import IconClose from '@component/IconClose'
import IconMenu from '@component/IconMenu'
import MenuLinks from '@component/HeaderMenuLinks'
import HeaderSearch from '@component/HeaderSearch'

export default function HeaderMenu({ showMenu, handleSetShowMenu, menuLinks }) {
  return (
    <div className="flex items-center md:hidden">
      <button
        type="button"
        onClick={() => handleSetShowMenu(!showMenu)}
        aria-expanded={showMenu}
        aria-controls="mobile-menu"
        className="sc-focus grid size-9 place-items-center rounded-full text-neutral-700 transition hover:bg-neutral-100"
      >
        {showMenu ? <IconClose /> : <IconMenu />}
        <span className="sr-only">{showMenu ? 'Close menu' : 'Open menu'}</span>
      </button>

      {showMenu && (
        <div id="mobile-menu" className="absolute inset-x-0 top-full border-b border-neutral-950/10 bg-white px-4 pb-4 pt-2 shadow-lg sm:px-6">
          {/* The header search is hidden below sm, so phones get it here */}
          <HeaderSearch className="mb-3 sm:hidden" />

          <MenuLinks menuLinks={menuLinks} navClass="" ulClass="space-y-1 [&_a]:w-full [&_a]:rounded-lg [&_a]:px-3 [&_a]:py-2.5" />
        </div>
      )}
    </div>
  )
}