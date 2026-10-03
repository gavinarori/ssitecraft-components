import { notFound } from 'next/navigation'
import Link from 'next/link'

import { join } from 'path'
import { promises as fs } from 'fs'
import { serialize } from 'next-mdx-remote/serialize'

import { ogMeta, twitterMeta } from '@data/metadata'
import { getCollectionParams, paths } from '@util/components-data'

import Ad from '@component/Ad'
import Container from '@component/Container'
import MdxRemoteRender from '@component/MdxRemoteRender'
import CollectionList from '@component/CollectionList'

const mdxComponents = { CollectionList }

export async function generateStaticParams() {
  return getCollectionParams()
}

async function getCollection(params) {
  const { category, collection } = await params

  try {
    const filePath = join(paths.COMPONENTS_DIR, `${category}-${collection}.mdx`)
    const source = await fs.readFile(filePath, 'utf-8')
    const mdxSource = await serialize(source, { parseFrontmatter: true })

    return {
      collectionData: { ...mdxSource.frontmatter, slug: collection },
      collectionContent: mdxSource,
    }
  } catch {
    notFound()
  }
}

export async function generateMetadata({ params }) {
  const { collectionData } = await getCollection(params)
  const title = `Tailwind CSS ${collectionData.seo.title} | sitecraft`
  const description = collectionData.seo.description

  return {
    title,
    description,
    openGraph: { title, description, ...ogMeta },
    twitter: { title, description, ...twitterMeta },
  }
}

export default async function Page({ params }) {
  const { collectionData, collectionContent } = await getCollection(params)

  const componentsData = {
    componentContainer: {
      previewInner: collectionData.container || '',
      previewHeight: collectionData.wrapper || '',
    },
    componentsData: Object.entries(collectionData.components).map(([componentId, item]) => ({
      id: componentId,
      title: item.title,
      slug: collectionData.slug,
      category: collectionData.category,
      container: item.container || '',
      wrapper: item.wrapper || '',
      creator: item.creator || '',
      dark: !!item.dark,
      interactive: !!item.interactive,
    })),
  }

  return (
    <Container id="mainContent" classNames="py-10 lg:py-14 space-y-10">
      <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="hover:text-indigo-600">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href={`/${collectionData.category}`} className="capitalize hover:text-indigo-600">
              {String(collectionData.category).replace(/-/g, ' ')}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="font-medium text-slate-900">
            {collectionData.title}
          </li>
        </ol>
      </nav>

      <Ad />

      <div className="prose prose-slate max-w-none prose-headings:tracking-tight prose-a:text-indigo-600 hover:prose-a:text-indigo-800">
        <MdxRemoteRender
          mdxSource={collectionContent}
          mdxComponents={mdxComponents}
          mdxScope={componentsData}
        />
      </div>
    </Container>
  )
}
