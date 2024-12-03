import Link from 'next/link'

export default function CollectionCard({ componentData }) {
  const componentCountPluralize = componentData.count > 1 ? 'Components' : 'Component'
  const componentCount = `${componentData.count} ${componentCountPluralize}`

  console.log(componentData)

  const hasTag = !!componentData.tag

  return (
    <Link href={`/components/${componentData.category}/${componentData.slug}`}>
      <div className="group relative block h-full bg-white before:absolute ">
        
        <div className="flex items-center overflow-hidden rounded-xl border border-gray-950/5 bg-gray-50 text-center ring-offset-white transition duration-300 group-hover:border-primary/10 group-hover:bg-gray-100 group-hover:ring-1 group-hover:ring-gray-950/10 group-hover:ring-offset-4 ">
          <div className="p-4 sm:p-6">
          <img
            src={componentData.image}
            alt={componentData.title}
            className="h-auto w-auto  "
                    />

            <h2 className="font-medium text-gray-900 sm:text-sm">{componentData.title}</h2>

            <p className="text-xs text-gray-700 group-hover:underline group-hover:underline-offset-4">{componentCount}</p>
          </div>
        </div>

      </div>
    </Link>
  )
}

function CardTag({ tagType }) {
  const isNew = tagType === 'new'
  const isUpdated = tagType === 'updated'

  if (!isNew && !isUpdated) {
    return <></>
  }

  return (
    <span
      className={`-me-1.5 -mt-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium capitalize sm:-me-3 sm:-mt-3 ${
        isNew && 'bg-green-100 text-green-700'
      } ${isUpdated && 'bg-blue-100 text-blue-700'}`}
    >
      {tagType}
    </span>
  )
}
