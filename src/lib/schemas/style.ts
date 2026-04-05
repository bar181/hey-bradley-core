import { z } from 'zod'

export const imageEffectSchema = z.enum([
  'none', 'ken-burns', 'slow-pan', 'zoom-hover', 'click-enlarge',
  'gradient-overlay', 'parallax', 'glass-blur', 'grayscale-hover', 'vignette',
])

export type ImageEffect = z.infer<typeof imageEffectSchema>

export const styleSchema = z.object({
  background: z.string().default('#0a0a0f'),
  color: z.string().default('#f8fafc'),
  fontFamily: z.string().optional(),
  borderRadius: z.string().optional(),
  imageEffect: imageEffectSchema.optional(),
})

export type Style = z.infer<typeof styleSchema>
