import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto'

import { PaymentError } from './errors.js'

/**
 * Paystack adapter (cards, M-Pesa, bank transfer, Apple Pay ...). Same shape as the other providers:
 *   createCheckout / createPackCheckout / createComponentCheckout -> hosted checkout URL
 *   verifyWebhook({ rawBody, headers }) -> boolean
 *   parseWebhook(payload) -> { type, eventId, orderId, email, name, slug, tier, kind, pack, component, test, amount, currency } | null
 *
 * Env:
 *   PAYSTACK_SECRET_KEY   sk_test_... while testing, sk_live_... in production (Settings > API Keys)
 *   PAYSTACK_CURRENCY     currency your Paystack account charges in. KES for Kenya (M-Pesa is KES only). Default USD.
 *   PAYSTACK_FX_RATE      only when the currency is not USD: how many of that currency make 1 USD (e.g. 130 for KES)
 *
 * Prices in the MDX files are in USD. They are converted with PAYSTACK_FX_RATE when needed.
 */

const API = process.env.PAYSTACK_API_URL || 'https://api.paystack.co'

const currency = () => (process.env.PAYSTACK_CURRENCY || 'USD').toUpperCase()

function rate() {
  if (currency() === 'USD') return 1
  const value = Number(process.env.PAYSTACK_FX_RATE)
  if (!Number.isFinite(value) || value <= 0) {
    console.error(`[paystack] PAYSTACK_CURRENCY is ${currency()}, so PAYSTACK_FX_RATE (${currency()} per 1 USD) must be set.`)
    throw new PaymentError('Checkout is not set up yet. Please try again later.', { status: 503 })
  }
  return value
}

/** USD price -> smallest unit of the charge currency (cents). */
export const toSubunit = (usd) => Math.round(Number(usd) * rate() * 100)

function secret() {
  const value = process.env.PAYSTACK_SECRET_KEY
  if (!value) {
    console.error('[paystack] PAYSTACK_SECRET_KEY is not set')
    throw new PaymentError('Checkout is not set up yet. Please try again later.', { status: 503 })
  }
  return value
}

async function initialize({ email, usdPrice, redirectUrl, metadata }) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email ?? ''))) {
    throw new PaymentError('Enter a valid email address.', { status: 400 })
  }
  if (!(usdPrice > 0)) throw new PaymentError('This item is not available for purchase yet.', { status: 503 })

  const response = await fetch(`${API}/transaction/initialize`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${secret()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      amount: toSubunit(usdPrice),
      currency: currency(),
      reference: `sc_${randomUUID().replaceAll('-', '').slice(0, 24)}`,
      callback_url: redirectUrl,
      metadata,
    }),
    signal: AbortSignal.timeout(10_000),
    cache: 'no-store',
  }).catch((cause) => {
    console.error('[paystack] initialize request failed', cause)
    throw new PaymentError('We could not reach the payment provider. Please try again in a moment.', { status: 502 })
  })

  const json = await response.json().catch(() => null)
  if (!response.ok || !json?.status || !json?.data?.authorization_url) {
    console.error(`[paystack] initialize rejected (${response.status})`, JSON.stringify(json)?.slice(0, 400))
    throw new PaymentError('We could not start checkout. Please try again in a moment.', { status: 502 })
  }
  return json.data.authorization_url
}

export const createCheckout = ({ template, tier, siteUrl, email }) =>
  initialize({
    email,
    usdPrice: template.price?.[tier],
    redirectUrl: `${siteUrl}/checkout/success?template=${encodeURIComponent(template.slug)}`,
    metadata: { kind: 'template', slug: template.slug, tier },
  })

export const createPackCheckout = ({ pack, siteUrl, email }) =>
  initialize({
    email,
    usdPrice: pack.price,
    redirectUrl: `${siteUrl}/checkout/success?pack=${encodeURIComponent(pack.id)}`,
    metadata: { kind: 'pack', pack: pack.id },
  })

export const createComponentCheckout = ({ pack, componentId, siteUrl, email }) =>
  initialize({
    email,
    usdPrice: pack.unitPrice(componentId),
    redirectUrl: `${siteUrl}/checkout/success?pack=${encodeURIComponent(pack.id)}`,
    metadata: { kind: 'component', pack: pack.id, component: String(componentId) },
  })

/** HMAC-SHA512 of the raw body with your secret key, hex, in the x-paystack-signature header. */
export function verifyWebhook({ rawBody, headers }) {
  const key = process.env.PAYSTACK_SECRET_KEY
  if (!key) {
    console.error('[paystack] PAYSTACK_SECRET_KEY is not set')
    return false
  }
  const expected = Buffer.from(createHmac('sha512', key).update(rawBody).digest('hex'))
  const received = Buffer.from(headers.get('x-paystack-signature') ?? '')
  return expected.length === received.length && timingSafeEqual(expected, received)
}

export function parseWebhook(payload) {
  const event = payload?.event
  const data = payload?.data
  if (!event || !data) return null

  if (event === 'charge.success' && data.status === 'success' && data.reference) {
    const meta = data.metadata && typeof data.metadata === 'object' ? data.metadata : {}
    return {
      type: 'order_paid',
      eventId: `${event}:${data.reference}`,
      orderId: String(data.reference),
      email: data.customer?.email ?? null,
      name: null,
      slug: meta.slug ?? null,
      tier: meta.tier ?? null,
      kind: meta.kind ?? 'template',
      pack: meta.pack ?? null,
      component: meta.component ?? null,
      test: meta.test === true,
      amount: typeof data.amount === 'number' ? data.amount : null,
      currency: data.currency ?? null,
    }
  }

  if (event === 'refund.processed') {
    const reference = data.transaction_reference ?? data.transaction?.reference
    if (!reference) return null
    return { type: 'order_refunded', eventId: `${event}:${data.id ?? reference}`, orderId: String(reference) }
  }

  return null
}

/** Smallest amount we accept for an order, so an underpayment never unlocks anything. */
export const minimumAmount = (usdPrice) => ({
  amount: Math.floor(toSubunit(usdPrice) * 0.99),
  currency: currency(),
})