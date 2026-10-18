import { NextResponse } from 'next/server'

import { sendAccessLink } from '@util/lib/access-link'
import { recordPurchase } from '@util/lib/entitlements'
import { getPack } from '@util/lib/packs'
import { getProvider } from '@util/lib/payments'
import { getSiteUrl } from '@util/lib/site-url'
import { store } from '@util/lib/store'
import { getTemplateServer } from '@util/lib/templates-data'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const DAY = 86_400
const ok = (body = {}) => NextResponse.json({ ok: true, ...body })

/** Records what was bought against the buyer's email, then gets them their access link. */
async function fulfil(event, request, provider) {
  if (!event.email) {
    console.error('[webhook] paid order has no email. Fulfil manually.', event.orderId)
    return {}
  }

  // If the provider reports what was paid, it must cover the price (an underpayment unlocks nothing)
  const underpaid = (usdPrice) => {
    if (event.amount == null || !provider.minimumAmount) return false
    const min = provider.minimumAmount(usdPrice)
    return event.currency !== min.currency || event.amount < min.amount
  }

  if (event.kind === 'pack' || event.kind === 'component') {
    const pack = event.pack ? await getPack(event.pack) : null
    const componentId = event.kind === 'component' ? event.component : null
    if (!pack || (componentId !== null && !pack.hasComponent(componentId))) {
      console.error('[webhook] order is for an unknown pack/component. Unlock manually.', event.orderId, event.pack, componentId)
      return {}
    }
    if (underpaid(componentId !== null ? pack.unitPrice(componentId) : pack.price)) {
      console.error('[webhook] amount paid is below the price. Check and unlock manually.', event.orderId, event.amount, event.currency)
      return {}
    }
    await recordPurchase({ email: event.email, orderId: event.orderId, packId: pack.id, componentId })
  } else {
    const template = event.slug ? await getTemplateServer(event.slug) : null
    if (!template || !event.tier) {
      console.error(`[webhook] order ${event.orderId} is for an unknown template/tier. Deliver manually.`)
      return {}
    }
    if (underpaid(template.price?.[event.tier])) {
      console.error('[webhook] amount paid is below the price. Check and deliver manually.', event.orderId, event.amount, event.currency)
      return {}
    }
    await recordPurchase({ email: event.email, orderId: event.orderId, template: { slug: template.slug, tier: event.tier } })
  }

  // Test purchases (from /test-purchase) skip the email and hand the link back instead
  const test = event.test === true && process.env.ENABLE_TEST_PURCHASES === '1'
  const result = await sendAccessLink({ email: event.email, siteUrl: getSiteUrl(request), test })
  if (test && result.link) await store.set(`testlink:${event.orderId}`, result.link, 600)
  return result
}

export async function POST(request, { params }) {
  const { provider: providerName } = await params
  const provider = getProvider(providerName)
  if (!provider) return NextResponse.json({ error: 'Unknown provider' }, { status: 404 })

  // The signature covers the exact bytes sent, so read the body as text before parsing
  const rawBody = await request.text()
  if (!provider.verifyWebhook({ rawBody, headers: request.headers })) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let payload
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const event = provider.parseWebhook(payload)
  if (!event) return ok({ ignored: true })

  // Providers retry, so claim the event first. Whoever claims it does the work.
  const lockKey = `webhook:${providerName}:${event.eventId}`
  const claimed = await store.setnx(lockKey, 'processing', 300)
  if (!claimed) return ok({ duplicate: true })

  try {
    if (event.type === 'order_paid') await fulfil(event, request, provider)
    if (event.type === 'order_refunded') await store.set(`revoked:${event.orderId}`, '1')

    await store.set(lockKey, 'done', 30 * DAY)
    return ok()
  } catch (error) {
    console.error('[webhook] handler failed', event.eventId, error)
    // Release the claim so the provider's retry can try again
    await store.del(lockKey).catch(() => {})
    return NextResponse.json({ error: 'Handler failed' }, { status: 500 })
  }
}