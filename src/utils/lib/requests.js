import { randomUUID } from 'node:crypto'

import { store } from './store.js'

/**
 * Purchase requests from buyers outside Africa, handled by hand.
 * request:<id> holds one request, requests:index holds the ids (newest first, capped).
 */
const INDEX = 'requests:index'
const CAP = 500

export async function createRequest(data) {
  const id = randomUUID().slice(0, 8)
  const record = { id, createdAt: new Date().toISOString(), status: 'new', ...data }
  await store.set(`request:${id}`, JSON.stringify(record))
  const ids = JSON.parse((await store.get(INDEX)) ?? '[]')
  await store.set(INDEX, JSON.stringify([id, ...ids].slice(0, CAP)))
  return record
}

export async function getRequest(id) {
  const raw = await store.get(`request:${id}`)
  return raw ? JSON.parse(raw) : null
}

export async function listRequests() {
  const ids = JSON.parse((await store.get(INDEX)) ?? '[]')
  const records = await Promise.all(ids.map(getRequest))
  return records.filter(Boolean)
}

export async function updateRequest(id, patch) {
  const record = await getRequest(id)
  if (!record) return null
  const next = { ...record, ...patch }
  await store.set(`request:${id}`, JSON.stringify(next))
  return next
}