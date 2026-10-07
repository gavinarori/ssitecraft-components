import { notFound } from 'next/navigation'

import { join } from 'path'
import { promises as fs } from 'fs'
import { serialize } from 'next-mdx-remote/serialize'

import { getCollectionParams } from '@util/components-data'
import { ogMeta, twitterMeta } from '@data/metadata'

import Ad from '@component/Ad'
import Container from '@component/Container'
import MdxRemoteRender from '@component/MdxRemoteRender'
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

    return {
      collectionData: {
        ...mdxSource.frontmatter,
        slug: params.collection,
      },
      collectionContent: mdxSource,
    }
  } catch (error) {
    console.error(`[components] failed to load ${file}:`, error)
    notFound()
  }
}

export default async function Page(props) {
  const { collectionData, collectionContent } = await getCollection(await props.params)

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
        }
      }
    ),
  }

  return (
    <Container id="mainContent" classNames="py-8 lg:py-12 space-y-8">
      <Ad />

      <div className="prose max-w-none">
        <MdxRemoteRender
          mdxSource={collectionContent}
          mdxComponents={mdxComponents}
          mdxScope={componentsData}
        />
      </div>
    </Container>
  )
}
