import { useState, useMemo, useCallback, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useConfigStore } from '@/store/configStore'
import { useUIStore } from '@/store/uiStore'
import { cn } from '../../lib/cn'
import { Copy, Download, Check, Compass, Layers, ListChecks, CheckSquare, FileText, Code, Braces, ChevronDown, X } from 'lucide-react'
import {
  generateNorthStar,
  generateSADD,
  generateBuildPlan,
  generateFeatures,
  generateHumanSpec,
  generateAISPSpec,
} from '@/lib/specGenerators'

// ---------------------------------------------------------------------------
// Card definitions
// ---------------------------------------------------------------------------

const CARDS = [
  { id: 'north-star', label: 'North Star', desc: 'Vision and goals', icon: Compass, generator: generateNorthStar, ext: 'md', format: 'markdown' as const, color: 'text-blue-400' },
  { id: 'build-plan', label: 'Build Plan', desc: 'Step-by-step implementation', icon: ListChecks, generator: generateBuildPlan, ext: 'md', format: 'markdown' as const, color: 'text-emerald-400' },
  { id: 'aisp', label: 'AISP Crystal Atom', desc: 'Machine-parseable spec (<2% ambiguity)', icon: Code, generator: generateAISPSpec, ext: 'aisp', format: 'aisp' as const, color: 'text-amber-400' },
  { id: 'architecture', label: 'Architecture', desc: 'Technical structure', icon: Layers, generator: generateSADD, ext: 'md', format: 'markdown' as const, color: 'text-purple-400' },
  { id: 'features', label: 'Features', desc: 'Capability checklist', icon: CheckSquare, generator: generateFeatures, ext: 'md', format: 'markdown' as const, color: 'text-cyan-400' },
  { id: 'human', label: 'Specifications', desc: 'Human-readable spec', icon: FileText, generator: generateHumanSpec, ext: 'md', format: 'markdown' as const, color: 'text-rose-400' },
  { id: 'json', label: 'JSON Config', desc: 'Raw configuration data', icon: Braces, generator: null, ext: 'json', format: 'json' as const, color: 'text-gray-400' },
] as const

type CardId = typeof CARDS[number]['id']

// ---------------------------------------------------------------------------
// AISP Syntax Highlighting
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
          const symbolColor =
            symbol === '\u03A9' ? 'text-purple-400' :
            symbol === '\u03A3' ? 'text-blue-400' :
            symbol === '\u0393' ? 'text-green-400' :
            symbol === '\u039B' ? 'text-orange-400' :
            symbol === '\u0395' ? 'text-red-400' :
            'text-hb-accent'
          return (
            <span key={i}>
              {indent}
              <span className={`${symbolColor} font-bold`}>{symbol}</span>
              <span className="text-hb-text-muted">{op}</span>
              <span className="text-hb-success">{rest}</span>
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
        if (/^\s*%/.test(line)) {
          return <span key={i} className="text-hb-text-muted italic">{line}{'\n'}</span>
        }
        return <span key={i} className="text-hb-text-secondary">{line}{'\n'}</span>
      })}
    </>
  )
}

// ---------------------------------------------------------------------------
// Component — Card layout
// ---------------------------------------------------------------------------

