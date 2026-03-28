import { CheckCircle2, Circle, Clock } from 'lucide-react'

interface PipelineStep {
  name: string
  status: 'done' | 'active' | 'waiting'
}

const steps: PipelineStep[] = [
  { name: 'Voice Capture', status: 'done' },
  { name: 'Intent Parsing', status: 'done' },
  { name: 'AISP Generation', status: 'active' },
  { name: 'Schema Validation', status: 'waiting' },
  { name: 'Reality Render', status: 'waiting' },
  { name: 'Edge Deploy', status: 'waiting' },
]

const statusConfig = {
  done: {
    icon: CheckCircle2,
    color: 'text-hb-success',
    subtitle: 'complete',
  },
  active: {
    icon: Circle,
    color: 'text-hb-accent',
    subtitle: 'active',
  },
  waiting: {
    icon: Clock,
    color: 'text-hb-text-muted',
    subtitle: 'waiting',
  },
}

export function WorkflowTab() {
  return (
    <div>
      {steps.map((step) => {
        const config = statusConfig[step.status]
        const Icon = config.icon
        return (
          <div
            key={step.name}
            className="flex flex-row items-center gap-3 border-b border-hb-border py-2"
          >
            <Icon className={`h-4 w-4 ${config.color}`} />
            <div>
              <div className="font-ui text-sm font-medium">{step.name}</div>
              <div className="text-xs text-hb-text-muted">
                {config.subtitle}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
