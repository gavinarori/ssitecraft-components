import HeaderSearch from '@component/HeaderSearch'
import Container from '@component/Container'

const FORMATS = [
  {
    label: 'HTML',
    path: ['M5 4.15h22.5l-2 20.5-9.25 4-9.25-4-2-20.5Z', 'M20.5 9.15H12v5.5h8.5v6l-4.25 2-4.25-2v-2.5'],
  },
  { label: 'React', ellipses: true },
  {
    label: 'Vue',
    path: ['M19.924 5 16 11.644 12.075 5H3l13 23L29 5h-9.076Z', 'M19.879 5 16 11.26 12.121 5H8l8 13 8-13h-4.121Z'],
  },
]

function FormatIcon({ format }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className="size-6 flex-none stroke-current text-slate-400"
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {format.ellipses ? (
        <>
          <ellipse cx="16" cy="16" rx="13" ry="5" />
          <ellipse cx="16" cy="16" rx="13" ry="5" transform="rotate(60 16 16)" />
          <ellipse rx="13" ry="5" transform="matrix(-.5 .86603 .86603 .5 16 16)" />
          <circle cx="16" cy="16" r="2" />
        </>
      ) : (
        format.path.map((d) => <path key={d} d={d} />)
      )}
    </svg>
  )
}

// Before: this ignored the title/subtitle/children passed in by category pages,
// so every category showed "Welcome to Sitecraft Components".
export default function HeroBanner({
  title = 'Welcome to Sitecraft Components',
  subtitle = 'New components every week',
  children,
}) {
  const isHome = title === 'Welcome to Sitecraft Components'

  return (
    <section className="sc-glow relative isolate overflow-hidden text-center">
      <div aria-hidden="true" className="sc-grid absolute inset-0 -z-10" />

      <Container classNames="py-16 md:py-24 lg:py-28">
        <p className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-700 shadow-sm">
          <span aria-hidden="true" className="size-2 rounded-full bg-emerald-500" />
          {subtitle}
        </p>

        <h1 className="mx-auto max-w-4xl text-balance text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
          {title}
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-balance text-lg leading-8 text-slate-600">
          {children ??
            'Copy-paste the most trending components and use them in your websites without having to worry about starting from scratch.'}
        </p>

        {isHome && (
          <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {FORMATS.map((format) => (
              <li key={format.label} className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <FormatIcon format={format} />
                {format.label}
              </li>
            ))}
          </ul>
        )}

        <div className="mx-auto mt-10 max-w-xl">
          <HeaderSearch />
        </div>
      </Container>
    </section>
  )
}