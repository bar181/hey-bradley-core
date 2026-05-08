/**
 * P100 W2 / A6 — Scenario 4 fixture: Planning-mode SaaS auth system.
 * SIMULATION-ONLY: 10-prompt sequence; rows the wired pipeline (W1 /
 * migration 005) WOULD have written. PROCESS + DDD + AGENT atoms fire;
 * final output is a `.md` bundle per ADR-122. edit_history is NOT
 * exercised (planning mode is read-emit, not patch-apply).
 * Cross-refs: ADR-053 INTENT, ADR-118 PROCESS, ADR-119 DDD, ADR-120 AGENT,
 *             ADR-121 SpecWorkbench, ADR-122 Export Claude Code.
 */

export type ScenarioMode = 'planning'
export type ScenarioPlanningAtom = 'INTENT' | 'PROCESS' | 'DDD' | 'AGENT' | 'SELECTION'

/** Planning-mode log event types (extend W1 base schema). */
export type ScenarioPlanningLogEventType =
  | 'input_event'
  | 'intent_classification'
  | 'process_atom_output'
  | 'ddd_atom_output'
  | 'agent_atom_output'
  | 'response_summary'
  | 'export_emit'

export interface ScenarioPlanningPrompt {
  step: number
  input: string
  mode: ScenarioMode
  expectedAtoms: ScenarioPlanningAtom[]
  expectedLogEventTypes: ScenarioPlanningLogEventType[]
  simulatedLatencyMs: number
  expectedOutcome: string
}

export const SCENARIO_4_PLANNING_PROMPTS: ScenarioPlanningPrompt[] = [
  // 1 — initial PROCESS_ATOM fires; phases generated for SaaS auth system
  {
    step: 1,
    input: 'I need to build a SaaS authentication system',
    mode: 'planning',
    expectedAtoms: ['INTENT', 'PROCESS'],
    expectedLogEventTypes: [
      'input_event',
      'intent_classification',
      'process_atom_output',
      'response_summary',
    ],
    simulatedLatencyMs: 420,
    expectedOutcome: 'PROCESS_ATOM emits 4-5 phases (foundation/schema/auth-flow/sessions/polish); ProcessMapSVG updates',
  },
  // 2 — confirms / refines phase breakdown
  {
    step: 2,
    input: 'Break this into phases',
    mode: 'planning',
    expectedAtoms: ['INTENT', 'PROCESS'],
    expectedLogEventTypes: [
      'input_event',
      'intent_classification',
      'process_atom_output',
      'response_summary',
    ],
    simulatedLatencyMs: 380,
    expectedOutcome: 'PROCESS_ATOM re-emits stable 4-5 phase breakdown (idempotent on confirm)',
  },
  // 3 — INTENT add phase; PROCESS_ATOM re-emits with extra QA phase
  {
    step: 3,
    input: 'Add a phase for testing and QA',
    mode: 'planning',
    expectedAtoms: ['INTENT', 'PROCESS'],
    expectedLogEventTypes: [
      'input_event',
      'intent_classification',
      'process_atom_output',
      'response_summary',
    ],
    simulatedLatencyMs: 410,
    expectedOutcome: 'PROCESS_ATOM re-emits 5-phase plan with QA phase appended at position 4',
  },
  // 4 — DDD_ATOM fires; produces 4 bounded contexts
  {
    step: 4,
    input: 'Generate the DDD bounded contexts',
    mode: 'planning',
    expectedAtoms: ['INTENT', 'DDD'],
    expectedLogEventTypes: [
      'input_event',
      'intent_classification',
      'ddd_atom_output',
      'response_summary',
    ],
    simulatedLatencyMs: 360,
    expectedOutcome: 'DDD_ATOM emits ~4 contexts (User/Session/Token/Audit); DomainModelSVG updates',
  },
  // 5 — SpecWorkbench renders Σ block for the auth phase
  {
    step: 5,
    input: 'Show me the AISP spec for the auth phase',
    mode: 'planning',
    expectedAtoms: ['INTENT', 'SELECTION'],
    expectedLogEventTypes: [
      'input_event',
      'intent_classification',
      'response_summary',
    ],
    simulatedLatencyMs: 90,
    expectedOutcome: 'SpecWorkbench AISP tab renders verbatim Σ block for auth-flow phase',
  },
  // 6 — AGENT_ATOM fires; agent spec generated for JWT-specific work
  {
    step: 6,
    input: 'Add an agent scope for the JWT implementation',
    mode: 'planning',
    expectedAtoms: ['INTENT', 'AGENT'],
    expectedLogEventTypes: [
      'input_event',
      'intent_classification',
      'agent_atom_output',
      'response_summary',
    ],
    simulatedLatencyMs: 480,
    expectedOutcome: 'AGENT_ATOM emits AgentSpec for jwt-implementation role with disjoint ownedFiles + DoD',
  },
  // 7 — INTENT query → recommend ADRs
  {
    step: 7,
    input: 'What ADRs do I need to write first',
    mode: 'planning',
    expectedAtoms: ['INTENT'],
    expectedLogEventTypes: [
      'input_event',
      'intent_classification',
      'response_summary',
    ],
    simulatedLatencyMs: 220,
    expectedOutcome: 'Recommendations: ADR for auth-strategy, token-format, session-storage (3 ADRs queued)',
  },
  // 8 — TDD scaffold (P97 deferred; expected output simulated)
  {
    step: 8,
    input: 'Generate the TDD spec for phase 1',
    mode: 'planning',
    expectedAtoms: ['INTENT', 'PROCESS'],
    expectedLogEventTypes: [
      'input_event',
      'intent_classification',
      'process_atom_output',
      'response_summary',
    ],
    simulatedLatencyMs: 340,
    expectedOutcome: 'TDD scaffold emits red/green/refactor plan for foundation phase (P97 simulation)',
  },
  // 9 — KISS reviewer (P98 deferred; expected output simulated)
  {
    step: 9,
    input: 'Run KISS review on the plan',
    mode: 'planning',
    expectedAtoms: ['INTENT'],
    expectedLogEventTypes: [
      'input_event',
      'intent_classification',
      'response_summary',
    ],
    simulatedLatencyMs: 290,
    expectedOutcome: 'KISS reviewer emits findings: scope tight, no premature abstraction (P98 simulation)',
  },
  // 10 — Export Claude Code bundle per ADR-122
  {
    step: 10,
    input: 'Export everything for Claude Code',
    mode: 'planning',
    expectedAtoms: ['INTENT'],
    expectedLogEventTypes: [
      'input_event',
      'intent_classification',
      'export_emit',
      'response_summary',
    ],
    simulatedLatencyMs: 60,
    expectedOutcome: 'buildClaudeCodeBundle emits markdown bundle with ≥6 logical files (ADR-122 D4)',
  },
]

/**
 * Row math: 4+4+4+4+3+4+3+4+3+4 = 37 log_events rows; 0 edit_history rows
 * (planning mode is read-emit). 37 SQLite rows total.
 */
export const SCENARIO_4_EXPECTED_SQLITE_ROW_COUNT = 37

export const SCENARIO_4_EXPECTED_LOG_EVENT_ROW_COUNT =
  SCENARIO_4_PLANNING_PROMPTS.reduce((sum, p) => sum + p.expectedLogEventTypes.length, 0)

export const SCENARIO_4_EXPECTED_EDIT_HISTORY_ROW_COUNT = 0

export const SCENARIO_4_TOTAL_SIMULATED_LATENCY_MS =
  SCENARIO_4_PLANNING_PROMPTS.reduce((sum, p) => sum + p.simulatedLatencyMs, 0)
