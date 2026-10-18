import { getPack } from './packs.js'
import { getTemplateServer } from './templates-data.js'

/**
 * Turns what the browser says it wants into a trusted item, with title and USD price read from OUR data.
 * input: { kind: 'template', slug, tier } | { kind: 'pack', pack } | { kind: 'component', pack, component }
 * Returns null when it is not for sale.
 */
export async function resolveItem(input) {
  if (input?.kind === 'template') {
    const template = await getTemplateServer(String(input.slug ?? ''))
    const tier = String(input.tier ?? '')
    const price = template?.price?.[tier]
    return template && price > 0 ? { kind: 'template', slug: template.slug, tier, title: `${template.title} (${tier} license)`, usd: price } : null
  }

  if (input?.kind === 'pack' || input?.kind === 'component') {
    const pack = await getPack(String(input.pack ?? ''))
    if (!pack?.pro) return null

    if (input.kind === 'pack') {
      return pack.price ? { kind: 'pack', pack: pack.id, title: `${pack.title}, all ${pack.count} components`, usd: pack.price } : null
    }
    const component = String(input.component ?? '')
    const usd = pack.unitPrice(component)
    if (!pack.hasComponent(component) || pack.free.has(component) || !usd) return null
    return { kind: 'component', pack: pack.id, component, title: `${pack.title}, component ${component}`, usd }
  }
  return null
}