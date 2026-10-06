'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

// tone="light" is white text, for the transparent header over the hero photo
export default function HeaderMenuLinks({ menuLinks = [], navClass = '', ulClass = '', tone = 'dark' }) {
  const pathname = usePathname()
  const light = tone === 'light'

  return (
    <nav aria-label="Main" className={navClass}>
      <ul className={ulClass}>
        {menuLinks.map(({ href, title }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`)

          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={isActive ? 'page' : undefined}
                className={`lf-focus inline-flex items-center gap-1 text-sm font-medium transition ${
                  light
                    ? isActive
                      ? 'text-white underline decoration-[var(--lf-lime)] decoration-2 underline-offset-[6px]'
                      : 'text-[rgb(255_255_255/0.88)] hover:text-white'
                    : isActive
                      ? 'text-[var(--lf-leaf-deep)] underline decoration-[var(--lf-lime)] decoration-2 underline-offset-[6px]'
                      : 'text-neutral-700 hover:text-[var(--lf-leaf-deep)]'
                }`}
              >
                {title}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
