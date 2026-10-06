import { createHmac, timingSafeEqual } from 'node:crypto'

import { PaymentError } from './errors.js'

/**
 * Lemon Squeezy adapter. Every provider exposes the same three functions, so a second provider
 * (Paystack for M-Pesa) is a new file next to this one:
 *
 *   createCheckout({ template, tier, siteUrl })  -> hosted checkout URL
 *   verifyWebhook({ rawBody, headers })          -> boolean
 *   parseWebhook(payload)                        -> { type, eventId, orderId, email, name, slug, tier } | null
 *
 * Env:  LEMONSQUEEZY_API_KEY  LEMONSQUEEZY_STORE_ID  LEMONSQUEEZY_WEBHOOK_SECRET
 * Template frontmatter:  provider.lemonsqueezy.standard / .extended  (numeric variant IDs)
 */

const CHECKOUTS_URL = 'https://api.lemonsqueezy.com/v1/checkouts'

function requireEnv(name) {
  const value = process.env[name]
  if (!value) {
    console.error(`[lemonsqueezy] ${name} is not set`)
    throw new PaymentError('Checkout is not set up yet. Please try again later.', { status: 503 })
  }
  return value
}

export async function createCheckout({ template, tier, siteUrl }) {
  const variantId = String(template.provider?.lemonsqueezy?.[tier] ?? '')
  if (!/^\d+$/.test(variantId)) {
    console.error(`[lemonsqueezy] ${template.slug}: provider.lemonsqueezy.${tier} must be a numeric variant ID`)
    throw new PaymentError('This template is not available for purchase yet.', { status: 503 })
  }

  const apiKey = requireEnv('LEMONSQUEEZY_API_KEY')
  const storeId = requireEnv('LEMONSQUEEZY_STORE_ID')

  const response = await fetch(CHECKOUTS_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      data: {
        type: 'checkouts',
        attributes: {
          product_options: {
            enabled_variants: [Number(variantId)],
            redirect_url: `${siteUrl}/checkout/success?template=${encodeURIComponent(template.slug)}`,
          },
          // Comes back to us as meta.custom_data on the webhook
          checkout_data: { custom: { slug: template.slug, tier } },
        },
        relationships: {
          store: { data: { type: 'stores', id: String(storeId) } },
          variant: { data: { type: 'variants', id: variantId } },
        },
      },
    }),
    signal: AbortSignal.timeout(10_000),
    cache: 'no-store',
  }).catch((cause) => {
    console.error('[lemonsqueezy] checkout request failed', cause)
    throw new PaymentError('We could not reach the payment provider. Please try again in a moment.', { status: 502 })
  })

  if (!response.ok) {
    console.error(`[lemonsqueezy] checkout rejected (${response.status})`, (await response.text()).slice(0, 500))
    throw new PaymentError('We could not start checkout. Please try again in a moment.', { status: 502 })
  }

  const json = await response.json().catch(() => null)
  const url = json?.data?.attributes?.url
  if (!url) {
    console.error('[lemonsqueezy] checkout response had no URL')
    throw new PaymentError('We could not start checkout. Please try again in a moment.', { status: 502 })
  }
  return url
}

/** HMAC-SHA256 of the raw body, hex encoded, in the X-Signature header. */
export function verifyWebhook({ rawBody, headers }) {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET
  if (!secret) {
    console.error('[lemonsqueezy] LEMONSQUEEZY_WEBHOOK_SECRET is not set')
    return false
  }

  const expected = Buffer.from(createHmac('sha256', secret).update(rawBody).digest('hex'))
  const received = Buffer.from(headers.get('x-signature') ?? '')

  // timingSafeEqual throws when lengths differ, so check first
  return expected.length === received.length && timingSafeEqual(expected, received)
}

export function parseWebhook(payload) {
  const eventName = payload?.meta?.event_name
  const orderId = payload?.data?.id
  if (!eventName || !orderId) return null

  const attributes = payload.data.attributes ?? {}
  const custom = payload.meta.custom_data ?? {}

  let type = null
  if (eventName === 'order_created' && attributes.status === 'paid') type = 'order_paid'
  if (eventName === 'order_refunded') type = 'order_refunded'
  if (!type) return null

  return {
    type,
    eventId: `${eventName}:${orderId}`,
    orderId: String(orderId),
    email: attributes.user_email ?? null,
    name: attributes.user_name ?? null,
    slug: custom.slug ?? null,
    tier: custom.tier ?? null,
  }
}
