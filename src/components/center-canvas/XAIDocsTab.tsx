import { useState, useMemo, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useConfigStore } from '@/store/configStore'
import { cn } from '../../lib/cn'
import { Copy, Download, Check, Compass, Layers, ListChecks, CheckSquare, FileText, Code, Braces } from 'lucide-react'
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
  { id: 'aisp', label: 'AISP', icon: Code, generator: generateAISPSpec, ext: 'aisp', format: 'aisp' as const },
  { id: 'json', label: 'JSON', icon: Braces, generator: null, ext: 'json', format: 'json' as const },
] as const

type TabId = typeof SPEC_TABS[number]['id']

// ---------------------------------------------------------------------------
// AISP Syntax Highlighting (from AISPTab)
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
// Component
// ---------------------------------------------------------------------------

export function XAIDocsTab() {
  const [activeTab, setActiveTab] = useState<TabId>('north-star')
  const [copied, setCopied] = useState(false)
  const config = useConfigStore((s) => s.config)

  const currentTab = SPEC_TABS.find((t) => t.id === activeTab) ?? SPEC_TABS[0]

  const specText = useMemo(
    () => {
      if (currentTab.format === 'json') return JSON.stringify(config, null, 2)
      if (currentTab.generator) return currentTab.generator(config)
      return ''
    },
    [config, currentTab],
  )

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(specText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [specText])

  const handleDownload = useCallback(() => {
    const mimeType = currentTab.format === 'json' ? 'application/json' : currentTab.format === 'aisp' ? 'text/plain' : 'text/markdown'
    const blob = new Blob([specText], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${activeTab}.${currentTab.ext}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [specText, activeTab, currentTab.ext, currentTab.format])

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
          {currentTab.format === 'aisp' ? 'AISP 5.1 Crystal Atom' : currentTab.format === 'json' ? 'JSON Config' : 'Markdown'}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-md bg-hb-surface px-3 py-1.5 text-xs font-medium text-hb-text-secondary hover:text-hb-text-primary transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-hb-accent"
            title="Copy to clipboard"
            aria-label="Copy spec to clipboard"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-hb-success" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 rounded-md bg-hb-surface px-3 py-1.5 text-xs font-medium text-hb-text-secondary hover:text-hb-text-primary transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-hb-accent"
            title={`Download as .${currentTab.ext}`}
            aria-label={`Download spec as .${currentTab.ext}`}
          >
            <Download className="h-3.5 w-3.5" />
            .{currentTab.ext}
          </button>
        </div>
      </div>

      {/* How to use this spec */}
      {activeTab === 'build-plan' && (
        <div className="rounded-lg border border-hb-accent/20 bg-hb-accent/5 px-4 py-3 flex items-start gap-3">
          <span className="text-hb-accent text-lg mt-0.5">→</span>
          <div className="text-xs text-hb-text-secondary leading-relaxed">
            <span className="font-semibold text-hb-text-primary">How to use:</span>{' '}
            Copy this Build Plan → open Claude Code → paste as your prompt with{' '}
            <span className="font-mono text-hb-accent">"Build this in React + Tailwind"</span>{' '}
            → your site is ready in minutes. The spec includes exact colors, fonts, copy, and component structure for 90%+ reproduction.
          </div>
        </div>
      )}
      {/* AISP info banner */}
      {activeTab === 'aisp' && (
        <div className="rounded-lg border border-hb-accent/20 bg-hb-accent/5 px-4 py-3 flex items-start gap-3">
          <span className="text-hb-accent text-lg mt-0.5">{'\u2192'}</span>
          <div className="text-xs text-hb-text-secondary leading-relaxed">
            <span className="font-semibold text-hb-text-primary">AISP Crystal Atom:</span>{' '}
            Machine-parseable spec with {'<'}2% ambiguity. Paste into Claude Code for precise reproduction.{' '}
            <a href="https://github.com/bar181/aisp-open-core" target="_blank" rel="noopener noreferrer" className="text-hb-accent hover:underline">Learn more</a>
          </div>
        </div>
      )}
      {/* Spec content */}
      <div className="rounded-lg bg-hb-surface p-5 max-h-[calc(100vh-16rem)] overflow-y-auto">
        {currentTab.format === 'aisp' ? (
          <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono text-hb-text-secondary">
            <AISPHighlighted text={specText} />
          </pre>
        ) : currentTab.format === 'json' ? (
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

// Re-export for TopBar copy button compatibility
export { generateAISPSpec } from '@/lib/specGenerators'

