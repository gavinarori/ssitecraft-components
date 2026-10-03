'use client'

import { useEffect, useRef } from 'react'

// Lights up the hero grid around the pointer. It is the only client code in the hero:
// the rest is server-rendered CSS. Skipped for touch screens and reduced-motion users.
// Pointer events are listened for on the parent <section>, because this layer itself is pointer-events-none.
export default function HeroSpotlight() {
  const ref = useRef(null)

  useEffect(() => {
    const layer = ref.current
    const host = layer?.closest('section')
    if (!layer || !host) return

    const skip =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(pointer: coarse)').matches
    if (skip) return

    let frame = 0

    const onMove = (event) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const box = host.getBoundingClientRect()
        layer.style.setProperty('--mx', `${event.clientX - box.left}px`)
        layer.style.setProperty('--my', `${event.clientY - box.top}px`)
        layer.style.opacity = '1'
      })
    }
    const onLeave = () => {
      cancelAnimationFrame(frame)
      layer.style.opacity = '0'
    }

    host.addEventListener('pointermove', onMove)
    host.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(frame)
      host.removeEventListener('pointermove', onMove)
      host.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return <div ref={ref} aria-hidden="true" className="sc-spotlight absolute inset-0" />
}