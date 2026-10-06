import Link from 'next/link'

import Container from '@component/Container'

export const metadata = {
  title: 'Thank you | sitecraft',
  robots: { index: false, follow: false },
}

export default function Page() {
  return (
    <Container classNames="py-20">
      <div className="mx-auto max-w-lg text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-[rgb(198_242_107/0.4)] text-[var(--lf-leaf)] ring-1 ring-[rgb(22_160_95/0.3)]" aria-hidden="true">
          <svg viewBox="0 0 20 20" fill="currentColor" className="size-6"><path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" clipRule="evenodd" /></svg>
        </span>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-neutral-950">Payment received</h1>
        <p className="mt-3 text-neutral-600">
          Your download link is on its way to the email you used at checkout. It usually arrives within a minute.
        </p>
        <p className="mt-2 text-sm text-neutral-500">
          Nothing yet? Check your spam folder, then write to us and we will resend it.
        </p>
        <Link href="/templates" className="sc-focus mt-8 inline-flex h-11 items-center rounded-xl bg-neutral-950 px-5 text-sm font-semibold text-white hover:bg-neutral-800">
          Back to templates
        </Link>
      </div>
    </Container>
  )
}
