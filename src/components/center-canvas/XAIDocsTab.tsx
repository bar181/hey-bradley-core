import { useState, useMemo, useCallback } from 'react'
import { useConfigStore } from '@/store/configStore'
import { cn } from '../../lib/cn'
import { Copy, Download, Check } from 'lucide-react'
import type { MasterConfig } from '@/lib/schemas'

type DocsMode = 'HUMAN' | 'AISP'

// ---------------------------------------------------------------------------
// Section type -> human-readable label
// ---------------------------------------------------------------------------

const SECTION_LABELS: Record<string, string> = {
  hero: 'Main Banner',
  columns: 'Columns',
  action: 'Action Block',
  pricing: 'Pricing',
  footer: 'Footer',
  quotes: 'Quotes',
  questions: 'Questions',
  numbers: 'Numbers',
  menu: 'Top Menu',
  gallery: 'Gallery',
  image: 'Image',
  divider: 'Spacer',
  text: 'Text',
  logos: 'Logo Cloud',
  team: 'Team',
}

// ---------------------------------------------------------------------------
// Generators
// ---------------------------------------------------------------------------

function summarizeComponent(comp: { id: string; type: string; enabled: boolean; props?: Record<string, unknown> }): string | null {
  if (!comp.enabled) return null
  const p = comp.props ?? {}
  const text = p.text as string | undefined
  const name = p.name as string | undefined
  const heading = p.heading as string | undefined
  const caption = p.caption as string | undefined
  const role = p.role as string | undefined
  const url = p.url as string | undefined
  const imageUrl = p.imageUrl as string | undefined

  if (text) return `"${text}"`
  if (name && role) return `${name} (${role})`
  if (name) return name
  if (heading) return `"${heading}"`
  if (caption) return caption
  if (url) return url
  if (imageUrl) return '[image]'
  return null
}

function generateHumanSpec(config: MasterConfig): string {
  const { site, theme, sections } = config
  const enabled = sections.filter((s) => s.enabled)
  const disabled = sections.filter((s) => !s.enabled)

  let spec = `# Hey Bradley Specification`
  if (site.title) spec += `: ${site.title}`
  spec += `\n\n`

  // Overview
  spec += `## Overview\n`
  spec += `- **Theme:** ${theme.preset || '(default)'}\n`
  spec += `- **Mode:** ${theme.mode}\n`
  spec += `- **Font:** ${theme.typography?.fontFamily || 'Inter'}\n`
  if (theme.typography?.headingFamily && theme.typography.headingFamily !== theme.typography.fontFamily) {
    spec += `- **Heading Font:** ${theme.typography.headingFamily}\n`
  }
  if (theme.borderRadius) spec += `- **Border Radius:** ${theme.borderRadius}\n`
  if (theme.palette) {
    spec += `- **Palette:** bg ${theme.palette.bgPrimary}, accent ${theme.palette.accentPrimary}\n`
  }
  spec += `\n`

  // Site info
  if (site.author || site.email || site.domain) {
    spec += `## Site Info\n`
    if (site.author) spec += `- **Author:** ${site.author}\n`
    if (site.email) spec += `- **Email:** ${site.email}\n`
    if (site.domain) spec += `- **Domain:** ${site.domain}\n`
    if (site.project) spec += `- **Project:** ${site.project}\n`
    spec += `\n`
  }

  // Page structure
  spec += `## Page Structure\n`
  enabled.forEach((s, i) => {
    const label = SECTION_LABELS[s.type] || s.type
    const variant = s.variant ? ` | variant: ${s.variant}` : ''
    const compCount = s.components?.filter((c) => c.enabled).length ?? 0
    const compNote = compCount > 0 ? ` | ${compCount} component${compCount > 1 ? 's' : ''}` : ''
    spec += `${i + 1}. **${label}**${variant}${compNote}\n`
  })
  if (disabled.length > 0) {
    spec += `\n_Disabled:_ ${disabled.map((s) => SECTION_LABELS[s.type] || s.type).join(', ')}\n`
  }
  spec += `\n`

  // Section details
  spec += `## Section Details\n`
  enabled.forEach((s) => {
    const label = SECTION_LABELS[s.type] || s.type
    spec += `### ${label}\n`
    if (s.variant) spec += `- **Variant:** ${s.variant}\n`
    if (s.layout) {
      const parts: string[] = []
      if (s.layout.display) parts.push(`display: ${s.layout.display}`)
      if (s.layout.columns) parts.push(`columns: ${s.layout.columns}`)
      if (s.layout.gap) parts.push(`gap: ${s.layout.gap}`)
      if (parts.length > 0) spec += `- **Layout:** ${parts.join(', ')}\n`
    }

    const activeComps = (s.components ?? []).filter((c) => c.enabled)
    if (activeComps.length > 0) {
      spec += `- **Components:**\n`
      activeComps.forEach((c) => {
        const summary = summarizeComponent(c)
        spec += `  - \`${c.id}\` (${c.type})${summary ? ` — ${summary}` : ''}\n`
      })
    }
    spec += `\n`
  })

  return spec.trimEnd() + '\n'
}

