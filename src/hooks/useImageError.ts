import { useState, useCallback } from 'react'

/**
 * P115/A3 Interaction 5 — Track <img> load failure state.
 *
 * Returns { errored, onError } for templates to swap a broken <img>
 * with the <ImageFallback /> gradient placeholder. Replaces the
 * pre-P115 pattern of `onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}`
 * which left an empty hole in the layout.
 */
export function useImageError() {
  const [errored, setErrored] = useState(false)
  const onError = useCallback(() => setErrored(true), [])
  return { errored, onError }
}
