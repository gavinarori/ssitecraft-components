'use client'

import { useCallback } from 'react'

import { openPurchase } from './purchase'

/**
 * Starts buying a template. Opens the purchase dialog (pay with Paystack in Africa, request elsewhere).
 * Same return shape as before so BuyBox and the preview bar keep working.
 *   useCheckout(slug, { title, priceFor })   priceFor(tier) -> "$49" (optional, shown in the dialog)
 */
export function useCheckout(slug, { title = slug, priceFor } = {}) {
  const start = useCallback(
    (tier) => openPurchase({ kind: 'template', slug, tier, title: `${title} (${tier} license)`, priceLabel: priceFor?.(tier) }),
    [slug, title, priceFor]
  )
  return { start, error: '', loading: false }
}