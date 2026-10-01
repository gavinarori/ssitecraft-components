'use client'

import { faqItems } from '@data/faqs'

export default function FaqList() {
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    // Before: the map result was wrapped in another array, producing invalid
    // nested FAQ structured data that search engines would ignore.
    mainEntity: faqItems.map((faqItem) => ({
      '@type': 'Question',
      name: faqItem.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faqItem.answer,
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <ul className="not-prose m-0 list-none space-y-3 p-0">
        {faqItems.map((faqItem, faqIndex) => (
          <li
            key={faqItem.question}
            className="rounded-2xl border border-slate-200 bg-white shadow-sm transition open:border-indigo-200 open:shadow-md"
          >
            <details className="group p-5" open={faqIndex === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-lg text-slate-900 marker:content-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-500 [&::-webkit-details-marker]:hidden">
                <span className="text-base font-semibold sm:text-lg">{faqItem.question}</span>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.75"
                  stroke="currentColor"
                  className="size-5 shrink-0 text-slate-400 transition group-open:rotate-180 group-open:text-indigo-600"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </summary>

              <p className="mt-3 leading-7 text-slate-600">{faqItem.answer}</p>
            </details>
          </li>
        ))}
      </ul>
    </>
  )
}