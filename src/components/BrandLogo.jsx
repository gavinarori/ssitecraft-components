import Link from 'next/link'

export default function BrandLogo({ fontSize = 'text-sm' }) {
  return (
    <Link href="https://ssitecraft.vercel.app">
      <div className="flex lg:flex-1">
          <div className="-m-1.5 p-1.5 inline-flex">

          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75a4.5 4.5 0 0 1-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 1 1-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 0 1 6.336-4.486l-3.276 3.276a3.004 3.004 0 0 0 2.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.867 19.125h.008v.008h-.008v-.008Z" />
          </svg>
            <h1 className=' font-bold text-[32px]'>Sitecraft</h1>
          </div>
        </div>
    </Link>
  )
}
