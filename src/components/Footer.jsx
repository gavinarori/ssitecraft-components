import Link from 'next/link'

import Container from '@component/Container'
import BrandLogo from '@component/BrandLogo'

const FOOTER_LINKS = [
  { title: 'Application UI', href: '/components/application-ui' },
  { title: 'Marketing', href: '/components/marketing' },
  { title: 'Colors & generator', href: '/colors' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <Container classNames="py-10 lg:py-14">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm space-y-3">
            <BrandLogo fontSize="text-lg" />
            <p className="text-sm leading-6 text-slate-600">
              Copy-paste Tailwind CSS components and ship your websites faster.
            </p>
          </div>

          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-6 gap-y-3">
              {FOOTER_LINKS.map(({ title, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm font-medium text-slate-700 transition hover:text-indigo-600"
                  >
                    {title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-slate-200 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {year} Sitecraft. All rights reserved.</p>
          <p>
            Created by{' '}
            <a
              href="https://github.com/gavinarori"
              rel="noreferrer noopener"
              target="_blank"
              className="font-medium text-slate-700 hover:text-indigo-600"
            >
              Gavin Arori
            </a>
          </p>
        </div>
      </Container>
    </footer>
  )
}