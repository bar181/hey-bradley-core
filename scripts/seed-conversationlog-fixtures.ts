// scripts/seed-conversationlog-fixtures.ts — pre-canned ConversationLogTab seed.
// P101 / A3: regenerates tests/fixtures/conversationlog-seed.json with ~20
// LogEventInsert rows spanning the four P100 W2 scenarios so the
// ConversationLogTab drill-down surface (per request_id) renders meaningfully
// on first launch — without a running dev-server or live AgentProxy run.
//
// Run via:  npx tsx scripts/seed-conversationlog-fixtures.ts
//
// Stdlib-only Node. No new deps. Shape mirrors `LogEventInsert` from
// src/contexts/persistence/repositories/comprehensiveLogs.ts; the
// ConversationLogTab loads via getEventsForRequest(db, requestId).
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'

interface LogEventInsertSeed {
  id: string
  sessionId: string
  requestId: string
  projectId?: string
  eventType:
    | 'input_event'
    | 'intent_classification'
    | 'decomposition'
    | 'template_match'
    | 'patch_validation'
    | 'response_summary'
    | 'process_atom_output'
    | 'ddd_atom_output'
    | 'listen_capture'
    | 'multi_page_scope'
    | 'todo_execution'
    | 'decomp_split'
    | 'export_emit'
    | 'error_event'
  eventData: Record<string, unknown>
  pageId?: string
  pageIndex?: number
  inputType?: 'chat' | 'listen'
  latencyMs?: number
}

const SESSION = 's-p101-seed'

