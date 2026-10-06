import Link from 'next/link'

// access: 'free' | 'pro' comes from the collection's frontmatter (see utils/components-data.js)
export default function CollectionCard({ componentData }) {
  const { title, image, emoji, count = 0, tag, category, slug, access = 'free' } = componentData
  const countLabel = `${count} ${count === 1 ? 'component' : 'components'}`
  const isPro = access === 'pro'

  return (
    <Link href={`/components/${category}/${slug}`} className="group relative block h-full rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--lf-leaf)]">
      <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-[var(--lf-line)] transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_22px_44px_-18px_rgb(12_42_30/0.35)] group-hover:ring-[rgb(22_160_95/0.4)]">
        <div className="relative grid aspect-[4/3] place-items-center overflow-hidden bg-[var(--lf-paper)]">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          ) : (
            <span aria-hidden="true" className="text-5xl">{emoji ?? '🌱'}</span>
          )}

          <span
            className={`sc-mono absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide ${
              isPro ? 'bg-[var(--lf-forest)] text-[var(--lf-lime)]' : 'bg-[var(--lf-lime)] text-[var(--lf-forest)]'
            }`}
          >
            {isPro ? (
              <svg viewBox="0 0 20 20" fill="currentColor" className="size-3" aria-hidden="true"><path d="m10 1.5 2.5 5.3 5.8.7-4.3 4 1.1 5.7L10 14.3 4.9 17.2 6 11.5 1.7 7.5l5.8-.7L10 1.5Z" /></svg>
            ) : null}
            {isPro ? 'Pro' : 'Free'}
          </span>

          {tag ? (
            <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium capitalize text-neutral-800 ring-1 ring-[var(--lf-line)]">
              {tag}
            </span>
          ) : null}
        </div>

        <div className="flex items-center justify-between gap-2 p-4">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-neutral-950">{title}</h3>
            <p className="mt-0.5 text-xs text-neutral-500">{countLabel}</p>
          </div>
          <span aria-hidden="true" className="text-neutral-300 transition group-hover:translate-x-0.5 group-hover:text-[var(--lf-leaf)]">&rarr;</span>
        </div>
      </article>
    </Link>
  )
}
