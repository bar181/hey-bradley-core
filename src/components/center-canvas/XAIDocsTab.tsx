import { useState, useMemo, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useConfigStore } from '@/store/configStore'
import { cn } from '../../lib/cn'
import { Copy, Download, Check, Compass, Layers, ListChecks, CheckSquare, FileText } from 'lucide-react'
import {
  generateNorthStar,
  generateSADD,
  generateBuildPlan,
  generateFeatures,
  generateHumanSpec,
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
    const mimeType = 'text/markdown'
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
          Markdown
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
      {/* Spec content */}
      <div className="rounded-lg bg-hb-surface p-5 max-h-[calc(100vh-16rem)] overflow-y-auto">
        <div className="prose prose-invert dark:prose-invert max-w-none hb-spec-prose">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{specText}</ReactMarkdown>
        </div>
      </div>
    </div>
  )
}

// Re-export for TopBar copy button compatibility
export { generateAISPSpec } from '@/lib/specGenerators'

