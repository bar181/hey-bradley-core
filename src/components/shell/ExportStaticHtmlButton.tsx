/**
 * Sprint N P57 Wave 2 (N1) — Export static HTML button. One-click
 * self-contained HTML download via createObjectURL. Mirrors ShareSpecButton's
 * toast pattern; no new dependencies.
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import { Download } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useConfigStore } from '@/store/configStore'
import { exportStaticHtml } from '@/contexts/specification/staticHtmlExport'

interface ToastState { text: string; kind: 'success' | 'error' }

function slugify(s: string): string {
  return (s || 'site').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'site'
}

function triggerDownload(blob: Blob, filename: string): boolean {
  try {
    if (typeof document === 'undefined' || typeof URL === 'undefined') return false
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = filename; a.style.display = 'none'
    document.body.appendChild(a); a.click(); document.body.removeChild(a)
    setTimeout(() => URL.revokeObjectURL(url), 0)
    return true
  } catch { return false }
}

export function ExportStaticHtmlButton() {
  const config = useConfigStore((s) => s.config)
  const [toast, setToast] = useState<ToastState | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  const showToast = useCallback((next: ToastState) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setToast(next)
    timerRef.current = setTimeout(() => setToast(null), 3000)
  }, [])

  const onExport = useCallback(() => {
    try {
      const blob = exportStaticHtml(config)
      const slug = slugify(config.site?.title || config.site?.brandName || 'site')
      const ok = triggerDownload(blob, `hey-bradley-${slug}.html`)
      showToast(ok
        ? { text: 'Downloaded static HTML', kind: 'success' }
        : { text: 'Could not start download', kind: 'error' })
    } catch {
      showToast({ text: 'Could not start download', kind: 'error' })
    }
  }, [config, showToast])

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={onExport}
        data-testid="export-static-html-button"
        aria-label="Export site as static HTML"
        className={cn(
          'inline-flex items-center gap-1.5 px-2 py-1 rounded',
          'text-[11px] uppercase tracking-wider',
          'bg-hb-surface text-hb-text-secondary border border-hb-border/40',
          'hover:bg-hb-accent/10 hover:text-hb-accent hover:border-hb-accent/30',
          'transition-colors',
        )}
      >
        <Download className="size-3" aria-hidden="true" />
        <span>Export HTML</span>
      </button>
      {toast && (
        <span
          role="status"
          data-testid="export-static-html-toast"
          data-toast-kind={toast.kind}
          className={cn(
            'ml-2 inline-block px-2 py-0.5 rounded text-[10px] tracking-wider border',
            toast.kind === 'success'
              ? 'bg-hb-accent/10 text-hb-accent border-hb-accent/30'
              : 'bg-red-500/10 text-red-500 border-red-500/30',
          )}
        >
          {toast.text}
        </span>
      )}
    </div>
  )
}
