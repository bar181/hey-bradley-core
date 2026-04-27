// Spec: plans/implementation/mvp-plan/04-phase-18-real-chat.md §3.4
// Decision record: docs/adr/ADR-044-json-patch-contract.md (authored Step 3)
// Step 2 of Phase 18: Zod-validated envelope schema returned by every adapter.

import { z } from 'zod'

/** RFC-6902 path: '/' followed by `/`-separated tokens; `~0` = `~`, `~1` = `/`. */
export const JSONPatchSchema = z.object({
  op: z.enum(['add', 'replace', 'remove']),
  path: z.string().regex(/^\/(?:[^/~]|~0|~1)+(?:\/(?:[^/~]|~0|~1)+)*$/),
  value: z.unknown().optional(),
})

export type JSONPatch = z.infer<typeof JSONPatchSchema>

/** The single shape returned by every LLM adapter. ≤ 20 patches per turn. */
export const PatchEnvelopeSchema = z.object({
  patches: z.array(JSONPatchSchema).min(1).max(20),
  summary: z.string().max(140).optional(),
})

export type PatchEnvelope = z.infer<typeof PatchEnvelopeSchema>
