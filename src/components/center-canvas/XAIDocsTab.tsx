import { useState, useMemo, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useConfigStore } from '@/store/configStore'
import { cn } from '../../lib/cn'
import { Copy, Download, Check, Compass, Layers, ListChecks, CheckSquare, FileText, Code } from 'lucide-react'
import {
  generateNorthStar,
  generateSADD,
  generateBuildPlan,
  generateFeatures,
  generateHumanSpec,
  generateAISPSpec,
} from '@/lib/specGenerators'

// ---------------------------------------------------------------------------
// Tab definitions
// ---------------------------------------------------------------------------

const SPEC_TABS = [
  { id: 'north-star', label: 'North Star', icon: Compass, generator: generateNorthStar, ext: 'md', format: 'markdown' as const },
  { id: 'architecture', label: 'Architecture', icon: Layers, generator: generateSADD, ext: 'md', format: 'markdown' as const },
  { id: 'build-plan', label: 'Build Plan', icon: ListChecks, generator: generateBuildPlan, ext: 'md', format: 'markdown' as const },
  { id: 'features', label: 'Features', icon: CheckSquare, generator: generateFeatures, ext: 'md', format: 'markdown' as const },
  { id: 'human', label: 'Human Spec', icon: FileText, generator: generateHumanSpec, ext: 'md', format: 'markdown' as const },
  { id: 'aisp', label: 'AISP Spec', icon: Code, generator: generateAISPSpec, ext: 'aisp', format: 'aisp' as const },
] as const

