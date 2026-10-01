import Link from 'next/link'

export default function CollectionCard({ componentData }) {
  const { title, image, emoji, count = 0, tag, category, slug } = componentData
  const countLabel = `${count} ${count === 1 ? 'component' : 'components'}`

  return (
    <Link
      href={`/components/${category}/${slug}`}
      className="group relative block h-full rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-500"
    >
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 group-hover:-translate-y-0.5 group-hover:border-indigo-200 group-hover:shadow-lg group-hover:shadow-indigo-100">
        <div className="relative grid aspect-[4/3] place-items-center overflow-hidden bg-slate-50">
          {image ? (
            <img
              src={image}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <span aria-hidden="true" className="text-5xl">
              {emoji ?? '🧩'}
            </span>
          )}

          <CardTag tagType={tag} />
        </div>

        <div className="flex items-center justify-between gap-2 p-4">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-slate-900">{title}</h3>
            <p className="mt-0.5 text-xs text-slate-500">{countLabel}</p>
          </div>

          <span
            aria-hidden="true"
            className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-indigo-600"
          >
            &rarr;
          </span>
        </div>
      </article>
    </Link>
  )
}

const TAG_STYLES = {
  new: 'bg-emerald-100 text-emerald-700',
  updated: 'bg-sky-100 text-sky-700',
}

function CardTag({ tagType }) {
  const style = TAG_STYLES[tagType]
  if (!style) return null

  return (
    <span
      className={`absolute right-3 top-3 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${style}`}
    >
      {tagType}
    </span>
  )
}