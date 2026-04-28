/**
 * P26 Sprint C Phase 1 — AISP barrel export.
 * ADR-053 (AISP Intent Classifier).
 */
export {
  INTENT_ATOM,
  ALLOWED_TARGET_TYPES,
  AISP_CONFIDENCE_THRESHOLD,
} from './intentAtom'
export type {
  IntentVerb,
  IntentTarget,
  ClassifiedIntent,
} from './intentAtom'
export { classifyIntent } from './intentClassifier'
export { llmClassifyIntent } from './llmClassifier'
export { selectTemplate, STEP1_THRESHOLD } from './templateSelector'
export { runTwoStepPipeline } from './twoStepPipeline'
export type { TemplateSelection } from './templateSelector'
export type { TwoStepResult } from './twoStepPipeline'
// P34 Sprint E P1 (A3) — Assumptions engine + persistence.
export {
  ASSUMPTIONS_TRIGGER_THRESHOLD,
  generateAssumptions,
  shouldRequestAssumptions,
} from './assumptions'
export type { Assumption, AssumptionRequest } from './assumptions'
export {
  recordAcceptedAssumption,
  listAcceptedAssumptions,
  ACCEPTED_ASSUMPTIONS_LIMITS,
} from './assumptionStore'
export type { AcceptedAssumptionRecord } from './assumptionStore'
// P35 Sprint E P2 — ASSUMPTIONS_ATOM (5th Crystal Atom) + LLM-driven generator.
export {
  ASSUMPTIONS_ATOM,
  ASSUMPTIONS_CONFIDENCE_THRESHOLD,
  ASSUMPTIONS_COST_CAP_RESERVE,
  ASSUMPTIONS_MAX_OPTIONS,
  ASSUMPTIONS_MAX_REPHRASING_LENGTH,
  ASSUMPTIONS_ID_RE,
  ASSUMPTIONS_VERB_PREFIX_RE,
  validateAssumptionsAtomOutput,
} from './assumptionsAtom'
export type { AssumptionAtomItem } from './assumptionsAtom'
export { generateAssumptionsLLM } from './assumptionsLLM'
export type { LLMAssumptionsResult } from './assumptionsLLM'
