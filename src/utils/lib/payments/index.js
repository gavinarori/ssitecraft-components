import * as lemonsqueezy from './lemonsqueezy.js'

// Add a provider by dropping a file next to lemonsqueezy.js and listing it here.
const providers = { lemonsqueezy }

/** Looks a provider up by name. With no name, uses PAYMENT_PROVIDER (default: lemonsqueezy). */
export function getProvider(name = process.env.PAYMENT_PROVIDER || 'lemonsqueezy') {
  return Object.hasOwn(providers, name) ? providers[name] : null
}
