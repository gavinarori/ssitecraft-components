import { NextResponse } from 'next/server'

import { isTier } from '@util/lib/licenses'
import { PaymentError } from '@util/lib/payments/errors'
import { getProvider } from '@util/lib/payments'
import { getSiteUrl } from '@util/lib/site-url'
import { getPack } from '@util/lib/packs'
import { getTemplateServer } from '@util/lib/templates-data'

export const runtime = 'nodejs'

const fail = (error, status) => NextResponse.json({ error }, { status, headers: { 'Cache-Control': 'no-store' } })

export async function POST(request) {
  const body = await request.json().catch(() => null)
  const slug = body?.slug
  const tier = body?.tier

  const provider = getProvider()

  // Component pack: { pack: 'application-ui-login' }
  if (typeof body?.pack === 'string') {
    const pack = await getPack(body.pack)
    if (!pack?.pro) return fail('That pack is not for sale.', 404)
    if (!provider) return fail('Checkout is not set up yet. Please try again later.', 503)

    // Single component: { pack, component: '3' }
    const single = body.component != null ? String(body.component) : null
    if (single !== null) {
      if (!pack.hasComponent(single) || pack.free.has(single) || !pack.unitPrice(single)) {
        return fail('That component is not for sale on its own.', 404)
      }
    } else if (!pack.price) {
      return fail('That pack is not for sale.', 404)
    }

    try {
      const siteUrl = getSiteUrl(request)
      const url =
        single !== null
          ? await provider.createComponentCheckout({ pack, componentId: single, siteUrl })
          : await provider.createPackCheckout({ pack, siteUrl })
      return NextResponse.json({ url }, { headers: { 'Cache-Control': 'no-store' } })
    } catch (error) {
      if (error instanceof PaymentError) return fail(error.publicMessage, error.status)
      console.error('[checkout] unexpected error', error)
      return fail('Checkout is unavailable right now. Please try again.', 500)
    }
  }

  if (typeof slug !== 'string' || !isTier(tier)) return fail('Invalid request.', 400)

  // Server-side record, because only it has the payment variant IDs
  const template = await getTemplateServer(slug)
  if (!template) return fail('Template not found.', 404)
  if (template.price[tier] == null) return fail('That license is not available for this template.', 400)

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