/**
 * P100 W2 / A5 — Scenario 3: Listen-mode transcript simulation.
 *
 * 10 voice-style prompts with disfluencies (uh/um/like/you know) building a
 * small-business AI startup site. TWO-STAGE capture per P100 W1 audit
 * (log-design.md §7(a) — REJECT verdict; Wave 2 must persist BOTH raw +
 * cleaned text so request_envelope joins back via request_id).
 *
 * SIMULATION-ONLY. Personality: teacher-mode (forgiving, supportive).
 * Per-prompt narrative + personality responses live in:
 *   plans/implementation/phase-100/scenarios/03-listen-build-log.md
 *
 * Sibling-disjoint with A3 (scenario-1), A4 (scenario-2), A6 (planning).
 * Schema cross-refs: log_events / listen_capture / edit_history per W1 / 005.
 */

export type Scenario3Mode = 'listen'
export type Scenario3Atom =
  | 'INTENT' | 'SELECTION' | 'PATCH' | 'DECOMP' | 'CONTENT' | 'ASSUMPTIONS'
export type Scenario3Personality = 'teacher'
export type Scenario3LogEventType =
  | 'input_event'
  | 'listen_capture'
  | 'intent_classification'
  | 'template_match'
  | 'decomp_split'
  | 'page_scope_resolution'
  | 'patch_validation'
  | 'response_summary'
  | 'export_emit'

export interface Scenario3ListenCapture {
  /** Verbatim with disfluencies preserved. */
  readonly raw: string
  /** Post-cleanup: strip uh/um/like fillers + false starts; preserve intent. */
  readonly cleaned: string
  /** Heuristic count of interim webSpeech results before final stitched text. */
  readonly interimCount: number
  /** Push-to-talk held duration in ms. */
  readonly pttHeldMs: number
}

export interface Scenario3Prompt {
  readonly step: number
  readonly inputType: Scenario3Mode
  readonly capture: Scenario3ListenCapture
  readonly expectedAtoms: readonly Scenario3Atom[]
  readonly expectedTodos?: number
  readonly expectedLogEventTypes: readonly Scenario3LogEventType[]
  readonly personality: Scenario3Personality
  readonly simulatedLatencyMs: number
}

const BASE: readonly Scenario3LogEventType[] = [
  'input_event', 'listen_capture', 'intent_classification',
]
const TAIL: readonly Scenario3LogEventType[] = ['patch_validation', 'response_summary']

const cap = (
  raw: string, cleaned: string, interimCount: number, pttHeldMs: number,
): Scenario3ListenCapture => ({ raw, cleaned, interimCount, pttHeldMs })

