import type { SectionType } from '@/lib/schemas/section'

// P116 / B3 — F2 section-type swap matrix (text/quotes/numbers/image only).
// Disallow incompatible swaps; user re-creates the section instead.
export const SWAPPABLE_TYPES = ['text', 'quotes', 'numbers', 'image'] as const
export type SwappableType = (typeof SWAPPABLE_TYPES)[number]

export function isSwappable(type: SectionType): type is SwappableType {
  return (SWAPPABLE_TYPES as readonly string[]).includes(type)
}

export function swapCandidates(type: SectionType): SwappableType[] {
  if (!isSwappable(type)) return []
  return SWAPPABLE_TYPES.filter((t) => t !== type)
}

const DEFAULTS: Record<SwappableType, Record<string, unknown>[]> = {
  text: [
    { id: 'content', type: 'text-content', enabled: true, order: 0,
      props: { heading: 'About Us', body: 'Share your story here. This is a text block perfect for long-form content, blog posts, or about pages.', sidebar: 'Quick Facts\n\nFounded: 2024\nTeam: 12 people' } },
  ],
  quotes: [
    { id: 'q1', type: 'quote', enabled: true, order: 0, props: { text: 'This product changed how our team works.', author: 'Sarah Chen', role: 'CEO, Acme' } },
    { id: 'q2', type: 'quote', enabled: true, order: 1, props: { text: 'Setup took five minutes. Results came in a day.', author: 'Marcus Rivera', role: 'CTO, Globex' } },
  ],
  numbers: [
    { id: 'n1', type: 'stat', enabled: true, order: 0, props: { value: '99.9%', label: 'Uptime' } },
    { id: 'n2', type: 'stat', enabled: true, order: 1, props: { value: '12k+', label: 'Active users' } },
    { id: 'n3', type: 'stat', enabled: true, order: 2, props: { value: '40%', label: 'Faster delivery' } },
  ],
  image: [
    { id: 'image', type: 'image', enabled: true, order: 0,
      props: { imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&auto=format&q=80', heading: 'Your Story', description: 'Tell your audience what makes you unique.' } },
  ],
}

export function defaultComponentsFor(type: SwappableType): Record<string, unknown>[] {
  return DEFAULTS[type]
}

export const SWAP_LABEL: Record<SwappableType, string> = {
  text: 'Text', quotes: 'Quotes', numbers: 'Numbers', image: 'Image',
}