const SEED_ROWS: LogEventInsertSeed[] = [
  // Scenario 1 — Axon CLI dev (chat, single-page, INTENT+SELECTION+PATCH)
  { id: 'evt-001', sessionId: SESSION, requestId: 'req-axon-001', projectId: 'axon-cli', eventType: 'input_event',          eventData: { text: 'Create a site for my CLI tool called Axon' }, inputType: 'chat',  latencyMs: 5 },
  { id: 'evt-002', sessionId: SESSION, requestId: 'req-axon-001', projectId: 'axon-cli', eventType: 'intent_classification', eventData: { route: 'design', confidence: 0.91 },                inputType: 'chat',  latencyMs: 12 },
  { id: 'evt-003', sessionId: SESSION, requestId: 'req-axon-001', projectId: 'axon-cli', eventType: 'template_match',       eventData: { template: 'dev-tool-dark', score: 0.93 },           inputType: 'chat',  latencyMs: 18 },
  { id: 'evt-004', sessionId: SESSION, requestId: 'req-axon-001', projectId: 'axon-cli', eventType: 'patch_validation',     eventData: { patches: 7, valid: 7 },                              inputType: 'chat',  latencyMs: 23 },
  { id: 'evt-005', sessionId: SESSION, requestId: 'req-axon-001', projectId: 'axon-cli', eventType: 'response_summary',     eventData: { kind: 'design', applied: 7, latencyMs: 612 },        inputType: 'chat',  latencyMs: 612 },

  // Scenario 2 — Edge case: contradictory ask + DECOMP split
  { id: 'evt-006', sessionId: SESSION, requestId: 'req-edge-001', projectId: 'axon-cli', eventType: 'input_event',          eventData: { text: 'Add pricing AND remove pricing — also need a contact form' }, inputType: 'chat',  latencyMs: 4 },
  { id: 'evt-007', sessionId: SESSION, requestId: 'req-edge-001', projectId: 'axon-cli', eventType: 'intent_classification', eventData: { route: 'design', confidence: 0.71, flags: { contradiction: true } }, inputType: 'chat', latencyMs: 14 },
  { id: 'evt-008', sessionId: SESSION, requestId: 'req-edge-001', projectId: 'axon-cli', eventType: 'decomp_split',         eventData: { todos: 3, confidence: 0.78 },                          inputType: 'chat',  latencyMs: 21 },
  { id: 'evt-009', sessionId: SESSION, requestId: 'req-edge-001', projectId: 'axon-cli', eventType: 'todo_execution',       eventData: { applied: 2, deferred: 1, skipped: 0 },                  inputType: 'chat',  latencyMs: 32 },
  { id: 'evt-010', sessionId: SESSION, requestId: 'req-edge-001', projectId: 'axon-cli', eventType: 'response_summary',     eventData: { kind: 'decomp', applied: 2, latencyMs: 488 },           inputType: 'chat',  latencyMs: 488 },

  // Scenario 3 — Listen mode startup (voice, transcript-cleanup)
  { id: 'evt-011', sessionId: SESSION, requestId: 'req-listen-001', projectId: 'axon-cli', eventType: 'listen_capture',     eventData: { rawTranscript: 'um make the hero brighter you know', cleaned: 'make the hero brighter' }, inputType: 'listen', latencyMs: 8 },
  { id: 'evt-012', sessionId: SESSION, requestId: 'req-listen-001', projectId: 'axon-cli', eventType: 'input_event',         eventData: { text: 'make the hero brighter' },                      inputType: 'listen', latencyMs: 9 },
  { id: 'evt-013', sessionId: SESSION, requestId: 'req-listen-001', projectId: 'axon-cli', eventType: 'intent_classification', eventData: { route: 'design', confidence: 0.86 },                inputType: 'listen', latencyMs: 17 },
  { id: 'evt-014', sessionId: SESSION, requestId: 'req-listen-001', projectId: 'axon-cli', eventType: 'patch_validation',    eventData: { patches: 2, valid: 2 },                                 inputType: 'listen', latencyMs: 22 },
  { id: 'evt-015', sessionId: SESSION, requestId: 'req-listen-001', projectId: 'axon-cli', eventType: 'response_summary',    eventData: { kind: 'design', applied: 2, latencyMs: 391 },           inputType: 'listen', latencyMs: 391 },

  // Scenario 4 — Planning mode SaaS auth (PROCESS + DDD outputs persisted, P99 closure)
  { id: 'evt-016', sessionId: SESSION, requestId: 'req-plan-001', projectId: 'saas-auth', eventType: 'input_event',         eventData: { text: 'A SaaS auth product with magic link and Google OAuth' }, inputType: 'chat', latencyMs: 6 },
  { id: 'evt-017', sessionId: SESSION, requestId: 'req-plan-001', projectId: 'saas-auth', eventType: 'process_atom_output',  eventData: { phases: 4, sprints: 7, waves: 9, agents: 22 },          inputType: 'chat', latencyMs: 28 },
  { id: 'evt-018', sessionId: SESSION, requestId: 'req-plan-001', projectId: 'saas-auth', eventType: 'ddd_atom_output',      eventData: { contexts: 5, relationships: 6 },                        inputType: 'chat', latencyMs: 31 },
  { id: 'evt-019', sessionId: SESSION, requestId: 'req-plan-001', projectId: 'saas-auth', eventType: 'export_emit',          eventData: { bundleSize: 6, files: ['CLAUDE.md', 'process-map.md', 'human-spec/north-star.md', 'aisp/phase-aisp.md', 'adrs/ADR-114.md', 'agents/wave-1.md'] }, inputType: 'chat', latencyMs: 142 },
  { id: 'evt-020', sessionId: SESSION, requestId: 'req-plan-001', projectId: 'saas-auth', eventType: 'response_summary',     eventData: { kind: 'planning', applied: 0, latencyMs: 802 },         inputType: 'chat', latencyMs: 802 },
]

const OUT_PATH = join(process.cwd(), 'tests/fixtures/conversationlog-seed.json')
mkdirSync(dirname(OUT_PATH), { recursive: true })
writeFileSync(OUT_PATH, JSON.stringify(SEED_ROWS, null, 2) + '\n')
console.log(`Seeded ${SEED_ROWS.length} log_events rows → ${OUT_PATH}`)
