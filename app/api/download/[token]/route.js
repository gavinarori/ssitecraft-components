import { NextResponse } from 'next/server'

import { verifyDownloadToken } from '../../../src/lib/download-token'
import { getSignedZipUrl } from '../../../src/lib/storage'
import { store } from '../../../src/lib/store'
import { getTemplateServer } from '../../../src/lib/templates-data'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const DAY = 86_400
const maxDownloads = () => {
  const value = Number(process.env.DOWNLOAD_MAX ?? 5)
  return Number.isFinite(value) && value > 0 ? value : 5
}

function page(status, heading, message) {
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${heading}</title></head><body style="margin:0;display:grid;min-height:100vh;place-items:center;background:#fafafa;font-family:Inter,Arial,sans-serif;color:#0a0a0a"><main style="max-width:420px;padding:24px;text-align:center"><h1 style="font-size:22px;margin:0 0 8px">${heading}</h1><p style="color:#525252;line-height:1.5;margin:0">${message}</p></main></body></html>`
  return new NextResponse(html, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' },
  })
}

export async function GET(_request, { params }) {
  const { token } = await params

  const claims = verifyDownloadToken(token)
  if (!claims) return page(410, 'Link expired', 'This download link is invalid or has expired. Reply to your order email and we will send a new one.')

  if (await store.get(`revoked:${claims.orderId}`)) {
    return page(410, 'Order refunded', 'This order was refunded, so the download is no longer available.')
  }

  const template = await getTemplateServer(claims.slug)
  if (!template) return page(410, 'Not available', 'This template is no longer available. Please contact us.')

  // Sign first: a storage failure should not use up one of the buyer's downloads
  let url
  try {
    url = await getSignedZipUrl({ slug: template.slug, version: template.version })
  } catch (error) {
    console.error('[download] could not sign the file URL', error)
    return page(503, 'Try again shortly', 'The download is temporarily unavailable. Please try again in a few minutes.')
  }

  const count = await store.incr(`downloads:${claims.orderId}`, 30 * DAY)
  if (count > maxDownloads()) {
    return page(429, 'Download limit reached', 'This order has reached its download limit. Reply to your order email and we will help.')
  }

  return new NextResponse(null, {
    status: 302,
    headers: { Location: url, 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' },
  })
}
