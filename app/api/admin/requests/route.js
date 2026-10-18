import { NextResponse } from 'next/server'

import { isAdmin } from '@util/lib/admin'
import { listRequests } from '@util/lib/requests'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request) {
  if (!isAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json({ requests: await listRequests() }, { headers: { 'Cache-Control': 'no-store' } })
}