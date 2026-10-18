'use client'

import { createElement } from 'react'
import { createRoot } from 'react-dom/client'

import PurchaseDialog from '@component/PurchaseDialog'

/**
 * Opens the "how do you want to buy this?" dialog from anywhere (buttons, hooks), with no provider
 * or layout change needed. item: { kind, slug, tier, pack, component, title, priceLabel }
 */
export function openPurchase(item) {
  const host = document.createElement('div')
  document.body.appendChild(host)
  const root = createRoot(host)
  const close = () => {
    root.unmount()
    host.remove()
  }
  root.render(createElement(PurchaseDialog, { item, onClose: close }))
}