import Link from 'next/link'

import BrandLogo from '@component/BrandLogo'
import Container from '@component/Container'

const COLUMNS = [
  {
    title: 'Components',
    links: [
      { title: 'Application UI', href: '/components/application-ui' },
      { title: 'Marketing', href: '/components/marketing' },
      { title: 'Colors & generator', href: '/colors' },
    ],
  },
  {
    title: 'Templates',
    links: [
      { title: 'Browse templates', href: '/templates' },
      { title: 'License', href: '/legal/license' },
      { title: 'Refund policy', href: '/legal/refunds' },
    ],
  },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="lf-forest relative overflow-hidden">
      {/* Soft green glow, purely decorative */}
      <div aria-hidden="true" className="lf-blob pointer-events-none absolute -right-32 -top-32 size-[420px] bg-[radial-gradient(closest-side,rgb(198_242_107/0.22),transparent)]" />

      <Container classNames="relative py-14 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-sm space-y-4">
            <BrandLogo tone="light" fontSize="text-2xl" />
            <p className="text-sm leading-6 text-[rgb(246_243_234/0.7)]">
              Free Tailwind CSS components, premium packs and complete website templates. Preview them live, then build.
            </p>
          </div>

          {COLUMNS.map(({ title, links }) => (
            <nav key={title} aria-label={title}>
              <h2 className="sc-mono text-[11px] uppercase tracking-[0.14em] text-[var(--lf-lime)]">{title}</h2>
              <ul className="mt-4 space-y-3">
                {links.map(({ title: label, href }) => (
                  <li key={href}>
                    <Link href={href} className="lf-focus text-sm text-[rgb(246_243_234/0.8)] transition hover:text-white hover:underline hover:decoration-[var(--lf-lime)] hover:decoration-2 hover:underline-offset-4">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <nav aria-label="Project">
            <h2 className="sc-mono text-[11px] uppercase tracking-[0.14em] text-[var(--lf-lime)]">Project</h2>
            <ul className="mt-4 space-y-3">
              <li>
                <a href="https://github.com/gavinarori" rel="noreferrer noopener" target="_blank" className="lf-focus text-sm text-[rgb(246_243_234/0.8)] transition hover:text-white hover:underline hover:decoration-[var(--lf-lime)] hover:decoration-2 hover:underline-offset-4">
                  GitHub
                </a>
              </li>
            </ul>
          </nav>
        </div>

        {/* Oversized wordmark, cropped by the section edge */}
        <p aria-hidden="true" className="lf-display pointer-events-none mt-14 select-none text-[22vw] font-semibold leading-[0.8] tracking-tighter text-[rgb(246_243_234/0.06)] lg:text-[15rem]">
          Sitecraft
        </p>

        <div className="mt-6 flex flex-col gap-2 border-t border-white/10 pt-6 text-sm text-[rgb(246_243_234/0.6)] sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {year} Sitecraft. All rights reserved.</p>
          <p>
            Made by{' '}
            <a href="https://github.com/gavinarori" rel="noreferrer noopener" target="_blank" className="lf-focus font-medium text-[var(--lf-paper)] hover:text-[var(--lf-lime)]">
              Gavin Arori
            </a>
          </p>
        </div>
      </Container>
    </footer>
  )
}
