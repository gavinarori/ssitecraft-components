import { createHmac } from 'node:crypto'
import { NextResponse } from 'next/server'

import { getSiteUrl } from '@util/lib/site-url'
import { store } from '@util/lib/store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * TEST TOOL. Fakes a paid Lemon Squeezy order by sending a correctly signed webhook to our own webhook route,
 * so the whole delivery path runs for real: record the purchase, build the access link, (download from Supabase).
 * Only exists when ENABLE_TEST_PURCHASES=1. Never set that in production.
 */
const off = () => NextResponse.json({ error: 'Not found' }, { status: 404 })

export async function POST(request) {
  if (process.env.ENABLE_TEST_PURCHASES !== '1') return off()

  // Fake the provider that is actually in use: Paystack (default) or Lemon Squeezy
  const provider = process.env.PAYMENT_PROVIDER || (process.env.PAYSTACK_SECRET_KEY ? 'paystack' : 'lemonsqueezy')
  const secret = provider === 'paystack' ? process.env.PAYSTACK_SECRET_KEY : process.env.LEMONSQUEEZY_WEBHOOK_SECRET
  if (!secret) {
    return NextResponse.json(
      { error: `Set ${provider === 'paystack' ? 'PAYSTACK_SECRET_KEY (a test key is fine)' : 'LEMONSQUEEZY_WEBHOOK_SECRET (any value)'} so the test webhook can be signed.` },
      { status: 400 }
    )
  }

  const body = await request.json().catch(() => ({}))
  const email = String(body.email ?? 'buyer@example.com').trim().toLowerCase()
  const orderId = String(body.orderId ?? `test-${Date.now()}`)

  let custom
  if (body.kind === 'template') custom = { kind: 'template', slug: body.slug, tier: body.tier || 'standard' }
  else if (body.kind === 'pack') custom = { kind: 'pack', pack: body.pack }
  else if (body.kind === 'component') custom = { kind: 'component', pack: body.pack, component: String(body.component) }
  else if (body.kind !== 'refund') return NextResponse.json({ error: 'Unknown kind.' }, { status: 400 })

  let payload
  if (provider === 'paystack') {
    payload =
      body.kind === 'refund'
        ? { event: 'refund.processed', data: { id: 1, transaction_reference: orderId } }
        : { event: 'charge.success', data: { id: Date.now(), status: 'success', reference: orderId, customer: { email }, metadata: { ...custom, test: true } } }
  } else {
    payload =
      body.kind === 'refund'
        ? { meta: { event_name: 'order_refunded', custom_data: {} }, data: { id: orderId, attributes: { status: 'refunded' } } }
        : {
            meta: { event_name: 'order_created', custom_data: { ...custom, test: true } },
            data: { id: orderId, attributes: { status: 'paid', user_email: email, user_name: 'Test Buyer' } },
          }
  }

  const raw = JSON.stringify(payload)
  const signature = provider === 'paystack' ? createHmac('sha512', secret).update(raw).digest('hex') : createHmac('sha256', secret).update(raw).digest('hex')
  const site = getSiteUrl(request)

  const response = await fetch(`${site}/api/webhooks/${provider}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', [provider === 'paystack' ? 'x-paystack-signature' : 'X-Signature']: signature },
    body: raw,
    cache: 'no-store',
  }).catch((error) => ({ ok: false, status: 502, json: async () => ({ error: error.message }) }))
  const result = await response.json().catch(() => ({}))
  if (!response.ok) return NextResponse.json({ error: `Webhook answered ${response.status}: ${result.error ?? ''}` }, { status: 502 })

  return NextResponse.json({ ok: true, orderId, link: (await store.get(`testlink:${orderId}`)) ?? null })
}