'use client'

import { useState } from 'react'

export default function AdminRequests() {
  const [token, setToken] = useState('')
  const [requests, setRequests] = useState(null)
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState('')

  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

  async function load(event) {
    event?.preventDefault()
    setMessage('')
    const response = await fetch('/api/admin/requests', { headers })
    if (!response.ok) return setMessage(response.status === 401 ? 'Wrong token, or ADMIN_TOKEN is not set on the server.' : 'Could not load requests.')
    setRequests((await response.json()).requests)
  }

  async function grant(id) {
    // eslint-disable-next-line no-alert
    if (!window.confirm('Only grant after you have been paid. Continue?')) return
    setBusy(id)
    const response = await fetch('/api/admin/grant', { method: 'POST', headers, body: JSON.stringify({ requestId: id }) })
    const data = await response.json().catch(() => ({}))
    setBusy('')
    setMessage(response.ok ? `Granted: ${data.item} to ${data.email}.${data.error ? ' ' + data.error : data.link ? ' Access link: ' + data.link : ' Sign-in email sent.'}` : data.error || 'Failed.')
    if (response.ok) load()
  }

  if (!requests) {
    return (
      <form onSubmit={load} className="mt-6 flex gap-2">
        <input type="password" value={token} onChange={(e) => setToken(e.target.value)} placeholder="Admin token" className="h-11 flex-1 rounded-xl border border-neutral-300 px-3 text-sm" required />
        <button className="h-11 rounded-xl bg-neutral-950 px-5 text-sm font-semibold text-white">Open</button>
        {message && <p className="basis-full text-sm text-red-600">{message}</p>}
      </form>
    )
  }

  return (
    <div className="mt-6 space-y-4">
      {message && <p className="break-words rounded-xl bg-neutral-100 p-3 text-sm">{message}</p>}
      {requests.length === 0 && <p className="text-sm text-neutral-600">No requests yet.</p>}
      <ul className="space-y-3">
        {requests.map((r) => (
          <li key={r.id} className="rounded-[20px] border border-neutral-200 bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{r.item.title} <span className="font-normal text-neutral-500">· ${r.item.usd}</span></p>
                <p className="mt-1 text-sm text-neutral-700">{r.name} · <a className="underline" href={`mailto:${r.email}`}>{r.email}</a>{r.country ? ` · ${r.country}` : ''}</p>
                {r.message && <p className="mt-2 text-sm text-neutral-600">“{r.message}”</p>}
                <p className="mt-2 text-xs text-neutral-400">{new Date(r.createdAt).toLocaleString()} · #{r.id}</p>
              </div>
              {r.status === 'done' ? (
                <span className="rounded-full bg-[var(--lf-lime)] px-3 py-1 text-xs font-semibold text-[var(--lf-forest)]">Granted</span>
              ) : (
                <button onClick={() => grant(r.id)} disabled={busy === r.id} className="h-10 rounded-xl bg-neutral-950 px-4 text-sm font-semibold text-white disabled:opacity-60">
                  {busy === r.id ? 'Granting…' : 'Grant and email link'}
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
      <button onClick={load} className="text-sm underline">Refresh</button>
    </div>
  )
}