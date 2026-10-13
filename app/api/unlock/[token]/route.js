import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { COOKIE, cookieOptions, mergeOrders, readUnlockLink, signCookie } from '@util/lib/entitlements'
import { getSiteUrl } from '@util/lib/site-url'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** The emailed link: validates it, sets the unlock cookie and sends the buyer to their components. */
export async function GET(request, { params }) {
  const { token } = await params
  const site = getSiteUrl(request)

  const orders = readUnlockLink(token)
  if (!orders) return NextResponse.redirect(`${site}/unlock?status=invalid`)

  const jar = await cookies()
  jar.set(COOKIE, signCookie(mergeOrders(jar.get(COOKIE)?.value, orders)), cookieOptions)

  const first = orders[0]?.p
  // Pack IDs are "<category>-<slug>", e.g. application-ui-login; map to /components/application-ui/login
  const slug = first && ['application-ui', 'marketing'].find((c) => first.startsWith(`${c}-`))
  const target = slug ? `/components/${slug}/${first.slice(slug.length + 1)}` : '/'
  return NextResponse.redirect(`${site}${target}?unlocked=1`)
}
