import HeaderSearch from '@component/HeaderSearch'
import HeroDemo from '@component/HeroDemo'
import HeroSpotlight from '@component/HeroSpotlight'
import Container from '@component/Container'

// [grid column, seconds per pass, start delay] for the light beams that run down the grid lines
const BEAMS = [
  [3, 8, 0],
  [8, 10, 2.4],
  [13, 7, 4.6],
  [18, 9, 1.3],
  [23, 11, 5.8],
]

const GRID = 48 // px, must match the cell size of .sc-grid-dark in tokens.css

const FORMATS = [
  {
    label: 'HTML',
    paths: ['M5 4.15h22.5l-2 20.5-9.25 4-9.25-4-2-20.5Z', 'M20.5 9.15H12v5.5h8.5v6l-4.25 2-4.25-2v-2.5'],
  },
  { label: 'React', atom: true },
  {
    label: 'Vue',
    paths: ['M19.924 5 16 11.644 12.075 5H3l13 23L29 5h-9.076Z', 'M19.879 5 16 11.26 12.121 5H8l8 13 8-13h-4.121Z'],
  },
]

function FormatIcon({ format }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className="size-5 flex-none stroke-current text-neutral-400"
      fill="none"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {format.atom ? (
        <>
          <ellipse cx="16" cy="16" rx="13" ry="5" />
          <ellipse cx="16" cy="16" rx="13" ry="5" transform="rotate(60 16 16)" />
          <ellipse rx="13" ry="5" transform="matrix(-.5 .86603 .86603 .5 16 16)" />
          <circle cx="16" cy="16" r="2" />
        </>
      ) : (
        format.paths.map((d) => <path key={d} d={d} />)
      )}
    </svg>
  )
}

// Everything in here is decorative: hidden from assistive tech and from pointer events.
// It lives in its own clipped layer so the search dropdown is never cut off by the hero.
function Backdrop({ calm }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Aurora: saturated light drifting behind the copy */}
      <div className="sc-aurora sc-aurora-a -left-[12%] -top-[40%] h-[640px] w-[640px] bg-[radial-gradient(closest-side,rgb(14_165_233/0.55),transparent)] sm:h-[900px] sm:w-[900px]" />
      <div className="sc-aurora sc-aurora-b -right-[14%] -top-[32%] h-[600px] w-[600px] bg-[radial-gradient(closest-side,rgb(124_58_237/0.6),transparent)] sm:h-[860px] sm:w-[860px]" />
      {!calm && (
        <>
          <div className="sc-aurora sc-aurora-c left-[30%] top-[28%] h-[520px] w-[520px] bg-[radial-gradient(closest-side,rgb(217_70_239/0.30),transparent)] sm:h-[760px] sm:w-[760px]" />
          {/* Pool of light under the demo window. closest-side keeps its edges fully transparent. */}
          <div className="absolute -bottom-[18%] left-1/2 h-[55%] w-[110%] -translate-x-1/2 bg-[radial-gradient(closest-side,rgb(99_102_241/0.42),rgb(56_189_248/0.12)_62%,transparent)]" />
        </>
      )}

      <div className="sc-grid-dark absolute inset-0" />

      {!calm &&
        BEAMS.map(([column, seconds, delay]) => (
          <span
            key={column}
            className="sc-beam hidden sm:block"
            style={{
              left: column * GRID,
              '--t': `${seconds}s`,
              '--d': `${delay}s`,
              '--beam': column % 2 ? '#38bdf8' : '#c4b5fd',
            }}
          />
        ))}

      <HeroSpotlight />
      <div className="sc-noise absolute inset-0" />
    </div>
  )
}

const GLASS =
  'rounded-2xl bg-[#12121a]/90 p-3.5 shadow-[0_30px_60px_-24px_rgb(0_0_0/0.85)] ring-1 ring-white/15 backdrop-blur-xl'

