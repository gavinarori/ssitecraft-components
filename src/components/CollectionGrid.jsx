import CollectionCard from '@component/CollectionCard'

export default function CollectionGrid({ componentItems = [] }) {
  if (!componentItems.length) {
    return (
      <p className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">
        No collections here yet. Check back soon.
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