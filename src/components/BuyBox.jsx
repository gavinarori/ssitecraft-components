'use client'

import { useState } from 'react'

import Link from 'next/link'

import { formatPrice } from '../utils/lib/format'
import { TIERS, availableTiers } from '../utils/lib/licenses'
import { useCheckout } from '../utils/lib/use-checkout'

const Check = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 size-4 shrink-0 text-[var(--lf-leaf)]" aria-hidden="true">
    <path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" clipRule="evenodd" />
  </svg>
)

export default function BuyBox({ template }) {
  const tiers = availableTiers(template)
  const [tier, setTier] = useState(tiers[0])
  const { start, error, loading } = useCheckout(template.slug)

  return (
    <aside aria-label="Purchase" className="rounded-2xl bg-white p-5 ring-1 ring-neutral-950/10">
      <fieldset>
        <legend className="sc-mono text-[11px] uppercase tracking-wide text-neutral-500">License</legend>

        <div className="mt-3 space-y-2">
          {tiers.map((value) => (
            <label key={value} className="block cursor-pointer">
              <input
                type="radio"
                name="tier"
                value={value}
                checked={tier === value}
                onChange={() => setTier(value)}
                className="peer sr-only"
              />
              <span className="flex items-start justify-between gap-3 rounded-xl p-3 ring-1 ring-neutral-950/10 transition peer-checked:bg-neutral-50 peer-checked:ring-2 peer-checked:ring-neutral-950 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--lf-leaf)]">
                <span>
                  <span className="block text-sm font-semibold text-neutral-950">{TIERS[value].label}</span>
                  <span className="mt-0.5 block text-xs text-neutral-600">{TIERS[value].blurb}</span>
                </span>
                <span className="text-sm font-semibold tabular-nums text-neutral-950">
                  {formatPrice(template.price[value], template.currency)}
                </span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <button
        type="button"
        onClick={() => start(tier)}
        disabled={loading}
        className="sc-focus mt-4 inline-flex h-11 w-full items-center justify-center rounded-xl bg-neutral-950 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-wait disabled:opacity-70"
      >
        {loading ? 'Opening checkout...' : `Buy ${TIERS[tier].label} · ${formatPrice(template.price[tier], template.currency)}`}
      </button>

      <p role="alert" className="mt-2 min-h-5 text-sm text-red-600">
        {error}
      </p>

      <Link
        href={`/templates/${template.slug}/preview`}
        className="sc-focus inline-flex h-11 w-full items-center justify-center rounded-xl text-sm font-semibold text-neutral-950 ring-1 ring-neutral-950/15 transition hover:bg-neutral-50"
      >
        Live preview
      </Link>

      {template.included.length ? (
        <div className="mt-5 border-t border-neutral-950/10 pt-4">
          <p className="sc-mono text-[11px] uppercase tracking-wide text-neutral-500">What you get</p>
          <ul className="mt-3 space-y-2 text-sm text-neutral-700">
            {template.included.map((item) => (
              <li key={item} className="flex gap-2">
                <Check />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <p className="mt-5 text-xs leading-relaxed text-neutral-500">
        Paid securely at checkout. We email your download link as soon as the payment clears.{' '}
        <Link href="/legal/license" className="underline underline-offset-2 hover:text-neutral-800">
          License
        </Link>
        {' · '}
        <Link href="/legal/refunds" className="underline underline-offset-2 hover:text-neutral-800">
          Refunds
        </Link>
      </p>
    </aside>
  )
}
