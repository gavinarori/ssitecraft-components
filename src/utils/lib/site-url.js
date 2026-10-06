/**
 * The public origin of the site, used for checkout redirects and download links.
 * Prefer the configured value: the Host header is not something to build payment URLs from.
 */
export function getSiteUrl(request) {
  const configured = process.env.NEXT_PUBLIC_SITE_URL
  if (configured) return configured.replace(/\/+$/, '')
  return new URL(request.url).origin
}
