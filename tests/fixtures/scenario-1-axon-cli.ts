/**
 * P100 W2 / A3 — Scenario 1 fixture: Claude Code developer builds "Axon" CLI landing page.
 * SIMULATION-ONLY. Describes the rows the W1-wired pipeline (migration 005) WOULD have
 * written. Consumed by A7 audit and A9 spec for row-count math.
 * log_events.event_type ∈ {input_event, intent_classification, template_match,
 *   decomp_split, page_scope_resolution, patch_validation, response_summary, export_emit}.
 * edit_history: one row per applied patch batch.
 */

export type ScenarioMode = 'chat' | 'listen'
export type ScenarioAtom = 'INTENT' | 'SELECTION' | 'PATCH' | 'DECOMP' | 'CONTENT' | 'ASSUMPTIONS'
export type ScenarioPageScope = 'page-1' | 'page-2'

export type ScenarioLogEventType =
  | 'input_event'
  | 'intent_classification'
  | 'template_match'
  | 'decomp_split'
  | 'page_scope_resolution'
  | 'patch_validation'
  | 'response_summary'
  | 'export_emit'

export interface ScenarioPrompt {
  step: number
  input: string
  mode: ScenarioMode
  expectedAtoms: ScenarioAtom[]
  expectedTodos?: number
  expectedPageScope?: ScenarioPageScope
  expectedLogEventTypes: ScenarioLogEventType[]
  simulatedLatencyMs: number
}

export const SCENARIO_1_AXON_PROMPTS: ScenarioPrompt[] = [
  {
    step: 1,
    input: 'Create a site for my CLI tool called Axon',
    mode: 'chat',
    expectedAtoms: ['INTENT', 'SELECTION', 'PATCH'],
    expectedLogEventTypes: [
      'input_event',
      'intent_classification',
      'template_match',
      'patch_validation',
      'response_summary',
    ],
    simulatedLatencyMs: 1850,
  },
  {
    step: 2,
    input: 'Add a quickstart section with npm install steps',
    mode: 'chat',
    expectedAtoms: ['INTENT', 'PATCH'],
    expectedLogEventTypes: [
      'input_event',
      'intent_classification',
      'patch_validation',
      'response_summary',
    ],
    simulatedLatencyMs: 150,
  },
  {
    step: 3,
    input: 'Make the hero darker and more technical',
    mode: 'chat',
    expectedAtoms: ['INTENT', 'PATCH'],
    expectedLogEventTypes: [
      'input_event',
      'intent_classification',
      'patch_validation',
      'response_summary',
    ],
    simulatedLatencyMs: 200,
  },
  {
    step: 4,
    input: 'Add a pricing section — free tier and $19/month pro',
    mode: 'chat',
    expectedAtoms: ['INTENT', 'DECOMP', 'PATCH'],
    expectedTodos: 2,
    expectedLogEventTypes: [
      'input_event',
      'intent_classification',
      'decomp_split',
      'patch_validation',
      'response_summary',
    ],
    simulatedLatencyMs: 300,
  },
  {
    step: 5,
    input: 'Change the font to something more developer-friendly',
    mode: 'chat',
    expectedAtoms: ['INTENT', 'PATCH'],
    expectedLogEventTypes: [
      'input_event',
      'intent_classification',
      'patch_validation',
      'response_summary',
    ],
    simulatedLatencyMs: 250,
  },
  {
    step: 6,
    input: 'Add social proof with GitHub stars and downloads',
    mode: 'chat',
    expectedAtoms: ['INTENT', 'PATCH'],
    expectedLogEventTypes: [
      'input_event',
      'intent_classification',
      'patch_validation',
      'response_summary',
    ],
    simulatedLatencyMs: 180,
  },
  {
    step: 7,
    input: 'Create a second page for documentation',
    mode: 'chat',
    expectedAtoms: ['INTENT', 'PATCH'],
    expectedLogEventTypes: [
      'input_event',
      'intent_classification',
      'page_scope_resolution',
      'patch_validation',
      'response_summary',
    ],
    simulatedLatencyMs: 200,
  },
  {
    step: 8,
    input: 'Add a changelog section to the docs page',
    mode: 'chat',
    expectedAtoms: ['INTENT', 'PATCH'],
    expectedPageScope: 'page-2',
    expectedLogEventTypes: [
      'input_event',
      'intent_classification',
      'page_scope_resolution',
      'patch_validation',
      'response_summary',
    ],
    simulatedLatencyMs: 250,
  },
  {
    step: 9,
    input: 'Make the whole site feel more like linear.app',
    mode: 'chat',
    expectedAtoms: ['INTENT', 'DECOMP', 'PATCH'],
    expectedTodos: 3,
    expectedLogEventTypes: [
      'input_event',
      'intent_classification',
      'decomp_split',
      'patch_validation',
      'response_summary',
    ],
    simulatedLatencyMs: 400,
  },
  {
    step: 10,
    input: 'Export the spec for Claude Code',
    mode: 'chat',
    expectedAtoms: ['INTENT'],
    expectedLogEventTypes: [
      'input_event',
      'intent_classification',
      'export_emit',
      'response_summary',
    ],
    simulatedLatencyMs: 50,
  },
]

/**
 * One log_events row per entry in expectedLogEventTypes across all 10 prompts,
 * PLUS one edit_history row per prompt that produced a patch (steps 1-9 = 9
 * patch-producing prompts; step 10 = export-only, no patch row).
 *
 * 5 + 4 + 4 + 5 + 4 + 4 + 5 + 5 + 5 + 4 = 45 log_events rows
 * 9 patch-producing steps                = 9 edit_history rows
 * total                                  = 54 SQLite rows
 */
export const SCENARIO_1_EXPECTED_SQLITE_ROW_COUNT = 54

export const SCENARIO_1_EXPECTED_LOG_EVENT_ROW_COUNT =
  SCENARIO_1_AXON_PROMPTS.reduce((sum, p) => sum + p.expectedLogEventTypes.length, 0)

export const SCENARIO_1_EXPECTED_EDIT_HISTORY_ROW_COUNT =
  SCENARIO_1_AXON_PROMPTS.filter((p) => p.expectedAtoms.includes('PATCH')).length

export const SCENARIO_1_TOTAL_SIMULATED_LATENCY_MS =
  SCENARIO_1_AXON_PROMPTS.reduce((sum, p) => sum + p.simulatedLatencyMs, 0)
