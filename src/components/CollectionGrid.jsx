import CollectionCard from '@component/CollectionCard'

export default function CollectionGrid({ componentItems = [] }) {
  if (!componentItems.length) {
    return (
      <p className="rounded-2xl border border-dashed border-[var(--lf-line)] p-10 text-center text-sm text-neutral-500">
        Nothing planted here yet. Check back soon.
      </p>
    )
  }

  return (
    <ul className="grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {componentItems.map((componentData) => (
        <li key={componentData.id}>
          <CollectionCard componentData={componentData} />
        </li>
      ))}
    </ul>
  )
}
