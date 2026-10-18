import { NextResponse } from 'next/server'

import { isAfrica } from '@util/lib/regions'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Where the visitor probably is, from the host's geo header (Vercel or Cloudflare). Only picks a default; the buyer can switch. */
export async function GET(request) {
    const country = request.headers.get('x-vercel-ip-country') || request.headers.get('cf-ipcountry') || null
    return NextResponse.json({ country, africa: country ? isAfrica(country) : null }, { headers: { 'Cache-Control': 'private, no-store' } })
}