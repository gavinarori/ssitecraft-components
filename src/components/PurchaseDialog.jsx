'use client'

import { useEffect, useRef, useState } from 'react'

const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL
const CONTACT_WHATSAPP = (process.env.NEXT_PUBLIC_CONTACT_WHATSAPP || '').replace(/\D/g, '')

/**
 * "How do you want to buy this?"
 *   Africa:          pay now with Paystack (M-Pesa, cards, bank)
 *   Everywhere else: send us a request and we sort out payment by hand
 * item: { kind: 'template'|'pack'|'component', slug, tier, pack, component, title, priceLabel }
 */
export default function PurchaseDialog({ item, onClose }) {
  const [mode, setMode] = useState('pay') // 'pay' | 'request'
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [website, setWebsite] = useState('') // honeypot
  const [state, setState] = useState({ busy: false, error: '', sent: false })
  const emailRef = useRef(null)

  const target = { kind: item.kind, slug: item.slug, tier: item.tier, pack: item.pack, component: item.component }

  useEffect(() => {
    let cancelled = false
    fetch('/api/region')
      .then((response) => response.json())
      .then((data) => {
        if (!cancelled && data.africa === false) setMode('request')
      })
      .catch(() => {})
    emailRef.current?.focus()
    const onKey = (event) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      cancelled = true
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  async function post(url, body) {
    setState({ busy: true, error: '', sent: false })
    try {
      const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error || 'Something went wrong. Please try again.')
      return data
    } catch (caught) {
      setState({ busy: false, error: caught.message, sent: false })
      return null
    }
  }

  async function pay(event) {
    event.preventDefault()
    const body = item.kind === 'template' ? { slug: item.slug, tier: item.tier } : { pack: item.pack, ...(item.kind === 'component' ? { component: item.component } : {}) }
    const data = await post('/api/checkout', { ...body, email })
    if (data?.url) window.location.assign(data.url)
  }

  async function request(event) {
    event.preventDefault()
    const data = await post('/api/requests', { name, email, message, website, item: target })
    if (data) setState({ busy: false, error: '', sent: true })
  }

  const summary = `${item.title}${item.priceLabel ? ` (${item.priceLabel})` : ''}`
  const field = 'h-11 w-full rounded-xl border border-neutral-300 bg-white px-3 text-sm sc-focus'
  const tab = (active) =>
    `flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${active ? 'bg-white text-neutral-950 shadow-sm' : 'text-neutral-600 hover:text-neutral-950'}`

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-neutral-950/60 p-4" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-label="Buy" className="relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-[20px] bg-white p-6 shadow-[rgba(0,0,0,0.25)_0_12px_48px]">
        <button type="button" onClick={onClose} aria-label="Close" className="absolute right-4 top-4 grid size-8 place-items-center rounded-full text-neutral-500 hover:bg-neutral-100">×</button>
        <p className="sc-mono text-[11px] uppercase tracking-wide text-neutral-500">You are buying</p>
        <h2 className="mt-1 pr-8 text-lg font-semibold tracking-tight text-neutral-950">{summary}</h2>

        <div className="mt-5 flex gap-1 rounded-xl bg-neutral-100 p-1" role="tablist">
          <button type="button" role="tab" aria-selected={mode === 'pay'} className={tab(mode === 'pay')} onClick={() => setMode('pay')}>I am in Africa</button>
          <button type="button" role="tab" aria-selected={mode === 'request'} className={tab(mode === 'request')} onClick={() => setMode('request')}>Somewhere else</button>
        </div>

        {mode === 'pay' && (
          <form onSubmit={pay} className="mt-5 space-y-4">
            <label className="block text-sm font-medium text-neutral-800">Email for your purchase
              <input ref={emailRef} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={`${field} mt-1`} />
            </label>
            <button disabled={state.busy} className="sc-focus h-11 w-full rounded-xl bg-neutral-950 text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-60">
              {state.busy ? 'Opening checkout…' : 'Continue to secure payment'}
            </button>
            <p className="text-xs text-neutral-500">Pay with M-Pesa, mobile money, card or bank transfer through Paystack. We email you a sign-in link to your purchase.</p>
          </form>
        )}

        {mode === 'request' && !state.sent && (
          <form onSubmit={request} className="mt-5 space-y-4">
            <p className="text-sm text-neutral-600">Online checkout is for African payment methods for now. Send us a request and we will reply with payment options and unlock this for you.</p>
            <label className="block text-sm font-medium text-neutral-800">Your name
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className={`${field} mt-1`} />
            </label>
            <label className="block text-sm font-medium text-neutral-800">Email
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={`${field} mt-1`} />
            </label>
            <label className="block text-sm font-medium text-neutral-800">Anything we should know? <span className="font-normal text-neutral-500">(optional)</span>
              <textarea rows={3} value={message} onChange={(e) => setMessage(e.target.value)} maxLength={1000} className="sc-focus mt-1 w-full rounded-xl border border-neutral-300 p-3 text-sm" />
            </label>
            <div className="absolute -left-[9999px]" aria-hidden="true">
              <label>Website<input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} /></label>
            </div>
            <button disabled={state.busy} className="sc-focus h-11 w-full rounded-xl bg-neutral-950 text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-60">
              {state.busy ? 'Sending…' : 'Send request'}
            </button>
          </form>
        )}

        {mode === 'request' && state.sent && (
          <div className="mt-5 space-y-3" role="status">
            <p className="font-semibold text-neutral-950">Request received.</p>
            <p className="text-sm text-neutral-600">We will email {email} with payment options, usually within a day. Once paid, your purchase unlocks automatically.</p>
            {(CONTACT_EMAIL || CONTACT_WHATSAPP) && (
              <div className="flex flex-wrap gap-2 pt-1">
                {CONTACT_WHATSAPP && (
                  <a className="inline-flex h-10 items-center rounded-xl border border-neutral-300 px-4 text-sm font-semibold" target="_blank" rel="noreferrer" href={`https://wa.me/${CONTACT_WHATSAPP}?text=${encodeURIComponent(`Hi, I just requested: ${summary}`)}`}>WhatsApp us</a>
                )}
                {CONTACT_EMAIL && (
                  <a className="inline-flex h-10 items-center rounded-xl border border-neutral-300 px-4 text-sm font-semibold" href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Request: ${item.title}`)}`}>Email us</a>
                )}
              </div>
            )}
          </div>
        )}

        {state.error && <p role="alert" className="mt-3 text-sm text-red-600">{state.error}</p>}
      </div>
    </div>
  )
}