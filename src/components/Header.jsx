'use client'

import { useEffect, useState } from 'react'

import { usePathname } from 'next/navigation'

import BrandLogo from '@component/BrandLogo'
import Container from '@component/Container'
import GithubSocial from '@component/GithubSocial'
import HeaderMenu from '@component/HeaderMenu'
import HeaderMenuLinks from '@component/HeaderMenuLinks'
import HeaderSearch from '@component/HeaderSearch'

const menuLinks = [{ title: 'Tailwind Colors & generator', href: '/colors' }]

export default function Header() {
  const routerPathname = usePathname()
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => setShowMenu(false), [routerPathname])

  return (
    <header className="sticky inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <Container classNames="relative flex h-16 items-center justify-between gap-4 sm:gap-8">
        <div className="flex items-center gap-6">
          <BrandLogo />
          <HeaderMenuLinks menuLinks={menuLinks} navClass="hidden md:block" ulClass="flex gap-6" />
        </div>

        <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3">
          <HeaderSearch className="max-w-xs" />

          <GithubSocial />

          <HeaderMenu showMenu={showMenu} handleSetShowMenu={setShowMenu} menuLinks={menuLinks} />
        </div>
      </Container>
    </header>
  )
}