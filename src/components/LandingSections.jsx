import Link from 'next/link'

import Container from '@component/Container'

const Check = ({ className = 'size-4 text-[var(--lf-leaf)]' }) => (
  <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m3.5 8.5 3 3 6-7" />
  </svg>
)

const buttonDark =
  'lf-focus inline-flex items-center rounded-lg bg-[#171717] px-[18px] py-2.5 text-[15px] font-medium tracking-[-0.02em] text-white shadow-[0_6px_27px_rgba(0,0,0,0.07)] transition hover:bg-black'

// Editorial manifesto: a short heading and a short paragraph, left aligned, narrow measure
export function Manifesto({ componentsHref }) {
  return (
    <section aria-labelledby="manifesto">
      <Container classNames="py-24 lg:py-32">
        <div className="max-w-[520px]">
          <h2 id="manifesto" className="lf-display text-balance text-[28px] font-medium leading-[1.4] tracking-[-0.02em] text-black">
            Good parts, in the open.
          </h2>
          <p className="mt-4 text-base leading-6 tracking-[-0.02em] text-[#737373]">
            We build the pieces you would otherwise spend a week on. Open one, resize it to any screen, copy the code. When a project needs more, take a whole pack or a finished website, and make it yours.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href={componentsHref} className={buttonDark}>Browse components</Link>
            <Link href="/templates" className="lf-focus inline-flex items-center rounded-lg px-[18px] py-2.5 text-[15px] font-medium tracking-[-0.02em] text-black ring-1 ring-[#c7c7c7] transition hover:bg-white">
              See websites
            </Link>
          </div>
        </div>
      </Container>
    </section>
  )
}

// ---- mini product mockups that sit inside the feature cards ----
function FreeMock() {
  return (
    <div className="space-y-2.5">
      <div className="flex h-10 items-center gap-2 rounded-xl bg-white px-3 text-sm text-[#999694] ring-1 ring-[#c7c7c7]">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="size-4" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.3-4.3M17 10.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z" /></svg>
        Pricing table
      </div>
      {['Pricing table', 'Pricing with toggle'].map((name, i) => (
        <div key={name} className="flex items-center justify-between rounded-xl bg-white px-3 py-2.5 ring-1 ring-[#c7c7c7]/70">
          <span className="text-sm font-medium text-black">{name}</span>
          {i === 0 ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--lf-lime)] px-2.5 py-1 text-xs font-medium text-[var(--lf-forest)]"><Check className="size-3" />Copied</span>
          ) : (
            <span className="sc-mono rounded-full bg-[var(--lf-lime)] px-2.5 py-1 text-[11px] uppercase text-[var(--lf-forest)]">Free</span>
          )}
        </div>
      ))}
    </div>
  )
}

function ProMock() {
  return (
    <div className="relative h-full min-h-[150px]">
      <div className="absolute left-2 top-3 w-[78%] rotate-[-4deg] rounded-xl bg-[var(--lf-forest-2)] p-3 ring-1 ring-black/10">
        <div className="h-2 w-1/2 rounded-full bg-white/30" />
        <div className="mt-2 h-2 w-3/4 rounded-full bg-white/15" />
      </div>
      <div className="absolute right-1 top-9 w-[82%] rotate-[3deg] rounded-xl bg-white p-3 shadow-[0_6px_27px_rgba(0,0,0,0.07)] ring-1 ring-[#c7c7c7]/70">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-black">Dashboard UI kit</span>
          <span className="sc-mono inline-flex items-center gap-1 rounded-full bg-[var(--lf-forest)] px-2.5 py-1 text-[11px] uppercase text-[var(--lf-lime)]">
            <svg viewBox="0 0 20 20" fill="currentColor" className="size-3" aria-hidden="true"><path d="m10 1.5 2.5 5.3 5.8.7-4.3 4 1.1 5.7L10 14.3 4.9 17.2 6 11.5 1.7 7.5l5.8-.7L10 1.5Z" /></svg>
            Pro
          </span>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-1.5">
          {[0, 1, 2].map((i) => <div key={i} className="h-8 rounded-md bg-[var(--lf-paper)]" />)}
        </div>
      </div>
    </div>
  )
}

