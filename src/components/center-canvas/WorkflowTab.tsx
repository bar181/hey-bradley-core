import { CheckCircle2, Circle, Clock } from 'lucide-react'
import { cn } from '../../lib/cn'

interface PipelineStep {
  name: string
  subtitle: string
  status: 'done' | 'active' | 'waiting'
}

const steps: PipelineStep[] = [
  { name: 'Voice Capture', subtitle: 'Captured 3 intents', status: 'done' },
  { name: 'Intent Parsing', subtitle: 'hero, features, cta', status: 'done' },
  { name: 'AISP Generation', subtitle: 'Generating...', status: 'active' },
  { name: 'Schema Validation', subtitle: 'Waiting', status: 'waiting' },
  { name: 'Reality Render', subtitle: 'Waiting', status: 'waiting' },
  { name: 'Edge Deploy', subtitle: 'Waiting', status: 'waiting' },
]

const statusConfig = {
  done: { icon: CheckCircle2, color: 'text-hb-success' },
  active: { icon: Circle, color: 'text-hb-accent', animate: true },
  waiting: { icon: Clock, color: 'text-hb-text-muted' },
}

const logLines = [
  '[00:01.23] voice_capture: 3 intents extracted',
  '[00:01.45] intent_parse: hero → layout.stack',
  '[00:01.46] intent_parse: features → grid.3col',
  '[00:01.47] intent_parse: cta → layout.inline',
  '[00:02.10] aisp_gen: building section tree...',
  '[00:02.34] aisp_gen: applying style tokens...',
  '[00:02.58] aisp_gen: ▓▓▓▓▓▓▓▓▓▓░░░░░ 68%',
]

export function WorkflowTab() {
  return (
    <div className="space-y-4">
      {/* Pipeline steps */}
      <div>
        {steps.map((step) => {
          const config = statusConfig[step.status]
          const Icon = config.icon
          return (
            <div
              key={step.name}
              className="flex items-center gap-3 border-b border-hb-border py-3"
            >
              <Icon
                className={cn(
                  'h-4 w-4 flex-shrink-0',
                  config.color,
                  'animate' in config && config.animate && 'animate-pulse'
                )}
              />
              <div>
                <div className="text-sm font-medium text-hb-text-primary">
                  {step.name}
                </div>
                <div className="text-xs text-hb-text-muted">
                  {step.subtitle}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Live stream output */}
      <div>
        <span className="mb-2 inline-block font-mono text-[10px] font-semibold uppercase tracking-widest text-hb-text-muted">
          LIVE STREAM OUTPUT
        </span>
        <div className="rounded-lg bg-hb-bg p-3">
          <div className="space-y-0.5 font-mono text-xs leading-relaxed text-hb-text-muted">
            {logLines.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
            <div className="animate-pulse">_</div>
          </div>
        </div>
      </div>
    </div>
  )
}
