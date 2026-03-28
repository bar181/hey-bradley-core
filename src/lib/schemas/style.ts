import { z } from 'zod'

export const styleSchema = z.object({
  background: z.string().default('#0a0a0f'),
  color: z.string().default('#f8fafc'),
  fontFamily: z.string().optional(),
  borderRadius: z.string().optional(),
})

export type Style = z.infer<typeof styleSchema>
