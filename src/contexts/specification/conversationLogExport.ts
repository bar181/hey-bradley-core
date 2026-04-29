// Conversation Log exporters — MD + JSON. Sprint J P52 (Wave 3, Agent A7).
// Pure: read messages + llm_logs, merge by (session_id, created_at), serialize.
// Every value passes through redactKeyShapes (defence-in-depth, ADR-067).

import { listChatMessages, type ChatMessageRow } from '@/contexts/persistence/repositories/messages'
import { listLLMLogs, type LLMLogRow } from '@/contexts/persistence/repositories/llmLogs'
import { listSessions } from '@/contexts/persistence/repositories/sessions'
import { listProjects } from '@/contexts/persistence/repositories/projects'
import { getPersonalityId } from '@/contexts/persistence/repositories/kv'
import { redactKeyShapes } from '@/contexts/intelligence/llm/keys'

export interface ConversationLogFilter {
  sessionId?: string
  provider?: string
  personality?: string
  fromMs?: number
  toMs?: number
}

export interface ConversationTurn {
  role: ChatMessageRow['role']
  text: string
  personality: string | null
  provider: string | null
  model: string | null
  prompt_hash: string | null
  status: string | null
  created_at: number
}

export interface ConversationSession {
  id: string
  project_id: string
  started_at: number
  turns: ConversationTurn[]
}

const r = (s: string | null | undefined): string | null =>
  s == null ? null : redactKeyShapes(String(s))

/** Pair each chat_message with the nearest llm_log within ±5s; each log used once. */
function pairMessages(msgs: ChatMessageRow[], logs: LLMLogRow[]): ConversationTurn[] {
  const used = new Set<number>()
  const personality = getPersonalityId()
  return msgs.map((m): ConversationTurn => {
    let best: LLMLogRow | null = null
    let bestDelta = Number.POSITIVE_INFINITY
    for (const log of logs) {
      if (used.has(log.id)) continue
      const d = Math.abs(log.started_at - m.created_at)
      if (d < bestDelta && d <= 5_000) { best = log; bestDelta = d }
    }
    if (best) used.add(best.id)
    return {
      role: m.role, text: r(m.text) ?? '', personality,
      provider: best?.provider ?? null, model: best?.model ?? null,
      prompt_hash: best?.prompt_hash ?? null, status: best?.status ?? null,
      created_at: m.created_at,
    }
  })
}

/** Join messages + llm_logs across all projects/sessions, then apply filter. */
export function loadConversationLog(filter: ConversationLogFilter = {}): ConversationSession[] {
  const seeds: { id: string; project_id: string; started_at: number }[] = []
  for (const p of listProjects()) {
    for (const s of listSessions(p.id, 1000)) {
      if (filter.sessionId && s.id !== filter.sessionId) continue
      seeds.push({ id: s.id, project_id: p.id, started_at: s.started_at })
    }
  }
  const out: ConversationSession[] = []
  for (const s of seeds) {
    let turns = pairMessages(listChatMessages(s.id, 1000), listLLMLogs(s.id, 1000))
    if (filter.provider) turns = turns.filter((t) => t.provider === filter.provider)
    if (filter.personality) turns = turns.filter((t) => (t.personality ?? '') === filter.personality)
    if (filter.fromMs != null) turns = turns.filter((t) => t.created_at >= (filter.fromMs as number))
    if (filter.toMs != null) turns = turns.filter((t) => t.created_at <= (filter.toMs as number))
    if (turns.length > 0) out.push({ ...s, turns })
  }
  out.sort((a, b) => b.started_at - a.started_at)
  return out
}

export function exportConversationLogMarkdown(filter: ConversationLogFilter = {}): string {
  const sessions = loadConversationLog(filter)
  const lines: string[] = ['# Conversation Log', '', `_Exported ${new Date().toISOString()}_`, '']
  for (const s of sessions) {
    lines.push(`## Session ${r(s.id) ?? ''}`)
    lines.push(`- project: ${r(s.project_id) ?? ''}`)
    lines.push(`- started: ${new Date(s.started_at).toISOString()}`, '')
    for (const t of s.turns) {
      const ts = new Date(t.created_at).toISOString()
      const meta = [t.provider, t.model, t.personality, (t.prompt_hash ?? '').slice(0, 8), t.status]
        .filter(Boolean).join(' · ')
      lines.push(`### ${t.role} — ${ts}`)
      if (meta) lines.push(`> ${redactKeyShapes(meta)}`)
      lines.push('', t.text, '')
    }
  }
  return lines.join('\n')
}

export function exportConversationLogJson(filter: ConversationLogFilter = {}): string {
  const sessions = loadConversationLog(filter)
  return JSON.stringify({
    exportedAt: new Date().toISOString(),
    filter,
    sessions: sessions.map((s) => ({
      id: r(s.id), project_id: r(s.project_id), started_at: s.started_at,
      turns: s.turns.map((t) => ({
        role: t.role, text: t.text,
        personality: r(t.personality), provider: r(t.provider), model: r(t.model),
        prompt_hash: r(t.prompt_hash), status: r(t.status), created_at: t.created_at,
      })),
    })),
  }, null, 2)
}