export const SCENARIO_3_LISTEN_PROMPTS: readonly Scenario3Prompt[] = [
  // 1 — initial scaffold; SELECTION matches saas-startup template.
  {
    step: 1, inputType: 'listen', personality: 'teacher',
    capture: cap(
      'um hey can you uh create a site for my like startup thing',
      'create a site for my startup', 5, 2400),
    expectedAtoms: ['INTENT', 'SELECTION', 'PATCH'],
    expectedLogEventTypes: [...BASE, 'template_match', ...TAIL],
    simulatedLatencyMs: 1850,
  },
  // 2 — content fill: tagline + value-props seed via CONTENT_ATOM.
  {
    step: 2, inputType: 'listen', personality: 'teacher',
    capture: cap(
      'yeah so we do like AI stuff for like small businesses you know',
      'we do AI for small businesses', 4, 2100),
    expectedAtoms: ['INTENT', 'CONTENT', 'PATCH'],
    expectedLogEventTypes: [...BASE, ...TAIL],
    simulatedLatencyMs: 950,
  },
  // 3 — INTENT change theme + size (hero bigger + colorful keywords).
  {
    step: 3, inputType: 'listen', personality: 'teacher',
    capture: cap(
      'make the hero um bigger and like more colorful or something',
      'make the hero bigger and more colorful', 4, 1900),
    expectedAtoms: ['INTENT', 'PATCH'],
    expectedLogEventTypes: [...BASE, ...TAIL],
    simulatedLatencyMs: 280,
  },
  // 4 — DECOMP triggered by "actually"; INTENT add team section (4 cards).
  {
    step: 4, inputType: 'listen', personality: 'teacher',
    capture: cap(
      'oh wait actually can you add like a team section with like four people',
      'actually add a team section with four people', 5, 2300),
    expectedAtoms: ['INTENT', 'DECOMP', 'PATCH'],
    expectedTodos: 1,
    expectedLogEventTypes: [...BASE, 'decomp_split', ...TAIL],
    simulatedLatencyMs: 380,
  },
  // 5 — INTENT change typography (font keyword → modern preset swap).
  {
    step: 5, inputType: 'listen', personality: 'teacher',
    capture: cap(
      'the font is kinda weird can you make it more like modern',
      'make the font more modern', 3, 1700),
    expectedAtoms: ['INTENT', 'PATCH'],
    expectedLogEventTypes: [...BASE, ...TAIL],
    simulatedLatencyMs: 220,
  },
  // 6 — recent contradiction; INTENT remove team ("forget" → remove verb).
  {
    step: 6, inputType: 'listen', personality: 'teacher',
    capture: cap(
      'actually you know what forget the team section',
      'remove the team section', 3, 1500),
    expectedAtoms: ['INTENT', 'PATCH'],
    expectedLogEventTypes: [...BASE, ...TAIL],
    simulatedLatencyMs: 190,
  },
  // 7 — INTENT add pricing 3-tier (free + 2 paid); SELECTION + CONTENT.
  {
    step: 7, inputType: 'listen', personality: 'teacher',
    capture: cap(
      'add pricing um three tiers like free and then two paid ones',
      'add pricing with three tiers free and two paid', 4, 2000),
    expectedAtoms: ['INTENT', 'SELECTION', 'CONTENT', 'PATCH'],
    expectedLogEventTypes: [...BASE, 'template_match', ...TAIL],
    simulatedLatencyMs: 1100,
  },
  // 8 — INTENT change palette; blue + green brand keyword pair.
  {
    step: 8, inputType: 'listen', personality: 'teacher',
    capture: cap(
      'make the colors match our brand which is like blue and green',
      'make the colors match our brand blue and green', 4, 1850),
    expectedAtoms: ['INTENT', 'PATCH'],
    expectedLogEventTypes: [...BASE, ...TAIL],
    simulatedLatencyMs: 240,
  },
  // 9 — INTENT add contact-form section at footer position.
  {
    step: 9, inputType: 'listen', personality: 'teacher',
    capture: cap(
      'oh and we need a contact form at the bottom',
      'add a contact form at the bottom', 3, 1600),
    expectedAtoms: ['INTENT', 'SELECTION', 'PATCH'],
    expectedLogEventTypes: [...BASE, 'template_match', ...TAIL],
    simulatedLatencyMs: 850,
  },
  // 10 — INTENT export bundle; emit-only, no patch.
  {
    step: 10, inputType: 'listen', personality: 'teacher',
    capture: cap(
      'ok export this for our developer',
      'export this for our developer', 2, 1200),
    expectedAtoms: ['INTENT'],
    expectedLogEventTypes: [...BASE, 'export_emit', 'response_summary'],
    simulatedLatencyMs: 60,
  },
]

/**
 * Row-count math:
 *   log_events: 6+5+5+6+5+5+6+5+6+5 = 54
 *   edit_history: steps 1-9 patch-producing = 9; step 10 export-only.
 *   total SQLite rows: 54 + 9 = 63
 *   listen_capture events: 10 (required by brief; one per prompt).
 */
export const SCENARIO_3_EXPECTED_LOG_EVENT_ROW_COUNT =
  SCENARIO_3_LISTEN_PROMPTS.reduce((s, p) => s + p.expectedLogEventTypes.length, 0)

export const SCENARIO_3_EXPECTED_LISTEN_CAPTURE_COUNT =
  SCENARIO_3_LISTEN_PROMPTS.filter((p) =>
    p.expectedLogEventTypes.includes('listen_capture')).length

export const SCENARIO_3_EXPECTED_EDIT_HISTORY_ROW_COUNT =
  SCENARIO_3_LISTEN_PROMPTS.filter((p) => p.expectedAtoms.includes('PATCH')).length

export const SCENARIO_3_EXPECTED_SQLITE_ROW_COUNT =
  SCENARIO_3_EXPECTED_LOG_EVENT_ROW_COUNT + SCENARIO_3_EXPECTED_EDIT_HISTORY_ROW_COUNT

export const SCENARIO_3_TOTAL_SIMULATED_LATENCY_MS =
  SCENARIO_3_LISTEN_PROMPTS.reduce((s, p) => s + p.simulatedLatencyMs, 0)
