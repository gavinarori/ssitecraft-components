'use client'

import { useEffect, useState } from 'react'

import { usePathname } from 'next/navigation'

import BrandLogo from '@component/BrandLogo'
import Container from '@component/Container'
import GithubSocial from '@component/GithubSocial'
import HeaderMenu from '@component/HeaderMenu'
import HeaderMenuLinks from '@component/HeaderMenuLinks'
import HeaderSearch from '@component/HeaderSearch'

const menuLinks = [
  { title: 'Templates', href: '/templates' },
  { title: 'Colors & generator', href: '/colors' },
]

export default function Header() {
  const routerPathname = usePathname()
  const [showMenu, setShowMenu] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => setShowMenu(false), [routerPathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // On the home page the header floats transparently over the hero photo until you scroll
  const isHome = routerPathname === '/'
  const overlay = isHome && !scrolled && !showMenu
  const tone = overlay ? 'light' : 'dark'

  return (
    <header
      className={`sticky inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${isHome ? '-mb-16' : ''} ${
        overlay
          ? 'border-transparent bg-transparent'
          : 'border-[var(--lf-line)] bg-[rgb(233_230_219/0.88)] backdrop-blur'
      }`}
    >
      <Container classNames="relative flex h-16 items-center justify-between gap-4 sm:gap-8">
        <div className="flex items-center gap-7">
          <BrandLogo tone={overlay ? 'light' : 'dark'} />
          <HeaderMenuLinks menuLinks={menuLinks} navClass="hidden md:block" ulClass="flex gap-6" tone={tone} />
        </div>

        <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3">
          <HeaderSearch className="max-w-xs" tone={overlay ? 'glass' : 'light'} placeholder="Search" enableShortcut />

          <GithubSocial tone={tone} />

          <HeaderMenu showMenu={showMenu} handleSetShowMenu={setShowMenu} menuLinks={menuLinks} tone={tone} />
        </div>
      </Container>
    </header>
  )
}
