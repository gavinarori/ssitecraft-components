import { notFound } from 'next/navigation'

import { getTemplate } from '../../../../src/lib/templates-data'

import TemplatePreviewShell from '@component/TemplatePreviewShell'

export async function generateMetadata({ params }) {
  const { slug } = await params
  const found = await getTemplate(slug)
  return {
    title: found ? `${found.template.title} live preview | sitecraft` : 'Preview',
    // Preview URLs are for buyers, not search results
    robots: { index: false, follow: false },
  }
}

export default async function Page({ params }) {
  const { slug } = await params
  const found = await getTemplate(slug)
  if (!found) notFound()

  return <TemplatePreviewShell template={found.template} />
}
