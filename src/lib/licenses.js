/**
 * The two license tiers, in one place so the buy box, the preview bar and the license page
 * can never disagree. Wording here is starter text: have it reviewed before launch.
 */
export const TIERS = {
  standard: {
    label: 'Standard',
    blurb: 'One finished website, for you or one client.',
  },
  extended: {
    label: 'Extended',
    blurb: 'Unlimited client sites, and use inside a product you sell.',
  },
}

export const TIER_ORDER = ['standard', 'extended']

export const isTier = (value) => Object.hasOwn(TIERS, value)

/** Tiers a template actually sells (extended is optional). */
export function availableTiers(template) {
  return TIER_ORDER.filter((tier) => template.price?.[tier] != null)
}
