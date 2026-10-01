'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function HeaderMenuLinks({ menuLinks = [], navClass = '', ulClass = '' }) {
  const pathname = usePathname()

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
                className={`inline-flex items-center gap-1 text-sm font-medium transition ${
                  isActive ? 'text-indigo-600' : 'text-slate-700 hover:text-indigo-600'
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