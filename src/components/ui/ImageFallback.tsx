import { ImageIcon } from 'lucide-react'

/**
 * P115/A3 Interaction 5 — Broken image fallback gradient placeholder.
 *
 * Renders a token-driven gradient block + image-icon + "Image" label
 * when the underlying <img> fails to load. Used as a swap-target via
 * onError handlers across image-bearing section templates.
 *
 * Token compliance per ADR-087: gradient uses var(--hb-bg-secondary)
 * → var(--hb-surface) so it inherits the active theme palette and
 * never ships hex literals.
 */
export function ImageFallback({ className = '', label = 'Image' }: { className?: string; label?: string }) {
  return (
    <div
      className={`hb-image-fallback flex items-center justify-center w-full h-full ${className}`}
      role="img"
      aria-label={`${label} unavailable`}
      style={{
        background:
          'linear-gradient(135deg, var(--hb-bg-secondary, #2a2a2a) 0%, var(--hb-surface, #1f1f1f) 100%)',
      }}
    >
      <div className="flex flex-col items-center gap-2 opacity-60">
        <ImageIcon size={32} className="text-hb-text-muted" />
        <span className="text-xs font-medium text-hb-text-muted">{label}</span>
      </div>
    </div>
  )
}
