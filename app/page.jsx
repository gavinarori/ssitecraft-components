import Link from 'next/link'

import { getAllCategories } from '@util/components-data'

import Container from '@component/Container'
import Features from '@component/Features'
import HeroBanner from '@component/HeroBanner'
import CollectionGrid from '@component/CollectionGrid'

export default async function Page() {
  const categories = await getAllCategories()

  return (
    <>
      <HeroBanner />

      <Features />

      <div id="mainContent">
        {categories.map(({ slug, title, subtitle, items }) => (
          <section
            key={slug}
            aria-labelledby={`cat-${slug}`}
            className="border-b border-neutral-950/10 last:border-b-0"
          >
            <Container classNames="py-12 lg:py-16 space-y-8">
              <header className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
                <div className="max-w-2xl">
                  <h2
                    id={`cat-${slug}`}
                    className="text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl"
                  >
                    {title}
                  </h2>
                  {subtitle ? <p className="mt-2 text-neutral-600">{subtitle}</p> : null}
                </div>

                <Link
                  href={`/components/${slug}`}
                  className="sc-focus inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-neutral-800 ring-1 ring-inset ring-neutral-950/15 transition hover:bg-neutral-50 hover:ring-neutral-950/30"
                >
                  View all
                  <span className="sc-mono text-xs tabular-nums text-neutral-500">{items.length}</span>
                </Link>
              </header>

              <CollectionGrid componentItems={items} />
            </Container>
          </section>
        ))}
      </div>
    </>
  )
}