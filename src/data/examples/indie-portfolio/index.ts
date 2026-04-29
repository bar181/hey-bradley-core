import type { MasterConfig } from '@/lib/schemas'

// Indie Portfolio — Sprint M premium template (A2)
// Aesthetic: bold near-black canvas, oversized type, single coral accent.
// Distinct from A1 (SaaS Founder, corporate-confident) and A3 (B2B Agency, formal-trust).
// Voice: first-person, direct, opinionated. Real copy throughout.

const BG = '#0a0a0a'
const BG_ALT = '#141414'
const TEXT = '#f5f5f4'
const MUTE = '#a8a29e'
const ACCENT = '#f97316' // warm coral
const ACCENT_2 = '#fb923c'

const indiePortfolio: MasterConfig = {
  site: {
    title: 'Maya Okafor — Independent Designer',
    description: 'Independent product designer crafting interfaces for teams who care about details.',
    author: 'Maya Okafor',
    email: 'hello@mayaokafor.studio',
    domain: 'mayaokafor.studio',
    project: 'maya-okafor-portfolio',
    version: '1.0.0-RC1',
    spec: 'aisp-1.2',
    purpose: 'portfolio',
    audience: 'business',
    tone: 'bold',
    brandName: 'Maya Okafor',
    tagline: 'Interfaces for people who care about details.',
    voiceAttributes: ['direct', 'opinionated', 'craft-led'],
  },
  theme: {
    preset: 'creative',
    mode: 'dark',
    palette: {
      bgPrimary: BG,
      bgSecondary: BG_ALT,
      textPrimary: TEXT,
      textSecondary: MUTE,
      accentPrimary: ACCENT,
      accentSecondary: ACCENT_2,
    },
    typography: {
      fontFamily: 'Inter',
      headingFamily: 'Inter',
      headingWeight: 800,
      baseSize: '17px',
      lineHeight: 1.6,
    },
    spacing: {
      sectionPadding: '96px',
      containerMaxWidth: '1240px',
      componentGap: '32px',
    },
    borderRadius: '4px',
  },
  sections: [
    {
      type: 'hero',
      id: 'hero-indie-01',
      enabled: true,
      order: 0,
      variant: 'left-aligned',
      layout: { display: 'flex', direction: 'column', align: 'start', gap: '28px', padding: '128px 32px 96px', maxWidth: '1240px' },
      style: { background: BG, color: TEXT, fontFamily: 'Inter', borderRadius: '0px' },
      components: [
        { id: 'eyebrow', type: 'badge', enabled: true, order: 0, props: { text: 'Available May 2026', variant: 'pill' } },
        { id: 'headline', type: 'heading', enabled: true, order: 1, props: { text: 'I design interfaces for people who care about details.', level: 1, size: '88px', weight: 800 } },
        { id: 'subtitle', type: 'text', enabled: true, order: 2, props: { text: 'Maya Okafor — independent product designer working with founders and small teams on the parts of the product that decide whether anyone stays.' } },
        { id: 'primaryCta', type: 'button', enabled: true, order: 3, props: { text: 'See the work', url: '#work', style: 'filled', size: 'lg' } },
        { id: 'secondaryCta', type: 'button', enabled: true, order: 4, props: { text: 'Read about me', url: '#about', style: 'outline', size: 'lg' } },
        { id: 'heroImage', type: 'image', enabled: false, order: 5, props: {} },
        { id: 'trustBadges', type: 'trust', enabled: true, order: 6, props: { text: 'Past work · Linear · Arc · Notion · Vercel', show: true } },
      ],
      content: {},
    },
    {
      type: 'gallery',
      id: 'gallery-work-01',
      enabled: true,
      order: 1,
      variant: 'grid',
      layout: { display: 'grid', columns: 3, gap: '20px', padding: '64px 32px' },
      style: { background: BG, color: TEXT },
      components: [
        { id: 'g-1', type: 'gallery-image', enabled: true, order: 0, props: { url: '', alt: 'Mobile finance app — onboarding flow redesign', caption: 'Glide — onboarding rebuilt around one decision per screen.' } },
        { id: 'g-2', type: 'gallery-image', enabled: true, order: 1, props: { url: '', alt: 'Web dashboard — analytics rework', caption: 'Northbeam — analytics that read like a story, not a spreadsheet.' } },
        { id: 'g-3', type: 'gallery-image', enabled: true, order: 2, props: { url: '', alt: 'Editorial product page', caption: 'Marginalia — a reading app for books that argue with you.' } },
        { id: 'g-4', type: 'gallery-image', enabled: true, order: 3, props: { url: '', alt: 'Calendar interface concept', caption: 'Hours — a calendar for people who hate calendars.' } },
        { id: 'g-5', type: 'gallery-image', enabled: true, order: 4, props: { url: '', alt: 'Type-driven brand system', caption: 'Cipher — identity system for an indie security firm.' } },
        { id: 'g-6', type: 'gallery-image', enabled: true, order: 5, props: { url: '', alt: 'Settings interface case study', caption: 'Linear (contract) — settings that finally make sense.' } },
      ],
      content: { heading: 'Selected work', subheading: 'Six projects from the last two years. Case studies on request.' },
    },
    {
      type: 'numbers',
      id: 'numbers-services-01',
      enabled: true,
      order: 2,
      variant: 'three-up',
      layout: { display: 'grid', columns: 3, gap: '32px', padding: '96px 32px' },
      style: { background: BG_ALT, color: TEXT },
      components: [
        { id: 'n-1', type: 'stat', enabled: true, order: 0, props: { value: '01', label: 'Product design', description: 'End-to-end flows, from first sketch to shipped pixel. I work in Figma and the browser.' } },
        { id: 'n-2', type: 'stat', enabled: true, order: 1, props: { value: '02', label: 'Brand & identity', description: 'Type-driven systems for software people. Logos optional, opinions included.' } },
        { id: 'n-3', type: 'stat', enabled: true, order: 2, props: { value: '03', label: 'Design audits', description: 'A two-week deep-read of your product. You get a 40-page document and a much shorter list.' } },
      ],
      content: { heading: 'What I do', subheading: 'Three things, done well, on a four-week minimum.' },
    },
    {
      type: 'text',
      id: 'text-about-01',
      enabled: true,
      order: 3,
      variant: 'single',
      layout: { display: 'flex', direction: 'column', gap: '24px', padding: '96px 32px', maxWidth: '760px' },
      style: { background: BG, color: TEXT },
      components: [
        { id: 'body', type: 'text', enabled: true, order: 0, props: { body: "I have been a designer for nine years and independent for four. Before that I was on the design team at Linear and led brand at a small fintech in Lagos.\n\nI take on three or four projects a year. I work alone, I write my own contracts, and I don't subcontract. If we work together you get me, the whole time.\n\nI care about typography, restraint, and shipping. I am suspicious of frameworks, allergic to Lorem ipsum, and convinced that most products are one round of edits away from being good." } },
      ],
      content: { heading: 'About', subheading: '' },
    },
    {
      type: 'quotes',
      id: 'quotes-01',
      enabled: true,
      order: 4,
      variant: 'large',
      layout: { display: 'flex', direction: 'column', align: 'center', gap: '48px', padding: '96px 32px', maxWidth: '900px' },
      style: { background: BG_ALT, color: TEXT },
      components: [
        { id: 'q-1', type: 'quote', enabled: true, order: 0, props: { text: 'Maya rebuilt our onboarding in three weeks and our day-7 retention jumped eleven points. She pushed back on every assumption we had and was right about most of them.', author: 'Priya Raman', role: 'Co-founder, Glide' } },
        { id: 'q-2', type: 'quote', enabled: true, order: 1, props: { text: 'Working with Maya is like hiring a senior design lead who already knows your product. She wrote better copy than our copywriter and shipped a brand system in a month.', author: 'Daniel Voss', role: 'CEO, Northbeam' } },
      ],
      content: { heading: 'Kind words', subheading: '' },
    },
    {
      type: 'action',
      id: 'cta-01',
      enabled: true,
      order: 5,
      variant: 'centered',
      layout: { display: 'flex', direction: 'column', align: 'center', padding: '128px 32px', gap: '24px' },
      style: { background: BG, color: TEXT },
      components: [
        { id: 'heading', type: 'heading', enabled: true, order: 0, props: { text: "Let's work together.", level: 2, size: '64px', weight: 800 } },
        { id: 'subtitle', type: 'text', enabled: true, order: 1, props: { text: 'I take new projects starting May 2026. Tell me what you are building, who it is for, and what is broken.' } },
        { id: 'button', type: 'button', enabled: true, order: 2, props: { text: 'Email me', url: 'mailto:hello@mayaokafor.studio', style: 'filled', size: 'lg' } },
      ],
      content: {},
    },
    {
      type: 'footer',
      id: 'footer-01',
      enabled: true,
      order: 6,
      variant: 'simple',
      layout: { display: 'flex', gap: '32px', direction: 'row', justify: 'between', align: 'center', padding: '40px 32px' },
      style: { background: BG, color: MUTE },
      components: [
        { id: 'brand', type: 'footer-brand', enabled: true, order: 0, props: { text: 'Maya Okafor — Studio of one, since 2022.' } },
        { id: 'links', type: 'footer-column', enabled: true, order: 1, props: { heading: 'Elsewhere', links: 'Are.na,Read.cv,Email,LinkedIn' } },
        { id: 'copyright', type: 'footer-copyright', enabled: true, order: 2, props: { text: '© 2026 Maya Okafor. Hand-built in Lagos and Lisbon.' } },
      ],
      content: {},
    },
  ],
}

export default indiePortfolio
