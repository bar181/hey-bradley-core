import { useEffect, useRef, useState } from 'react'

/**
 * useReveal — fade-in-on-scroll via IntersectionObserver.
 * Returns { ref, isVisible }. Caller spreads ref onto the element to observe
 * and toggles className based on isVisible.
 *
 * Respects `prefers-reduced-motion: reduce` — when set, isVisible starts
 * `true` so no transition runs.
 *
 * P123.5 — defensive fallback: if IntersectionObserver hasn't fired within
 * 1000ms (slow connection, headless browser, prerender, fullPage screencaps),
 * force isVisible=true so below-fold content renders. The IO callback is
 * idempotent — if it fires first, the timeout setIsVisible(true) is harmless.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options: IntersectionObserverInit = { threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
) {
  const ref = useRef<T | null>(null)
  const reduced =
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  const [isVisible, setIsVisible] = useState(reduced)

  useEffect(() => {
    if (reduced || !ref.current) return
    const el = ref.current
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          io.unobserve(entry.target)
        }
      })
    }, options)
    io.observe(el)
    // Defensive fallback — ensure section eventually renders even if IO never fires.
    const fallback = window.setTimeout(() => setIsVisible(true), 1000)
    return () => {
      io.disconnect()
      window.clearTimeout(fallback)
    }
  }, [reduced, options])

  return { ref, isVisible }
}
