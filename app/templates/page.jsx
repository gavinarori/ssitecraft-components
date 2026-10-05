import { getAllTemplates, getTemplateFacets } from '../../src/lib/templates-data'

import { ogMeta, twitterMeta } from '@data/metadata'

import Container from '@component/Container'
import TemplateCatalog from '@component/TemplateCatalog'

const title = 'Website templates | sitecraft'
const description = 'Production-ready website templates built with Tailwind CSS. Try each one live, then buy and download the source.'

export const metadata = {
  title,
  description,
  openGraph: { title, description, ...ogMeta },
  twitter: { title, description, ...twitterMeta },
}

export default async function Page() {
  const templates = await getAllTemplates()
  const { categories } = getTemplateFacets(templates)

  return (
    <>
      <section className="border-b border-neutral-950/10 sc-hatch">
        <Container classNames="py-14 lg:py-20">
          <p className="sc-mono text-xs uppercase tracking-wide text-neutral-500">Templates</p>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl">
            Whole websites, ready to ship.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-neutral-600">
            Every template is a real, working site. Open the live demo, resize it, flip it to dark mode, then take the source.
          </p>
        </Container>
      </section>

      <Container classNames="py-10 lg:py-14">
        {templates.length ? (
          <TemplateCatalog templates={templates} categories={categories} />
        ) : (
          <p className="rounded-2xl p-10 text-center text-neutral-600 ring-1 ring-neutral-950/10 sc-hatch">
            The first templates are on their way. Check back soon.
          </p>
        )}
      </Container>
    </>
  )
}
