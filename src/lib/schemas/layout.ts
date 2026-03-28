import { z } from 'zod'

export const layoutSchema = z.object({
  display: z.enum(['flex', 'grid']).default('flex'),
  direction: z.enum(['row', 'column']).optional(),
  align: z.enum(['center', 'start', 'end', 'stretch']).optional(),
  justify: z.enum(['center', 'start', 'end', 'between', 'around']).optional(),
  gap: z.string().default('24px'),
  padding: z.string().default('64px'),
  maxWidth: z.string().optional(),
  columns: z.number().optional(),
})

export type Layout = z.infer<typeof layoutSchema>
