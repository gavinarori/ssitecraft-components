import Link from 'next/link'

import { getFeaturedTemplates } from '@lib/templates-data'

import Container from '@component/Container'
import TemplateCard from '@component/TemplateCard'

// Home page section. Renders nothing until at least one template is visible.
export default async function TemplatesSection() {
  const templates = await getFeaturedTemplates(3)
  if (!templates.length) return null

  return (
    <Container classNames="pb-16 lg:pb-24">
      <section aria-labelledby="home-templates" className="space-y-6">
        <header className="flex flex-wrap items-end justify-between gap-4 border-b border-neutral-950/10 pb-4">
          <div>
            <h2 id="home-templates" className="text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
              Website templates
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-neutral-600 sm:text-base">
              Complete sites built from these components. Try each one live before you buy.
            </p>
          </div>
          <Link href="/templates" className="sc-focus text-sm font-semibold text-neutral-950 underline decoration-sky-500 decoration-2 underline-offset-4">
            Browse all templates
          </Link>
        </header>

        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <li key={template.slug} className="flex">
              <TemplateCard template={template} />
            </li>
          ))}
        </ul>
      </section>
    </Container>
  )
}
