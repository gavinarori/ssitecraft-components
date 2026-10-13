import { NextResponse } from 'next/server'

import { getPurchases, signUnlockLink } from '@util/lib/entitlements'
import { getPack } from '@util/lib/packs'
import { getSiteUrl } from '@util/lib/site-url'
import { store } from '@util/lib/store'
import { sendUnlockEmail } from '@util/lib/unlock-email'

export const runtime = 'nodejs'

const reply = (status = 200) => NextResponse.json({ ok: true }, { status, headers: { 'Cache-Control': 'no-store' } })

/**
 * "Restore purchases". Always answers the same way, so it cannot be used to find out who is a customer.
 * Limited to 3 emails per address per hour.
 */
export async function POST(request) {
  const body = await request.json().catch(() => null)
  const email = String(body?.email ?? '').trim().toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 })
  }

  if ((await store.incr(`restore:${email}`, 3600)) > 3) return reply()

  try {
    const orders = (await getPurchases(email))
    const live = []
    for (const order of orders) if (!(await store.get(`revoked:${order.o}`))) live.push(order)

    if (live.length) {
      const titles = (await Promise.all([...new Set(live.map((o) => o.p))].map(getPack))).filter(Boolean).map((p) => p.title)
      await sendUnlockEmail({
        to: email,
        titles,
        unlockUrl: `${getSiteUrl(request)}/api/unlock/${signUnlockLink(live)}`,
      })
    }
  } catch (error) {
    console.error('[unlock] restore failed', error)
  }
  return reply()
}
