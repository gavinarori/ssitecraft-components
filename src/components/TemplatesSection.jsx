import Link from 'next/link'

import { getFeaturedTemplates } from '../utils/lib/templates-data'

import Container from '@component/Container'
import TemplateCard from '@component/TemplateCard'

// Home page section. Renders nothing until at least one template is visible.
export default async function TemplatesSection() {
  const templates = await getFeaturedTemplates(3)
  if (!templates.length) return null

  return (
    <Container classNames="pb-24 lg:pb-32">
      <section aria-labelledby="home-templates" className="space-y-6">
        <header className="flex flex-wrap items-end justify-between gap-4 ">
          <div>
            <h2 id="home-templates" className="lf-display text-[28px] font-medium leading-[1.4] tracking-[-0.02em] text-black">
              Website templates
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-neutral-600 sm:text-base">
              Complete sites built from these components. Try each one live before you buy.
            </p>
          </div>
          <Link href="/templates" className="sc-focus text-sm font-semibold text-neutral-950 underline decoration-[var(--lf-leaf)] decoration-2 underline-offset-4">
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
