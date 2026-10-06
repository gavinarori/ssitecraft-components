import { NextResponse } from 'next/server'

import { isTier } from '@util/lib/licenses'
import { PaymentError } from '@util/lib/payments/errors'
import { getProvider } from '@util/lib/payments'
import { getSiteUrl } from '@util/lib/site-url'
import { getTemplateServer } from '@util/lib/templates-data'

export const runtime = 'nodejs'

const fail = (error, status) => NextResponse.json({ error }, { status, headers: { 'Cache-Control': 'no-store' } })

export async function POST(request) {
  const body = await request.json().catch(() => null)
  const slug = body?.slug
  const tier = body?.tier

  if (typeof slug !== 'string' || !isTier(tier)) return fail('Invalid request.', 400)

  // Server-side record, because only it has the payment variant IDs
  const template = await getTemplateServer(slug)
  if (!template) return fail('Template not found.', 404)
  if (template.price[tier] == null) return fail('That license is not available for this template.', 400)

  const provider = getProvider()
  if (!provider) return fail('Checkout is not set up yet. Please try again later.', 503)

  try {
    const url = await provider.createCheckout({ template, tier, siteUrl: getSiteUrl(request) })
    return NextResponse.json({ url }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    if (error instanceof PaymentError) return fail(error.publicMessage, error.status)
    console.error('[checkout] unexpected error', error)
    return fail('Checkout is unavailable right now. Please try again.', 500)
  }
}
