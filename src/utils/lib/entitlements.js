import { createHmac, timingSafeEqual } from 'node:crypto'

import { store } from './store.js'

/**
 * Who has unlocked what, with no accounts and no passwords.
 *
 *  - On purchase the webhook records the order against the buyer's email (store) and emails an
 *    "unlock link". Opening it sets a signed cookie listing the packs.
 *  - "Restore purchases" emails a fresh link to anyone who has bought, so a new browser or device works too.
 *  - A refund marks the order as revoked; the cookie is re-checked against that on every request.
 *
 * Cookie and links are HMAC-signed with UNLOCK_SECRET (falls back to DOWNLOAD_TOKEN_SECRET).
 */

export const COOKIE = 'sc_unlock'
const COOKIE_DAYS = 365
const LINK_HOURS = 24 * 7

function secret() {
  const value = process.env.UNLOCK_SECRET || process.env.DOWNLOAD_TOKEN_SECRET
  if (!value || value.length < 32) throw new Error('Set UNLOCK_SECRET (or DOWNLOAD_TOKEN_SECRET) to a random string of 32+ characters.')
  return value
}

const sign = (body) => createHmac('sha256', secret()).update(body).digest('base64url')

function seal(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  return `${body}.${sign(body)}`
}

function open(token) {
  if (typeof token !== 'string') return null
  const [body, signature, ...extra] = token.split('.')
  if (!body || !signature || extra.length) return null
  const expected = Buffer.from(sign(body))
  const received = Buffer.from(signature)
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf-8'))
    if (typeof payload.exp !== 'number' || payload.exp < Math.floor(Date.now() / 1000)) return null
    return payload
  } catch {
    return null
  }
}

const inSeconds = (hours) => Math.floor(Date.now() / 1000) + Math.round(hours * 3600)
const normEmail = (email) => String(email ?? '').trim().toLowerCase()

/* ---------- purchases (store) ---------- */

/** orders: [{ o: orderId, p: packId, c?: componentId }] kept per email. No `c` = the whole pack. */
export async function recordPurchase({ email, orderId, packId, componentId }) {
  const key = `purchases:${normEmail(email)}`
  const orders = JSON.parse((await store.get(key)) ?? '[]')
  const c = componentId == null ? undefined : String(componentId)
  if (!orders.some((order) => order.o === String(orderId) && order.p === packId && order.c === c)) {
    orders.push(c ? { o: String(orderId), p: packId, c } : { o: String(orderId), p: packId })
    await store.set(key, JSON.stringify(orders))
  }
  return orders
}

export async function getPurchases(email) {
  return JSON.parse((await store.get(`purchases:${normEmail(email)}`)) ?? '[]')
}

/* ---------- unlock link (emailed) ---------- */

export const signUnlockLink = (orders) => seal({ k: 'link', orders, exp: inSeconds(LINK_HOURS) })

export function readUnlockLink(token) {
  const payload = open(token)
  return payload?.k === 'link' && Array.isArray(payload.orders) ? payload.orders : null
}

/* ---------- cookie ---------- */

export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: COOKIE_DAYS * 86_400,
}

export const signCookie = (orders) => seal({ k: 'cookie', orders, exp: inSeconds(COOKIE_DAYS * 24) })

/** Union of what is already in the cookie and the new orders. */
export function mergeOrders(existingCookie, orders) {
  const current = open(existingCookie)?.k === 'cookie' ? open(existingCookie).orders : []
  const map = new Map([...current, ...orders].map((order) => [`${order.o}:${order.p}:${order.c ?? ''}`, order]))
  return [...map.values()]
}

/** What this browser has unlocked (refunded orders dropped). */
export async function getAccess(cookieValue) {
  const packs = new Set()
  const singles = new Set() // `${packId}#${componentId}`

  const payload = open(cookieValue)
  if (payload?.k === 'cookie' && Array.isArray(payload.orders)) {
    for (const order of payload.orders) {
      if (await store.get(`revoked:${order.o}`)) continue
      if (order.c) singles.add(`${order.p}#${order.c}`)
      else packs.add(order.p)
    }
  }

  return {
    packs,
    components: (packId) => [...singles].filter((key) => key.startsWith(`${packId}#`)).map((key) => key.split('#')[1]),
    has: (packId, componentId) => packs.has(packId) || (componentId != null && singles.has(`${packId}#${componentId}`)),
  }
}