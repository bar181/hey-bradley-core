/**
 * Shared helpers for all 6 spec generators.
 * Pure mappings — no React, no store, no side effects.
 */

// ---------------------------------------------------------------------------
// Section type descriptions
// ---------------------------------------------------------------------------

export const SECTION_DESCRIPTIONS: Record<string, string> = {
  hero: 'The main banner visitors see first — headline, subtitle, call-to-action, and optional background image or video.',
  menu: 'Top navigation bar with logo/brand name and primary CTA button.',
  columns: 'Multi-column content cards — features, services, or highlights displayed in a grid layout.',
  pricing: 'Pricing tiers with feature lists, highlighted plans, and action buttons.',
  action: 'Call-to-action block with headline, supporting text, and a prominent button.',
  footer: 'Site footer with brand info, navigation columns, and copyright notice.',
  quotes: 'Customer testimonials or reviews displayed as cards with author attribution.',
  questions: 'Frequently asked questions in accordion, card, or numbered format.',
  numbers: 'Key statistics or metrics displayed with large counter values and labels.',
  gallery: 'Image gallery in grid, masonry, carousel, or full-width layout.',
  logos: 'Partner or client logo cloud — grid, simple row, or animated marquee.',
  team: 'Team member cards with photos, names, roles, and optional bios.',
  image: 'Standalone image section — full-width, with text overlay, or parallax.',
  divider: 'Visual separator — decorative line, space, or ornamental divider.',
  text: 'Text content block — single column, two-column, or with sidebar.',
}

// ---------------------------------------------------------------------------
// Section type → user story mapping
// ---------------------------------------------------------------------------

export const SECTION_USER_STORIES: Record<string, { want: string; benefit: string }> = {
  hero: { want: 'see a compelling first impression with headline and call-to-action', benefit: 'I immediately understand what this business offers and can take action' },
  menu: { want: 'navigate the site easily with a clear top bar', benefit: 'I can find any section quickly' },
  columns: { want: 'see key features or services at a glance in a structured layout', benefit: 'I can compare offerings and find what interests me' },
  pricing: { want: 'compare pricing tiers with clear feature breakdowns', benefit: 'I can choose the right plan for my needs' },
  action: { want: 'see a clear call-to-action that tells me what to do next', benefit: 'I can convert or take the next step easily' },
  footer: { want: 'find contact info, links, and legal details at the bottom', benefit: 'I can navigate to supporting pages or get in touch' },
  quotes: { want: 'read testimonials from real customers', benefit: 'I gain trust and social proof before making a decision' },
  questions: { want: 'find answers to common questions', benefit: 'I can resolve doubts without contacting support' },
  numbers: { want: 'see key metrics and achievements at a glance', benefit: 'I understand the scale and credibility of this business' },
  gallery: { want: 'browse visual examples of work or products', benefit: 'I can assess quality and style before engaging' },
  logos: { want: 'see which companies or partners trust this business', benefit: 'I gain confidence through brand association' },
  team: { want: 'see the people behind the business', benefit: 'I build personal connection and trust' },
  image: { want: 'see a full-width visual that sets the mood', benefit: 'I experience the brand atmosphere visually' },
  divider: { want: 'see clear visual separation between content blocks', benefit: 'the page feels organized and easy to scan' },
  text: { want: 'read detailed information about the business', benefit: 'I get the depth I need to make a decision' },
}

// ---------------------------------------------------------------------------
// Human-readable section labels
// ---------------------------------------------------------------------------

export const SECTION_LABELS: Record<string, string> = {
  hero: 'Hero Banner',
  menu: 'Navigation Bar',
  columns: 'Columns / Features',
  pricing: 'Pricing',
  action: 'Call to Action',
  footer: 'Footer',
  quotes: 'Testimonials',
  questions: 'FAQ',
  numbers: 'Numbers / Stats',
  gallery: 'Gallery',
  logos: 'Logo Cloud',
  team: 'Team',
  image: 'Image',
  divider: 'Divider',
  text: 'Text Block',
}

// ---------------------------------------------------------------------------
// Variant descriptions
// ---------------------------------------------------------------------------

