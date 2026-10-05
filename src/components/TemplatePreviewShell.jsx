'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import Link from 'next/link'

import { formatPrice } from '../lib/format'
import { TIERS, availableTiers } from '../lib/licenses'
import { useCheckout } from '../lib/use-checkout'

const DEVICES = [
  { id: 'desktop', label: 'Desktop', width: '100%', icon: 'M3 5.5A1.5 1.5 0 0 1 4.5 4h15A1.5 1.5 0 0 1 21 5.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 14.5v-9ZM8 20h8M12 16v4' },
  { id: 'tablet', label: 'Tablet', width: '820px', icon: 'M6.5 3h11A1.5 1.5 0 0 1 19 4.5v15a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19.5v-15A1.5 1.5 0 0 1 6.5 3ZM11 18h2' },
  { id: 'mobile', label: 'Mobile', width: '390px', icon: 'M8.5 3h7A1.5 1.5 0 0 1 17 4.5v15a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 7 19.5v-15A1.5 1.5 0 0 1 8.5 3ZM11 18h2' },
]

const iconButton =
  'sc-focus inline-flex size-9 items-center justify-center rounded-lg text-neutral-600 transition hover:bg-neutral-100 aria-pressed:bg-neutral-950 aria-pressed:text-white'

function Icon({ d }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="size-[18px]" aria-hidden="true">
      <path d={d} />
    </svg>
  )
}

export default function TemplatePreviewShell({ template }) {
  const { demo } = template
  const tiers = availableTiers(template)

  const [device, setDevice] = useState('desktop')
  const [path, setPath] = useState(demo.pages[0].path)
  const [dark, setDark] = useState(false)
  const [tier, setTier] = useState(tiers[0])
  const [loaded, setLoaded] = useState(false)
  const [slow, setSlow] = useState(false)

  const frame = useRef(null)
  const { start, error, loading } = useCheckout(template.slug)

  // The demo site listens for this message (the publish script injects the listener)
  const sendTheme = useCallback(
    (value) => {
      frame.current?.contentWindow?.postMessage({ source: 'sitecraft', type: 'theme', value: value ? 'dark' : 'light' }, demo.origin)
    },
    [demo.origin]
  )

  useEffect(() => {
    setLoaded(false)
    setSlow(false)
    const timer = setTimeout(() => setSlow(true), 12_000)
    return () => clearTimeout(timer)
  }, [path])

  const width = DEVICES.find((item) => item.id === device).width
  const src = `${demo.origin}${path}`

  const buyLabel = `Buy ${formatPrice(template.price[tier], template.currency)}`
  const tierSelect = tiers.length > 1 && (
    <>
      <label htmlFor="preview-tier" className="sr-only">
        License
      </label>
      <select
        id="preview-tier"
        value={tier}
        onChange={(event) => setTier(event.target.value)}
        className="h-9 rounded-lg bg-white px-2 text-sm text-neutral-900 ring-1 ring-neutral-950/15 focus:outline-none focus:ring-2 focus:ring-neutral-950"
      >
        {tiers.map((value) => (
          <option key={value} value={value}>
            {TIERS[value].label}
          </option>
        ))}
      </select>
    </>
  )
  const buyButton = (
    <button
      type="button"
      onClick={() => start(tier)}
      disabled={loading}
      className="sc-focus inline-flex h-9 items-center rounded-lg bg-neutral-950 px-4 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-wait disabled:opacity-70"
    >
      {loading ? 'Opening...' : buyLabel}
    </button>
  )

  return (
    <div className="flex h-[calc(100dvh-4rem)] flex-col bg-neutral-100">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-neutral-950/10 bg-white px-3 py-2">
        <Link href={`/templates/${template.slug}`} className="sc-focus -ml-1 inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100">
          <span aria-hidden="true">&larr;</span> Details
        </Link>

        <p className="min-w-0 truncate text-sm font-semibold text-neutral-950">{template.title}</p>

        {demo.pages.length > 1 && (
          <>
            <label htmlFor="preview-page" className="sr-only">
              Page
            </label>
            <select
              id="preview-page"
              value={path}
              onChange={(event) => setPath(event.target.value)}
              className="h-9 rounded-lg bg-white px-2 text-sm text-neutral-900 ring-1 ring-neutral-950/15 focus:outline-none focus:ring-2 focus:ring-neutral-950"
            >
              {demo.pages.map((page) => (
                <option key={page.path} value={page.path}>
                  {page.label}
                </option>
              ))}
            </select>
          </>
        )}

        <div className="ml-auto flex items-center gap-1">
          <div className="hidden items-center gap-1 md:flex" role="group" aria-label="Device size">
            {DEVICES.map((item) => (
              <button key={item.id} type="button" aria-pressed={device === item.id} aria-label={item.label} title={item.label} onClick={() => setDevice(item.id)} className={iconButton}>
                <Icon d={item.icon} />
              </button>
            ))}
          </div>

          {demo.dark && (
            <button
              type="button"
              aria-pressed={dark}
              aria-label="Dark mode"
              title="Dark mode"
              onClick={() => {
                setDark(!dark)
                sendTheme(!dark)
              }}
              className={iconButton}
            >
              <Icon d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.6 6.6 0 0 0 9.8 9.8Z" />
            </button>
          )}

          <a href={src} target="_blank" rel="noopener noreferrer" aria-label="Open in a new tab" title="Open in a new tab" className={iconButton}>
            <Icon d="M14 4h6v6M20 4l-9 9M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5" />
          </a>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {tierSelect}
          {buyButton}
        </div>
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden">
        <div className="mx-auto h-full transition-[width] duration-300 ease-out" style={{ width, maxWidth: '100%' }}>
          <iframe
            ref={frame}
            key={src}
            src={src}
            title={`${template.title} live preview`}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
            referrerPolicy="no-referrer"
            onLoad={() => {
              setLoaded(true)
              if (dark) sendTheme(true)
            }}
            className={`size-full bg-white ${device === 'desktop' ? '' : 'shadow-[0_0_0_1px_rgb(10_10_10/0.1),0_20px_50px_-12px_rgb(10_10_10/0.25)]'}`}
          />
        </div>

        {!loaded && (
          <div role="status" className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 bg-neutral-100 text-sm text-neutral-600 sc-hatch">
            <span className="size-6 animate-spin rounded-full border-2 border-neutral-950/15 border-t-neutral-950 motion-reduce:animate-none" aria-hidden="true" />
            Loading the live demo...
            {slow && <span className="max-w-xs text-center text-xs text-neutral-500">This is taking longer than usual. The demo may be waking up; it should appear shortly.</span>}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 border-t border-neutral-950/10 bg-white px-3 py-2 md:hidden">
        {tierSelect}
        {buyButton}
        {error && <p role="alert" className="min-w-0 truncate text-xs text-red-600">{error}</p>}
      </div>
      {error && <p role="alert" className="hidden bg-red-50 px-3 py-1.5 text-center text-sm text-red-700 md:block">{error}</p>}
    </div>
  )
}
