// Decorative, server-rendered demo of what the site does: one component, previewed and as code.
// The two panes cross-fade on a CSS loop (see tokens.css). Hidden from assistive tech on purpose.

const CODE = [
  [['t', '<form'], ['a', ' class='], ['s', '"space-y-4 p-6"'], ['t', '>']],
  [['x', '  '], ['t', '<h2'], ['a', ' class='], ['s', '"text-lg font-semibold"'], ['t', '>'], ['x', 'Welcome back'], ['t', '</h2>']],
  [['x', '  '], ['t', '<input'], ['a', ' type='], ['s', '"email"'], ['a', ' placeholder='], ['s', '"Email"'], ['t', ' />']],
  [['x', '  '], ['t', '<input'], ['a', ' type='], ['s', '"password"'], ['a', ' placeholder='], ['s', '"Password"'], ['t', ' />']],
  [['x', '  '], ['t', '<button'], ['a', ' class='], ['s', '"w-full rounded-lg bg-neutral-950 py-2 text-white"'], ['t', '>']],
  [['x', '    Sign in']],
  [['x', '  '], ['t', '</button>']],
  [['t', '</form>']],
]

const TOKEN_CLASS = {
  t: 'text-neutral-500',
  a: 'text-sky-300',
  s: 'text-emerald-300',
  x: 'text-neutral-100',
}

export default function HeroDemo() {
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden rounded-2xl bg-white shadow-[0_30px_60px_-30px_rgb(10_10_10/0.35)] ring-1 ring-neutral-950/10"
    >
      {/* Title bar: same anatomy as the real preview window below the fold */}
      <div className="flex items-center gap-3 border-b border-neutral-950/10 bg-neutral-50 px-3 py-2">
        <span className="text-sm font-medium text-neutral-900">Sign in form</span>

        <div className="ml-auto flex items-center gap-1 rounded-lg bg-neutral-200/60 p-0.5 text-xs font-medium">
          <span className="sc-tab-a rounded-md px-3 py-1">Preview</span>
          <span className="sc-tab-b rounded-md px-3 py-1">Code</span>
        </div>

        <span className="sc-mono hidden text-xs text-neutral-500 sm:block">HTML</span>
      </div>

      <div className="grid">
        {/* Preview pane */}
        <div className="sc-flip-a sc-hatch col-start-1 row-start-1 grid min-h-[300px] place-items-center p-6 sm:min-h-[340px]">
          <div className="w-full max-w-sm space-y-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-neutral-950/10">
            <h2 className="text-lg font-semibold tracking-tight text-neutral-950">Welcome back</h2>
            <div className="h-10 rounded-lg px-3 text-sm leading-10 text-neutral-400 ring-1 ring-neutral-950/15">Email</div>
            <div className="h-10 rounded-lg px-3 text-sm leading-10 text-neutral-400 ring-1 ring-neutral-950/15">Password</div>
            <div className="rounded-lg bg-neutral-950 py-2 text-center text-sm font-medium text-white">Sign in</div>
          </div>
        </div>

        {/* Code pane */}
        <pre className="sc-flip-b sc-mono col-start-1 row-start-1 min-h-[300px] overflow-hidden bg-neutral-950 p-6 text-[13px] leading-6 sm:min-h-[340px]">
          {CODE.map((line, i) => (
            <div key={i} className="whitespace-pre">
              {line.map(([kind, text], j) => (
                <span key={j} className={TOKEN_CLASS[kind]}>
                  {text}
                </span>
              ))}
            </div>
          ))}
        </pre>
      </div>
    </div>
  )
}