'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function HeaderSearch({ className = '' }) {
  const pathname = usePathname()
  // useId: the search now appears in the header AND the hero, so a fixed id="SiteSearch" was duplicated.
  const inputId = useId()
  const listId = useId()
  const refRoot = useRef(null)

  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [items, setItems] = useState(null)
  const [failed, setFailed] = useState(false)

  // Close and reset on navigation
  useEffect(() => {
    setQuery('')
    setOpen(false)
  }, [pathname])

  // Load the index once, the first time the dropdown opens
  useEffect(() => {
    if (!open || items) return

    let cancelled = false
    setFailed(false)

    fetch('/api/search')
      .then((res) => {
        if (!res.ok) throw new Error(`Search failed: ${res.status}`)
        return res.json()
      })
      .then((data) => {
        if (!cancelled) setItems([...data].sort((a, b) => a.title.localeCompare(b.title)))
      })
      .catch(() => {
        if (!cancelled) setFailed(true)
      })

    return () => {
      cancelled = true
    }
  }, [open, items])

  // Click outside / Escape to close (replaces react-use's useClickAway)
  useEffect(() => {
    if (!open) return

    const onPointerDown = (event) => {
      if (refRoot.current && !refRoot.current.contains(event.target)) setOpen(false)
    }
    const onKeyDown = (event) => event.key === 'Escape' && setOpen(false)

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  // Filtering ~dozens of titles is instant, so no debounce state is needed
  const results = useMemo(() => {
    if (!items) return []
    const needle = query.toLowerCase().trim()
    if (!needle) return items
    return items.filter(
      ({ title, category }) =>
        title.toLowerCase().includes(needle) || category?.title?.toLowerCase().includes(needle)
    )
  }, [items, query])

  return (
    <div ref={refRoot} className={`relative w-full flex-1 ${className}`}>
      <form role="search" onSubmit={(event) => event.preventDefault()}>
        <label htmlFor={inputId} className="sr-only">
          Search components
        </label>

        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.3-4.3M17 10.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z" />
          </svg>

          <input
            id={inputId}
            type="search"
            role="combobox"
            aria-expanded={open}
            aria-controls={listId}
            autoComplete="off"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onFocus={() => setOpen(true)}
            placeholder="Search components..."
            className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
          />
        </div>
      </form>

      {open && (
        <div
          id={listId}
          className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow-xl"
        >
          {results.length ? (
            <ul className="max-h-72 space-y-0.5 overflow-auto p-2">
              {results.map((result) => (
                <li key={result.id}>
                  <Link
                    href={`/components/${result.category.slug}/${result.slug}`}
                    className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-700 focus:bg-indigo-50 focus:outline-none"
                  >
                    <span className="truncate">{result.title}</span>
                    <span className="shrink-0 rounded-md bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600">
                      {result.category.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-4 text-center text-sm text-slate-500" role="status">
              {failed
                ? 'Search is unavailable right now.'
                : !items
                  ? 'Loading...'
                  : 'Sorry, nothing matches that 🗿'}
            </p>
          )}
        </div>
      )}
    </div>
  )
}