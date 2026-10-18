import { NextResponse } from 'next/server'

import { isAdmin } from '@util/lib/admin'
import { sendAccessLink } from '@util/lib/access-link'
import { recordPurchase } from '@util/lib/entitlements'
import { getRequest, updateRequest } from '@util/lib/requests'
import { getSiteUrl } from '@util/lib/site-url'
import { resolveItem } from '@util/lib/item'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const fail = (error, status = 400) => NextResponse.json({ error }, { status })

/**
 * After you have been paid by hand: gives the buyer their purchase and emails their sign-in link.
 *   { requestId }                      grant exactly what a request asked for
 *   { email, item: { kind, ... } }     grant something without a request
 */
export async function POST(request) {
  if (!isAdmin(request)) return fail('Unauthorized', 401)

  const body = await request.json().catch(() => null)
  let email = String(body?.email ?? '').trim().toLowerCase()
  let input = body?.item
  let record = null

  if (body?.requestId) {
    record = await getRequest(String(body.requestId))
    if (!record) return fail('Request not found.', 404)
    email = record.email
    input = record.item
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail('A valid email is required.')
  const item = await resolveItem(input)
  if (!item) return fail('That item is not available.', 404)

  const orderId = `manual-${record?.id ?? Date.now()}`
  if (item.kind === 'template') {
    await recordPurchase({ email, orderId, template: { slug: item.slug, tier: item.tier } })
  } else {
    await recordPurchase({ email, orderId, packId: item.pack, componentId: item.kind === 'component' ? item.component : null })
  }

  let delivery = { sent: false }
  if (body?.sendLink !== false) {
    delivery = await sendAccessLink({ email, siteUrl: getSiteUrl(request) }).catch((error) => {
      console.error('[admin] could not send the access link', error)
      return { sent: false, error: 'Purchase recorded, but the email could not be sent. Check your Supabase SMTP settings.' }
    })
  }

  if (record) await updateRequest(record.id, { status: 'done', grantedAt: new Date().toISOString() })
  return NextResponse.json({ ok: true, orderId, email, item: item.title, ...delivery })
}