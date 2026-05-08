import { useEffect, useRef, useState } from 'react'

/**
 * useReveal — fade-in-on-scroll via IntersectionObserver.
 * Returns { ref, isVisible }. Caller spreads ref onto the element to observe
 * and toggles className based on isVisible.
 *
 * Respects `prefers-reduced-motion: reduce` — when set, isVisible starts
 * `true` so no transition runs.
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
    return () => io.disconnect()
  }, [reduced, options])

  return { ref, isVisible }
}
