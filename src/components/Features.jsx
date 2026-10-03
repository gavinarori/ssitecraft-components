// Home page: what you get, in three cells divided by hairlines (same device Tailwind's marketing pages use).
// Every claim here maps to a real feature in the preview window: resizable frame, HTML/JSX/Vue
// transformers, and the dark / Alpine.js variants some components ship with.

const FEATURES = [
  {
    title: 'Resize to any breakpoint',
    body: 'Drag the handle or jump to a preset width and see how each block behaves before you copy it.',
    icon: 'M3 12h18M7 8l-4 4 4 4M17 8l4 4-4 4',
  },
  {
    title: 'Copy it your way',
    body: 'Switch between HTML, JSX and Vue, then copy the code with one click. No install, no lock-in.',
    icon: 'M16 18l6-6-6-6M8 6l-6 6 6 6',
  },
  {
    title: 'Dark and interactive variants',
    body: 'Where a component ships with a dark theme or Alpine.js behavior, toggle it right in the preview.',
    icon: 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z',
  },
]

export default function Features() {
  return (
    <section aria-label="Features" className="border-b border-neutral-950/10">
      <ul className="grid divide-y divide-neutral-950/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {FEATURES.map(({ title, body, icon }, index) => (
          <li key={title} className="p-6 sm:p-8 lg:p-10">
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-lg bg-neutral-50 text-neutral-900 ring-1 ring-neutral-950/10">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-[18px]"
                  aria-hidden="true"
                >
                  <path d={icon} />
                </svg>
              </span>
              <span className="sc-mono text-xs tabular-nums text-neutral-400" aria-hidden="true">
                0{index + 1}
              </span>
            </div>

            <h2 className="mt-5 text-base font-semibold tracking-tight text-neutral-950">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-600">{body}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}