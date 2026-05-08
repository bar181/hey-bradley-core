/**
 * P76 / OC-9 (A4) — Export bundle UI redesign.
 *
 * Sprint N P57 Wave 2 (N1) shipped a one-click HTML download with a small
 * inline toast. P76 promotes that surface to a clean two-CTA modal so users
 * pick between the two distinct artifact shapes:
 *
 *   - Primary: "Download .heybradley" (static HTML mini-document, offline-ready)
 *   - Secondary: "Copy AISP" (AISP atom bundle to clipboard for LLM hand-off)
 *
 * Tailwind transitions only. No new deps. ARIA dialog semantics; backdrop
 * click + Escape close. Tokens stay canonical (ADR-091).
 */
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { Download, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useConfigStore } from '@/store/configStore'
import { exportStaticHtml } from '@/contexts/specification/staticHtmlExport'
import { composeShareSpecBundle } from '@/contexts/specification/shareSpecBundle'

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

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch { /* fall through */ }
  try {
    if (typeof document === 'undefined') return false
    const ta = document.createElement('textarea')
    ta.value = text
    ta.setAttribute('readonly', '')
    ta.style.position = 'fixed'; ta.style.left = '-9999px'
    document.body.appendChild(ta); ta.select()
    const ok = document.execCommand?.('copy') ?? false
    document.body.removeChild(ta)
    return ok
  } catch { return false }
}

export function ExportStaticHtmlButton() {
  const config = useConfigStore((s) => s.config)
  const [open, setOpen] = useState(false)
  const [toast, setToast] = useState<ToastState | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const titleId = useId()

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  // Escape closes; focus the dialog on open for keyboard users.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    dialogRef.current?.focus()
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const showToast = useCallback((next: ToastState) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setToast(next)
    timerRef.current = setTimeout(() => setToast(null), 3000)
  }, [])

  const onDownload = useCallback(() => {
    try {
      const blob = exportStaticHtml(config)
      const slug = slugify(config.site?.title || config.site?.brandName || 'site')
      const ok = triggerDownload(blob, `${slug}.heybradley.html`)
      showToast(ok
        ? { text: 'Downloaded .heybradley', kind: 'success' }
        : { text: 'Could not start download', kind: 'error' })
      if (ok) setOpen(false)
    } catch {
      showToast({ text: 'Could not start download', kind: 'error' })
    }
  }, [config, showToast])

  const onCopyAisp = useCallback(async () => {
    try {
      const bundle = composeShareSpecBundle(config)
      // Use the canonical bundle JSON — it carries the AISP atom block plus
      // the surrounding spec context LLM consumers expect (round-trip safe).
      // A5 owns enriching shareSpecBundle with a stand-alone aispText field;
      // until then `bundle.json` is the public AISP-bearing artifact.
      const aispText = bundle.json || bundle.dataUrl || ''
      if (!aispText) {
        showToast({ text: 'No AISP available yet', kind: 'error' })
        return
      }
      const ok = await copyToClipboard(aispText)
      showToast(ok
        ? { text: 'AISP copied to clipboard', kind: 'success' }
        : { text: 'Could not copy AISP', kind: 'error' })
      if (ok) setOpen(false)
    } catch {
      showToast({ text: 'Could not copy AISP', kind: 'error' })
    }
  }, [config, showToast])

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={() => setOpen(true)}
        data-testid="export-static-html-button"
        aria-label="Export site"
        aria-haspopup="dialog"
        aria-expanded={open}
        className={cn(
          'inline-flex items-center gap-1.5 px-2 py-1 rounded',
          'text-[11px] uppercase tracking-wider',
          'bg-hb-surface text-hb-text-secondary border border-hb-border/40',
          'hover:bg-hb-accent/10 hover:text-hb-accent hover:border-hb-accent/30',
          'transition-colors',
        )}
      >
        <Download className="size-3" aria-hidden="true" />
        <span>Export</span>
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

      {open && (
        <div
          data-testid="export-modal-backdrop"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false) }}
          className={cn(
            'fixed inset-0 z-[60] flex items-center justify-center',
            'bg-black/60 backdrop-blur-sm',
            'transition-opacity duration-150',
          )}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            data-testid="export-modal"
            className={cn(
              'relative w-[min(92vw,520px)] rounded-xl shadow-2xl',
              'bg-hb-surface border border-hb-border/60',
              'p-6 sm:p-7 outline-none',
              'transition-transform duration-150',
            )}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              data-testid="export-modal-close"
              aria-label="Close export dialog"
              className={cn(
                'absolute top-3 right-3 inline-flex items-center justify-center',
                'size-7 rounded-md text-hb-text-secondary',
                'hover:bg-hb-border/30 hover:text-hb-text-primary',
                'transition-colors',
              )}
            >
              <X className="size-4" aria-hidden="true" />
            </button>

            <h2
              id={titleId}
              className="text-lg font-semibold text-hb-text-primary tracking-tight"
            >
              Export your spec
            </h2>
            <p className="mt-2 text-sm text-hb-text-secondary leading-relaxed">
              Download a self-contained HTML preview of the site, or copy the
              AISP atom bundle straight to your clipboard. Both surfaces are
              offline-safe and fully portable.
            </p>
            <p className="mt-2 text-xs text-hb-text-secondary/80 leading-relaxed">
              The .heybradley file opens like any web page. The AISP bundle
              hands off cleanly to Claude, Gemini, or any LLM that speaks
              the AI Symbolic Protocol.
            </p>

            <div className="mt-5 flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={onDownload}
                data-testid="export-modal-download"
                className={cn(
                  'flex-1 inline-flex items-center justify-center gap-2',
                  'px-4 py-2.5 rounded-md',
                  'bg-[#e8772e] text-white text-sm font-semibold',
                  'hover:brightness-105 active:brightness-95',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8772e]',
                  'transition-[filter,transform] duration-150',
                  'shadow-sm',
                )}
              >
                <Download className="size-4" aria-hidden="true" />
                Download .heybradley
              </button>
              <button
                type="button"
                onClick={onCopyAisp}
                data-testid="export-modal-copy-aisp"
                className={cn(
                  'flex-1 inline-flex items-center justify-center gap-2',
                  'px-4 py-2.5 rounded-md',
                  'bg-transparent text-hb-text-primary text-sm font-medium',
                  'border border-hb-border/60',
                  'hover:bg-hb-accent/10 hover:border-hb-accent/40 hover:text-hb-accent',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hb-accent',
                  'transition-colors duration-150',
                )}
              >
                Copy AISP
              </button>
            </div>

            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={() => setOpen(false)}
                data-testid="export-modal-cancel"
                className={cn(
                  'text-xs text-hb-text-secondary hover:text-hb-text-primary',
                  'underline underline-offset-4 decoration-hb-border/60',
                  'transition-colors',
                )}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
