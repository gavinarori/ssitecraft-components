import { notFound } from 'next/navigation'

import { promises as fs } from 'fs'
import { join } from 'path'
import { serialize } from 'next-mdx-remote/serialize'

import rehypeExternalLinks from 'rehype-external-links'
import remarkSlug from 'remark-slug'

import { ogMeta, twitterMeta } from '@data/metadata'
import { getPageParams, paths } from '@util/components-data'

import FaqList from '@component/FaqList'
import Container from '@component/Container'
import MdxRemoteRender from '@component/MdxRemoteRender'

const mdxComponents = { FaqList }

export async function generateStaticParams() {
  return getPageParams()
}

async function getPage(params) {
  const { slug } = await params

  try {
    const source = await fs.readFile(join(paths.PAGES_DIR, `${slug}.mdx`), 'utf-8')

    const mdxSource = await serialize(source, {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkSlug],
        rehypePlugins: [[rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }]],
      },
    })

    return { pageData: mdxSource.frontmatter, pageContent: mdxSource }
  } catch {
    notFound()
  }
}

export async function generateMetadata({ params }) {
  const { pageData } = await getPage(params)
  const title = `${pageData.title} | sitecraft`

  return {
    title,
    description: pageData.description,
    openGraph: { title, description: pageData.description, ...ogMeta },
    twitter: { title, description: pageData.description, ...twitterMeta },
  }
}

export default async function Page({ params }) {
  const { pageData, pageContent } = await getPage(params)

  return (
    <>
      <header className="sc-glow border-b border-slate-200">
        <div className="mx-auto max-w-3xl px-6 py-14 lg:py-20">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            {pageData.title}
          </h1>
          {pageData.description ? (
            <p className="mt-4 text-lg leading-8 text-slate-600">{pageData.description}</p>
          ) : null}
        </div>
      </header>

      <Container id="mainContent" classNames="py-10 lg:py-14">
        <article className="prose prose-slate mx-auto prose-headings:tracking-tight prose-a:text-indigo-600 hover:prose-a:text-indigo-800">
          <MdxRemoteRender mdxSource={pageContent} mdxComponents={mdxComponents} />
        </article>
      </Container>
    </>
  )
}
