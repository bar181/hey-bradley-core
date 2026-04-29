// P60 step 2 — AI Engineer Personal Site (Geek/Lars persona).
// Per template-audit.json recommendation #1. Aesthetic: monospace headings,
// deep navy + cyan accent, dense info layout, GitHub-flavored.
// Sections: navbar, hero, columns(features), blog (preview), quotes, footer.
// Real copy throughout — agentic-engineer voice.

import type { MasterConfig } from '@/lib/schemas'

const NAVY = '#0b1729'
const NAVY_DEEP = '#06101e'
const CYAN = '#22d3ee'
const SLATE = '#94a3b8'
const PAPER = '#f8fafc'
const INK = '#e2e8f0'

const aiEngineerPersonal: MasterConfig = {
  site: {
    title: 'Lars Halvorsen',
    description: 'Agentic engineer. Spec-first development. AISP open-core contributor.',
    author: 'Lars Halvorsen',
    email: 'lars@example.dev',
    domain: 'lars.dev',
    project: 'lars-halvorsen-personal',
    version: '1.0.0',
    spec: 'aisp-1.2',
    purpose: 'portfolio',
    audience: 'developer',
    tone: 'technical',
    brandName: 'Lars Halvorsen',
    tagline: 'I write specs that AI agents implement on the first attempt.',
    voiceAttributes: ['precise', 'technical', 'spec-first'],
  },
  theme: {
    preset: 'tech-business',
    mode: 'dark',
    palette: {
      bgPrimary: NAVY,
      bgSecondary: NAVY_DEEP,
      textPrimary: INK,
      textSecondary: SLATE,
      accentPrimary: CYAN,
      accentSecondary: '#67e8f9',
    },
    alternatePalette: {
      bgPrimary: PAPER,
      bgSecondary: '#e2e8f0',
      textPrimary: NAVY,
      textSecondary: '#475569',
      accentPrimary: '#0891b2',
      accentSecondary: '#0e7490',
    },
    typography: {
      fontFamily: 'Inter',
      headingFamily: 'JetBrains Mono',
      headingWeight: 600,
      baseSize: '16px',
      lineHeight: 1.6,
    },
    spacing: {
      sectionPadding: '96px',
      containerMaxWidth: '960px',
      componentGap: '24px',
    },
    borderRadius: '6px',
  },
  sections: [
    {
      type: 'menu', id: 'navbar-01', enabled: true, order: -1, variant: 'simple',
      layout: { display: 'flex', gap: '20px', padding: '20px 32px' },
      style: { background: NAVY, color: INK },
      components: [
        { id: 'logo', type: 'text', enabled: true, order: 0, props: { text: 'lars.dev' } },
        { id: 'nav-blog', type: 'link', enabled: true, order: 1, props: { text: 'writing', url: '#writing' } },
        { id: 'nav-github', type: 'link', enabled: true, order: 2, props: { text: 'github →', url: 'https://github.com/lars' } },
      ],
      content: {},
    },
    {
      type: 'hero', id: 'hero-01', enabled: true, order: 0, variant: 'split',
      layout: { display: 'flex', direction: 'column', align: 'start', gap: '20px', padding: '96px 32px 48px', maxWidth: '900px' },
      style: { background: NAVY, color: INK, fontFamily: 'JetBrains Mono', borderRadius: '0px' },
      components: [
        { id: 'eyebrow', type: 'text', enabled: true, order: 0, props: { text: '$ whoami' } },
        { id: 'headline', type: 'heading', enabled: true, order: 1, props: { text: 'I write specs that AI agents implement on the first attempt.', level: 1, size: '52px', weight: 600 } },
        { id: 'subtitle', type: 'text', enabled: true, order: 2, props: { text: 'Six years writing production TypeScript at agentic-engineering shops. Two years contributing to AISP open core. The 55% of software work that happens before coding is where I live.' } },
        { id: 'pillrow', type: 'badge', enabled: true, order: 3, props: { text: 'AISP-native · Claude Code · Cursor · DSPy · ruvector', variant: 'pill' } },
      ],
      content: {},
    },
    {
      type: 'columns', id: 'features-stack', enabled: true, order: 1, variant: 'default',
      layout: { display: 'grid', columns: 3, gap: '24px', padding: '48px 32px', maxWidth: '960px' },
      style: { background: NAVY_DEEP, color: INK },
      components: [
        { id: 'f1', type: 'feature-card', enabled: true, order: 0, props: { icon: 'code', title: 'Spec-first', description: 'Every feature ships with an AISP atom + ADR + a test that asserts the Σ shape. The spec is the work product.' } },
        { id: 'f2', type: 'feature-card', enabled: true, order: 1, props: { icon: 'cpu', title: 'Agentic', description: 'Wave-gate sprint cadence, 6-8 disjoint-scope agents per wave. The orchestrator holds the context; the agents do the work.' } },
        { id: 'f3', type: 'feature-card', enabled: true, order: 2, props: { icon: 'database', title: 'Telemetric', description: 'ruvector-backed learning runtime, HNSW index, semantic recall across phase logs and ADRs. The dev flywheel is the spec layer.' } },
      ],
      content: { heading: '// stack', subheading: 'spec-first, agentic, telemetric — the three patterns I use on every project.' },
    },
    {
      type: 'blog', id: 'blog-preview', enabled: true, order: 2, variant: 'cards',
      layout: { display: 'grid', columns: 2, gap: '24px', padding: '64px 32px', maxWidth: '960px' },
      style: { background: NAVY, color: INK },
      components: [
        { id: 'p1', type: 'blog-card', enabled: true, order: 0, props: { title: 'Why Jira Is Incompatible With Agentic Development', excerpt: 'The agentic engineer types one prompt and Claude Code returns 12 commits in 90 seconds. Then they open Jira to log it. The ticket form has no idea what just happened. That is the problem.', date: '2026-04-29', readingTime: '4 min', url: '/blog/jira-vs-agentics' } },
        { id: 'p2', type: 'blog-card', enabled: true, order: 1, props: { title: 'Six Sprints in Two Days: The Wave-Gate Pattern', excerpt: 'Most projects ship a sprint per fortnight. We shipped six in two days. Here is what made it possible: prompt discipline, the orchestrator session-context, and the docs as memory.', date: '2026-04-29', readingTime: '5 min', url: '/blog/six-sprints-two-days' } },
      ],
      content: { heading: '// writing', subheading: 'Notes on agentic engineering, AISP, and what happens before code.' },
    },
    {
      type: 'quotes', id: 'quotes-validation', enabled: true, order: 3, variant: 'single',
      layout: { display: 'flex', direction: 'column', align: 'center', gap: '20px', padding: '64px 32px', maxWidth: '760px' },
      style: { background: NAVY_DEEP, color: INK },
      components: [
        { id: 'qt1', type: 'testimonial', enabled: true, order: 0, props: { quote: 'Lars\' spec was clean enough that Claude Code shipped the whole sprint without a clarifying question. That happens almost never.', author: 'principal at a YC-backed dev tools company', role: 'verified collaborator' } },
      ],
      content: {},
    },
    {
      type: 'footer', id: 'footer-01', enabled: true, order: 4, variant: 'simple',
      layout: { display: 'flex', gap: '24px', direction: 'row', justify: 'between', align: 'center', padding: '32px' },
      style: { background: NAVY, color: SLATE },
      components: [
        { id: 'brand', type: 'text', enabled: true, order: 0, props: { text: 'lars.dev · spec-first since 2024' } },
        { id: 'links', type: 'text', enabled: true, order: 1, props: { text: 'github · twitter · email · rss' } },
        { id: 'attribution', type: 'text', enabled: true, order: 2, props: { text: 'Built with Hey Bradley' } },
      ],
      content: {},
    },
  ],
}

export default aiEngineerPersonal
