import { notFound } from 'next/navigation'
import Link from 'next/link'

import { ogMeta, twitterMeta } from '@data/metadata'
import {
  CATEGORY_SLUGS,
  getCategoryData,
  getCollectionsForCategory,
} from '@util/components-data'

import Container from '@component/Container'
import HeroBanner from '@component/HeroBanner'
import CollectionGrid from '@component/CollectionGrid'

export async function generateStaticParams() {
  // Must be an array of param objects, not bare strings
  return CATEGORY_SLUGS.map((category) => ({ category }))
}

async function getCategory(params) {
  const { category } = await params

  if (!CATEGORY_SLUGS.includes(category)) notFound()

  try {
    const [categoryData, componentItems] = await Promise.all([
      getCategoryData(category),
      getCollectionsForCategory(category),
    ])
    return { categoryData, componentItems, category }
  } catch {
    notFound()
  }
}

export async function generateMetadata({ params }) {
  const { categoryData } = await getCategory(params)
  const title = `Tailwind CSS ${categoryData.title} Components | sitecraft`

  return {
    title,
    description: categoryData.description,
    openGraph: { title, description: categoryData.description, ...ogMeta },
    twitter: { title, description: categoryData.description, ...twitterMeta },
  }
}

export default async function Page({ params }) {
  const { categoryData, componentItems } = await getCategory(params)

  return (
    <>
      <HeroBanner title={categoryData.title} subtitle={categoryData.subtitle}>
        {categoryData.description}
      </HeroBanner>

      <Container id="mainContent" classNames="pb-16 lg:pb-24 space-y-8">
        <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="hover:text-indigo-600">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="font-medium text-slate-900">
              {categoryData.title}
            </li>
          </ol>
        </nav>

        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">
            {componentItems.length} collections
          </h2>
        </div>

        <CollectionGrid componentItems={componentItems} />
      </Container>
    </>
  )
}
