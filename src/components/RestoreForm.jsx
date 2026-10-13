'use client'

import { useState } from 'react'

/** "Already bought? Email yourself an unlock link." */
export default function RestoreForm({ className = '' }) {
  const [email, setEmail] = useState('')
  const [state, setState] = useState('idle') // idle | sending | sent | error
  const [error, setError] = useState('')

  async function submit(event) {
    event.preventDefault()
    setState('sending')
    try {
      const response = await fetch('/api/unlock/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error || 'Something went wrong. Please try again.')
      setState('sent')
    } catch (caught) {
      setError(caught.message)
      setState('error')
    }
  }

  if (state === 'sent') {
    return (
      <p className={`text-sm text-neutral-600 ${className}`} role="status">
        If that email has a purchase, an unlock link is on its way. It can take a minute; check spam too.
      </p>
    )
  }

  return (
    <form onSubmit={submit} className={`flex flex-col gap-2 sm:flex-row ${className}`}>
      <label className="sr-only" htmlFor="restore-email">Email used at checkout</label>
      <input
        id="restore-email"
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Email used at checkout"
        className="sc-focus h-11 min-w-0 flex-1 rounded-xl border border-neutral-300 bg-white px-4 text-sm"
      />
      <button
        type="submit"
        disabled={state === 'sending'}
        className="sc-focus h-11 rounded-xl border border-neutral-300 bg-white px-4 text-sm font-semibold text-neutral-900 hover:bg-neutral-50 disabled:opacity-60"
      >
        {state === 'sending' ? 'Sending…' : 'Email me my link'}
      </button>
      {state === 'error' && <p className="text-sm text-red-600 sm:basis-full" role="alert">{error}</p>}
    </form>
  )
}
