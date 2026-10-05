/**
 * A tiny key-value store for three jobs: remembering which webhook events were handled,
 * counting downloads per order, and marking refunded orders as revoked.
 *
 * With UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN (or Vercel KV's KV_REST_API_URL +
 * KV_REST_API_TOKEN) it uses Upstash Redis over HTTP, which works on serverless with no driver.
 * Without them it falls back to process memory. Memory is fine for local development, but
 * serverless instances do not share it, so duplicate-event protection, download caps and refund
 * revocation only hold on one warm instance. Set the Redis variables before taking real orders.
 */

// On globalThis because Next compiles each route separately in development, and they must see the same state
const memory = (globalThis.__sitecraftStore ??= new Map()) // key -> { value, expires }
let warned = false

function remote() {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN
  return url && token ? { url, token } : null
}

async function command(args) {
  const { url, token } = remote()
  const response = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(args),
    cache: 'no-store',
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok || data.error) {
    throw new Error(`Store command ${args[0]} failed: ${data.error ?? response.status}`)
  }
  return data.result
}

function useMemoryStore() {
  if (!warned && process.env.NODE_ENV === 'production') {
    warned = true
    console.warn('[store] No Redis configured. Using in-memory state, which is not shared between serverless instances.')
  }
}

function readMemory(key) {
  const entry = memory.get(key)
  if (!entry) return null
  if (entry.expires && entry.expires < Date.now()) {
    memory.delete(key)
    return null
  }
  return entry
}

export const store = {
  async get(key) {
    if (remote()) return command(['GET', key])
    useMemoryStore()
    return readMemory(key)?.value ?? null
  },

  /** Sets only if the key is new. Returns true when this call created it. */
  async setnx(key, value, ttlSeconds) {
    if (remote()) {
      const args = ['SET', key, String(value), 'NX']
      if (ttlSeconds) args.push('EX', ttlSeconds)
      return (await command(args)) === 'OK'
    }
    useMemoryStore()
    if (readMemory(key)) return false
    memory.set(key, { value: String(value), expires: ttlSeconds ? Date.now() + ttlSeconds * 1000 : 0 })
    return true
  },

  async set(key, value, ttlSeconds) {
    if (remote()) {
      const args = ['SET', key, String(value)]
      if (ttlSeconds) args.push('EX', ttlSeconds)
      await command(args)
      return
    }
    useMemoryStore()
    memory.set(key, { value: String(value), expires: ttlSeconds ? Date.now() + ttlSeconds * 1000 : 0 })
  },

  async del(key) {
    if (remote()) return void (await command(['DEL', key]))
    memory.delete(key)
  },

  /** Adds one and returns the new count. The expiry is set when the counter is created. */
  async incr(key, ttlSeconds) {
    if (remote()) {
      const total = Number(await command(['INCR', key]))
      if (total === 1 && ttlSeconds) await command(['EXPIRE', key, ttlSeconds])
      return total
    }
    useMemoryStore()
    const current = Number(readMemory(key)?.value ?? 0) + 1
    const previous = memory.get(key)
    memory.set(key, {
      value: String(current),
      expires: previous?.expires ?? (ttlSeconds ? Date.now() + ttlSeconds * 1000 : 0),
    })
    return current
  },
}