// Four glass cards that hang off the sides of the demo window and drift. Each one is a real
// feature of the product: copy code, copied toast, breakpoint presets, dark variants.
// Wide screens only, so they never crowd the copy.
function FloatingUI() {
  const place = 'pointer-events-none absolute z-10 hidden xl:block'

  return (
    <div aria-hidden="true">
      {/* Code */}
      <div className={`${place} sc-float -left-36 top-16 w-56`} style={{ '--r': '-3deg', '--t': '8s' }}>
        <div className={GLASS}>
          <div className="mb-2.5 flex gap-1.5">
            <span className="size-2 rounded-full bg-white/20" />
            <span className="size-2 rounded-full bg-white/20" />
            <span className="size-2 rounded-full bg-white/20" />
          </div>
          <div className="sc-mono text-[11px] leading-5">
            <p className="text-neutral-500">&lt;button</p>
            <p className="pl-3">
              <span className="text-sky-300">class</span>
              <span className="text-neutral-500">=</span>
              <span className="text-emerald-300">&quot;rounded-full</span>
            </p>
            <p className="pl-6 text-emerald-300">
              bg-violet-600&quot;<span className="text-neutral-500">&gt;</span>
              <span className="sc-caret ml-0.5 inline-block h-3 w-px translate-y-0.5 bg-white" />
            </p>
          </div>
        </div>
      </div>

      {/* Copied toast */}
      <div className={`${place} sc-float -left-24 bottom-20 w-60`} style={{ '--r': '2deg', '--t': '9s', '--d': '-3s' }}>
        <div className={`${GLASS} sc-pop flex items-center gap-3`}>
          <span className="grid size-8 flex-none place-items-center rounded-full bg-emerald-400/20 text-emerald-300 ring-1 ring-emerald-300/30">
            <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3.5 8.5 3 3 6-7" />
            </svg>
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white">Copied to clipboard</p>
            <p className="sc-mono truncate text-[11px] text-neutral-400">pricing-section.html</p>
          </div>
        </div>
      </div>

      {/* Breakpoints */}
      <div className={`${place} sc-float -right-36 top-16 w-56`} style={{ '--r': '3deg', '--t': '7.5s', '--d': '-2s' }}>
        <div className={GLASS}>
          <p className="mb-2.5 text-xs font-medium text-neutral-300">Preview width</p>
          <div className="sc-bp sc-mono flex gap-1 rounded-lg bg-black/30 p-1 text-[11px]">
            {['sm', 'md', 'lg', 'xl'].map((name, index) => (
              <span key={name} className="flex-1 rounded-md py-1 text-center" style={{ '--i': index }}>
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Dark variant switch */}
      <div className={`${place} sc-float -right-28 bottom-24 w-52`} style={{ '--r': '-2deg', '--t': '9.5s', '--d': '-5s' }}>
        <div className={`${GLASS} flex items-center justify-between gap-3`}>
          <span className="text-sm font-medium text-white">Dark mode</span>
          <span className="sc-switch-track flex h-5 w-9 items-center rounded-full p-0.5">
            <span className="sc-switch-thumb block size-4 rounded-full bg-white shadow" />
          </span>
        </div>
      </div>
    </div>
  )
}

function Marquee({ items }) {
  if (!items.length) return null

  // Repeat short lists so one half is always wider than the viewport and the loop never shows a gap
  const repeats = Math.max(1, Math.ceil(16 / items.length))
  const row = Array.from({ length: repeats }, () => items).flat()

  return (
    <div
      aria-hidden="true"
      className="relative overflow-hidden border-t border-white/10 bg-black/20 py-4 backdrop-blur-sm [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
    >
      <div className="sc-marquee">
        {[0, 1].map((half) => (
          <ul key={half} className="flex shrink-0 items-center gap-3 pr-3">
            {row.map((title, index) => (
              <li
                key={`${half}-${index}`}
                className="sc-mono inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-white/[0.05] px-3 py-1.5 text-xs text-neutral-300 ring-1 ring-white/10"
              >
                <span className="size-1.5 rounded-full bg-sky-400 shadow-[0_0_8px_rgb(56_189_248)]" />
                {title}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  )
}

// Home (no title): full stage with search, product shot and a marquee of real collections.
// Category pages pass title / subtitle / children and get the same look, calmer and shorter.
export default function HeroBanner({ title, subtitle, children, marquee = [] }) {
  const isHome = !title
  const eyebrow = subtitle ?? (isHome ? 'New components every week' : null)

  return (
    <section className="sc-stage relative isolate border-b border-white/10">
      <Backdrop calm={!isHome} />

      <Container classNames={isHome ? 'pt-16 sm:pt-24 lg:pt-28' : 'pb-16 pt-16 sm:pb-20 sm:pt-24 lg:pb-24 lg:pt-28'}>
        <div className="mx-auto max-w-5xl text-center">
          {eyebrow ? (
            <div className="sc-rise">
              <span className="sc-ring-dark inline-flex rounded-full p-px">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#0b0b10] px-3.5 py-1.5 text-sm font-medium text-neutral-200">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
                  </span>
                  {eyebrow}
                </span>
              </span>
            </div>
          ) : null}

          <h1
            className="sc-rise mx-auto mt-6 max-w-5xl text-balance text-4xl font-semibold tracking-tighter text-white sm:text-6xl lg:text-[4rem] lg:leading-[1.05]"
            style={{ '--d': '0.08s' }}
          >
            {title ?? (
              <>
                Tailwind CSS components you can <span className="sc-aurora-text">copy, paste and ship</span>
              </>
            )}
          </h1>

          <p
            className="sc-rise mx-auto mt-6 max-w-2xl text-pretty text-lg leading-8 text-neutral-400"
            style={{ '--d': '0.18s' }}
          >
            {children ??
              'Browse application UI and marketing blocks. Preview each one, resize it to any breakpoint, then copy the code.'}
          </p>

          <div className="sc-rise mx-auto mt-9 max-w-xl" style={{ '--d': '0.28s' }}>
            <div className="sc-ring-dark rounded-[14px] p-px shadow-[0_20px_60px_-20px_rgb(124_58_237/0.65)]">
              <HeaderSearch size="lg" tone="dark" className="w-full" />
            </div>
          </div>

          {isHome && (
            <ul className="sc-rise mt-6 flex flex-wrap items-center justify-center gap-2" style={{ '--d': '0.38s' }}>
              {FORMATS.map((format) => (
                <li
                  key={format.label}
                  className="inline-flex items-center gap-2 rounded-full bg-white/[0.05] py-1.5 pl-2.5 pr-3.5 text-sm font-medium text-neutral-200 ring-1 ring-white/10"
                >
                  <FormatIcon format={format} />
                  {format.label}
                </li>
              ))}
            </ul>
          )}
        </div>

        {isHome && (
          <div className="sc-rise relative mx-auto mt-14 max-w-4xl lg:mt-16" style={{ '--d': '0.5s' }}>
            <FloatingUI />

            {/* Product shot: cropped and faded so it emerges from the marquee below */}
            <div className="relative [mask-image:linear-gradient(to_bottom,black_58%,transparent)]">
              <div className="max-h-[340px] overflow-hidden rounded-t-2xl shadow-[0_-30px_100px_-30px_rgb(124_58_237/0.55)] ring-1 ring-white/15">
                <HeroDemo />
              </div>
            </div>
          </div>
        )}
      </Container>

      {isHome && <Marquee items={marquee} />}
    </section>
  )
}