export const VARIANT_DESCRIPTIONS: Record<string, Record<string, string>> = {
  hero: {
    centered: 'Centered layout — content stacked vertically, text-align center',
    split: 'Split layout — text on left, image on right (or reversed)',
    overlay: 'Full-bleed background image with text overlay and gradient scrim',
    minimal: 'Minimal hero — headline and CTA only, no image, maximum whitespace',
  },
  columns: {
    cards: 'Card grid — each item in a bordered card with padding and shadow',
    'image-cards': 'Image cards — cards with top image, title, and description below',
    glass: 'Glass morphism — translucent cards with backdrop blur',
    gradient: 'Gradient background cards with color overlay',
    horizontal: 'Horizontal layout — icon/image left, text right per item',
    'icon-text': 'Icon + text — centered icon above title and description',
    minimal: 'Minimal — clean text-only list without borders',
    numbered: 'Numbered items — large step number with title and description',
  },
  quotes: {
    cards: 'Card layout — individual testimonial cards in a grid',
    minimal: 'Minimal — simple text quotes with author attribution',
    single: 'Single featured quote — one large testimonial',
    stars: 'Star rating cards — quote with star rating display',
  },
  action: {
    centered: 'Centered CTA — headline, subtitle, and button stacked center',
    split: 'Split CTA — text on left, button on right',
    gradient: 'Gradient background CTA with overlay effect',
    newsletter: 'Newsletter signup — email input with subscribe button',
  },
  gallery: {
    grid: 'Uniform grid — equal-size thumbnails',
    masonry: 'Masonry layout — variable height tiles',
    carousel: 'Horizontal scrolling carousel',
    'full-width': 'Full-bleed single image display',
  },
  footer: {
    'multi-column': 'Multi-column — brand, navigation columns, copyright',
    simple: 'Simple — single line with brand and copyright',
    'simple-bar': 'Simple bar — minimal horizontal bar',
    minimal: 'Minimal — just copyright text',
  },
  numbers: {
    counters: 'Large counter values with labels below',
    cards: 'Numbers in bordered cards',
    gradient: 'Gradient background number display',
    icons: 'Number with icon above',
  },
  questions: {
    accordion: 'Expandable accordion — click to reveal answers',
    cards: 'FAQ cards — question and answer visible in card layout',
    numbered: 'Numbered list with question/answer pairs',
    'two-col': 'Two-column layout — questions left, answers right',
  },
  logos: {
    simple: 'Simple row of logos',
    grid: 'Logo grid layout',
    marquee: 'Animated horizontal scrolling marquee',
  },
  team: {
    cards: 'Team member cards with photo, name, role',
    grid: 'Grid layout for larger teams',
    minimal: 'Minimal text-only list',
  },
  image: {
    'full-width': 'Full-bleed image spanning container',
    'with-text': 'Image with text overlay or caption',
    overlay: 'Dark overlay with text on top',
    parallax: 'Parallax scroll effect background',
  },
  pricing: {
    tiers: 'Side-by-side pricing tier cards',
    toggle: 'Monthly/annual toggle with animated price switch',
    comparison: 'Feature comparison table — tier columns with feature rows, checkmarks, and sticky header',
  },
  text: {
    single: 'Single column centered text',
    'two-column': 'Two-column text layout',
    'with-sidebar': 'Main text with sidebar content',
  },
  divider: {
    line: 'Thin horizontal line',
    decorative: 'Decorative ornamental divider',
    space: 'Empty vertical spacer',
  },
  menu: {
    simple: 'Horizontal navbar — logo left, nav links center, CTA right',
    centered: 'Centered navbar — logo stacked above centered nav links',
  },
}

// ---------------------------------------------------------------------------
// Component type → human description
// ---------------------------------------------------------------------------

export const COMPONENT_DESCRIPTIONS: Record<string, string> = {
  heading: 'Heading text',
  text: 'Body text / paragraph',
  button: 'Call-to-action button',
  badge: 'Eyebrow badge / pill label',
  image: 'Image',
  video: 'Video background',
  trust: 'Trust badge / social proof line',
  'feature-card': 'Feature card with icon, title, description',
  testimonial: 'Customer testimonial with quote and author',
  'value-prop': 'Statistic / number with label',
  'footer-brand': 'Footer brand / logo text',
  'footer-column': 'Footer navigation column',
  'footer-copyright': 'Copyright notice',
  'gallery-item': 'Gallery image item',
  'logo-item': 'Partner / client logo',
  'team-member': 'Team member card',
  'pricing-tier': 'Pricing plan card',
  'faq-item': 'FAQ question and answer',
}

// ---------------------------------------------------------------------------
// Palette slot → human name
// ---------------------------------------------------------------------------

export function describePaletteSlot(slot: string): string {
  const map: Record<string, string> = {
    bgPrimary: 'Primary background',
    bgSecondary: 'Secondary background',
    textPrimary: 'Primary text',
    textSecondary: 'Secondary text',
    accentPrimary: 'Primary accent',
    accentSecondary: 'Secondary accent',
  }
  return map[slot] || slot
}

// ---------------------------------------------------------------------------
// Theme preset → mood
// ---------------------------------------------------------------------------

export const PRESET_MOODS: Record<string, string> = {
  saas: 'Technical, confident, modern dark interface',
  agency: 'Bold, creative, collaborative energy',
  portfolio: 'Artistic, minimal, image-focused',
  blog: 'Warm, readable, content-first',
  startup: 'Futuristic, energetic, motion-forward',
  personal: 'Approachable, friendly, authentic',
  professional: 'Corporate, trustworthy, clean',
  wellness: 'Natural, warm, organic feeling',
  creative: 'Vibrant, expressive, unconventional',
  minimalist: 'Ultra-clean, typography-focused, restrained',
}

// ---------------------------------------------------------------------------
// Utility: extract full text from a component (NO truncation)
// ---------------------------------------------------------------------------

export function getComponentText(comp: { props?: Record<string, unknown> }): string {
  const p = comp.props ?? {}
  const text = p.text as string | undefined
  const quote = p.quote as string | undefined
  const description = p.description as string | undefined
  const name = p.name as string | undefined
  const title = p.title as string | undefined
  const heading = p.heading as string | undefined
  const label = p.label as string | undefined
  const value = p.value as string | undefined

  if (text) return text
  if (quote) return quote
  if (title && description) return `${title}: ${description}`
  if (title) return title
  if (name) return name
  if (heading) return heading
  if (label && value) return `${value} — ${label}`
  if (label) return label
  return ''
}

// ---------------------------------------------------------------------------
// Utility: extract all component props as key-value pairs
// ---------------------------------------------------------------------------

export function describeComponentProps(comp: { id: string; type: string; props?: Record<string, unknown> }): string[] {
  const p = comp.props ?? {}
  const lines: string[] = []
  for (const [key, val] of Object.entries(p)) {
    if (val === undefined || val === null || val === '') continue
    if (typeof val === 'string' && val.length > 0) {
      lines.push(`${key}: "${val}"`)
    } else if (typeof val === 'number' || typeof val === 'boolean') {
      lines.push(`${key}: ${val}`)
    }
  }
  return lines
}
