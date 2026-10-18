import * as lemonsqueezy from './lemonsqueezy.js'
import * as paystack from './paystack.js'   // ← must be exactly this casing

// Add a provider by dropping a file next to these and listing it here.
const providers = { paystack, lemonsqueezy }

/** Looks a provider up by name. With no name, uses PAYMENT_PROVIDER (default: paystack). */
export function getProvider(name = process.env.PAYMENT_PROVIDER || 'paystack') {
  return Object.hasOwn(providers, name) ? providers[name] : null
}