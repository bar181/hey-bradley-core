import { useState, useCallback, useRef, useEffect } from 'react'
import { useConfigStore } from '../../store/configStore'
import { masterConfigSchema } from '../../lib/schemas'

function colorize(line: string): string {
  return line
    .replace(/"([^"]+)"(?=\s*:)/g, '<span class="text-blue-400">"$1"</span>')
    .replace(/"([^"]*)"/g, '<span class="text-green-400">"$1"</span>')
    .replace(/\b(\d+\.?\d*)\b/g, '<span class="text-amber-400">$1</span>')
    .replace(/\b(true|false)\b/g, '<span class="text-purple-400">$1</span>')
    .replace(/\bnull\b/g, '<span class="text-slate-500">null</span>')
}

function highlightJSON(json: string): React.ReactNode[] {
  const lines = json.split('\n')
  return lines.map((line, i) => (
    <div key={i} className="flex">
      <span className="w-8 text-right text-slate-600 select-none border-r border-hb-border pr-2 mr-3 flex-shrink-0">
        {i + 1}
      </span>
      <span dangerouslySetInnerHTML={{ __html: colorize(line) }} />
    </div>
  ))
}

export function DataTab() {
  const config = useConfigStore((s) => s.config)
  const loadConfig = useConfigStore((s) => s.loadConfig)

  const [editing, setEditing] = useState(false)
  const [editText, setEditText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const jsonString = JSON.stringify(config, null, 2)

  useEffect(() => {
    if (editing && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [editing])

  const handleEdit = useCallback(() => {
    setEditText(jsonString)
    setError(null)
    setEditing(true)
  }, [jsonString])

  const handleCancel = useCallback(() => {
    setEditing(false)
    setError(null)
  }, [])

  const handleSave = useCallback(() => {
    try {
      const parsed = JSON.parse(editText)
      const result = masterConfigSchema.safeParse(parsed)
      if (result.success) {
        loadConfig(result.data)
        setEditing(false)
        setError(null)
      } else {
        const issues = result.error.issues.map((i) => i.message).join('; ')
        setError(`Validation failed: ${issues}`)
      }
    } catch (e) {
      setError(`Invalid JSON: ${(e as Error).message}`)
    }
  }, [editText, loadConfig])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        handleSave()
      }
    },
    [handleSave]
  )

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(jsonString)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }, [jsonString])

  const handleExport = useCallback(() => {
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'config.json'
    a.click()
    URL.revokeObjectURL(url)
  }, [jsonString])

  const buttonClass =
    'font-mono text-[11px] uppercase text-hb-text-muted hover:text-hb-accent border border-hb-border rounded px-2.5 py-1 transition-colors'

  return (
    <div className="space-y-0">
      {/* Top bar */}
      <div className="flex justify-between items-center mb-3">
        <span className="font-mono text-[11px] uppercase tracking-wide text-hb-text-muted">
          DATA
        </span>
        <div className="flex gap-2">
          <button className={buttonClass} onClick={handleCopy}>
            {copied ? 'Copied!' : 'COPY'}
          </button>
          <button className={buttonClass} onClick={handleExport}>
            EXPORT
          </button>
          {editing ? (
            <>
              <button className={buttonClass} onClick={handleCancel}>
                CANCEL
              </button>
              <button className={buttonClass} onClick={handleSave}>
                SAVE
              </button>
            </>
          ) : (
            <button className={buttonClass} onClick={handleEdit}>
              EDIT
            </button>
          )}
        </div>
      </div>

      {/* Content area */}
      <div className="bg-hb-surface rounded-lg overflow-auto">
        {editing ? (
          <div className="p-4">
            <textarea
              ref={textareaRef}
              className="w-full h-[500px] bg-hb-surface font-mono text-[13px] leading-relaxed text-slate-200 resize-y border border-hb-border rounded p-3 outline-none focus:border-hb-accent"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              spellCheck={false}
            />
            {error && (
              <p className="text-hb-error text-xs mt-2">{error}</p>
            )}
          </div>
        ) : (
          <pre className="font-mono text-[13px] leading-relaxed p-4">
            {highlightJSON(jsonString)}
          </pre>
        )}
      </div>
    </div>
  )
}
