import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { COOKIE, getAccess } from '@util/lib/entitlements'
import { getPack } from '@util/lib/packs'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** { unlocked: whole pack owned, components: [ids bought singly] } for the pack banner. */
export async function GET(_request, { params }) {
  const pack = await getPack((await params).pack)
  const headers = { 'Cache-Control': 'private, no-store' }
  if (!pack) return NextResponse.json({ unlocked: false, components: [] }, { headers })

  const access = await getAccess((await cookies()).get(COOKIE)?.value)
  return NextResponse.json({ unlocked: access.has(pack.id), components: access.components(pack.id) }, { headers })
}