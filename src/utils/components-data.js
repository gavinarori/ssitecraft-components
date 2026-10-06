import { join } from 'path'
import { promises as fs } from 'fs'
import { cache } from 'react'
import { serialize } from 'next-mdx-remote/serialize'

/**
 * Shared data layer for the page files.
 * Before: the same directory-walking + frontmatter parsing was copy-pasted in
 * the home page, category page and /api route. Now it lives here once.
 *
 * Free vs Pro: add `access: pro` to a collection's frontmatter to mark it as a paid pack.
 * Anything without it is free. Optional `price: 29` is carried through for the pack page.
 */

export const CATEGORY_SLUGS = ['application-ui']

// The turbopackIgnore comments tell Turbopack these paths are read at runtime, so it stops trying
// to trace every file under them (that tracing is what produced the TP1004 "very dynamic" warning).
const COMPONENTS_DIR = join(/* turbopackIgnore: true */ process.cwd(), 'src/data/components')
const CATEGORIES_DIR = join(/* turbopackIgnore: true */ process.cwd(), 'src/data/categories')
const PAGES_DIR = join(/* turbopackIgnore: true */ process.cwd(), 'src/data/pages')

export const paths = { COMPONENTS_DIR, CATEGORIES_DIR, PAGES_DIR }

const stripMdx = (name) => name.replace(/\.mdx$/, '')

async function readFrontmatter(filePath) {
  const source = await fs.readFile(/* turbopackIgnore: true */ filePath, 'utf-8')
  const { frontmatter } = await serialize(source, { parseFrontmatter: true })
  return frontmatter
}

/** Anything that is not exactly "pro" counts as free, so a typo can never lock a collection by accident. */
const normalizeAccess = (value) => (String(value ?? '').trim().toLowerCase() === 'pro' ? 'pro' : 'free')

/** One category's frontmatter (title, subtitle, description, image...) */
export const getCategoryData = cache(async (categorySlug) => {
  return readFrontmatter(join(CATEGORIES_DIR, `${categorySlug}.mdx`))
})

/** Every collection belonging to a category, sorted by title. */
export const getCollectionsForCategory = cache(async (categorySlug) => {
  const files = (await fs.readdir(/* turbopackIgnore: true */ COMPONENTS_DIR)).filter(
    (file) => file.endsWith('.mdx') && file.startsWith(`${categorySlug}-`)
  )

  const items = await Promise.all(
    files.map(async (file) => {
      const data = await readFrontmatter(join(COMPONENTS_DIR, file))
      const id = stripMdx(file)

      return {
        id,
        title: data.title,
        slug: id.slice(categorySlug.length + 1),
        category: data.category ?? categorySlug,
        image: data.image ?? null,
        emoji: data.emoji ?? null,
        tag: data.tag ?? null,
        count: Object.keys(data.components ?? {}).length,
        access: normalizeAccess(data.access),
        price: data.price != null && Number(data.price) > 0 ? Number(data.price) : null,
      }
    })
  )

  return items.sort((a, b) => a.title.localeCompare(b.title))
})

/** All categories with their collections (used by the home page). */
export const getAllCategories = cache(async () => {
  return Promise.all(
    CATEGORY_SLUGS.map(async (slug) => {
      const [data, items] = await Promise.all([
        getCategoryData(slug),
        getCollectionsForCategory(slug),
      ])
      return { slug, ...data, items }
    })
  )
})

/** Flat list with category info attached (used by the /api route). */
export async function getFlatCollections() {
  const categories = await getAllCategories()
  return categories.flatMap(({ items, slug, title, image }) =>
    items.map((item) => ({
      ...item,
      category: { slug, title, image },
    }))
  )
}

/** Params for generateStaticParams on /[category]/[collection]. */
export async function getCollectionParams() {
  const files = await fs.readdir(/* turbopackIgnore: true */ COMPONENTS_DIR)
  return files
    .filter((f) => f.endsWith('.mdx'))
    .map(stripMdx)
    .map((id) => {
      const category = CATEGORY_SLUGS.find((c) => id.startsWith(`${c}-`))
      return category ? { category, collection: id.slice(category.length + 1) } : null
    })
    .filter(Boolean)
}

/** Params for generateStaticParams on /[slug] content pages. */
export async function getPageParams() {
  const files = await fs.readdir(/* turbopackIgnore: true */ PAGES_DIR)
  return files.filter((f) => f.endsWith('.mdx')).map((f) => ({ slug: stripMdx(f) }))
}
