'use client'

import { useCallback, useEffect, useState } from 'react'

/**
 * Starts a hosted checkout for a template. POSTs to /api/checkout and sends the browser to the
 * URL it returns. Used by the buy box on the template page and by the preview shell.
 */
export function useCheckout(slug) {
  const [status, setStatus] = useState('idle') // idle | loading | error
  const [error, setError] = useState('')

  // Coming back with the browser's Back button restores the page from cache with the button still busy
  useEffect(() => {
    const onPageShow = (event) => {
      if (event.persisted) setStatus('idle')
    }
    window.addEventListener('pageshow', onPageShow)
    return () => window.removeEventListener('pageshow', onPageShow)
  }, [])

  const start = useCallback(
    async (tier) => {
      setStatus('loading')
      setError('')

      try {
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug, tier }),
        })
        const data = await response.json().catch(() => ({}))

        if (!response.ok || !data.url) {
          throw new Error(data.error || 'Checkout is unavailable right now. Please try again.')
        }

        window.location.assign(data.url)
      } catch (caught) {
        setStatus('error')
        setError(caught.message || 'Checkout is unavailable right now. Please try again.')
      }
    },
    [slug]
  )

  return { start, error, loading: status === 'loading' }
}
