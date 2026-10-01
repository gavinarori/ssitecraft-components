import IconClose from '@component/IconClose'
import IconMenu from '@component/IconMenu'
import MenuLinks from '@component/HeaderMenuLinks'

export default function HeaderMenu({ showMenu, handleSetShowMenu, menuLinks }) {
  return (
    <div className="flex items-center md:hidden">
      <button
        type="button"
        onClick={() => handleSetShowMenu(!showMenu)}
        aria-expanded={showMenu}
        aria-controls="mobile-menu"
        className="grid size-9 place-items-center rounded-lg text-slate-700 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500"
      >
        {showMenu ? <IconClose /> : <IconMenu />}
        <span className="sr-only">{showMenu ? 'Close menu' : 'Open menu'}</span>
      </button>

      {showMenu && (
        <div id="mobile-menu" className="absolute inset-x-0 top-full px-4 pt-2 sm:px-6">
          <MenuLinks
            menuLinks={menuLinks}
            navClass="rounded-2xl border border-slate-200 bg-white p-4 shadow-xl"
            ulClass="space-y-3"
          />
        </div>
      )}
    </div>
  )
}