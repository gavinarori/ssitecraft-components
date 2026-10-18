import { NextResponse } from 'next/server'

import { resolveItem } from '@util/lib/item'
import { notifyOwner } from '@util/lib/notify'
import { createRequest } from '@util/lib/requests'
import { store } from '@util/lib/store'

export const runtime = 'nodejs'

const fail = (error, status = 400) => NextResponse.json({ error }, { status, headers: { 'Cache-Control': 'no-store' } })
const clean = (value, max) => String(value ?? '').replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, max)

/** A buyer outside Africa asks us to sell them something by hand. */
export async function POST(request) {
  const body = await request.json().catch(() => null)
  if (!body) return fail('Invalid request.')

  // Honeypot: real people never fill this hidden field
  if (body.website) return NextResponse.json({ ok: true })

  const email = clean(body.email, 254).toLowerCase()
  const name = clean(body.name, 100)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail('Enter a valid email address.')
  if (!name) return fail('Please tell us your name.')

  const item = await resolveItem(body.item)
  if (!item) return fail('That item is not available.', 404)

  // At most 5 requests per email per hour
  if ((await store.incr(`reqlimit:${email}`, 3600)) > 5) return fail('Too many requests. Please try again later.', 429)

  const record = await createRequest({
    name,
    email,
    message: clean(body.message, 1000),
    country: request.headers.get('x-vercel-ip-country') || request.headers.get('cf-ipcountry') || null,
    item,
  })

  await notifyOwner(
    `New purchase request ${record.id}\n${name} <${email}>${record.country ? ` (${record.country})` : ''}\n${item.title} · $${item.usd}${record.message ? `\n"${record.message}"` : ''}`
  )

  return NextResponse.json({ ok: true, id: record.id }, { headers: { 'Cache-Control': 'no-store' } })
}