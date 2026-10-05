import Container from '@component/Container'

export default function LegalPage({ title, updated, children }) {
  return (
    <Container classNames="py-12 lg:py-16">
      <article className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-950">{title}</h1>
        <p className="sc-mono mt-2 text-xs text-neutral-500">Last updated {updated}</p>
        <div className="mt-8 space-y-4 leading-relaxed text-neutral-700 [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-neutral-950 [&_li]:pl-1 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
          {children}
        </div>
      </article>
    </Container>
  )
}
