'use client'

import { useState } from 'react'

import HeaderSearch from '@component/HeaderSearch'

const SCOPES = [
  { id: 'component', label: 'Components', placeholder: 'Dashboards, pricing tables' },
  { id: 'template', label: 'Websites', placeholder: 'Agency, cabins, portfolio' },
]

// The pill toggle narrows what the search looks through, like the audience switch on the reference design
export default function HeroSearch() {
  const [scope, setScope] = useState('component')
  const active = SCOPES.find((item) => item.id === scope)

  return (
    <div className="mx-auto w-full max-w-[540px]">
      <div role="group" aria-label="Search in" className="mx-auto mb-3 flex w-fit gap-0.5 rounded-xl bg-black/30 p-1 backdrop-blur-md ring-1 ring-white/15">
        {SCOPES.map((item) => {
          const on = item.id === scope
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={on}
              onClick={() => setScope(item.id)}
              className={`lf-focus rounded-lg px-[18px] py-2 text-sm font-medium transition ${
                on ? 'bg-white text-black shadow-[0_6px_27px_rgba(0,0,0,0.07)]' : 'text-white/75 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          )
        })}
      </div>

      <div className="rounded-[14px] p-1 ring-1 ring-white/25">
        <HeaderSearch variant="hero" scope={scope} placeholder={active.placeholder} className="w-full" />
      </div>
    </div>
  )
}
