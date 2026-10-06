import IconClose from '@component/IconClose'
import IconMenu from '@component/IconMenu'
import MenuLinks from '@component/HeaderMenuLinks'

export default function HeaderMenu({ showMenu, handleSetShowMenu, menuLinks, tone = 'dark' }) {
  return (
    <div className="flex items-center md:hidden">
      <button
        type="button"
        onClick={() => handleSetShowMenu(!showMenu)}
        aria-expanded={showMenu}
        aria-controls="mobile-menu"
        className={`lf-focus grid size-9 place-items-center rounded-lg transition ${tone === 'light' ? 'text-white hover:bg-white/15' : 'text-neutral-800 hover:bg-[rgb(12_42_30/0.05)]'}`}
      >
        {showMenu ? <IconClose /> : <IconMenu />}
        <span className="sr-only">{showMenu ? 'Close menu' : 'Open menu'}</span>
      </button>

      {showMenu && (
        <div id="mobile-menu" className="absolute inset-x-0 top-full px-4 pt-2 sm:px-6">
          <MenuLinks
            menuLinks={menuLinks}
            navClass="rounded-2xl bg-[#e9e6db] p-5 shadow-[0_24px_60px_-20px_rgb(12_42_30/0.35)] ring-1 ring-[var(--lf-line)]"
            ulClass="space-y-4"
          />
        </div>
      )}
    </div>
  )
}
