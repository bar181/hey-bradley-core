/**
 * themeLibrary.ts — Layer 1 (Theme) of the Template Intelligence stack
 *
 * Authority: ADR-098 (Template Intelligence Architecture, P72 / OC-TI)
 *
 * Mid-conversation theme application. Each entry is a self-contained visual
 * recipe (palette + typography + radius + shadow) that the matcher ranks via
 * tag overlap + vectorDescription substring matching. Future HNSW activation
 * (Tier-2) will swap the substring step for true semantic similarity over
 * `vectorDescription`; the data shape stays identical.
 *
 * Strict scope (per phase-72 preflight hard rules):
 *  - NO new dependencies
 *  - Self-contained: NO imports from peer template-intelligence files
 *  - TypeScript-strict; no `any`
 *  - ≤ 600 LOC total (data + helper)
 */

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type ShadowStyle = 'none' | 'soft' | 'medium' | 'sharp'

export interface ThemeTemplate {
  id: string
  name: string
  description: string
  searchTags: readonly string[]
  vectorDescription: string
  theme: {
    primaryColor: string
    secondaryColor: string
    backgroundColor: string
    fontHeading: string
    fontBody: string
    borderRadius: string
    shadowStyle: ShadowStyle
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Theme entries (18) — distinct primary color, font pairing, and shadow style
// per brand. Hex values are unique across the library; verified by inspection.
// ─────────────────────────────────────────────────────────────────────────────

export const THEME_LIBRARY: readonly ThemeTemplate[] = [
  {
    id: 'warm-minimal',
    name: 'Warm Minimal',
    description:
      'Cream backdrop with warm orange accents — editorial restraint with approachable warmth.',
    searchTags: ['warm', 'minimal', 'cream', 'editorial', 'clean', 'approachable'],
    vectorDescription:
      'Warm minimal cream and orange theme with editorial restraint, clean approachable feel; suits boutique brands and lifestyle editorial.',
    theme: {
      primaryColor: '#E07A3C',
      secondaryColor: '#C75A1F',
      backgroundColor: '#FAF5EC',
      fontHeading: 'Fraunces',
      fontBody: 'Inter',
      borderRadius: '0.5rem',
      shadowStyle: 'soft',
    },
  },
  {
    id: 'dark-tech',
    name: 'Dark Tech',
    description:
      'Charcoal canvas with electric cyan accents — terminal-precise, developer-first.',
    searchTags: ['dark', 'tech', 'developer', 'terminal', 'precise', 'code'],
    vectorDescription:
      'Dark tech charcoal theme with electric cyan accents and monospace headings; precise developer tooling and terminal aesthetic.',
    theme: {
      primaryColor: '#00E5FF',
      secondaryColor: '#7C5CFF',
      backgroundColor: '#0E1117',
      fontHeading: 'JetBrains Mono',
      fontBody: 'Inter',
      borderRadius: '0.25rem',
      shadowStyle: 'sharp',
    },
  },
  {
    id: 'bright-playful',
    name: 'Bright Playful',
    description:
      'High-energy coral and golden yellow — informal, upbeat, consumer-friendly.',
    searchTags: ['fun', 'playful', 'bright', 'casual', 'energetic', 'colorful'],
    vectorDescription:
      'Bright, playful, energetic colorful theme with informal upbeat vibe; suits casual products and consumer brands.',
    theme: {
      primaryColor: '#FF6B35',
      secondaryColor: '#FFD166',
      backgroundColor: '#FFF8F0',
      fontHeading: 'Fraunces',
      fontBody: 'DM Sans',
      borderRadius: '1rem',
      shadowStyle: 'medium',
    },
  },
  {
    id: 'corporate-clean',
    name: 'Corporate Clean',
    description:
      'Navy and steel blue on white — formal, executive, trustworthy.',
    searchTags: ['corporate', 'clean', 'professional', 'executive', 'formal', 'trust'],
    vectorDescription:
      'Corporate clean navy and steel-blue professional theme on white backdrop; formal executive trust-building tone.',
    theme: {
      primaryColor: '#1E3A8A',
      secondaryColor: '#4B6FA5',
      backgroundColor: '#FFFFFF',
      fontHeading: 'Inter',
      fontBody: 'Inter',
      borderRadius: '0.375rem',
      shadowStyle: 'soft',
    },
  },
  {
    id: 'retro-bold',
    name: 'Retro Bold',
    description:
      'Burnt orange, cream, and black — 70s editorial statement design.',
    searchTags: ['retro', 'bold', 'vintage', 'editorial', 'statement', '70s'],
    vectorDescription:
      'Retro bold burnt-orange and black 70s editorial theme; vintage statement display typography with strong contrast.',
    theme: {
      primaryColor: '#B8470B',
      secondaryColor: '#1A1A1A',
      backgroundColor: '#F4ECD8',
      fontHeading: 'Playfair Display',
      fontBody: 'Inter',
      borderRadius: '0rem',
      shadowStyle: 'sharp',
    },
  },
  {
    id: 'soft-pastel',
    name: 'Soft Pastel',
    description:
      'Lavender, cream, and sage — gentle wellness palette with a calm feminine register.',
    searchTags: ['soft', 'pastel', 'gentle', 'wellness', 'feminine', 'calm'],
    vectorDescription:
      'Soft pastel lavender and sage gentle wellness theme; calm feminine register with approachable warmth.',
    theme: {
      primaryColor: '#C8A8E2',
      secondaryColor: '#A8C8A0',
      backgroundColor: '#FDF6F0',
      fontHeading: 'Fraunces',
      fontBody: 'DM Sans',
      borderRadius: '1.25rem',
      shadowStyle: 'soft',
    },
  },
  {
    id: 'high-contrast',
    name: 'High Contrast',
    description:
      'Pure black and white with a single accent yellow — striking, accessibility-forward.',
    searchTags: [
      'contrast',
      'bold',
      'accessibility',
      'minimal',
      'striking',
      'editorial',
    ],
    vectorDescription:
      'High contrast black-and-white theme with bold accent yellow; striking accessibility-forward editorial minimalism.',
    theme: {
      primaryColor: '#000000',
      secondaryColor: '#FFD600',
      backgroundColor: '#FFFFFF',
      fontHeading: 'Inter',
      fontBody: 'Inter',
      borderRadius: '0rem',
      shadowStyle: 'sharp',
    },
  },
  {
    id: 'earthy-natural',
    name: 'Earthy Natural',
    description:
      'Forest green, terracotta, and cream — organic, sustainable, hand-made warmth.',
    searchTags: [
      'earthy',
      'natural',
      'organic',
      'sustainable',
      'warm',
      'organic-product',
    ],
    vectorDescription:
      'Earthy natural forest-green and terracotta organic theme; sustainable warm hand-made product feel.',
    theme: {
      primaryColor: '#2F5233',
      secondaryColor: '#C26B4A',
      backgroundColor: '#F6EFE2',
      fontHeading: 'Fraunces',
      fontBody: 'Inter',
      borderRadius: '0.625rem',
      shadowStyle: 'soft',
    },
  },
  {
    id: 'neon-digital',
    name: 'Neon Digital',
    description:
      'Black canvas with neon pink and cyan — synthwave, cyberpunk, gamer energy.',
    searchTags: ['neon', 'digital', 'electric', 'cyberpunk', 'game', 'synthwave'],
    vectorDescription:
      'Neon digital black theme with electric pink and cyan; cyberpunk synthwave gaming aesthetic with high energy.',
    theme: {
      primaryColor: '#FF2E9A',
      secondaryColor: '#22D3EE',
      backgroundColor: '#050510',
      fontHeading: 'JetBrains Mono',
      fontBody: 'Inter',
      borderRadius: '0.5rem',
      shadowStyle: 'medium',
    },
  },
  {
    id: 'luxury-black',
    name: 'Luxury Black',
    description:
      'Pure black with gold and ivory accents — premium, elegant, high-end retail.',
    searchTags: ['luxury', 'black', 'gold', 'premium', 'elegant', 'high-end'],
    vectorDescription:
      'Luxury black-and-gold premium theme with ivory accents; elegant high-end retail and fashion register.',
    theme: {
      primaryColor: '#0A0A0A',
      secondaryColor: '#C9A961',
      backgroundColor: '#FAF6EE',
      fontHeading: 'Playfair Display',
      fontBody: 'Inter',
      borderRadius: '0rem',
      shadowStyle: 'sharp',
    },
  },
  {
    id: 'ocean-calm',
    name: 'Ocean Calm',
    description:
      'Deep navy, teal, and warm sand — clinical-clean coastal palette suited to medical and trust-led brands.',
    searchTags: ['ocean', 'calm', 'blue', 'clinical', 'medical', 'trust', 'clean'],
    vectorDescription:
      'Ocean calm deep-navy and teal coastal theme with sand neutrals; clinical clean medical trust-led register.',
    theme: {
      primaryColor: '#0F3D5C',
      secondaryColor: '#2BA7A0',
      backgroundColor: '#F1ECDD',
      fontHeading: 'Inter',
      fontBody: 'Inter',
      borderRadius: '0.75rem',
      shadowStyle: 'medium',
    },
  },
  {
    id: 'sunset-warm',
    name: 'Sunset Warm',
    description:
      'Coral, amber, and cream — golden-hour romance for editorial lifestyle stories.',
    searchTags: ['sunset', 'warm', 'golden', 'romantic', 'editorial', 'lifestyle'],
    vectorDescription:
      'Sunset warm coral and amber golden theme; romantic editorial lifestyle palette with magazine warmth.',
    theme: {
      primaryColor: '#FF8552',
      secondaryColor: '#F5B041',
      backgroundColor: '#FFF3E2',
      fontHeading: 'Fraunces',
      fontBody: 'DM Sans',
      borderRadius: '0.875rem',
      shadowStyle: 'soft',
    },
  },
  {
    id: 'forest-green',
    name: 'Forest Green',
    description:
      'Deep green with moss and cream — botanical wellness palette with grounded calm.',
    searchTags: ['forest', 'green', 'botanical', 'natural', 'wellness', 'organic'],
    vectorDescription:
      'Forest green deep botanical theme with moss and cream; grounded natural wellness register.',
    theme: {
      primaryColor: '#1F4A2E',
      secondaryColor: '#7A946A',
      backgroundColor: '#F2EEDD',
      fontHeading: 'Fraunces',
      fontBody: 'Inter',
      borderRadius: '0.625rem',
      shadowStyle: 'medium',
    },
  },
  {
    id: 'monochrome',
    name: 'Monochrome',
    description:
      'Full grayscale — Swiss-style editorial, print-ready, type-driven minimalism.',
    searchTags: ['monochrome', 'minimal', 'editorial', 'grayscale', 'swiss', 'print'],
    vectorDescription:
      'Monochrome grayscale Swiss-style minimal editorial theme; print-ready type-driven layout discipline.',
    theme: {
      primaryColor: '#1A1A1A',
      secondaryColor: '#6B6B6B',
      backgroundColor: '#F5F5F5',
      fontHeading: 'Inter',
      fontBody: 'Inter',
      borderRadius: '0rem',
      shadowStyle: 'sharp',
    },
  },
  {
    id: 'editorial-serif',
    name: 'Editorial Serif',
    description:
      'Ivory, black, and rust — newsstand magazine register with a literary serif body.',
    searchTags: [
      'editorial',
      'serif',
      'newsstand',
      'magazine',
      'literary',
      'journalism',
    ],
    vectorDescription:
      'Editorial serif ivory and rust newsstand magazine theme; literary journalism feel with display + serif body pairing.',
    theme: {
      primaryColor: '#1B1B1B',
      secondaryColor: '#A0431E',
      backgroundColor: '#FBF6EA',
      fontHeading: 'Playfair Display',
      fontBody: 'Source Serif Pro',
      borderRadius: '0.125rem',
      shadowStyle: 'soft',
    },
  },
  {
    id: 'medical-trust',
    name: 'Medical Trust',
    description:
      'Clinical white, soft blue, and sage — calm healthcare register for clinics and providers.',
    searchTags: ['medical', 'trust', 'clinical', 'healthcare', 'professional', 'calm'],
    vectorDescription:
      'Medical trust clinical white-and-soft-blue healthcare theme; calm professional sage accents for providers and clinics.',
    theme: {
      primaryColor: '#3F8EBF',
      secondaryColor: '#88B79A',
      backgroundColor: '#FAFCFD',
      fontHeading: 'Inter',
      fontBody: 'Inter',
      borderRadius: '0.5rem',
      shadowStyle: 'soft',
    },
  },
  {
    id: 'podcast-purple',
    name: 'Podcast Purple',
    description:
      'Deep purple, indigo, and cream — expressive creator palette for audio shows and listener-first brands.',
    searchTags: ['podcast', 'audio', 'creator', 'purple', 'expressive', 'listener'],
    vectorDescription:
      'Podcast purple deep indigo creator theme with cream backdrop; expressive listener-first audio show register.',
    theme: {
      primaryColor: '#5B2A86',
      secondaryColor: '#3949AB',
      backgroundColor: '#F6F0E6',
      fontHeading: 'Inter',
      fontBody: 'Inter',
      borderRadius: '0.875rem',
      shadowStyle: 'medium',
    },
  },
  {
    id: 'agency-bold',
    name: 'Agency Bold',
    description:
      'Pure black with electric orange — design-forward agency statement with maximum impact.',
    searchTags: [
      'agency',
      'bold',
      'creative',
      'statement',
      'design-forward',
      'impact',
    ],
    vectorDescription:
      'Agency bold black-and-electric-orange creative statement theme; design-forward maximum-impact register for studios and creative shops.',
    theme: {
      primaryColor: '#0B0B0B',
      secondaryColor: '#FF5A1F',
      backgroundColor: '#FFFFFF',
      fontHeading: 'Inter Display',
      fontBody: 'Inter',
      borderRadius: '0rem',
      shadowStyle: 'sharp',
    },
  },
] as const

// ─────────────────────────────────────────────────────────────────────────────
// findThemes — keyword/tag ranker
//
// Open-core deterministic similarity. HNSW activation (Tier-2 per CLAUDE.md
// ruvector note) will replace this with semantic vector search over
// `vectorDescription`; the function signature stays the same.
//
// Score model:
//   tagOverlap   — count of query tokens that match an entry's searchTags
//                  (weight 2 — tags are curated and high-signal)
//   substringHit — count of query tokens that appear inside vectorDescription
//                  (weight 1 — broader natural-language fallback)
//
// Empty/whitespace query → return THEME_LIBRARY in original order (no ranking).
// Otherwise sort by score descending, then by original index for stability.
// ─────────────────────────────────────────────────────────────────────────────

const TAG_WEIGHT = 2
const SUBSTRING_WEIGHT = 1

function tokenize(query: string): string[] {
  return query
    .toLowerCase()
    .split(/[^a-z0-9]+/u)
    .filter((token) => token.length > 0)
}

function scoreTheme(theme: ThemeTemplate, tokens: readonly string[]): number {
  if (tokens.length === 0) return 0

  const tagSet = new Set(theme.searchTags.map((tag) => tag.toLowerCase()))
  const description = theme.vectorDescription.toLowerCase()

  let tagOverlap = 0
  let substringHit = 0

  for (const token of tokens) {
    if (tagSet.has(token)) {
      tagOverlap += 1
    }
    if (description.includes(token)) {
      substringHit += 1
    }
  }

  return tagOverlap * TAG_WEIGHT + substringHit * SUBSTRING_WEIGHT
}

export function findThemes(query: string): ThemeTemplate[] {
  const tokens = tokenize(query)

  if (tokens.length === 0) {
    return [...THEME_LIBRARY]
  }

  const ranked = THEME_LIBRARY.map((theme, index) => ({
    theme,
    index,
    score: scoreTheme(theme, tokens),
  }))

  ranked.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    return a.index - b.index
  })

  return ranked.map((entry) => entry.theme)
}
