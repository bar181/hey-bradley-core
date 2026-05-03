/**
 * P27 Sprint C P2 — Zod schema for LLM AISP intent response.
 *
 * The LLM is sent INTENT_ATOM as system prompt; expected to reply with a
 * JSON object conforming to this schema. Mirrors ALLOWED_TARGET_TYPES from
 * intentAtom.ts (kept as a string union here to avoid circular import).
 *
 * ADR-056 (LLM-native AISP understanding).
 */
import { z } from 'zod'

export const intentVerbSchema = z.enum(['hide', 'show', 'change', 'remove', 'add', 'reset'])

// P106 / A3 — Section-enum 3-way reconciliation. Mirrors canonical 18 from
// `sectionTypeSchema` (src/lib/schemas/section.ts; ADR-100). Aliases live
// in `validateSectionType` only — never duplicated in atom enums.
export const intentTargetTypeSchema = z.enum([
  'hero', 'menu', 'columns', 'pricing', 'action', 'footer',
  'quotes', 'questions', 'numbers', 'gallery', 'logos', 'team',
  'image', 'divider', 'text', 'blog', 'case-study', 'contact-form',
])

export const intentTargetSchema = z.object({
  type: intentTargetTypeSchema,
  index: z.number().int().min(1).nullable(),
})

export const llmIntentResponseSchema = z.object({
  verb: intentVerbSchema,
  target: intentTargetSchema.nullable(),
  params: z.record(z.string(), z.unknown()).optional(),
  confidence: z.number().min(0).max(1),
  rationale: z.string().max(500).optional(),
})

export type LLMIntentResponse = z.infer<typeof llmIntentResponseSchema>
