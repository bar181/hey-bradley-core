import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { useConfigStore } from '../../store/configStore'
import { useUIStore } from '../../store/uiStore'
import { masterConfigSchema } from '../../lib/schemas'
import CodeMirror from '@uiw/react-codemirror'
import { json } from '@codemirror/lang-json'
import { oneDark } from '@codemirror/theme-one-dark'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Copy,
  Download,
  Upload,
  ChevronDown,
  ChevronRight,
  Palette,
  Star,
  Grid3X3,
  ArrowRight,
  Pencil,
  Check,
  X,
  type LucideIcon,
} from 'lucide-react'

const SECTION_ICONS: Record<string, LucideIcon> = {
  hero: Star,
  features: Grid3X3,
  cta: ArrowRight,
}

const DEBOUNCE_MS = 500

export function DataTab() {
  const config = useConfigStore((s) => s.config)
  const loadConfig = useConfigStore((s) => s.loadConfig)
  // DRAFT mode = Data is read-only (no inline edit affordances).
  // See plans/implementation/mvp-plan/01-phase-15-polish-kitchen-sink.md §1.1.
  const isExpert = useUIStore((s) => s.rightPanelTab) === 'EXPERT'

  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)
  const [validationOk, setValidationOk] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({ hero: true })
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [importError, setImportError] = useState<string | null>(null)

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const jsonString = useMemo(() => JSON.stringify(config, null, 2), [config])

  // Theme block: top-level config minus sections
  const themeData = useMemo(() => {
    const { sections: _sections, ...rest } = config
    return rest
  }, [config])

  const themeJson = useMemo(() => JSON.stringify(themeData, null, 2), [themeData])

  // Section blocks
  const sectionBlocks = useMemo(
    () =>
      config.sections.map((section) => ({
        key: section.id ?? section.type,
        name: section.type,
        json: JSON.stringify(section, null, 2),
      })),
    [config.sections]
  )

  // Metadata
  const totalChars = jsonString.length
  const totalLines = jsonString.split('\n').length

  // ── Copy helpers ──
  const copyToClipboard = useCallback((text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 1500)
  }, [])

  const handleCopyAll = useCallback(() => {
    copyToClipboard(jsonString, '__all__')
  }, [jsonString, copyToClipboard])

  const handleExport = useCallback(() => {
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'hey-bradley-project.json'
    a.click()
    URL.revokeObjectURL(url)
  }, [jsonString])

  const handleImport = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string)
        const result = masterConfigSchema.safeParse(parsed)
        if (result.success) {
          loadConfig(result.data)
          setImportError(null)
        } else {
          const issues = result.error.issues.slice(0, 3).map(i => `${i.path.join('.')}: ${i.message}`).join('; ')
          setImportError(`Invalid config: ${issues}`)
        }
      } catch (err) {
        setImportError(`Invalid JSON: ${(err as Error).message}`)
      }
      // Reset input so same file can be re-imported
      e.target.value = ''
    }
    reader.readAsText(file)
  }, [loadConfig])

  // ── Toggle sections ──
  const toggleSection = useCallback((key: string) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }))
  }, [])

  // ── Edit mode ──
  const enterEdit = useCallback(() => {
    setEditValue(jsonString)
    setValidationError(null)
    setValidationOk(true)
    setIsEditing(true)
  }, [jsonString])

  const cancelEdit = useCallback(() => {
    setIsEditing(false)
    setValidationError(null)
    setValidationOk(false)
    if (debounceRef.current) clearTimeout(debounceRef.current)
  }, [])

  const handleEditorChange = useCallback(
    (value: string) => {
      setEditValue(value)
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        try {
          const parsed = JSON.parse(value)
          const result = masterConfigSchema.safeParse(parsed)
          if (result.success) {
            setValidationError(null)
            setValidationOk(true)
          } else {
            const issues = result.error.issues
              .slice(0, 3)
              .map((i) => `${i.path.join('.')}: ${i.message}`)
              .join('; ')
            setValidationError(`Validation: ${issues}`)
            setValidationOk(false)
          }
        } catch (e) {
          setValidationError(`${(e as Error).message}`)
          setValidationOk(false)
        }
      }, DEBOUNCE_MS)
    },
    []
  )

  const applyEdit = useCallback(() => {
    try {
      const parsed = JSON.parse(editValue)
      const result = masterConfigSchema.safeParse(parsed)
      if (result.success) {
        loadConfig(result.data)
        setValidationError(null)
        setValidationOk(true)
        setIsEditing(false)
      } else {
        const issues = result.error.issues
          .slice(0, 3)
          .map((i) => `${i.path.join('.')}: ${i.message}`)
          .join('; ')
        setValidationError(`Validation: ${issues}`)
        setValidationOk(false)
      }
    } catch (e) {
      setValidationError(`${(e as Error).message}`)
      setValidationOk(false)
    }
  }, [editValue, loadConfig])

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  // If user drops to DRAFT mid-edit, force read-only.
  useEffect(() => {
    if (!isExpert && isEditing) cancelEdit()
  }, [isExpert, isEditing, cancelEdit])

  const ghostBtn =
    'inline-flex items-center gap-1.5 font-mono text-xs uppercase text-hb-text-muted hover:text-hb-accent border border-hb-border rounded px-2.5 py-1 transition-colors'

  const lineCount = (s: string) => s.split('\n').length
  const charCount = (s: string) => s.length

  // ── Section header renderer ──
  function SectionHeader({
    sectionKey,
    name,
    jsonStr,
    icon: Icon,
    expanded,
  }: {
    sectionKey: string
    name: string
    jsonStr: string
    icon: LucideIcon
    expanded: boolean
  }) {
    return (
      <div className="flex items-center justify-between w-full">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="flex items-center gap-2 flex-1 py-2.5 px-3 hover:bg-hb-surface-hover rounded-md transition-colors"
        >
          {expanded ? (
            <ChevronDown size={14} className="text-hb-text-muted" />
          ) : (
            <ChevronRight size={14} className="text-hb-text-muted" />
          )}
          <Icon size={14} className="text-hb-text-muted" />
          <span className="font-mono text-xs uppercase tracking-[0.05em] text-hb-text-primary font-medium">
            {name}
          </span>
        </button>
        <div className="flex items-center gap-3 pr-3">
          <span className="font-mono text-xs text-hb-text-muted">
            {lineCount(jsonStr)} lines &middot; {charCount(jsonStr)} chars
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation()
              copyToClipboard(jsonStr, sectionKey)
            }}
            className="text-hb-text-muted hover:text-hb-text-secondary transition-colors"
            title="Copy section"
          >
            {copiedKey === sectionKey ? (
              <span className="font-mono text-xs text-hb-success">OK</span>
            ) : (
              <Copy size={14} />
            )}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full space-y-0">
      {/* ── Layer 1: Header ── */}
      <div className="space-y-3 mb-4">
        {/* Title row */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-base font-semibold text-hb-text-primary">
              Project Data Schema
            </h2>
            <p className="text-xs text-hb-text-muted">
              Synchronized Single Source of Truth (SSOT)
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* LIVE indicator */}
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-hb-success animate-pulse" />
              <span className="text-xs text-hb-success font-mono uppercase">LIVE</span>
            </div>
            {/* EDIT toggle (EXPERT only — DRAFT keeps Data read-only) */}
            {isExpert &&
              (isEditing ? (
                <button className={ghostBtn} onClick={cancelEdit}>
                  <X size={12} />
                  CANCEL
                </button>
              ) : (
                <button className={ghostBtn} onClick={enterEdit}>
                  <Pencil size={12} />
                  EDIT
                </button>
              ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button className={ghostBtn} onClick={handleCopyAll}>
            <Copy size={12} />
            {copiedKey === '__all__' ? 'COPIED!' : 'COPY ALL'}
          </button>
          <button className={ghostBtn} onClick={handleExport}>
            <Download size={12} />
            EXPORT JSON
          </button>
          {isExpert && (
            <>
              <button className={ghostBtn} onClick={handleImport}>
                <Upload size={12} />
                IMPORT JSON
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileSelect}
                className="hidden"
              />
            </>
          )}
        </div>

        {importError && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 text-xs text-red-400">
            <span>{importError}</span>
            <button onClick={() => setImportError(null)} className="text-red-400 hover:text-red-300">
              <X size={12} />
            </button>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-hb-border" />

        {/* Metadata bar */}
        <div className="flex items-center gap-6 font-mono text-xs uppercase tracking-wide text-hb-text-muted">
          <span>VERSION {config.site.version}</span>
          <span>SECTIONS {config.sections.length}</span>
          <span>TOTAL {totalChars.toLocaleString()}</span>
          <span>LINES {totalLines}</span>
        </div>
      </div>

      {/* ── Layer 2 / 3: Content ── */}
      {isEditing ? (
        /* ── Edit Mode: Full CodeMirror editor ── */
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 min-h-0 rounded-lg overflow-hidden border border-hb-border">
            <CodeMirror
              value={editValue}
              height="100%"
              extensions={[json()]}
              theme={oneDark}
              onChange={handleEditorChange}
              className="h-full"
            />
          </div>

          {validationError && (
            <Card className="mx-0 mt-2 p-3 bg-red-500/10 border-red-500/20">
              <p className="text-xs text-red-400 font-medium">Invalid JSON</p>
              <p className="text-xs text-red-400/70 mt-1">{validationError}</p>
            </Card>
          )}

          <div className="mt-2 flex items-center justify-between">
            <div className="h-5">
              {validationOk && !validationError && (
                <span className="font-mono text-xs text-hb-success">
                  &#10003; Valid &mdash; ready to apply
                </span>
              )}
            </div>
            <Button
              size="sm"
              onClick={applyEdit}
              disabled={!validationOk || !!validationError}
              className="gap-1.5"
            >
              <Check size={12} />
              Apply
            </Button>
          </div>
        </div>
      ) : (
        /* ── Read Mode: Collapsible sections ── */
        <div className="flex-1 overflow-auto space-y-1">
          {/* Theme block */}
          <div className="rounded-lg border border-hb-border overflow-hidden">
            <SectionHeader
              sectionKey="theme"
              name="Theme"
              jsonStr={themeJson}
              icon={Palette}
              expanded={expandedSections['theme'] ?? false}
            />
            {expandedSections['theme'] && (
              <div className="bg-hb-bg rounded-b-lg px-4 py-3">
                <pre className="font-mono text-[13px] text-hb-text-secondary whitespace-pre overflow-x-auto">
                  {themeJson}
                </pre>
              </div>
            )}
          </div>

          {/* Section blocks */}
          {sectionBlocks.map((block) => {
            const Icon = SECTION_ICONS[block.name] ?? ArrowRight
            const expanded = expandedSections[block.name] ?? false
            return (
              <div
                key={block.key}
                className="rounded-lg border border-hb-border overflow-hidden"
              >
                <SectionHeader
                  sectionKey={block.name}
                  name={block.name}
                  jsonStr={block.json}
                  icon={Icon}
                  expanded={expanded}
                />
                {expanded && (
                  <div className="bg-hb-bg rounded-b-lg px-4 py-3">
                    <pre className="font-mono text-[13px] text-hb-text-secondary whitespace-pre overflow-x-auto">
                      {block.json}
                    </pre>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
