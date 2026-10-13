import { join } from 'node:path'
import { promises as fs } from 'node:fs'
import { serialize } from 'next-mdx-remote/serialize'

/**
 * A "pack" is one component collection that is sold. It is declared in the collection's MDX frontmatter:
 *
 *   access: pro
 *   price: 29
 *   lemonsqueezy: 123456        # numeric variant ID of the product in Lemon Squeezy
 *   free: [1, 2]                # optional: component numbers left open as samples
 *   componentPrice: 9           # optional: price of ONE component (enables "buy single")
 *   componentVariant: 654321    # variant ID of a generic "single component" product; the price above is applied at checkout
 *   components:
 *     3: { price: 12, lemonsqueezy: 777 }   # optional per-component override
 *
 * Server only. The variant ID never reaches the browser.
 */

const COMPONENTS_DIR = join(/* turbopackIgnore: true */ process.cwd(), 'src/data/components')
export const CODE_DIR = join(/* turbopackIgnore: true */ process.cwd(), 'src/data/code')

const SAFE_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/i

export const isPackId = (value) => typeof value === 'string' && SAFE_ID.test(value)

/** Case-insensitive on purpose: macOS ignores case, Vercel's Linux does not. */
async function findFile(packId) {
  const files = await fs.readdir(/* turbopackIgnore: true */ COMPONENTS_DIR)
  return files.find((file) => file.toLowerCase() === `${packId}.mdx`.toLowerCase()) ?? null
}

/** Returns null when the collection does not exist. */
export async function getPack(packId) {
  if (!isPackId(packId)) return null
  const file = await findFile(packId)
  if (!file) return null

  const source = await fs.readFile(/* turbopackIgnore: true */ join(COMPONENTS_DIR, file), 'utf-8')
  const { frontmatter } = await serialize(source, { parseFrontmatter: true })

  const num = (v) => (Number.isFinite(Number(v)) && Number(v) > 0 ? Number(v) : null)
  const price = num(frontmatter.price)
  const componentPrice = num(frontmatter.componentPrice)
  const componentVariant = String(frontmatter.componentVariant ?? '')
  const components = frontmatter.components ?? {}

  return {
    id: file.replace(/\.mdx$/, ''),
    title: frontmatter.title ?? packId,
    pro: String(frontmatter.access ?? '').trim().toLowerCase() === 'pro',
    price,
    variant: String(frontmatter.lemonsqueezy ?? ''),
    free: new Set((Array.isArray(frontmatter.free) ? frontmatter.free : []).map(String)),
    count: Object.keys(components).length,
    /** Price / variant for ONE component: its own `price` / `lemonsqueezy`, else the pack's componentPrice / componentVariant. */
    unitPrice: (id) => num(components[id]?.price) ?? componentPrice,
    unitVariant: (id) => String(components[id]?.lemonsqueezy ?? '') || componentVariant,
    hasComponent: (id) => Object.hasOwn(components, String(id)),
  }
}

/** Whether one component's code is open to everyone. */
export const isOpen = (pack, componentId) => !pack.pro || pack.free.has(String(componentId))