export function XAIDocsTab() {
  const [expandedCard, setExpandedCard] = useState<CardId | null>(null)
  const [copied, setCopied] = useState(false)
  const config = useConfigStore((s) => s.config)
  const hasSections = config.sections.some((s) => s.enabled)

  const activePageId = useUIStore((s) => s.activePageId)
  const isMultiPage = !!(config.pages && config.pages.length > 1)
  const [pageScope, setPageScope] = useState<string | null>(activePageId)
  useEffect(() => { if (activePageId) setPageScope(activePageId) }, [activePageId])

  const scopedConfig = useMemo(() => {
    if (!isMultiPage || !config.pages) return config
    const id = pageScope ?? activePageId ?? config.pages[0]?.id
    const page = config.pages.find((p) => p.id === id) ?? config.pages[0]
    return page ? { ...config, sections: page.sections } : config
  }, [config, isMultiPage, pageScope, activePageId])

  const currentCard = CARDS.find((c) => c.id === expandedCard)

  const specText = useMemo(() => {
    if (!currentCard) return ''
    if (currentCard.format === 'json') return JSON.stringify(scopedConfig, null, 2)
    if (currentCard.generator) return currentCard.generator(scopedConfig)
    return ''
  }, [scopedConfig, currentCard])

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(specText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [specText])

  const handleDownload = useCallback(() => {
    if (!currentCard) return
    const mimeType = currentCard.format === 'json' ? 'application/json' : currentCard.format === 'aisp' ? 'text/plain' : 'text/markdown'
    const blob = new Blob([specText], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${expandedCard}.${currentCard.ext}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [specText, expandedCard, currentCard])

  // Empty state
  if (!hasSections) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-sm text-hb-text-muted font-medium">Add sections to generate specs.</p>
          <p className="text-xs text-hb-text-muted/60 mt-1.5">Your specs will appear here as you build.</p>
        </div>
      </div>
    )
  }

  // Expanded view — single card content
  if (expandedCard && currentCard) {
    return (
      <div className="space-y-3">
        {/* Header with back button */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setExpandedCard(null)}
            className="inline-flex items-center gap-2 text-sm text-hb-text-muted hover:text-hb-text-primary transition-colors"
          >
            <X className="w-4 h-4" /> Back to cards
          </button>
          <div className="flex items-center gap-2">
            {isMultiPage && config.pages && (
              <select
                data-testid="spec-page-scope"
                value={pageScope ?? activePageId ?? config.pages[0]?.id ?? ''}
                onChange={(e) => setPageScope(e.target.value)}
                className="rounded-md bg-hb-surface border border-hb-border px-2 py-1 text-xs text-hb-text-secondary"
              >
                {config.pages.map((p) => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            )}
            <button onClick={handleCopy} className="flex items-center gap-1.5 rounded-md bg-hb-surface px-3 py-1.5 text-xs font-medium text-hb-text-secondary hover:text-hb-text-primary transition-colors">
              {copied ? <Check className="h-3.5 w-3.5 text-hb-success" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button onClick={handleDownload} className="flex items-center gap-1.5 rounded-md bg-hb-surface px-3 py-1.5 text-xs font-medium text-hb-text-secondary hover:text-hb-text-primary transition-colors">
              <Download className="h-3.5 w-3.5" /> .{currentCard.ext}
            </button>
          </div>
        </div>

        {/* Card title */}
        <div className="flex items-center gap-2">
          <currentCard.icon className={cn('w-5 h-5', currentCard.color)} />
          <h3 className="text-lg font-semibold">{currentCard.label}</h3>
        </div>

        {/* Content */}
        <div className="rounded-lg bg-hb-surface p-5 max-h-[calc(100vh-16rem)] overflow-y-auto">
          {currentCard.format === 'aisp' ? (
            <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono text-hb-text-secondary">
              <AISPHighlighted text={specText} />
            </pre>
          ) : currentCard.format === 'json' ? (
            <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono text-hb-text-secondary">
              {specText}
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

  // Card grid
  return (
    <div className="space-y-4">
      <p className="text-xs text-hb-text-muted">Click a card to view and export the generated spec.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {CARDS.map((card) => {
          const Icon = card.icon
          return (
            <button
              key={card.id}
              onClick={() => setExpandedCard(card.id)}
              className="group text-left p-5 rounded-xl bg-hb-surface border border-hb-border hover:border-hb-accent/40 hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <Icon className={cn('w-6 h-6', card.color)} />
                <ChevronDown className="w-4 h-4 text-hb-text-muted group-hover:text-hb-accent transition-colors -rotate-90" />
              </div>
              <h3 className="text-sm font-semibold mb-1 group-hover:text-hb-accent transition-colors">{card.label}</h3>
              <p className="text-xs text-hb-text-muted leading-relaxed">{card.desc}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// Re-export for TopBar copy button compatibility
export { generateAISPSpec } from '@/lib/specGenerators'
