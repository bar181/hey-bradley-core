import { cn } from '../../lib/cn'

const jsonLines = [
  { line: '{', indent: 0 },
  { line: null, indent: 1, key: '"spec"', value: '"aisp-1.2"', type: 'string' as const, comma: true },
  { line: null, indent: 1, key: '"page"', value: '"index"', type: 'string' as const, comma: true },
  { line: null, indent: 1, key: '"version"', value: '"1.0.0-RC1"', type: 'string' as const, comma: true },
  { line: null, indent: 1, key: '"sections"', value: '[', type: 'bracket' as const, comma: false },
  { line: null, indent: 2, value: '{', type: 'bracket' as const, comma: false },
  { line: null, indent: 3, key: '"id"', value: '"hero"', type: 'string' as const, comma: true },
  { line: null, indent: 3, key: '"type"', value: '"layout.stack"', type: 'string' as const, comma: true },
  { line: null, indent: 3, key: '"priority"', value: '1', type: 'number' as const, comma: true },
  { line: null, indent: 3, key: '"content"', value: '{', type: 'bracket' as const, comma: false },
  { line: null, indent: 4, key: '"headline"', value: '"Ship Code at the Speed of Thought"', type: 'string' as const, comma: true },
  { line: null, indent: 4, key: '"subtitle"', value: '"Build AI-native experiences"', type: 'string' as const, comma: true },
  { line: null, indent: 4, key: '"cta_primary"', value: '"Get Started"', type: 'string' as const, comma: true },
  { line: null, indent: 4, key: '"cta_secondary"', value: '"View my work"', type: 'string' as const, comma: false },
  { line: null, indent: 3, value: '}', type: 'bracket' as const, comma: true },
  { line: null, indent: 3, key: '"style"', value: '{', type: 'bracket' as const, comma: false },
  { line: null, indent: 4, key: '"gap"', value: '"2u"', type: 'string' as const, comma: true },
  { line: null, indent: 4, key: '"padding"', value: '"4u"', type: 'string' as const, comma: true },
  { line: null, indent: 4, key: '"maxWidth"', value: '1200', type: 'number' as const, comma: true },
  { line: null, indent: 4, key: '"breakpoint"', value: '"md:6col lg:12col"', type: 'string' as const, comma: false },
  { line: null, indent: 3, value: '}', type: 'bracket' as const, comma: false },
  { line: null, indent: 2, value: '}', type: 'bracket' as const, comma: false },
  { line: null, indent: 1, value: ']', type: 'bracket' as const, comma: false },
  { line: '}', indent: 0 },
]

function renderLine(entry: (typeof jsonLines)[number], lineNum: number) {
  const indent = '  '.repeat(entry.indent)

  if (entry.line !== undefined && entry.line !== null) {
    return (
      <div key={lineNum} className="flex">
        <span className="inline-block w-8 select-none pr-4 text-right text-hb-text-muted">
          {lineNum}
        </span>
        <span className="text-hb-text-muted">{indent}{entry.line}</span>
      </div>
    )
  }

  if (entry.key) {
    return (
      <div key={lineNum} className="flex">
        <span className="inline-block w-8 select-none pr-4 text-right text-hb-text-muted">
          {lineNum}
        </span>
        <span>
          <span className="text-hb-text-muted">{indent}</span>
          <span className="text-hb-accent">{entry.key}</span>
          <span className="text-hb-text-muted">: </span>
          <span
            className={cn(
              entry.type === 'string' && 'text-hb-success',
              entry.type === 'number' && 'text-hb-warning',
              entry.type === 'bracket' && 'text-hb-text-muted'
            )}
          >
            {entry.value}
          </span>
          {entry.comma && <span className="text-hb-text-muted">,</span>}
        </span>
      </div>
    )
  }

  return (
    <div key={lineNum} className="flex">
      <span className="inline-block w-8 select-none pr-4 text-right text-hb-text-muted">
        {lineNum}
      </span>
      <span className="text-hb-text-muted">
        {indent}{entry.value}{entry.comma ? ',' : ''}
      </span>
    </div>
  )
}

export function DataTab() {
  return (
    <div className="space-y-0">
      {/* Top bar */}
      <div className="flex items-center justify-between rounded-t-lg border border-hb-border bg-hb-surface px-4 py-2">
        <span className="font-mono text-xs font-medium uppercase tracking-wider text-hb-text-muted">
          DATA
        </span>
        <div className="flex gap-2">
          <button className="rounded border border-hb-border px-2 py-0.5 font-mono text-xs text-hb-text-muted transition-colors hover:text-hb-accent">
            COPY
          </button>
          <button className="rounded border border-hb-border px-2 py-0.5 font-mono text-xs text-hb-text-muted transition-colors hover:text-hb-accent">
            EXPORT
          </button>
        </div>
      </div>

      {/* Code area */}
      <div className="rounded-b-lg border border-t-0 border-hb-border bg-hb-surface p-4">
        <pre className="font-mono text-sm leading-relaxed">
          {jsonLines.map((entry, i) => renderLine(entry, i + 1))}
        </pre>
      </div>
    </div>
  )
}
