import { NextResponse } from 'next/server'

import { getFlatCollections } from '@util/components-data'
import { getAllTemplates } from '@util/lib/templates-data'

// One search index for components and templates. Components keep their existing shape;
// templates carry an explicit href because their URL is not /components/<category>/<slug>.
export async function GET() {
  const [components, templates] = await Promise.all([getFlatCollections(), getAllTemplates()])

  const templateItems = templates.map((template) => ({
    id: `template-${template.slug}`,
    title: template.title,
    slug: template.slug,
    type: 'template',
    href: `/templates/${template.slug}`,
    category: { slug: 'templates', title: 'Template' },
  }))

  return NextResponse.json([...components.map((item) => ({ ...item, type: 'component' })), ...templateItems])
}
