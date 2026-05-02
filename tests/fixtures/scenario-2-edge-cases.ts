/**
 * P100 W2 / A4 — Scenario 2 fixture: adversarial / messy multi-intent inputs.
 *
 * Edge-case audit of the chat pipeline. Each entry captures expected atom
 * activation, ASSUMPTIONS clarification routing, DECOMP fan-out, confidence
 * banding, log-event emissions, simulated latency, and outcome class.
 *
 * Verbatim prompts — typos, shouting, vagueness preserved on purpose.
 * READ-ONLY fixture — sibling-disjoint with A3/A5/A6.
 */

export type AtomKind =
  | 'INTENT' | 'DECOMP' | 'ASSUMPTIONS' | 'CONTENT' | 'SELECTION'
  | 'PATCH' | 'PROCESS' | 'DDD' | 'AGENT'

export type ConfidenceBand = 'low' | 'med' | 'high'

export type Outcome =
  | 'succeed'        // patches landed cleanly
  | 'partial'        // some todos applied, some deferred
  | 'clarification'  // ASSUMPTIONS_ATOM surfaces a picker turn
  | 'fallback'       // canned fallback / default response
  | 'failure'        // pipeline error — must NOT occur

export type LogEventType =
  | 'request_envelope' | 'intent_classify' | 'decomp_trace' | 'assumptions'
  | 'route_classify'   | 'template_match'  | 'patch_apply'  | 'personality_render'
  | 'page_scope'       | 'error'

export interface EdgeCasePrompt {
  readonly id: number
  /** Verbatim user input — preserves typos / shouting / vagueness. */
  readonly text: string
  readonly expectedAtoms: readonly AtomKind[]
  /** ASSUMPTIONS clarification options summary; empty when atom does not fire. */
  readonly expectedAssumptions: readonly string[]
  /** DECOMP todo count; 0 = single-clause / no fan-out. */
  readonly expectedDecompTodos: number
  readonly expectedConfidence: ConfidenceBand
  readonly expectedLogEventTypes: readonly LogEventType[]
  readonly simulatedLatencyMs: number
  readonly expectedOutcome: Outcome
  /** Why this prompt is adversarial / what it stresses. */
  readonly note: string
}

