'use client'

import { useMemo, useState } from 'react'

import TemplateCard from '@component/TemplateCard'

// templates arrive already stripped of provider data, so this is safe to ship to the browser
export default function TemplateCatalog({ templates, categories }) {
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return templates.filter((template) => {
      if (category !== 'all' && template.category !== category) return false
      if (!needle) return true
      return [template.title, template.tagline, ...template.stack].some((text) =>
        text.toLowerCase().includes(needle)
      )
    })
  }, [templates, category, query])

  const chip = (active) =>
    `sc-focus rounded-full px-3 py-1.5 text-sm transition-colors ${
      active
        ? 'bg-neutral-950 text-white'
        : 'bg-white text-neutral-700 ring-1 ring-neutral-950/10 hover:bg-neutral-50'
    }`

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          <button type="button" aria-pressed={category === 'all'} onClick={() => setCategory('all')} className={chip(category === 'all')}>
            All <span className="tabular-nums opacity-60">{templates.length}</span>
          </button>
          {categories.map(({ value, label, count }) => (
            <button
              key={value}
              type="button"
              aria-pressed={category === value}
              onClick={() => setCategory(value)}
              className={chip(category === value)}
            >
              {label} <span className="tabular-nums opacity-60">{count}</span>
            </button>
          ))}
        </div>

        <div>
          <label htmlFor="template-filter" className="sr-only">
            Filter templates
          </label>
          <input
            id="template-filter"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filter by name or stack"
            className="h-9 w-full rounded-lg bg-neutral-50 px-3 text-sm text-neutral-950 outline-none ring-1 ring-inset ring-neutral-950/10 placeholder:text-neutral-500 hover:bg-white focus:bg-white focus:ring-2 focus:ring-neutral-950 sm:w-64"
          />
        </div>
      </div>

      {visible.length ? (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((template) => (
            <li key={template.slug} className="flex">
              <TemplateCard template={template} />
            </li>
          ))}
        </ul>
      ) : (
        <p role="status" className="rounded-2xl p-10 text-center text-sm text-neutral-600 ring-1 ring-neutral-950/10 sc-hatch">
          No templates match. Try clearing the filter.
        </p>
      )}
    </div>
  )
}
