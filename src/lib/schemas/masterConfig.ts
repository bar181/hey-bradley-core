import { z } from 'zod'
import { sectionSchema } from './section'

export const masterConfigSchema = z.object({
  spec: z.literal('aisp-1.2'),
  page: z.string().default('index'),
  version: z.string().default('1.0.0-RC1'),
  sections: z.array(sectionSchema).default([]),
})

export type MasterConfig = z.infer<typeof masterConfigSchema>
