'use client'

import { useEffect, useRef, useState } from 'react'

// Sticky "jump to" bar for a collection page. Tracks which component is in view and keeps
// that chip centered in the scrollable row. Sits under the 56px site header (top-14).
export default function CollectionIndex({ items = [] }) {
  const [active, setActive] = useState(items[0]?.hash ?? '')
  const refRow = useRef(null)

  useEffect(() => {
    const targets = items.map(({ hash }) => document.getElementById(hash)).filter(Boolean)
    if (!targets.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (visible[0]) setActive(visible[0].target.id)
      },
      // Band just under the sticky bars; a component "counts" while it crosses the upper part of the viewport
      { rootMargin: '-120px 0px -60% 0px' }
    )

    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [items])

  useEffect(() => {
    const row = refRow.current
    const chip = row?.querySelector(`[data-hash="${active}"]`)
    if (!row || !chip) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    row.scrollTo({
      left: chip.offsetLeft - row.clientWidth / 2 + chip.clientWidth / 2,
      behavior: reduce ? 'auto' : 'smooth',
    })
  }, [active])

  if (items.length < 2) return null

  return (
    <nav
      aria-label="Components on this page"
      className="sticky top-14 z-40 border-b border-neutral-950/10 bg-white/85 backdrop-blur-md supports-[backdrop-filter]:bg-white/70"
    >
      <div
        ref={refRow}
        className="mx-auto flex max-w-screen-xl gap-1 overflow-x-auto px-4 py-2 [scrollbar-width:none] sm:px-6 lg:px-8 [&::-webkit-scrollbar]:hidden"
      >
        {items.map(({ hash, title }, index) => {
          const isActive = hash === active

          return (
            <a
              key={hash}
              href={`#${hash}`}
              data-hash={hash}
              aria-current={isActive ? 'true' : undefined}
              className={`sc-focus flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-neutral-950 text-white'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950'
              }`}
            >
              <span
                className={`sc-mono text-[11px] tabular-nums ${isActive ? 'text-neutral-400' : 'text-neutral-400'}`}
                aria-hidden="true"
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              {title}
            </a>
          )
        })}
      </div>
    </nav>
  )
}