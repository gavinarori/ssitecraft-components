import { join } from 'path'
import { promises as fs } from 'fs'
import { cache } from 'react'
import { serialize } from 'next-mdx-remote/serialize'

/**
 * Data layer for website templates. One MDX file per template in src/data/templates/.
 * Same idea as components-data.js: files are the database, so there is nothing to host.
 *
 * `provider` (payment variant IDs) is server-only. Anything that reaches a client component
 * goes through toPublic(), which drops it.
 */

// turbopackIgnore: these are runtime reads, so Turbopack should not trace the whole project (TP1004)
const TEMPLATES_DIR = join(/* turbopackIgnore: true */ process.cwd(), 'src/data/templates')
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

// Read at call time so tests and the build can change NODE_ENV
const showDrafts = () => process.env.NODE_ENV === 'development'

const asArray = (value) => (Array.isArray(value) ? value : value ? [value] : [])

function asDate(value) {
  if (!value) return null
  // YAML parses 2026-09-30 into a Date
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  return String(value)
}

function normalize(slug, fm) {
  const missing = []
  if (!fm?.title) missing.push('title')
  if (fm?.price?.standard == null) missing.push('price.standard')
  if (!fm?.demo?.origin) missing.push('demo.origin')
  if (missing.length) {
    throw new Error(`Template "${slug}" is missing required frontmatter: ${missing.join(', ')}`)
  }

  const standard = Number(fm.price.standard)
  const extended = fm.price.extended != null ? Number(fm.price.extended) : null
  if (!(standard > 0) || (extended != null && !(extended > 0))) {
    throw new Error(`Template "${slug}": prices must be positive numbers. Free templates are not supported yet.`)
  }

  if (!/^https?:\/\/[^\s/]+/i.test(String(fm.demo.origin))) {
    throw new Error(`Template "${slug}": demo.origin must start with http:// or https://`)
  }

  // Paths always start with a slash, so origin + path can never point at another host
  const pages = asArray(fm.demo.pages)
    .map((page) => ({
      label: String(page?.label ?? page?.path ?? 'Page'),
      path: `/${String(page?.path ?? '/').replace(/^\/+/, '')}`,
    }))

  return {
    slug,
    title: String(fm.title),
    tagline: fm.tagline ? String(fm.tagline) : '',
    category: fm.category ? String(fm.category) : 'general',
    stack: asArray(fm.stack).map(String),
    status: fm.status ?? 'draft',
    version: fm.version ? String(fm.version) : '1.0.0',
    updated: asDate(fm.updated),
    featured: Boolean(fm.featured),
    tag: fm.tag ?? null,
    currency: fm.currency ?? 'USD',
    price: { standard, extended },
    demo: {
      origin: String(fm.demo.origin).replace(/\/+$/, ''),
      dark: Boolean(fm.demo.dark),
      pages: pages.length ? pages : [{ label: 'Home', path: '/' }],
    },
    screenshots: {
      cover: fm.screenshots?.cover ?? null,
      tall: fm.screenshots?.tall ?? null,
      gallery: asArray(fm.screenshots?.gallery),
    },
    quality: fm.quality ?? null,
    included: asArray(fm.included).map(String),
    features: asArray(fm.features).map(String),
    provider: fm.provider ?? {},
  }
}

function toPublic(template) {
  // eslint-disable-next-line no-unused-vars
  const { provider, ...publicTemplate } = template
  return publicTemplate
}

const isVisible = (template) => template.status === 'published' || showDrafts()

const readTemplateFile = cache(async (slug) => {
  // The slug can come from a URL or a request body, so never let it reach the file system unchecked
  if (typeof slug !== 'string' || !SLUG_PATTERN.test(slug)) return null

  try {
    const source = await fs.readFile(/* turbopackIgnore: true */ join(/* turbopackIgnore: true */ TEMPLATES_DIR, `${slug}.mdx`), 'utf-8')
    const content = await serialize(source, { parseFrontmatter: true })
    return { template: normalize(slug, content.frontmatter), content }
  } catch (error) {
    if (error.code === 'ENOENT') return null
    throw error
  }
})

async function listSlugs() {
  try {
    const files = await fs.readdir(/* turbopackIgnore: true */ TEMPLATES_DIR)
    return files.filter((file) => file.endsWith('.mdx')).map((file) => file.replace(/\.mdx$/, ''))
  } catch (error) {
    if (error.code === 'ENOENT') return []
    throw error
  }
}

/** Full record including payment variant IDs. Server-only: checkout and webhook routes. */
export async function getTemplateServer(slug) {
  const record = await readTemplateFile(slug)
  return record && isVisible(record.template) ? record.template : null
}

/** Public record plus the compiled MDX body, for the template page. */
export async function getTemplate(slug) {
  const record = await readTemplateFile(slug)
  if (!record || !isVisible(record.template)) return null
  return { template: toPublic(record.template), content: record.content }
}

/** Every visible template, newest first. */
export const getAllTemplates = cache(async () => {
  const slugs = await listSlugs()
  const records = await Promise.all(slugs.map((slug) => readTemplateFile(slug)))

  return records
    .filter(Boolean)
    .map((record) => record.template)
    .filter(isVisible)
    .sort((a, b) => {
      if (a.updated && b.updated && a.updated !== b.updated) return b.updated.localeCompare(a.updated)
      if (a.updated !== b.updated) return a.updated ? -1 : 1
      return a.title.localeCompare(b.title)
    })
    .map(toPublic)
})

export async function getFeaturedTemplates(limit = 3) {
  const templates = await getAllTemplates()
  const featured = templates.filter((template) => template.featured)
  const rest = templates.filter((template) => !template.featured)
  return [...featured, ...rest].slice(0, limit)
}

export async function getTemplateParams() {
  const templates = await getAllTemplates()
  return templates.map(({ slug }) => ({ slug }))
}

const label = (value) => value.replace(/-/g, ' ').replace(/^\w/, (letter) => letter.toUpperCase())

/** Filter options with counts, for the catalog. */
export function getTemplateFacets(templates) {
  const count = (values) =>
    [...values.reduce((map, value) => map.set(value, (map.get(value) ?? 0) + 1), new Map())]
      .map(([value, total]) => ({ value, label: label(value), count: total }))
      .sort((a, b) => a.label.localeCompare(b.label))

  return {
    categories: count(templates.map((template) => template.category)),
    stacks: count(templates.flatMap((template) => template.stack)),
  }
}