function generateAISPSpec(config: MasterConfig): string {
  const { theme, sections } = config
  const enabled = sections.filter((s) => s.enabled)
  const p = theme.palette

  // Crystal Atom: ⟦Ω, Σ, Γ, Λ, Ε⟧ — Platinum tier (<2% ambiguity)
  let spec = `% AISP v1.2 | Crystal Atom Platinum | <2% ambiguity target\n`
  spec += `⟦\n`
  spec += `  Ω := { Render marketing website: ${enabled.length} sections, theme:${theme.preset}, mode:${theme.mode} }\n`
  spec += `  Σ := {\n`
  spec += `    Page : 𝕋 := ⟨Section⟩ 𝕃,\n`
  spec += `    Section : 𝕋 := { type:𝕊, variant:𝕊, layout:Layout, style:Style, components:Component 𝕃 },\n`
  spec += `    Layout : 𝕋 := { display:𝕊, columns:ℕ, gap:𝕊 },\n`
  spec += `    Style : 𝕋 := { background:𝕊, color:𝕊 },\n`
  spec += `    Component : 𝕋 := { id:𝕊, type:𝕊, enabled:𝔹, props:Map⟨𝕊,𝕊⟩ },\n`
  spec += `    Palette : 𝕋 := { bg₁:𝕊, bg₂:𝕊, txt₁:𝕊, txt₂:𝕊, acc₁:𝕊, acc₂:𝕊 }\n`
  spec += `  }\n`
  spec += `  Γ := {\n`
  spec += `    R1: ∀ s∈Page : s.enabled=⊤ ⟹ render(s),\n`
  spec += `    R2: ∀ s∈Page : s.type∈{${enabled.map(s => s.type).filter((v,i,a) => a.indexOf(v)===i).join(',')}},\n`
  spec += `    R3: ∀ c∈s.components : c.enabled=⊤ ⟹ display(c),\n`
  spec += `    R4: □ mobile_responsive ∧ □ theme_colors_applied\n`
  spec += `  }\n`
  spec += `  Λ := {\n`
  spec += `    theme := ${theme.preset},\n`
  spec += `    mode := ${theme.mode},\n`
  spec += `    font := "${theme.typography?.fontFamily || 'DM Sans'}",\n`
  if (p) {
    spec += `    palette := ⟨${p.bgPrimary}, ${p.bgSecondary}, ${p.textPrimary}, ${p.textSecondary}, ${p.accentPrimary}, ${p.accentSecondary}⟩,\n`
  }
  spec += `    sections := [\n`
  enabled.forEach((s, i) => {
    const comps = (s.components ?? []).filter(c => c.enabled)
    const compSummary = comps.slice(0, 4).map(c => {
      const t = (c.props?.text as string) || (c.props?.name as string) || c.id
      return `${c.id}:"${t.slice(0, 30)}"`
    }).join(', ')
    spec += `      ⟨${s.type}, ${s.variant || 'default'}, cols:${(s.layout as any)?.columns ?? '-'}, [${compSummary}]⟩${i < enabled.length - 1 ? ',' : ''}\n`
  })
  spec += `    ]\n`
  spec += `  }\n`
  spec += `  Ε := {\n`
  spec += `    V1: VERIFY ∀ s∈Page : render(s) ≠ ⊥,\n`
  spec += `    V2: VERIFY palette_contrast(txt₁, bg₁) ≥ 4.5,\n`
  spec += `    V3: VERIFY responsive(375px) ∧ responsive(1440px),\n`
  spec += `    V4: VERIFY |sections| = ${enabled.length}\n`
  spec += `  }\n`
  spec += `⟧\n`
  spec += `% Generated by Hey Bradley | spec: aisp-1.2 | tier: platinum\n`

  return spec
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function XAIDocsTab() {
  const [mode, setMode] = useState<DocsMode>('HUMAN')
  const [copied, setCopied] = useState(false)
  const config = useConfigStore((s) => s.config)

  const specText = useMemo(
    () => (mode === 'HUMAN' ? generateHumanSpec(config) : generateAISPSpec(config)),
    [config, mode],
  )

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(specText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [specText])

  const handleDownload = useCallback(() => {
    const ext = mode === 'HUMAN' ? 'md' : 'aisp'
    const mimeType = mode === 'HUMAN' ? 'text/markdown' : 'text/plain'
    const blob = new Blob([specText], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `spec.${ext}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [specText, mode])

  return (
    <div className="space-y-4">
      {/* Top bar: toggle + actions */}
      <div className="flex items-center justify-between">
        {/* Segmented pill toggle */}
        <div className="inline-flex rounded-lg bg-hb-surface p-0.5">
          <button
            onClick={() => setMode('HUMAN')}
            className={cn(
              'rounded-md px-4 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer',
              mode === 'HUMAN'
                ? 'bg-hb-accent text-white'
                : 'text-hb-text-muted hover:text-hb-text-secondary',
            )}
          >
            Human
          </button>
          <button
            onClick={() => setMode('AISP')}
            className={cn(
              'rounded-md px-4 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer',
              mode === 'AISP'
                ? 'bg-hb-accent text-white'
                : 'text-hb-text-muted hover:text-hb-text-secondary',
            )}
          >
            AISP
          </button>
        </div>

        {/* Action buttons */}
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
            title={`Download as .${mode === 'HUMAN' ? 'md' : 'aisp'}`}
          >
            <Download className="h-3.5 w-3.5" />
            .{mode === 'HUMAN' ? 'md' : 'aisp'}
          </button>
        </div>
      </div>

      {/* Spec content */}
      <div className="rounded-lg bg-hb-surface p-5 max-h-[calc(100vh-14rem)] overflow-y-auto">
        <pre
          className={cn(
            'whitespace-pre-wrap text-sm leading-relaxed',
            mode === 'AISP'
              ? 'font-mono text-hb-text-secondary'
              : 'font-sans text-hb-text-secondary',
          )}
        >
          {mode === 'AISP' ? (
            <AISPHighlighted text={specText} />
          ) : (
            <HumanHighlighted text={specText} />
          )}
        </pre>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Syntax highlighting for AISP view
// ---------------------------------------------------------------------------

function AISPHighlighted({ text }: { text: string }) {
  const lines = text.split('\n')
  return (
    <>
      {lines.map((line, i) => {
        // Crystal Atom delimiters
        if (/^\s*[⟦⟧]\s*$/.test(line)) {
          return <span key={i} className="text-hb-accent font-bold">{line}{'\n'}</span>
        }

        // Greek symbol definitions (Ω, Σ, Γ, Λ, Ε) := ...
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

        // Rule/verification labels (R1:, V1:, etc.)
        const ruleMatch = line.match(/^(\s*)((?:R|V)\d+)(:)(.*)$/)
        if (ruleMatch) {
          const [, indent, label, colon, rest] = ruleMatch
          // Highlight logical operators within rule text
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

        // Comment lines (% ...)
        if (/^\s*%/.test(line)) {
          return <span key={i} className="text-hb-text-muted italic">{line}{'\n'}</span>
        }

        // Lines with type declarations using blackboard bold
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

        // Key := value lines
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

        // Lines containing Crystal Atom brackets, logical operators, or blackboard bold
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

        // Default
        return <span key={i} className="text-hb-text-secondary">{line}{'\n'}</span>
      })}
    </>
  )
}

// ---------------------------------------------------------------------------
// Syntax highlighting for HUMAN (markdown) view
// ---------------------------------------------------------------------------

function HumanHighlighted({ text }: { text: string }) {
  const lines = text.split('\n')
  return (
    <>
      {lines.map((line, i) => {
        // Headings
        if (line.startsWith('# ')) {
          return <span key={i} className="text-hb-text-primary font-bold text-base">{line}{'\n'}</span>
        }
        if (line.startsWith('## ')) {
          return <span key={i} className="text-hb-text-primary font-semibold">{line}{'\n'}</span>
        }
        if (line.startsWith('### ')) {
          return <span key={i} className="text-hb-accent font-medium">{line}{'\n'}</span>
        }
        // Numbered list items
        if (/^\d+\.\s/.test(line)) {
          return <span key={i} className="text-hb-text-secondary">{line}{'\n'}</span>
        }
        // Bold bullet items
        if (line.match(/^-\s\*\*/)) {
          return <span key={i} className="text-hb-text-secondary">{line}{'\n'}</span>
        }
        // Italic disabled line
        if (line.startsWith('_Disabled:_')) {
          return <span key={i} className="text-hb-text-muted italic">{line}{'\n'}</span>
        }
        // Component sub-items
        if (line.match(/^\s+-\s`/)) {
          return <span key={i} className="text-hb-text-muted">{line}{'\n'}</span>
        }
        return <span key={i}>{line}{'\n'}</span>
      })}
    </>
  )
}
