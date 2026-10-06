import Link from 'next/link'

import { getAllTemplates } from '../src/utils/lib/templates-data'
import { getAllCategories } from '@util/components-data'

import Container from '@component/Container'
import CollectionGrid from '@component/CollectionGrid'
import HeroBanner from '@component/HeroBanner'
import { Compare, FeatureCards, Manifesto, PhotoCta } from '@component/LandingSections'
import TemplatesSection from '@component/TemplatesSection'

export default async function Page() {
  const [categories, templates] = await Promise.all([getAllCategories(), getAllTemplates()])
  const componentsHref = categories[0] ? `/components/${categories[0].slug}` : '/templates'

  // Real numbers from the content on disk, never typed in by hand
  const collections = categories.reduce((total, { items }) => total + items.length, 0)
  const components = categories.reduce((total, { items }) => total + items.reduce((sum, item) => sum + (item.count ?? 0), 0), 0)
  const stats = [
    components ? `${components} components` : null,
    collections ? `${collections} collections` : null,
    templates.length ? `${templates.length} website ${templates.length === 1 ? 'template' : 'templates'}` : null,
  ]
    .filter(Boolean)
    .join(' · ')

  const chips = [
    { label: 'Free components', href: componentsHref },
    { label: 'Pro packs', href: '#pricing' },
    { label: 'Website templates', href: '/templates' },
    { label: 'Colors', href: '/colors' },
  ]

  return (
    <>
      <HeroBanner stats={stats} chips={chips} />

      <Manifesto componentsHref={componentsHref} />

      <FeatureCards componentsHref={componentsHref} />

      <TemplatesSection />

      <div id="mainContent" className="scroll-mt-20">
        {categories.map(({ slug, title, subtitle, items }) => (
          <section key={slug} aria-labelledby={`cat-${slug}`}>
            <Container classNames="space-y-8 pb-20 lg:pb-28">
              <header className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
                <div className="max-w-[520px]">
                  <h2 id={`cat-${slug}`} className="lf-display text-[28px] font-medium leading-[1.4] tracking-[-0.02em] text-black">
                    {title}
                  </h2>
                  {subtitle ? <p className="mt-1 text-base tracking-[-0.02em] text-[#737373]">{subtitle}</p> : null}
                </div>

                <Link href={`/components/${slug}`} className="lf-focus inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-black ring-1 ring-[#c7c7c7] transition hover:ring-[var(--lf-leaf)]">
                  View all
                  <span className="sc-mono text-xs tabular-nums text-[#737373]">{items.length}</span>
                </Link>
              </header>

              <CollectionGrid componentItems={items} />
            </Container>
          </section>
        ))}
      </div>

      <Compare />

      <PhotoCta componentsHref={componentsHref} />
    </>
  )
}