export const SCENARIO_2_EDGE_CASES: readonly EdgeCasePrompt[] = [
  {
    id: 1,
    text: 'make it brighter and more fun and add pricing and change the font to something nice',
    expectedAtoms: ['INTENT', 'DECOMP', 'PATCH'],
    expectedAssumptions: [],
    expectedDecompTodos: 4,
    expectedConfidence: 'high',
    expectedLogEventTypes: ['request_envelope', 'intent_classify', 'decomp_trace', 'template_match', 'patch_apply', 'personality_render'],
    simulatedLatencyMs: 480,
    expectedOutcome: 'partial',
    note: 'DECOMP must split 4 conjunctions; "something nice" is vague but bounded by font target.',
  },
  {
    id: 2,
    text: 'idk make it better',
    expectedAtoms: ['INTENT', 'ASSUMPTIONS'],
    expectedAssumptions: ['better visually (theme/colors)', 'better content (copy/tone)', 'better structure (sections/layout)'],
    expectedDecompTodos: 0,
    expectedConfidence: 'low',
    expectedLogEventTypes: ['request_envelope', 'intent_classify', 'assumptions', 'personality_render'],
    simulatedLatencyMs: 260,
    expectedOutcome: 'clarification',
    note: 'Below ASSUMPTIONS_CONFIDENCE_THRESHOLD; classifier cannot pick a target.',
  },
  {
    id: 3,
    text: 'CHANGE EVERYTHING TO DARK MODE NOW',
    expectedAtoms: ['INTENT', 'PATCH'],
    expectedAssumptions: [],
    expectedDecompTodos: 0,
    expectedConfidence: 'high',
    expectedLogEventTypes: ['request_envelope', 'intent_classify', 'template_match', 'patch_apply', 'personality_render'],
    simulatedLatencyMs: 320,
    expectedOutcome: 'succeed',
    note: 'Shouting cleanup — INTENT lowercases input; "everything" maps to theme-level swap.',
  },
  {
    id: 4,
    text: 'add some stuff below the hero',
    expectedAtoms: ['INTENT', 'ASSUMPTIONS'],
    expectedAssumptions: ['add features section', 'add testimonials section', 'add pricing section'],
    expectedDecompTodos: 0,
    expectedConfidence: 'low',
    expectedLogEventTypes: ['request_envelope', 'intent_classify', 'assumptions', 'personality_render'],
    simulatedLatencyMs: 290,
    expectedOutcome: 'clarification',
    note: 'Vague target ("stuff") with anchored position ("below the hero"); needs picker.',
  },
  {
    id: 5,
    text: 'make the hero say something about AI but keep it professional but also fun',
    expectedAtoms: ['INTENT', 'CONTENT', 'PATCH'],
    expectedAssumptions: [],
    expectedDecompTodos: 0,
    expectedConfidence: 'med',
    expectedLogEventTypes: ['request_envelope', 'intent_classify', 'route_classify', 'template_match', 'patch_apply', 'personality_render'],
    simulatedLatencyMs: 540,
    expectedOutcome: 'succeed',
    note: 'CONTENT_ATOM must reconcile conflicting tone hints (professional + fun → balanced).',
  },
  {
    id: 6,
    text: 'remove the pricing and add it back but cheaper',
    expectedAtoms: ['INTENT', 'DECOMP', 'PATCH'],
    expectedAssumptions: [],
    expectedDecompTodos: 2,
    expectedConfidence: 'med',
    expectedLogEventTypes: ['request_envelope', 'intent_classify', 'decomp_trace', 'template_match', 'patch_apply', 'personality_render'],
    simulatedLatencyMs: 510,
    expectedOutcome: 'succeed',
    note: 'Contradiction handled as 2 sequential todos: remove → add. Order preserved.',
  },
  {
    id: 7,
    text: 'make page 2 look like page 1 but different',
    expectedAtoms: ['INTENT', 'ASSUMPTIONS'],
    expectedAssumptions: ['mirror page 1 layout but new copy', 'mirror page 1 theme but different sections', 'keep current page 2 — clarify what to change'],
    expectedDecompTodos: 0,
    expectedConfidence: 'low',
    expectedLogEventTypes: ['request_envelope', 'intent_classify', 'page_scope', 'assumptions', 'personality_render'],
    simulatedLatencyMs: 340,
    expectedOutcome: 'clarification',
    note: 'Page-aware reference (page 2 / page 1) but "but different" is self-canceling.',
  },
  {
    id: 8,
    text: 'add a blog but not really a blog more like updates',
    expectedAtoms: ['INTENT', 'PATCH'],
    expectedAssumptions: [],
    expectedDecompTodos: 0,
    expectedConfidence: 'med',
    expectedLogEventTypes: ['request_envelope', 'intent_classify', 'template_match', 'patch_apply', 'personality_render'],
    simulatedLatencyMs: 380,
    expectedOutcome: 'succeed',
    note: 'Tolerant match: blog kind=updates → blog section type per ADR-100; copy hint passed.',
  },
  {
    id: 9,
    text: 'this is wrong fix it',
    expectedAtoms: ['INTENT', 'ASSUMPTIONS'],
    expectedAssumptions: ['revert last change', 'reset to default theme', 'tell me what is wrong (clarify target)'],
    expectedDecompTodos: 0,
    expectedConfidence: 'low',
    expectedLogEventTypes: ['request_envelope', 'intent_classify', 'assumptions', 'personality_render'],
    simulatedLatencyMs: 240,
    expectedOutcome: 'clarification',
    note: 'No referent; "wrong" is unbounded. ASSUMPTIONS surfaces revert + reset + ask.',
  },
  {
    id: 10,
    text: 'make it perfect',
    expectedAtoms: ['INTENT', 'ASSUMPTIONS'],
    expectedAssumptions: ['perfect = polish theme + tighten copy', 'perfect = swap to premium template', 'perfect = pick a goal first (conversion / brand / trust)'],
    expectedDecompTodos: 0,
    expectedConfidence: 'low',
    expectedLogEventTypes: ['request_envelope', 'intent_classify', 'assumptions', 'personality_render'],
    simulatedLatencyMs: 230,
    expectedOutcome: 'clarification',
    note: 'Unmeasurable goal; classifier cannot resolve "perfect" → ASSUMPTIONS picker.',
  },
] as const

export const SCENARIO_2_PROMPT_COUNT = SCENARIO_2_EDGE_CASES.length
