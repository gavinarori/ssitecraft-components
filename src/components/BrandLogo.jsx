import Link from 'next/link'

// Renders a <span>, not an <h1>: the logo appears on every page (header + footer),
// and each page should own exactly one <h1>.
export default function BrandLogo({ fontSize = 'text-xl' }) {
  return (
    <Link
      href="/"
      aria-label="Sitecraft home"
      className="group inline-flex items-center gap-2 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
    >
      <span className="grid size-8 place-items-center rounded-lg bg-gray-600 text-white shadow-sm transition group-hover:scale-105">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.75}
          stroke="currentColor"
          className="size-5"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.75 6.75a4.5 4.5 0 0 1-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 1 1-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 0 1 6.336-4.486l-3.276 3.276a3.004 3.004 0 0 0 2.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852Z"
          />
        </svg>
      </span>
      <span className={`${fontSize} font-bold tracking-tight text-slate-900`}>Sitecraft</span>
    </Link>
  )
}