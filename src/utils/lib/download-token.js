import { createHmac, timingSafeEqual } from 'node:crypto'

/**
 * Stateless, signed download tokens. The token carries the order, the template and an expiry,
 * so the download route needs no database to know a link is genuine.
 *
 *   token = base64url(JSON payload) + "." + base64url(HMAC-SHA256(payload))
 */

const DEFAULT_TTL_HOURS = 168 // 7 days

function secret() {
  const value = process.env.DOWNLOAD_TOKEN_SECRET
  if (!value || value.length < 32) {
    throw new Error('DOWNLOAD_TOKEN_SECRET must be set to a random string of at least 32 characters.')
  }
  return value
}

const sign = (body) => createHmac('sha256', secret()).update(body).digest('base64url')

export function downloadLinkHours() {
  const hours = Number(process.env.DOWNLOAD_LINK_TTL_HOURS ?? DEFAULT_TTL_HOURS)
  return Number.isFinite(hours) && hours > 0 ? hours : DEFAULT_TTL_HOURS
}

export function signDownloadToken({ orderId, slug, tier }, { ttlHours = downloadLinkHours() } = {}) {
  const payload = {
    o: String(orderId),
    s: slug,
    t: tier,
    exp: Math.floor(Date.now() / 1000) + Math.round(ttlHours * 3600),
  }
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  return `${body}.${sign(body)}`
}

/** Returns { orderId, slug, tier, exp } for a valid, unexpired token. Otherwise null. */
export function verifyDownloadToken(token) {
  if (typeof token !== 'string') return null
  const [body, signature, ...extra] = token.split('.')
  if (!body || !signature || extra.length) return null

  const expected = Buffer.from(sign(body))
  const received = Buffer.from(signature)
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null

  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf-8'))
    if (!payload.o || !payload.s || typeof payload.exp !== 'number') return null
    if (payload.exp < Math.floor(Date.now() / 1000)) return null
    return { orderId: payload.o, slug: payload.s, tier: payload.t, exp: payload.exp }
  } catch {
    return null
  }
}