function SiteMock() {
  return (
    <div className="overflow-hidden rounded-xl bg-white ring-1 ring-[#c7c7c7]/70">
      <div className="flex items-center justify-between border-b border-[#c7c7c7]/60 px-3 py-2">
        <span className="flex gap-1">{[0, 1, 2].map((i) => <span key={i} className="size-2 rounded-full bg-[#c7c7c7]" />)}</span>
        <span className="flex gap-1 rounded-md bg-[var(--lf-paper)] p-0.5">
          {['M3 5h18v11H3zM8 20h8', 'M7 3h10v18H7z', 'M9 3h6v18H9z'].map((d, i) => (
            <span key={i} className={`grid size-6 place-items-center rounded ${i === 0 ? 'bg-white shadow-sm' : ''}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#171717" strokeWidth="1.8" strokeLinejoin="round" className="size-3.5" aria-hidden="true"><path d={d} /></svg>
            </span>
          ))}
        </span>
      </div>
      <div className="space-y-2 p-3">
        <div className="h-16 rounded-lg bg-[linear-gradient(135deg,#14402e,#16a05f)]" />
        <div className="grid grid-cols-3 gap-1.5">{[0, 1, 2].map((i) => <div key={i} className="h-7 rounded-md bg-[var(--lf-paper)]" />)}</div>
      </div>
    </div>
  )
}

export function FeatureCards({ componentsHref }) {
  const cards = [
    { title: 'Free, copy-ready components', body: 'Sections and UI blocks for apps and marketing sites. No account, no install. Switch between HTML, JSX and Vue.', mock: <FreeMock />, href: componentsHref, cta: 'Browse components' },
    { title: 'Premium packs', body: 'Larger, more polished collections for products that need to feel finished on day one. Full source after purchase.', mock: <ProMock />, href: '#pricing', cta: 'Compare free and Pro' },
    { title: 'Websites you can try first', body: 'Open a whole site live, resize it, flip it to dark mode. Like it? Take the source and make it your own.', mock: <SiteMock />, href: '/templates', cta: 'See templates' },
  ]

  return (
    <section aria-labelledby="features-cards" className="pb-24 lg:pb-32">
      <h2 id="features-cards" className="sr-only">What you get</h2>
      <Container>
        <ul className="grid gap-6 lg:grid-cols-3">
          {cards.map(({ title, body, mock, href, cta }) => (
            <li key={title}>
              <article className="lf-card flex h-full flex-col p-8">
                <div className="min-h-[180px] rounded-2xl bg-[var(--lf-paper)] p-4">{mock}</div>
                <h3 className="lf-display mt-8 text-[23px] font-medium leading-[1.4] tracking-[-0.02em] text-black">{title}</h3>
                <p className="mt-2 text-base leading-6 tracking-[-0.02em] text-[#737373]">{body}</p>
                <Link href={href} className="lf-focus mt-6 inline-flex items-center gap-1.5 self-start text-sm font-medium tracking-[-0.02em] text-black underline decoration-[var(--lf-leaf)] decoration-2 underline-offset-[5px]">
                  {cta} <span aria-hidden="true">&rarr;</span>
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

const ROWS = [
  ['Live preview', true, true, true],
  ['Resize to any breakpoint', true, true, true],
  ['How you get it', 'Copy from the page', 'Download after purchase', 'Download after purchase'],
  ['Scope', 'Single sections and blocks', 'Whole UI kits', 'A complete website'],
  ['Price', 'Free', 'One-time purchase', 'One-time purchase'],
]

export function Compare() {
  const heads = [
    { label: 'Free', note: 'Components', accent: 'bg-[var(--lf-lime)] text-[var(--lf-forest)]' },
    { label: 'Pro', note: 'Packs', accent: 'bg-[var(--lf-forest)] text-[var(--lf-lime)]' },
    { label: 'Templates', note: 'Websites', accent: 'bg-white text-[var(--lf-forest)] ring-1 ring-[#c7c7c7]' },
  ]

  return (
    <section id="pricing" aria-labelledby="compare" className="scroll-mt-20">
      <Container classNames="py-24 lg:py-32">
        <div className="max-w-[520px]">
          <h2 id="compare" className="lf-display text-balance text-[28px] font-medium leading-[1.4] tracking-[-0.02em] text-black">Pick what fits the project.</h2>
          <p className="mt-4 text-base leading-6 tracking-[-0.02em] text-[#737373]">The same quality bar everywhere. The difference is how much you take home.</p>
        </div>

        <div className="lf-card relative mt-10 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <caption className="sr-only">Free components, Pro packs and Templates compared</caption>
            <thead>
              <tr>
                <td className="w-[28%] p-6" />
                {heads.map(({ label, note, accent }) => (
                  <th key={label} scope="col" className="p-6 align-bottom">
                    <span className={`sc-mono inline-block rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-wide ${accent}`}>{label}</span>
                    <span className="mt-2 block text-base font-medium text-black">{note}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map(([name, ...cells]) => (
                <tr key={name} className="border-t border-[#c7c7c7]/70">
                  <th scope="row" className="p-6 font-medium text-[#4b4b4b]">{name}</th>
                  {cells.map((cell, index) => (
                    <td key={index} className="p-6 text-black">
                      {cell === true ? (<><Check className="size-5 text-[var(--lf-leaf)]" /><span className="sr-only">Included</span></>) : cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </section>
  )
}

// Photographic call to action: full-bleed image card, scrim, headline top-left, button bottom-left.
// Photo: public/images/cta.jpg (a green-and-teal dusk is drawn until it exists).
export function PhotoCta({ componentsHref }) {
  return (
    <section aria-labelledby="final-cta" className="pb-24 lg:pb-32">
      <Container>
        <div className="lf-photo lf-photo-cta relative isolate flex min-h-[420px] flex-col justify-between overflow-hidden rounded-[20px] p-8 sm:min-h-[520px] sm:p-14">
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgb(11_26_19/0.55),rgb(11_26_19/0.1)_60%)]" />
          <h2 id="final-cta" className="lf-display max-w-md text-balance text-4xl font-medium leading-[1.1] tracking-[-0.02em] text-white sm:text-[3.4rem]">
            Build the site made for you<span className="text-[var(--lf-lime)]">.</span>
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link href={componentsHref} className="lf-focus inline-flex items-center rounded-lg bg-white px-[18px] py-3 text-[15px] font-medium tracking-[-0.02em] text-black shadow-[0_6px_27px_rgba(0,0,0,0.07)] transition hover:bg-[#f2f2f2]">
              Get started
            </Link>
            <Link href="/templates" className="lf-focus lf-glass inline-flex items-center rounded-lg px-[18px] py-3 text-[15px] font-medium tracking-[-0.02em] text-white ring-1 ring-white/30 transition hover:bg-white/20">
              See websites
            </Link>
          </div>
        </div>
      </Container>
    </section>
  )
}
