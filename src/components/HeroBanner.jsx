import Link from 'next/link'

import Container from '@component/Container'
import HeaderSearch from '@component/HeaderSearch'
import HeroSearch from '@component/HeroSearch'

// Home (no title): a full-bleed photographic hero in the editorial style of the reference:
// photo, scrim, centered headline with a single accent dot, search, chips and a live count.
// Category pages pass title / subtitle / children and get a calm cream version of the same look.
//
// Photos: put your own at public/images/hero.jpg. Until it exists, a warm green dusk is drawn instead.
export default function HeroBanner({ title, subtitle, children, stats, chips = [] }) {
  if (title) {
    return (
      <section className="lf-paper relative isolate overflow-hidden border-b border-[var(--lf-line)]">
        <div aria-hidden="true" className="lf-dots absolute inset-0 -z-10" />
        <Container classNames="py-14 sm:py-20">
          {subtitle ? <p className="sc-mono lf-rise text-xs uppercase tracking-[0.14em] text-[var(--lf-leaf-deep)]">{subtitle}</p> : null}
          <h1 className="lf-display lf-rise mt-3 max-w-3xl text-balance text-4xl font-medium tracking-[-0.02em] text-[var(--lf-forest)] sm:text-6xl" style={{ '--d': '0.08s' }}>
            {title}
            <span className="text-[var(--lf-leaf)]">.</span>
          </h1>
          <p className="lf-rise mt-4 max-w-2xl text-lg text-neutral-600" style={{ '--d': '0.16s' }}>
            {children ?? 'Preview each one, resize it to any breakpoint, then copy the code.'}
          </p>
          <div className="lf-rise mt-8 max-w-xl" style={{ '--d': '0.24s' }}>
            <HeaderSearch size="lg" className="w-full" placeholder="Search components and websites" />
          </div>
        </Container>
      </section>
    )
  }

  return (
    <section className="p-2 pb-0">
      <div className="lf-photo lf-photo-hero relative isolate flex min-h-[min(100svh,880px)] flex-col overflow-hidden rounded-[20px]">
        {/* The photo layer drifts slowly. Everything on top of it stays still. */}
        <div aria-hidden="true" className="lf-photo lf-photo-hero lf-kenburns absolute inset-0 -z-20" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgb(11_26_19/0.55),rgb(11_26_19/0.25)_40%,rgb(11_26_19/0.7))]" />
        <div aria-hidden="true" className="lf-grain absolute inset-0 -z-10 opacity-[0.07] mix-blend-overlay" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")" }} />

        <div className="flex flex-1 flex-col items-center justify-center px-4 pb-24 pt-32 text-center">
          <h1 className="lf-display lf-rise max-w-5xl text-balance text-[2.75rem] font-medium leading-[1.05] tracking-[-0.02em] text-white sm:text-6xl lg:text-[4.3rem]">
            Build something worth shipping<span className="text-[var(--lf-lime)]">.</span>
          </h1>

          <p className="lf-rise mt-5 max-w-xl text-pretty text-[19px] leading-[1.4] tracking-[-0.02em] text-[rgb(255_255_255/0.9)]" style={{ '--d': '0.1s' }}>
            Free Tailwind CSS components, premium packs and complete website templates. Preview them live, then take the code.
          </p>

          <div className="lf-rise mt-10 w-full" style={{ '--d': '0.2s' }}>
            <HeroSearch />
          </div>

          {chips.length ? (
            <ul className="lf-rise mt-5 flex flex-wrap justify-center gap-2" style={{ '--d': '0.3s' }}>
              {chips.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="lf-focus lf-glass inline-flex items-center rounded-full px-4 py-2 text-sm font-medium text-white ring-1 ring-white/25 transition hover:bg-white/20">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {stats ? (
          <p className="lf-rise absolute inset-x-0 bottom-7 block px-4 text-center text-sm font-medium text-[rgb(255_255_255/0.9)]" style={{ '--d': '0.45s' }}>
            <span>
              <span className="mr-2 inline-block size-2 rounded-full bg-[var(--lf-lime)] align-middle shadow-[0_0_10px_rgb(198_242_107)]" aria-hidden="true" />
              {stats}
            </span>
          </p>
        ) : null}
      </div>
    </section>
  )
}
