import { NextResponse } from 'next/server'

import { downloadLinkHours, signDownloadToken } from '@util/lib/download-token'
import { sendDeliveryEmail } from '@util/lib/email'
import { getProvider } from '@util/lib/payments'
import { getSiteUrl } from '@util/lib/site-url'
import { store } from '@util/lib/store'
import { getTemplateServer } from '@util/lib/templates-data'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const DAY = 86_400
const ok = (body = {}) => NextResponse.json({ ok: true, ...body })

async function deliver(event, request) {
  if (!event.email || !event.slug || !event.tier) {
    // Retrying cannot fix missing data, so answer 200 and leave a trail to follow up by hand
    console.error('[webhook] paid order is missing email, slug or tier. Deliver manually.', event.orderId)
    return
  }

  const template = await getTemplateServer(event.slug)
  if (!template) {
    console.error(`[webhook] order ${event.orderId} is for unknown template "${event.slug}". Deliver manually.`)
    return
  }

  const hours = downloadLinkHours()
  const token = signDownloadToken({ orderId: event.orderId, slug: event.slug, tier: event.tier })

  await sendDeliveryEmail({
    to: event.email,
    name: event.name,
    templateTitle: template.title,
    tier: event.tier,
    downloadUrl: `${getSiteUrl(request)}/api/download/${token}`,
    expiresInHours: hours,
  })
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
    if (event.type === 'order_paid') await deliver(event, request)
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
