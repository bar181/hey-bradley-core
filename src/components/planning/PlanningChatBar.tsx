import { useState } from 'react'
import { classifyProcess, toProcessMap } from '@/contexts/intelligence/aisp/processAtom'
import { classifyContexts } from '@/contexts/intelligence/aisp/dddAtom'
import {
  classifyAgents,
  type AgentSpec,
  type WaveContext,
} from '@/contexts/intelligence/aisp/agentAtom'
import type { ProcessMap } from '@/components/planning/ProcessMapSVG'
import {
  writeLogEvent,
  newRequestId,
} from '@/contexts/persistence/repositories/comprehensiveLogs'
import { getDB } from '@/contexts/persistence/db'

export interface PlanningChatBarProps {
  /** Fired when chat input produces a new ProcessMap. */
  onProcessMapChange: (map: ProcessMap) => void
  /** P93/A6: optional raw-text relay for sibling atoms (e.g. DDD_ATOM). */
  onRawText?: (text: string) => void
  /** P97/A1: optional AGENT_ATOM enrichment relay (full AgentSpec[] across waves). */
  onAgentsChange?: (agents: AgentSpec[]) => void
  /** Optional placeholder override. */
  placeholder?: string
}

export function PlanningChatBar({
  onProcessMapChange,
  onRawText,
  onAgentsChange,
  placeholder,
}: PlanningChatBarProps) {
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim() || submitting) return
    setSubmitting(true)
    try {
      // Wave 1 baseline: rules-only classifier (deterministic).
      // Wave 2+: AgentProxy-enriched call via buildProcessAtom + parseProcessResponse.
      onRawText?.(text)
      const output = classifyProcess(text)
      const map = toProcessMap(output)
      onProcessMapChange(map)

      // P99 / A8 — persist PROCESS_ATOM + DDD_ATOM outputs to log_events
      // (closes P101 carry-forward #2). Fire-and-forget per ADR-126.
      try {
        const db = getDB()
        const reqId = newRequestId()
        writeLogEvent(db, {
          id: newRequestId(), sessionId: 'planning', requestId: reqId,
          eventType: 'process_atom_output',
          eventData: { phases: output.phases, sprints: output.sprints, waves: output.waves, rationale: output.rationale },
        })
        const dddForLog = classifyContexts(text)
        writeLogEvent(db, {
          id: newRequestId(), sessionId: 'planning', requestId: reqId,
          eventType: 'ddd_atom_output',
          eventData: { contexts: dddForLog.contexts, relationships: dddForLog.relationships, rationale: dddForLog.rationale },
        })
      } catch { /* fire-and-forget */ }

      // P97 / A1: AGENT_ATOM enrichment — fan out PROCESS_ATOM AgentScope hints
      // into full AgentSpec[] using DDD context as situational input. First
      // production call site of `classifyAgents` (closes P101 carry-forward #1).
      if (onAgentsChange) {
        const ddd = classifyContexts(text)
        const allAgents: AgentSpec[] = []
        for (const wave of output.waves) {
          const ctx: WaveContext = {
            wave,
            contexts: ddd.contexts,
            scopeHints: output.agents.filter((a) => a.waveId === wave.id),
          }
          allAgents.push(...classifyAgents(ctx).agents)
        }
        onAgentsChange(allAgents)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      data-testid="planning-chat-bar"
      className="flex flex-col gap-2 p-4 border border-[var(--hb-border)] rounded-md bg-[var(--hb-surface)]"
    >
      <label
        htmlFor="planning-chat-input"
        className="text-xs font-mono uppercase tracking-wider text-[var(--hb-text-muted)]"
      >
        Describe your project
      </label>
      <input
        id="planning-chat-input"
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder ?? 'build a SaaS with auth and payments'}
        disabled={submitting}
        data-testid="planning-chat-input"
        className="px-3 py-2 rounded border border-[var(--hb-border)] bg-[var(--hb-bg)] text-sm text-[var(--hb-text-primary)] placeholder:text-[var(--hb-text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hb-accent)] focus-visible:ring-offset-2 transition-colors duration-200 disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={!text.trim() || submitting}
        data-testid="planning-chat-submit"
        className="self-start px-4 py-2 rounded text-sm font-medium bg-[var(--hb-accent)] text-[var(--hb-bg)] hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hb-accent)] focus-visible:ring-offset-2 transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {submitting ? 'Decomposing…' : 'Decompose'}
      </button>
    </form>
  )
}
