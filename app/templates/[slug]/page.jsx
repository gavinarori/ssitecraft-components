import Link from 'next/link'
import { notFound } from 'next/navigation'

import { formatDate, majorVersion } from '../../../src/lib/format'
import { getTemplate, getTemplateParams } from '../../../src/lib/templates-data'

import { ogMeta, twitterMeta } from '@data/metadata'

import BuyBox from '@component/BuyBox'
import Container from '@component/Container'
import MdxRemoteRender from '@component/MdxRemoteRender'
import TemplateShot from '@component/TemplateShot'

export async function generateStaticParams() {
  return getTemplateParams()
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const found = await getTemplate(slug)
  if (!found) return {}

  const { template } = found
  const title = `${template.title} template | sitecraft`
  const description = template.tagline || `${template.title}, a website template built with Tailwind CSS.`
  const images = template.screenshots.cover ? [{ url: template.screenshots.cover }] : undefined

  return {
    title,
    description,
    // Drafts are only visible in development, but never let one get indexed
    robots: template.status === 'published' ? undefined : { index: false, follow: false },
    openGraph: { title, description, ...ogMeta, ...(images && { images }) },
    twitter: { title, description, ...twitterMeta },
  }
}

function productJsonLd(template) {
  const offers = ['standard', 'extended']
    .filter((tier) => template.price[tier] != null)
    .map((tier) => ({
      '@type': 'Offer',
      name: tier === 'standard' ? 'Standard license' : 'Extended license',
      price: template.price[tier],
      priceCurrency: template.currency,
      availability: 'https://schema.org/InStock',
    }))

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: template.title,
    description: template.tagline,
    image: template.screenshots.cover ?? undefined,
    offers,
  }
}

export default async function Page({ params }) {
  const { slug } = await params
  const found = await getTemplate(slug)
  if (!found) notFound()

  const { template, content } = found

  // "<" is escaped so a title containing "</script>" cannot break out of the tag
  const jsonLd = JSON.stringify(productJsonLd(template)).replace(/</g, '\\u003c')

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />

      <section className="border-b border-neutral-950/10 sc-hatch">
        <Container classNames="py-10 lg:py-14">
          <nav aria-label="Breadcrumb" className="sc-mono text-xs text-neutral-500">
            <Link href="/templates" className="hover:text-neutral-900">Templates</Link>
            <span aria-hidden="true"> / </span>
            <span className="text-neutral-800">{template.title}</span>
          </nav>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl">{template.title}</h1>
          {template.tagline ? <p className="mt-3 max-w-2xl text-lg text-neutral-600">{template.tagline}</p> : null}

          <dl className="sc-mono mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs text-neutral-600">
            <div className="flex gap-1.5"><dt className="text-neutral-500">Version</dt><dd>v{majorVersion(template.version)} ({template.version})</dd></div>
            {template.updated ? <div className="flex gap-1.5"><dt className="text-neutral-500">Updated</dt><dd>{formatDate(template.updated)}</dd></div> : null}
            {template.stack.length ? <div className="flex gap-1.5"><dt className="text-neutral-500">Stack</dt><dd>{template.stack.join(', ')}</dd></div> : null}
          </dl>
        </Container>
      </section>

      <Container classNames="grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-12 lg:py-14">
        <div className="min-w-0 space-y-12">
          <section aria-label="Preview">
            <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-neutral-950/10">
              <div className="flex items-center justify-between gap-3 border-b border-neutral-950/10 bg-neutral-50 px-4 py-2.5">
                <span className="flex gap-1.5" aria-hidden="true">
                  <span className="size-2.5 rounded-full bg-neutral-950/15" />
                  <span className="size-2.5 rounded-full bg-neutral-950/15" />
                  <span className="size-2.5 rounded-full bg-neutral-950/15" />
                </span>
                <Link href={`/templates/${template.slug}/preview`} className="sc-focus rounded-md px-2 py-1 text-sm font-semibold text-neutral-950 underline decoration-sky-500 decoration-2 underline-offset-4">
                  Open live preview
                </Link>
              </div>
              {/* Full-page capture, scrollable inside the frame */}
              <div className="max-h-[640px] overflow-y-auto" tabIndex={0} aria-label={`Scrollable screenshot of ${template.title}`}>
                <TemplateShot template={template} variant="tall" />
              </div>
            </div>

            {template.screenshots.gallery.length ? (
              <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                {template.screenshots.gallery.map((src, index) => (
                  <li key={src} className="overflow-hidden rounded-xl ring-1 ring-neutral-950/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={`${template.title} screen ${index + 1}`} loading="lazy" className="block w-full" />
                  </li>
                ))}
              </ul>
            ) : null}
          </section>

          {template.features.length ? (
            <section aria-labelledby="features">
              <h2 id="features" className="text-xl font-semibold tracking-tight text-neutral-950">Features</h2>
              <ul className="mt-4 grid gap-x-8 gap-y-3 text-sm text-neutral-700 sm:grid-cols-2">
                {template.features.map((feature) => (
                  <li key={feature} className="flex gap-2 border-t border-neutral-950/10 pt-3">
                    <span aria-hidden="true" className="mt-1.5 size-1.5 shrink-0 rounded-full bg-sky-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <div className="space-y-4 leading-relaxed text-neutral-700 [&_a]:underline [&_a]:underline-offset-2 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-neutral-950 [&_li]:pl-1 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
            <MdxRemoteRender mdxSource={content} />
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <BuyBox template={template} />
        </div>
      </Container>
    </>
  )
}
