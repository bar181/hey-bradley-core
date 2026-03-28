import { z } from 'zod'

export type PatchSource =
  | 'ui'
  | 'json-editor'
  | 'llm-chat'
  | 'llm-voice'
  | 'llm-listen'
  | 'import'
  | 'preset'
  | 'vibe'

export const patchEnvelopeSchema = z.object({
  patch: z.record(z.unknown()),
  source: z.string(),
  timestamp: z.number().optional(),
})

export type PatchEnvelope = z.infer<typeof patchEnvelopeSchema>
