import Link from 'next/link'

import { getAllCategories } from '../src/utils/components-data'

import Container from '@component/Container'
import HeroBanner from '@component/HeroBanner'
import CollectionGrid from '@component/CollectionGrid'

export default async function Page() {
  const categories = await getAllCategories()

  return (
    <>
      <HeroBanner />

      <Container id="mainContent" classNames="pb-16 lg:pb-24">
        <div className="space-y-16">
          {categories.map(({ slug, title, subtitle, items }) => (
            <section key={slug} aria-labelledby={`cat-${slug}`} className="space-y-6">
              <header className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <h2
                    id={`cat-${slug}`}
                    className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
                  >
                    {title}
                  </h2>
                  {subtitle ? (
                    <p className="mt-1 max-w-2xl text-sm text-slate-600 sm:text-base">{subtitle}</p>
                  ) : null}
                </div>

                <Link
                  href={`/${slug}`}
                  className="group inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  View all {items.length}
                  <span aria-hidden="true" className="transition group-hover:translate-x-0.5">
                    &rarr;
                  </span>
                </Link>
              </header>

              <CollectionGrid componentItems={items} />
            </section>
          ))}
        </div>
      </Container>
    </>
  )
}