type TabId = typeof SPEC_TABS[number]['id']

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function XAIDocsTab() {
  const [activeTab, setActiveTab] = useState<TabId>('north-star')
  const [copied, setCopied] = useState(false)
  const config = useConfigStore((s) => s.config)

  const currentTab = SPEC_TABS.find((t) => t.id === activeTab) ?? SPEC_TABS[0]

  const specText = useMemo(
    () => currentTab.generator(config),
    [config, currentTab],
  )

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(specText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [specText])

  const handleDownload = useCallback(() => {
    const mimeType = currentTab.ext === 'aisp' ? 'text/plain' : 'text/markdown'
    const blob = new Blob([specText], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${activeTab}.${currentTab.ext}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [specText, activeTab, currentTab.ext])

  return (
    <div className="space-y-3">
      {/* Tab bar — scrollable on small screens */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-thin">
        {SPEC_TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = tab.id === activeTab
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer',
                isActive
                  ? 'bg-hb-accent text-white'
                  : 'text-hb-text-muted hover:text-hb-text-secondary hover:bg-hb-surface',
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-hb-text-muted">
          {currentTab.format === 'aisp' ? 'AISP 5.1 Crystal Atom Platinum' : 'Markdown'}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-md bg-hb-surface px-3 py-1.5 text-xs font-medium text-hb-text-secondary hover:text-hb-text-primary transition-colors cursor-pointer"
            title="Copy to clipboard"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-hb-success" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 rounded-md bg-hb-surface px-3 py-1.5 text-xs font-medium text-hb-text-secondary hover:text-hb-text-primary transition-colors cursor-pointer"
            title={`Download as .${currentTab.ext}`}
          >
            <Download className="h-3.5 w-3.5" />
            .{currentTab.ext}
          </button>
        </div>
      </div>

      {/* Spec content */}
      <div className="rounded-lg bg-hb-surface p-5 max-h-[calc(100vh-16rem)] overflow-y-auto">
        {currentTab.format === 'aisp' ? (
          <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono text-hb-text-secondary">
            <AISPHighlighted text={specText} />
          </pre>
        ) : (
          <div className="prose prose-invert dark:prose-invert max-w-none hb-spec-prose">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{specText}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  )
}

// Re-export for TopBar copy button compatibility
export { generateAISPSpec } from '@/lib/specGenerators'

// ---------------------------------------------------------------------------
// Syntax highlighting for AISP view
// ---------------------------------------------------------------------------

function AISPHighlighted({ text }: { text: string }) {
  const lines = text.split('\n')
  return (
    <>
      {lines.map((line, i) => {
        if (/^\s*[⟦⟧]\s*$/.test(line)) {
          return <span key={i} className="text-hb-accent font-bold">{line}{'\n'}</span>
        }

        const greekMatch = line.match(/^(\s*)([\u03A9\u03A3\u0393\u039B\u0395])(\s*:=\s*)(.*)$/)
        if (greekMatch) {
          const [, indent, symbol, op, rest] = greekMatch
          return (
            <span key={i}>
              {indent}
              <span className="text-hb-accent font-bold">{symbol}</span>
              <span className="text-hb-text-muted">{op}</span>
              <span className="text-hb-success">{rest}</span>
              {'\n'}
            </span>
          )
        }

        const ruleMatch = line.match(/^(\s*)((?:R|V)\d+)(:)(.*)$/)
        if (ruleMatch) {
          const [, indent, label, colon, rest] = ruleMatch
          const highlighted = rest
            .replace(/([\u2200\u2203\u27F9\u25A1\u25C7\u00AC\u2227\u2228])/g, '\x01$1\x02')
            .replace(/(VERIFY|ASSERT)/g, '\x03$1\x04')
          const parts = highlighted.split(/(\x01[^\x02]*\x02|\x03[^\x04]*\x04)/)
          return (
            <span key={i}>
              {indent}
              <span className="text-amber-400 font-semibold">{label}</span>
              <span className="text-hb-text-muted">{colon}</span>
              {parts.map((part, j) => {
                if (part.startsWith('\x01')) return <span key={j} className="text-amber-400">{part.slice(1, -1)}</span>
                if (part.startsWith('\x03')) return <span key={j} className="text-emerald-400 font-semibold">{part.slice(1, -1)}</span>
                return <span key={j} className="text-hb-text-secondary">{part}</span>
              })}
              {'\n'}
            </span>
          )
        }

        if (/^\s*%/.test(line)) {
          return <span key={i} className="text-hb-text-muted italic">{line}{'\n'}</span>
        }

        const typeMatch = line.match(/^(\s*)(\S+)(\s*:\s*)([\u1D53B\u1D53C\u1D54A\u1D54B\u1D543\u2115\u2124\u211D])(.*)$/)
        if (typeMatch) {
          const [, indent, name, colon, bbType, rest] = typeMatch
          return (
            <span key={i}>
              {indent}
              <span className="text-hb-text-primary">{name}</span>
              <span className="text-hb-text-muted">{colon}</span>
              <span className="text-cyan-400">{bbType}</span>
              <span className="text-hb-text-secondary">{rest}</span>
              {'\n'}
            </span>
          )
        }

        const assignMatch = line.match(/^(\s*)(\S+)(\s*:=\s*)(.*)$/)
        if (assignMatch) {
          const [, indent, key, op, value] = assignMatch
          return (
            <span key={i}>
              {indent}
              <span className="text-hb-text-primary">{key}</span>
              <span className="text-hb-text-muted">{op}</span>
              <span className="text-hb-success">{value}</span>
              {'\n'}
            </span>
          )
        }

        if (/[⟦⟧⟨⟩\u2200\u2203\u27F9\u25A1\u25C7\u1D53B\u1D53C\u1D54A\u1D54B\u1D543\u2115\u2124\u211D]/.test(line)) {
          const highlighted = line
            .replace(/([⟦⟧])/g, '\x01$1\x02')
            .replace(/([\u2200\u2203\u27F9\u25A1\u25C7\u00AC\u2227\u2228])/g, '\x03$1\x04')
            .replace(/([\u1D53B\u1D53C\u1D54A\u1D54B\u1D543\u2115\u2124\u211D])/g, '\x05$1\x06')
            .replace(/(VERIFY|ASSERT)/g, '\x07$1\x08')
          const parts = highlighted.split(/(\x01[^\x02]*\x02|\x03[^\x04]*\x04|\x05[^\x06]*\x06|\x07[^\x08]*\x08)/)
          return (
            <span key={i}>
              {parts.map((part, j) => {
                if (part.startsWith('\x01')) return <span key={j} className="text-hb-accent font-bold">{part.slice(1, -1)}</span>
                if (part.startsWith('\x03')) return <span key={j} className="text-amber-400">{part.slice(1, -1)}</span>
                if (part.startsWith('\x05')) return <span key={j} className="text-cyan-400">{part.slice(1, -1)}</span>
                if (part.startsWith('\x07')) return <span key={j} className="text-emerald-400 font-semibold">{part.slice(1, -1)}</span>
                return <span key={j} className="text-hb-text-secondary">{part}</span>
              })}
              {'\n'}
            </span>
          )
        }

        return <span key={i} className="text-hb-text-secondary">{line}{'\n'}</span>
      })}
    </>
  )
}

