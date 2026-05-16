/**
 * P126 / F2a — BYOK hover panel (top-right, always-visible).
 * Decision record: docs/adr/ADR-153-byok-localstorage-only-storage.md.
 * Keys live in `localStorage` via `kv` only; smoke-test = 1-token Gemini ping
 * (~$0.0000003); never included in any event payload (ADR-043 + ADR-114 D3).
 */
import { useEffect, useRef, useState } from 'react'
import { Key } from 'lucide-react'
import { useIntelligenceStore } from '@/store/intelligenceStore'
import { useLLMHealthStore } from '@/store/llmHealthStore'

type SaveState = 'idle' | 'saving' | 'ok' | 'error'

const GEMINI_PING_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

/** Single-source-of-truth pill copy + dot color from (hasKey, llmHealth). */
function pillFor(hasKey: boolean, health: 'idle' | 'ok' | 'error'): { dot: string; label: string } {
  if (!hasKey) return { dot: '', label: 'Add API Key' }
  if (health === 'ok') return { dot: 'bg-hb-success', label: 'Key active' }
  if (health === 'error') return { dot: 'bg-hb-error', label: 'Key error' }
  return { dot: 'bg-hb-warning', label: 'Key set · untested' }
}

export function BYOKPanel() {
  const hasKey = useIntelligenceStore((s) => s.hasKey)
  const setProviderAndKey = useIntelligenceStore((s) => s.setProviderAndKey)
  const clearKey = useIntelligenceStore((s) => s.clearKey)
  const health = useLLMHealthStore((s) => s.status)
  const setHealth = useLLMHealthStore((s) => s.setLLMHealth)

  const [open, setOpen] = useState(false)
  const [pinned, setPinned] = useState(false)
  const [keyInput, setKeyInput] = useState('')
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [message, setMessage] = useState<string | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const autoCollapseTimer = useRef<number | null>(null)

  const pill = pillFor(hasKey, health)
  const isExpanded = open || pinned

  // Click-outside closes pinned state; cleanup cancels any auto-collapse timer.
  useEffect(() => {
    if (!pinned) return
    const onDocClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) { setPinned(false); setOpen(false) }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [pinned])
  useEffect(() => () => { if (autoCollapseTimer.current !== null) window.clearTimeout(autoCollapseTimer.current) }, [])

  async function smokeTest(key: string): Promise<{ ok: true } | { ok: false; reason: string }> {
    try {
      const res = await fetch(`${GEMINI_PING_URL}?key=${encodeURIComponent(key)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'ping' }] }],
          generationConfig: { thinkingConfig: { thinkingBudget: 0 }, maxOutputTokens: 8 },
        }),
      })
      if (res.status === 200) {
        const json = (await res.json()) as { candidates?: Array<{ finishReason?: string }> }
        const finish = json?.candidates?.[0]?.finishReason
        if (finish === 'STOP' || finish === 'MAX_TOKENS') return { ok: true }
        return { ok: false, reason: 'Unexpected response — try again' }
      }
      if (res.status === 400 || res.status === 401 || res.status === 403) return { ok: false, reason: 'Invalid API key — double-check and retry' }
      if (res.status === 429) return { ok: false, reason: 'Rate-limited — wait a moment' }
      return { ok: false, reason: `Provider error (HTTP ${res.status})` }
    } catch {
      return { ok: false, reason: 'Could not reach Gemini — check connection.' }
    }
  }

  async function handleSave() {
    const trimmed = keyInput.trim()
    if (!trimmed) return
    setSaveState('saving'); setMessage(null)
    const result = await smokeTest(trimmed)
    if (!result.ok) { setSaveState('error'); setMessage(result.reason); setHealth('error'); return }
    await setProviderAndKey('gemini', trimmed, { remember: true })
    setHealth('ok'); setSaveState('ok'); setMessage('Key active'); setKeyInput('')
    autoCollapseTimer.current = window.setTimeout(() => {
      setPinned(false); setOpen(false); setSaveState('idle'); setMessage(null)
    }, 1500)
  }

  function handleClear() {
    clearKey(); setHealth('idle'); setSaveState('idle'); setMessage(null); setKeyInput('')
  }

  const subtitle = hasKey
    ? 'Current setting: BYOK (your key)'
    : 'Current setting: default (limited access)'

  return (
    <div
      ref={wrapRef}
      data-testid="byok-panel"
      className="absolute top-2 right-3 z-50 font-mono text-xs"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => !pinned && setOpen(false)}
    >
      {!isExpanded ? (
        <button
          type="button"
          data-testid="byok-panel-collapsed"
          onClick={() => {
            setOpen(true)
            setPinned(true)
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded border border-hb-border bg-hb-surface text-hb-text-primary hover:bg-hb-surface-hover transition-colors focus-visible:ring-2 focus-visible:ring-hb-accent"
          aria-label={pill.label}
        >
          {hasKey ? (
            <span className={`w-1.5 h-1.5 rounded-full ${pill.dot}`} aria-hidden="true" />
          ) : (
            <Key size={12} className="text-hb-text-muted" aria-hidden="true" />
          )}
          <span className="uppercase tracking-wide">{pill.label}</span>
        </button>
      ) : (
        <div
          data-testid="byok-panel-expanded"
          className="w-[360px] p-4 rounded border border-hb-border bg-hb-surface shadow-xl"
          onClick={() => setPinned(true)}
        >
          <h3 className="text-xs uppercase tracking-wide text-hb-text-muted mb-1">
            Add your Google LLM key
          </h3>
          <p className="text-[11px] text-hb-text-muted mb-3">{subtitle}</p>
          <input
            type="password"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder={hasKey ? 'AIza…••••' : 'AIzaSy…'}
            disabled={saveState === 'saving'}
            className="w-full px-2 py-1.5 text-sm rounded border border-hb-border bg-hb-bg text-hb-text-primary disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-hb-accent"
            aria-label="Gemini API key"
            data-testid="byok-panel-input"
          />
          <div className="flex items-center justify-between mt-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={saveState === 'saving' || !keyInput.trim()}
              className="px-3 py-1.5 text-xs rounded border border-hb-border bg-hb-bg text-hb-text-primary hover:bg-hb-surface-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-hb-accent"
              data-testid="byok-panel-save"
            >
              {saveState === 'saving' ? 'Testing…' : hasKey ? 'Update key' : 'Save & test'}
            </button>
            {message && (
              <span
                className={`text-[11px] ${saveState === 'ok' ? 'text-hb-success' : 'text-hb-error'}`}
                data-testid="byok-panel-message"
              >
                {message}
              </span>
            )}
          </div>
          <p className="mt-3 text-hb-text-faint text-[10px] leading-snug">
            Your key is stored locally only and never sent to our servers.
          </p>
          {hasKey && (
            <button
              type="button"
              onClick={handleClear}
              className="mt-2 text-[10px] text-hb-text-muted hover:text-hb-error underline-offset-2 hover:underline transition-colors"
              data-testid="byok-panel-remove"
            >
              Remove key
            </button>
          )}
        </div>
      )}
    </div>
  )
}
