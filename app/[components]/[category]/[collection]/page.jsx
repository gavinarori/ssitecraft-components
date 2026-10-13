import { notFound } from 'next/navigation'

import { join } from 'path'
import { promises as fs } from 'fs'
import { serialize } from 'next-mdx-remote/serialize'

import { getCollectionParams } from '@util/components-data'
import { ogMeta, twitterMeta } from '@data/metadata'

import PackBanner from '@component/PackBanner'
import Ad from '@component/Ad'
import Container from '@component/Container'
import { MDXRemote } from 'next-mdx-remote/rsc'
import CollectionList from '@component/CollectionList'

const mdxComponents = {
  CollectionList,
}

const componentsDirectory = join(/* turbopackIgnore: true */ process.cwd(), 'src/data/components')

export async function generateMetadata(props) {
  const { collectionData } = await getCollection(await props.params)

  return {
    title: `Tailwind CSS ${collectionData.seo.title} | sitecraft`,
    description: collectionData.seo.description,
    openGraph: {
      title: `Tailwind CSS ${collectionData.seo.title} | sitecraft`,
      description: collectionData.seo.description,
      ...ogMeta,
    },
    twitter: {
      title: `Tailwind CSS ${collectionData.seo.title} | sitecraft`,
      description: collectionData.seo.description,
      ...twitterMeta,
    },
  }
}

export async function generateStaticParams() {
  return getCollectionParams()
}

async function findCollectionFile(category, collection) {
  const wanted = `${category}-${collection}.mdx`.toLowerCase()
  const files = await fs.readdir(/* turbopackIgnore: true */ componentsDirectory)
  // case-insensitive: macOS/Windows ignore case, Vercel (Linux) does not
  return files.find((file) => file.toLowerCase() === wanted)
}

async function getCollection(params) {
  const file = await findCollectionFile(params.category, params.collection)
  if (!file) notFound()

  try {
    const componentItem = await fs.readFile(/* turbopackIgnore: true */ join(componentsDirectory, file), 'utf-8')
    // next-mdx-remote v6 blocks JS expressions by default, so <CollectionList componentsData={componentsData} />
    // received `undefined` and rendered nothing. These MDX files are our own, so it is safe to allow them.
    const mdxSource = await serialize(componentItem, {
      parseFrontmatter: true,
      blockJS: false,
      blockDangerousJS: false,
    })

    // The payment variant ID is private. Remove it before the frontmatter goes to the browser.
    delete mdxSource.frontmatter.lemonsqueezy
    delete mdxSource.frontmatter.componentVariant
    for (const item of Object.values(mdxSource.frontmatter.components ?? {})) delete item.lemonsqueezy

    return {
      collectionData: {
        ...mdxSource.frontmatter,
        slug: params.collection,
      },
      collectionSource: componentItem,
    }
  } catch (error) {
    console.error(`[components] failed to load ${file}:`, error)
    notFound()
  }
}

export default async function Page(props) {
  const { collectionData, collectionSource } = await getCollection(await props.params)

  const isPro = String(collectionData.access ?? '').trim().toLowerCase() === 'pro'
  const price = Number(collectionData.price)
  const packSinglePrice = Number(collectionData.componentPrice) > 0 ? Number(collectionData.componentPrice) : null
  const freeIds = new Set((Array.isArray(collectionData.free) ? collectionData.free : []).map(String))
  const packId = `${collectionData.category}-${collectionData.slug}`
  const forSale = isPro && (price > 0 || packSinglePrice)
  const pack = {
    id: packId,
    title: collectionData.title,
    price: price > 0 ? price : null,
    count: Object.keys(collectionData.components ?? {}).length,
  }

  const componentsData = {
    componentContainer: {
      previewInner: collectionData.container || '',
      previewHeight: collectionData.wrapper || '',
    },
    componentsData: Object.entries(collectionData.components ?? {}).map(
      ([componentId, componentItem]) => {
        return {
          id: componentId,
          title: componentItem.title,
          slug: collectionData.slug,
          category: collectionData.category,
          container: componentItem.container || '',
          wrapper: componentItem.wrapper || '',
          creator: componentItem.creator || '',
          dark: !!componentItem.dark,
          interactive: !!componentItem.interactive,
          pro: isPro,
          open: !isPro || freeIds.has(String(componentId)),
          packId,
          pack,
          single: (() => {
            const unit = Number(componentItem.price) > 0 ? Number(componentItem.price) : packSinglePrice
            return isPro && !freeIds.has(String(componentId)) && unit ? { id: componentId, price: unit } : null
          })(),
        }
      }
    ),
  }

  return (
    <Container id="mainContent" classNames="py-8 lg:py-12 space-y-8">
      <Ad />

      {forSale && <PackBanner pack={pack} freeCount={freeIds.size} singlePrice={packSinglePrice} />}

      <div className="prose max-w-none">
        {/* Rendered on the server (rsc), so there is no second copy of React and no next.config workaround */}
        <MDXRemote
          source={collectionSource}
          components={mdxComponents}
          options={{ parseFrontmatter: true, scope: componentsData, blockJS: false, blockDangerousJS: false }}
        />
      </div>
    </Container>
  )
}