'use client'

import ComponentPreview from '@component/ComponentPreview'

export default function CollectionList({ componentsData = [], componentContainer }) {
  return (
    <div className="not-prose mx-auto xl:max-w-[1348px]">
      <ul className="space-y-12 lg:space-y-16">
        {componentsData.map((componentData) => (
          <li key={componentData.id} className="scroll-mt-32">
            <ComponentPreview
              componentData={componentData}
              componentContainer={componentContainer}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}