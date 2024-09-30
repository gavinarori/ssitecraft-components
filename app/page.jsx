import { join } from 'path'
import { promises as fs } from 'fs'
import { serialize } from 'next-mdx-remote/serialize'

import Container from '@component/Container'
import HeroBanner from '@component/HeroBanner'
import CollectionGrid from '@component/CollectionGrid'

async function getComponents() {
  const componentsPath = join(process.cwd(), '/src/data/components')
  const categoriesPath = join(process.cwd(), '/src/data/categories')

  const categorySlugs = ['application-ui', 'marketing']
  const componentSlugs = await fs.readdir(componentsPath)

  const componentsByCategory = await Promise.all(
    categorySlugs.map(async (categorySlug) => {
      const categoryPath = join(categoriesPath, `${categorySlug}.mdx`)
      const categoryItem = await fs.readFile(categoryPath, 'utf-8')

      const { frontmatter: categoryData } = await serialize(categoryItem, {
        parseFrontmatter: true,
      })

      const componentItems = await Promise.all(
        componentSlugs
          .filter((componentSlug) => componentSlug.includes(categorySlug))
          .map(async (componentSlug) => {
            const componentPath = join(componentsPath, componentSlug)
            const componentItem = await fs.readFile(componentPath, 'utf-8')

            const { frontmatter: componentData } = await serialize(componentItem, {
              parseFrontmatter: true,
            })

            const componentSlugFormatted = componentSlug.replace('.mdx', '')
            const componentSlugTrue = componentSlugFormatted.replace(
              `${componentData.category}-`,
              ''
            )
            const componentCount = Object.values(componentData.components).length

            return {
              title: componentData.title,
              slug: componentSlugTrue,
              category: componentData.category,
              image: componentData.image,
              count: componentCount,
              tag: componentData.tag,
              id: componentSlugFormatted,
            }
          })
      )

      componentItems.sort((itemA, itemB) => itemA.title.localeCompare(itemB.title))

      return {
        categoryTitle: categoryData?.title,
        componentItems,
      }
    })
  )

  return componentsByCategory
}

export default async function Page() {
  const componentsByCategory = await getComponents()

  return (
    <>
      <HeroBanner />
      <Container id="mainContent" classNames="pb-8 lg:pb-12">
        <ul className="space-y-8">
          {componentsByCategory.map(({ categoryTitle, componentItems = [] }) => {
            return (
              <li className="space-y-4" key={categoryTitle}>
                <CollectionGrid componentItems={componentItems} />
              </li>
            )
          })}
        </ul>
      </Container>
    </>
  )
}
