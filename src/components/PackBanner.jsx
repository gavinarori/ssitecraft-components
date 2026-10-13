'use client'

import { useEffect, useState } from 'react'

import UnlockPanel from '@component/UnlockPanel'

/** Top-of-collection strip for a paid pack: the offer for visitors, a "you own this" note for buyers. */
export default function PackBanner({ pack, freeCount = 0, singlePrice = null }) {
  const [unlocked, setUnlocked] = useState(null) // null while checking
  const [ownedSingles, setOwnedSingles] = useState([])

  useEffect(() => {
    let cancelled = false
    fetch(`/api/access/${pack.id}`)
      .then((response) => response.json())
      .then((data) => {
        if (cancelled) return
        setUnlocked(Boolean(data.unlocked))
        setOwnedSingles(data.components ?? [])
      })
      .catch(() => !cancelled && setUnlocked(false))
    return () => { cancelled = true }
  }, [pack.id])

  if (unlocked === null) return <div className="h-24" aria-hidden="true" />

  if (unlocked) {
    return (
      <p className="rounded-[20px] border border-[rgb(22_160_95/0.3)] bg-[rgb(198_242_107/0.3)] px-6 py-4 text-sm font-medium text-[var(--lf-forest)]" role="status">
        Pro pack unlocked. Every component below has live preview and copy-paste code.
      </p>
    )
  }

  return (
    <section className="rounded-[20px] border border-neutral-200 bg-white p-6 shadow-[rgba(0,0,0,0.07)_0_6px_27px] sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-[var(--lf-leaf)]">Pro pack</p>
      <h2 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-950">{pack.title}</h2>
      <p className="mt-2 max-w-xl text-sm text-neutral-600">
        {pack.count} components with live preview and copy-paste code (HTML, JSX, Vue). One payment, yours to keep.
        {freeCount > 0 ? ` ${freeCount} sample${freeCount > 1 ? 's are' : ' is'} free to try below.` : ''}
      </p>
      {singlePrice ? (
        <p className="mt-2 text-sm text-neutral-600">
          Only need one? Each component is ${singlePrice} on its own, buy it from its Code tab.
          {ownedSingles.length ? ` You already own ${ownedSingles.length}.` : ''}
        </p>
      ) : null}
      <div className="mt-5">
        <UnlockPanel pack={pack} />
      </div>
    </section>
  )
}