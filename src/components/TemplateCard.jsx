import Link from 'next/link'

import { formatPrice } from '../utils/lib/format'

import TemplateShot from '@component/TemplateShot'

export default function TemplateCard({ template }) {
  const { slug, title, tagline, tag, stack, price, currency, status } = template

  return (
    <Link
      href={`/templates/${slug}`}
      className="sc-focus group flex w-full flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-neutral-950/10 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-16px_rgb(10_10_10/0.25)] hover:ring-neutral-950/20"
    >
      <div className="relative border-b border-neutral-950/10 p-2 sc-hatch">
        <div className="overflow-hidden rounded-lg ring-1 ring-neutral-950/10">
          <TemplateShot template={template} />
        </div>

        {(tag || status === 'draft') && (
          <span className="sc-mono absolute left-4 top-4 rounded-md bg-neutral-950 px-2 py-1 text-[11px] uppercase tracking-wide text-white">
            {status === 'draft' ? 'Draft' : tag}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="text-base font-semibold tracking-tight text-neutral-950">{title}</h3>
          {tagline ? <p className="mt-1 line-clamp-2 text-sm text-neutral-600">{tagline}</p> : null}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3">
          <ul className="flex flex-wrap gap-1.5" aria-label="Built with">
            {stack.slice(0, 3).map((item) => (
              <li key={item} className="sc-mono rounded-md bg-neutral-100 px-1.5 py-0.5 text-[11px] text-neutral-600">
                {item}
              </li>
            ))}
          </ul>
          <p className="shrink-0 text-sm text-neutral-950">
            <span className="text-neutral-500">From </span>
            <span className="font-semibold tabular-nums">{formatPrice(price.standard, currency)}</span>
          </p>
        </div>
      </div>
    </Link>
  )
}
