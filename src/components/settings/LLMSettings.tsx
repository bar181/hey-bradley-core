// Spec: plans/implementation/mvp-plan/03-phase-17-llm-provider.md §3.7
// BYOK provider/key UI for the Settings drawer.
// Wires useIntelligenceStore actions: setProviderAndKey, testConnection, clearKey.

import { useEffect, useState } from 'react'
import { Check, AlertTriangle } from 'lucide-react'
import { useIntelligenceStore } from '@/store/intelligenceStore'
import { useConfigStore } from '@/store/configStore'
import {
  maskKey,
  looksLikeAnthropicKey,
  looksLikeGoogleKey,
} from '@/contexts/intelligence/llm/keys'
import type { LLMProviderName } from '@/contexts/intelligence/llm/adapter'
import { FixtureAdapter } from '@/contexts/intelligence/llm/fixtureAdapter'
import { STEP1_FIXTURES } from '@/data/llm-fixtures/step-1'

type TestResult = 'idle' | 'ok' | 'fail'

const PROVIDER_PLACEHOLDER: Record<LLMProviderName, string> = {
  simulated: '(no key needed)',
  claude: 'sk-ant-…',
  gemini: 'AIza…',
}

export function LLMSettings() {
  const provider = useIntelligenceStore((s) => s.provider)
  const modelId = useIntelligenceStore((s) => s.modelId)
  const hasKey = useIntelligenceStore((s) => s.hasKey)
  const rememberStored = useIntelligenceStore((s) => s.rememberKey)
  const sessionUsd = useIntelligenceStore((s) => s.sessionUsd)
  const sessionTokens = useIntelligenceStore((s) => s.sessionTokens)
  const setProviderAndKey = useIntelligenceStore((s) => s.setProviderAndKey)
  const clearKey = useIntelligenceStore((s) => s.clearKey)

  const [selected, setSelected] = useState<LLMProviderName>(provider)
  const [keyInput, setKeyInput] = useState('')
  const [remember, setRemember] = useState(rememberStored)
  const [saving, setSaving] = useState(false)
  const [testResult, setTestResult] = useState<TestResult>('idle')
  const [step1Ok, setStep1Ok] = useState<string | null>(null)
  const [step1Error, setStep1Error] = useState<string | null>(null)

  useEffect(() => { setSelected(provider) }, [provider])
  useEffect(() => { setRemember(rememberStored) }, [rememberStored])

  const isSimulated = selected === 'simulated'
  const trimmed = keyInput.trim()
  const showHint = !isSimulated && trimmed.length > 0
  const formatOk =
    selected === 'claude' ? looksLikeAnthropicKey(trimmed)
    : selected === 'gemini' ? looksLikeGoogleKey(trimmed)
    : true

  const handleSave = async () => {
    setSaving(true)
    setTestResult('idle')
    try {
      await setProviderAndKey(selected, isSimulated ? '' : trimmed, { remember })
      setKeyInput('')
    } finally {
      setSaving(false)
    }
  }

  const handleTest = async () => {
    setTestResult('idle')
    // FIX 8: a Test ping should not pollute the audit log nor consume the
    // session cap budget. Use adapter.testConnection() directly.
    const adapter = useIntelligenceStore.getState().adapter
    if (!adapter) { setTestResult('fail'); return }
    const ok = await adapter.testConnection()
    setTestResult(ok ? 'ok' : 'fail')
  }

  const handleClear = () => {
    if (!window.confirm("Forget this device's API key?")) return
    clearKey()
    setKeyInput('')
    setTestResult('idle')
  }

  // Step 1 wire test: round-trips through FixtureAdapter (no real LLM) and
  // applies the resulting patch directly to configStore. Removed in Step 3.
  const handleStep1Test = async () => {
    setStep1Ok(null)
    setStep1Error(null)
    const adapter = new FixtureAdapter(STEP1_FIXTURES)
    const res = await adapter.complete({ systemPrompt: '', userPrompt: 'PHASE18_STEP1' })
    if (!res.ok) {
      setStep1Error(`Fixture call failed: ${res.error.kind}`)
      return
    }
    const env = res.json as { patches?: Array<{ op: string; path: string; value?: unknown }> }
    const patches = env.patches ?? []
    if (patches.length === 0) {
      setStep1Error('No patches in envelope.')
      return
    }
    try {
      // TODO(P18 Step 3): replace with applyPatches (atomic, validated, structuredClone).
      const state = useConfigStore.getState()
      const nextConfig = JSON.parse(JSON.stringify(state.config)) as Record<string, unknown>
      for (const patch of patches) {
        if (patch.op !== 'replace') {
          setStep1Error(`Unsupported op in Step 1: ${patch.op}`)
          return
        }
        const segments = patch.path.split('/').filter(Boolean)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let target: any = nextConfig
        for (let i = 0; i < segments.length - 1; i++) target = target[segments[i]]
        target[segments[segments.length - 1]] = patch.value
      }
      useConfigStore.setState({ config: nextConfig as typeof state.config, isDirty: true })
      setStep1Ok('Hero updated')
    } catch (e) {
      setStep1Error(e instanceof Error ? e.message : String(e))
    }
  }

  const maskedKey = trimmed.length > 0
    ? maskKey(trimmed)
    : hasKey ? '••••stored' : '—'

  return (
    <section>
      <h3 className="text-xs font-mono uppercase tracking-wide text-hb-text-muted mb-2">
        AI provider
      </h3>

      <label className="block text-xs text-hb-text-muted mb-1" htmlFor="llm-provider">Provider</label>
      <select
        id="llm-provider"
        value={selected}
        onChange={(e) => setSelected(e.target.value as LLMProviderName)}
        className="w-full px-2 py-1.5 mb-3 text-sm rounded border border-hb-border bg-hb-bg text-hb-text-primary focus-visible:ring-2 focus-visible:ring-hb-accent"
      >
        <option value="simulated">Simulated (no key)</option>
        <option value="claude">Claude (Anthropic)</option>
        <option value="gemini">Gemini (Google)</option>
      </select>

      <label className="block text-xs text-hb-text-muted mb-1" htmlFor="llm-key">API key</label>
      <input
        id="llm-key"
        type="password"
        value={keyInput}
        onChange={(e) => setKeyInput(e.target.value)}
        placeholder={PROVIDER_PLACEHOLDER[selected]}
        disabled={isSimulated}
        className="w-full px-2 py-1.5 text-sm rounded border border-hb-border bg-hb-bg text-hb-text-primary disabled:text-hb-text-muted disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-hb-accent"
        aria-label="API key"
      />
      {showHint && (
        <p className={`mt-1 text-[11px] flex items-center gap-1 ${formatOk ? 'text-green-400' : 'text-yellow-400'}`}>
          {formatOk ? <Check size={12} /> : <AlertTriangle size={12} />}
          {formatOk ? 'Format looks right' : 'Format looks unusual — double-check'}
        </p>
      )}

      <label className="flex items-center gap-2 mt-3 text-sm text-hb-text-primary">
        <input
          type="checkbox"
          checked={remember}
          onChange={(e) => setRemember(e.target.checked)}
        />
        Remember on this device
      </label>

      <div className="flex flex-wrap gap-2 mt-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-3 py-1.5 text-xs rounded border border-hb-border text-hb-text-primary bg-hb-bg hover:bg-hb-surface disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-hb-accent"
        >
          Save
        </button>
        <button
          type="button"
          onClick={handleTest}
          className="px-3 py-1.5 text-xs rounded border border-hb-border text-hb-text-primary bg-hb-bg hover:bg-hb-surface focus-visible:ring-2 focus-visible:ring-hb-accent inline-flex items-center gap-1"
        >
          Test connection
          {testResult === 'ok' && <span className="text-green-400">✓ (connected)</span>}
          {testResult === 'fail' && <span className="text-red-400">✗ (failed)</span>}
        </button>
        <button
          type="button"
          onClick={handleClear}
          disabled={!hasKey}
          className="px-3 py-1.5 text-xs rounded border border-red-500/40 text-red-400 hover:bg-red-500/10 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-red-500"
        >
          Clear
        </button>
      </div>

      <div className="mt-3 p-2 rounded border border-hb-border bg-hb-bg text-[11px] font-mono text-hb-text-muted space-y-0.5">
        <div>provider: <span className="text-hb-text-primary">{provider}</span></div>
        <div>model: <span className="text-hb-text-primary">{modelId ?? '—'}</span></div>
        <div>key: <span className="text-hb-text-primary">{maskedKey}</span></div>
        <div>
          usage: <span className="text-hb-text-primary">
            {sessionTokens.in}/{sessionTokens.out} tokens · ${sessionUsd.toFixed(4)}
          </span>
        </div>
      </div>

      <p className="mt-2 text-[11px] text-hb-text-muted leading-snug">
        Your key is held only in memory unless you tick &quot;Remember&quot;. Never shared. Stripped from .heybradley exports automatically.
      </p>

      {import.meta.env.DEV && (
        <div className="mt-4 p-2 rounded border border-dashed border-yellow-500/40 bg-yellow-500/5">
          <p className="text-[10px] uppercase tracking-wide text-yellow-400 mb-2">
            DEV — Phase 18 Step 1
          </p>
          <button
            type="button"
            onClick={handleStep1Test}
            data-testid="phase18-step1-test"
            className="px-3 py-1.5 text-xs rounded border border-hb-border text-hb-text-primary bg-hb-bg hover:bg-hb-surface focus-visible:ring-2 focus-visible:ring-hb-accent"
          >
            [Run Step 1 wire test]
          </button>
          {step1Ok && (
            <p className="mt-2 text-[11px] text-green-400" data-testid="phase18-step1-ok">
              ✓ {step1Ok}
            </p>
          )}
          {step1Error && (
            <p className="mt-2 text-[11px] text-red-400" data-testid="phase18-step1-error">
              ✗ {step1Error}
            </p>
          )}
        </div>
      )}
    </section>
  )
}
