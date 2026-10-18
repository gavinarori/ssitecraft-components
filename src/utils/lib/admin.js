import { timingSafeEqual } from 'node:crypto'

/** Admin routes need `Authorization: Bearer <ADMIN_TOKEN>`. If ADMIN_TOKEN is missing or short, admin is switched off. */
export function isAdmin(request) {
  const expected = process.env.ADMIN_TOKEN
  if (!expected || expected.length < 16) return false
  const received = (request.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, '')
  const a = Buffer.from(expected)
  const b = Buffer.from(received)
  return a.length === b.length && timingSafeEqual(a, b)
}