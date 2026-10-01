const BASE =
  'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium shadow-sm transition'

const VARIANTS = {
  light: {
    active: 'border-indigo-600 bg-indigo-600 text-white',
    idle: 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:text-indigo-700',
  },
  dark: {
    active: 'border-slate-700 bg-slate-800 text-white',
    idle: 'border-slate-800 bg-slate-900 text-white hover:bg-slate-800',
  },
}

export default function ButtonStyle({ buttonEmoji, buttonText, buttonActive, isDark, children }) {
  const variant = VARIANTS[isDark ? 'dark' : 'light']

  return (
    <span className={`${BASE} ${buttonActive ? variant.active : variant.idle}`}>
      {children ?? (
        <>
          {buttonEmoji ? (
            <span aria-hidden="true" className="text-sm leading-none">
              {buttonEmoji}
            </span>
          ) : null}
          {/* buttonText was accepted before but never rendered */}
          {buttonText ? <span>{buttonText}</span> : null}
        </>
      )}
    </span>
  )
}