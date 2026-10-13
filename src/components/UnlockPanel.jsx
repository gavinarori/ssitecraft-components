'use client'

import { useState } from 'react'

import RestoreForm from '@component/RestoreForm'

/**
 * Two ways to buy: the whole pack, or (when `single` is given) just this component.
 * single = { id, price } ; pack = { id, title, price, count }
 */
export default function UnlockPanel({ pack, single = null, compact = false }) {
  const [loading, setLoading] = useState('') // '' | 'single' | 'pack'
  const [error, setError] = useState('')
  const [showRestore, setShowRestore] = useState(false)

  async function buy(which) {
    setLoading(which)
    setError('')
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(which === 'single' ? { pack: pack.id, component: single.id } : { pack: pack.id }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok || !data.url) throw new Error(data.error || 'Checkout is unavailable right now.')
      window.location.assign(data.url)
    } catch (caught) {
      setError(caught.message)
      setLoading('')
    }
  }

  const dark = 'sc-focus inline-flex h-11 items-center rounded-xl bg-neutral-950 px-5 text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-60'
  const light = 'sc-focus inline-flex h-11 items-center rounded-xl border border-neutral-300 bg-white px-5 text-sm font-semibold text-neutral-900 hover:bg-neutral-50 disabled:opacity-60'
  const canBuyPack = Boolean(pack.price)
  const canBuySingle = Boolean(single?.price)

  return (
    <div className={compact ? 'space-y-3' : 'space-y-4'}>
      <div className="flex flex-wrap items-center gap-3">
        {canBuySingle && (
          <button type="button" onClick={() => buy('single')} disabled={Boolean(loading)} className={dark}>
            {loading === 'single' ? 'Opening checkout…' : `This component · $${single.price}`}
          </button>
        )}
        {canBuyPack && (
          <button type="button" onClick={() => buy('pack')} disabled={Boolean(loading)} className={canBuySingle ? light : dark}>
            {loading === 'pack' ? 'Opening checkout…' : `All ${pack.count} · $${pack.price}`}
            {canBuySingle && single.price * pack.count > pack.price && (
              <span className="ml-2 rounded-full bg-[var(--lf-lime)] px-2 py-0.5 text-[11px] font-semibold text-[var(--lf-forest)]">
                Save {Math.round((1 - pack.price / (single.price * pack.count)) * 100)}%
              </span>
            )}
          </button>
        )}
        <button
          type="button"
          onClick={() => setShowRestore((open) => !open)}
          className="sc-focus text-sm font-medium text-neutral-700 underline underline-offset-4"
        >
          Already bought?
        </button>
      </div>
      {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
      {showRestore && <RestoreForm />}
    </div>
  )
}