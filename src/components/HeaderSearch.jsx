'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

// Wraps the first match in the result title so the eye lands on why it matched.
function Highlight({ text, query }) {
  const needle = query.trim().toLowerCase()
  const start = needle ? text.toLowerCase().indexOf(needle) : -1
  if (start === -1) return text

  return (
    <>
      {text.slice(0, start)}
      <mark className="bg-transparent text-neutral-950 underline decoration-sky-500 decoration-2 underline-offset-[3px]">
        {text.slice(start, start + needle.length)}
      </mark>
      {text.slice(start + needle.length)}
    </>
  )
}

// size="lg" is used in the hero. enableShortcut binds Cmd/Ctrl+K and should be set on ONE instance (the header).
export default function HeaderSearch({
  className = '',
  size = 'md',
  tone = 'light', // 'dark' is for the hero stage
  enableShortcut = false,
}) {
  const pathname = usePathname()
  const router = useRouter()
  const inputId = useId()
  const listId = useId()
  const refRoot = useRef(null)
  const refInput = useRef(null)
  const refList = useRef(null)

  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [items, setItems] = useState(null)
  const [failed, setFailed] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [shortcutLabel, setShortcutLabel] = useState('⌘K')

  useEffect(() => {
    setQuery('')
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!enableShortcut) return
    if (!/Mac|iPhone|iPad/.test(navigator.platform)) setShortcutLabel('Ctrl K')

    const onKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        refInput.current?.focus()
        setOpen(true)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [enableShortcut])

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

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event) => {
      if (refRoot.current && !refRoot.current.contains(event.target)) setOpen(false)
    }
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false)
        refInput.current?.blur()
      }
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const results = useMemo(() => {
    if (!items) return []
    const needle = query.toLowerCase().trim()
    if (!needle) return items
    return items.filter(
      ({ title, category }) =>
        title.toLowerCase().includes(needle) || category?.title?.toLowerCase().includes(needle)
    )
  }, [items, query])

  // A new query always starts back at the top result
  useEffect(() => setActiveIndex(0), [query])

  // Keep the keyboard-selected row visible inside the scroll area
  useEffect(() => {
    if (!open) return
    refList.current
      ?.querySelector(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex, open])

  function handleKeyDown(event) {
    if (!results.length) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setOpen(true)
      setActiveIndex((index) => (index + 1) % results.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setOpen(true)
      setActiveIndex((index) => (index - 1 + results.length) % results.length)
    } else if (event.key === 'Enter' && open) {
      const result = results[activeIndex]
      if (result) {
        event.preventDefault()
        router.push(result.href ?? `/components/${result.category.slug}/${result.slug}`)
      }
    }
  }

  const isLarge = size === 'lg'
  const inputTone =
    tone === 'dark'
      ? 'bg-[#0e0e14] text-white ring-white/10 placeholder:text-neutral-400 hover:bg-[#13131b] focus:bg-[#13131b] focus:ring-white/70'
      : 'bg-neutral-50 text-neutral-950 ring-neutral-950/10 placeholder:text-neutral-500 hover:bg-white focus:bg-white focus:ring-neutral-950'
  const optionId = (index) => `${listId}-option-${index}`

  return (
    <div ref={refRoot} className={`relative ${className}`}>
      <form role="search" onSubmit={(event) => event.preventDefault()}>
        <label htmlFor={inputId} className="sr-only">
          Search components and templates
        </label>

        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-neutral-400 ${
              isLarge ? 'left-4 size-5' : 'left-3 size-4'
            }`}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.3-4.3M17 10.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z" />
          </svg>

          <input
            ref={refInput}
            id={inputId}
            type="search"
            role="combobox"
            aria-expanded={open}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={open && results.length ? optionId(activeIndex) : undefined}
            autoComplete="off"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search"
            className={`w-full appearance-none outline-none ring-1 ring-inset transition focus:ring-2 ${inputTone} ${
              isLarge ? 'h-12 rounded-xl pl-12 pr-4 text-base' : 'h-9 rounded-lg pl-9 pr-14 text-sm'
            }`}
          />

          {enableShortcut && !query && (
            <kbd className="sc-mono pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-md bg-white px-1.5 py-0.5 text-[11px] text-neutral-500 ring-1 ring-neutral-950/10 lg:block">
              {shortcutLabel}
            </kbd>
          )}
        </div>
      </form>

      {open && (
        <div className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-xl bg-white text-left shadow-[0_20px_50px_-12px_rgb(10_10_10/0.25)] ring-1 ring-neutral-950/10">
          {results.length ? (
            <>
              <ul ref={refList} id={listId} role="listbox" aria-label="Components" className="max-h-80 overflow-auto p-1">
                {results.map((result, index) => {
                  const isActive = index === activeIndex

                  return (
                    <li
                      key={result.id}
                      id={optionId(index)}
                      data-index={index}
                      role="option"
                      aria-selected={isActive}
                    >
                      <Link
                        href={result.href ?? `/components/${result.category.slug}/${result.slug}`}
                        tabIndex={-1}
                        onMouseMove={() => setActiveIndex(index)}
                        className={`flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm text-neutral-800 transition-colors ${
                          isActive ? 'bg-neutral-100' : ''
                        }`}
                      >
                        <span className="truncate font-medium">
                          <Highlight text={result.title} query={query} />
                        </span>
                        <span className="sc-mono shrink-0 text-xs text-neutral-500">{result.category.title}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>

              {/* Keyboard hints: desktop only, there is no keyboard on a phone */}
              <div
                aria-hidden="true"
                className="sc-mono hidden items-center gap-4 border-t border-neutral-950/10 bg-neutral-50 px-3 py-2 text-[11px] text-neutral-500 sm:flex"
              >
                <span>↑↓ navigate</span>
                <span>↵ open</span>
                <span>esc close</span>
                <span className="ml-auto tabular-nums">{results.length} results</span>
              </div>
            </>
          ) : (
            <p className="p-4 text-center text-sm text-neutral-500" role="status">
              {failed
                ? 'Search is unavailable. Refresh the page and try again.'
                : !items
                  ? 'Loading...'
                  : `Nothing matches "${query}".`}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
