import Link from 'next/link'

// A span, not an <h1>: the logo sits on every page (header + footer) and each page owns one <h1>.
// tone="light" is for dark backgrounds (the footer).
export default function BrandLogo({ fontSize = 'text-xl', tone = 'dark' }) {
  const light = tone === 'light'

  return (
    <Link href="/" aria-label="Sitecraft home" className="lf-focus group inline-flex items-center gap-2.5">
      <span
        className={`grid size-8 place-items-center rounded-[10px] transition duration-300 group-hover:-rotate-6 group-hover:scale-105 ${
          light ? 'bg-[var(--lf-lime)] text-[var(--lf-forest)]' : 'bg-[var(--lf-forest)] text-[var(--lf-lime)]'
        }`}
      >
        {/* A sprout: stem and two leaves */}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="size-[18px]" aria-hidden="true">
          <path d="M12 21v-8" />
          <path d="M12 13c0-4 2.6-6.6 7-6.6 0 4-2.7 6.6-7 6.6Z" />
          <path d="M12 15.5c0-3-2-5-5.5-5 0 3 2 5 5.5 5Z" />
        </svg>
      </span>
      <span
        className={`lf-display ${fontSize} font-semibold tracking-tight ${light ? 'text-[var(--lf-paper)]' : 'text-[var(--lf-forest)]'}`}
      >
        Sitecraft
      </span>
    </Link>
  )
}
