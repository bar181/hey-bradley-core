// P60 step 2 — Hey Bradley flagship config (the public site as a Hey Bradley project).
// Recreates README + public-site narrative as a buildable MasterConfig: hero, four
// moat priorities (features), scoreboard (numbers), AISP architecture (text), open
// core vs commercial (pricing), testimonials (quotes), CTA, footer. ≥8 sections,
// real copy, no Lorem.

import type { MasterConfig } from '@/lib/schemas'

const CRIMSON = '#A51C30'      // Harvard crimson — the brand accent
const ORANGE = '#e8772e'        // CTA accent
const CREAM = '#faf8f5'         // background
const PARCHMENT = '#f1ece4'     // section alt
const INK = '#2d1f12'           // text primary
const TAUPE = '#6b5e4f'         // text secondary

const heyBradleyFlagship: MasterConfig = {
  site: {
    title: 'Hey Bradley',
    description: 'A whiteboard that listens, builds what you describe in real-time, and secretly writes enterprise specs behind the scenes.',
    author: 'Bradley Ross',
    email: 'bar183@cornell.edu',
    domain: 'hey-bradley.dev',
    project: 'hey-bradley-flagship',
    version: '1.0.0-RC1',
    spec: 'aisp-1.2',
    purpose: 'saas',
    audience: 'developer',
    tone: 'technical',
    brandName: 'Hey Bradley',
    tagline: 'The whiteboard is the demo. The spec is the moat.',
    voiceAttributes: ['confident', 'spec-first', 'AISP-native'],
  },
  theme: {
    preset: 'wellness',
    mode: 'light',
    palette: {
      bgPrimary: CREAM,
      bgSecondary: PARCHMENT,
      textPrimary: INK,
      textSecondary: TAUPE,
      accentPrimary: CRIMSON,
      accentSecondary: ORANGE,
    },
    alternatePalette: {
      bgPrimary: INK,
      bgSecondary: '#3d2e1c',
      textPrimary: CREAM,
      textSecondary: '#c0b6a8',
      accentPrimary: ORANGE,
      accentSecondary: CRIMSON,
    },
    typography: {
      fontFamily: 'Inter',
      headingFamily: 'Instrument Serif',
      headingWeight: 600,
      baseSize: '17px',
      lineHeight: 1.65,
    },
    spacing: {
      sectionPadding: '120px',
      containerMaxWidth: '1180px',
      componentGap: '32px',
    },
    borderRadius: '12px',
  },
  sections: [
    {
      type: 'menu', id: 'navbar-01', enabled: true, order: -1, variant: 'simple',
      layout: { display: 'flex', gap: '28px', padding: '20px 32px' },
      style: { background: CREAM, color: INK },
      components: [
        { id: 'logo', type: 'text', enabled: true, order: 0, props: { text: 'Hey Bradley' } },
        { id: 'nav-aisp', type: 'link', enabled: true, order: 1, props: { text: 'AISP', url: '/aisp' } },
        { id: 'nav-blog', type: 'link', enabled: true, order: 2, props: { text: 'Blog', url: '/blog' } },
        { id: 'nav-progress', type: 'link', enabled: true, order: 3, props: { text: 'Progress', url: '/progress' } },
        { id: 'cta', type: 'button', enabled: true, order: 4, props: { text: 'Try it now', url: '/builder', style: 'filled' } },
      ],
      content: {},
    },
    {
      type: 'hero', id: 'hero-01', enabled: true, order: 0, variant: 'centered',
      layout: { display: 'flex', direction: 'column', align: 'center', gap: '32px', padding: '128px 24px 96px', maxWidth: '1080px' },
      style: { background: CREAM, color: INK, fontFamily: 'Instrument Serif', borderRadius: '0px' },
      components: [
        { id: 'eyebrow', type: 'badge', enabled: true, order: 0, props: { text: 'AISP 5.1 Platinum · Harvard Capstone May 2026 · v1.0.0-RC1', variant: 'pill' } },
        { id: 'headline', type: 'heading', enabled: true, order: 1, props: { text: 'Tell Bradley what you want. Watch it appear.', level: 1, size: '72px', weight: 600 } },
        { id: 'subtitle', type: 'text', enabled: true, order: 2, props: { text: 'A whiteboard that listens, builds what you describe in real-time, and secretly writes enterprise specs behind the scenes. Local-only. BYOK. No backend. The spec is the moat.' } },
        { id: 'primaryCta', type: 'button', enabled: true, order: 3, props: { text: 'Try it now', url: '/builder', style: 'filled', size: 'lg' } },
        { id: 'secondaryCta', type: 'button', enabled: true, order: 4, props: { text: 'Read the AISP spec', url: '/aisp', style: 'outline', size: 'lg' } },
        { id: 'tertiary', type: 'link', enabled: true, order: 5, props: { text: 'Open core on GitHub →', url: 'https://github.com/bar181/hey-bradley-core' } },
      ],
      content: {},
    },
    {
      type: 'columns', id: 'features-moat', enabled: true, order: 1, variant: 'default',
      layout: { display: 'grid', columns: 4, gap: '32px', padding: '96px 32px', maxWidth: '1180px' },
      style: { background: CREAM, color: INK },
      components: [
        { id: 'm1', type: 'feature-card', enabled: true, order: 0, props: { icon: 'gauge', title: 'Speed visible', description: 'Latency badge on every patch. "Updated in 0.8s." The user feels the speed; the screenshot proves it. Lovable doesn\'t show this. Framer doesn\'t show this. We do, by default. (Sprint K · ADR-077)' } },
        { id: 'm2', type: 'feature-card', enabled: true, order: 1, props: { icon: 'eye', title: 'Spec unmissable', description: 'AISP atom trace renders on 100% of replies, in every personality, not just EXPERT mode. Spec panel auto-opens on first patch. The reviewer sees the moat without prompting. (Sprint L · ADR-078)' } },
        { id: 'm3', type: 'feature-card', enabled: true, order: 2, props: { icon: 'palette', title: 'Premium templates', description: 'Strongly opinionated templates ship in the registry: SaaS founder, indie portfolio, B2B agency, conference site. Output reads "a designer made this," not "AI made this." (Sprint M · ADR-079)' } },
        { id: 'm4', type: 'feature-card', enabled: true, order: 3, props: { icon: 'share-2', title: 'Shareable output', description: 'Static HTML export plus a content-addressable hosted spec URL. Survives Slack, Twitter DMs, iMessage. "Built with Hey Bradley" attribution renders on every shared output. (Sprint N · ADR-081)' } },
      ],
      content: { heading: 'Four moat priorities. All shipped before this RC.', subheading: 'The strategic reframe at the top of v1.0.0-RC1 named four things that turn a polished open-source artifact into a category-defining product.' },
    },
    {
      type: 'numbers', id: 'numbers-scoreboard', enabled: true, order: 2, variant: 'default',
      layout: { display: 'grid', columns: 4, gap: '40px', padding: '96px 32px', maxWidth: '1180px' },
      style: { background: PARCHMENT, color: INK },
      components: [
        { id: 'n1', type: 'stat', enabled: true, order: 0, props: { value: '82', label: 'ADRs Accepted', sublabel: 'every architectural decision committed to history' } },
        { id: 'n2', type: 'stat', enabled: true, order: 1, props: { value: '366', label: 'PURE-UNIT tests GREEN', sublabel: 'AgentProxy backbone · $0 cost' } },
        { id: 'n3', type: 'stat', enabled: true, order: 2, props: { value: '8', label: 'sprints in 2 days', sublabel: 'wave-gate cadence with disjoint scopes' } },
        { id: 'n4', type: 'stat', enabled: true, order: 3, props: { value: '95', label: 'ruvector entries', sublabel: 'phases / ADRs / decisions / learnings indexed' } },
      ],
      content: { heading: 'The engineering scoreboard.', subheading: 'A capstone project that ships the rigor of an enterprise platform.' },
    },
    {
      type: 'text', id: 'aisp-architecture', enabled: true, order: 3, variant: 'default',
      layout: { display: 'flex', direction: 'column', gap: '24px', padding: '96px 32px', maxWidth: '900px' },
      style: { background: CREAM, color: INK },
      components: [
        { id: 'aisp-heading', type: 'heading', enabled: true, order: 0, props: { text: 'The 5-atom AISP Crystal Atom architecture.', level: 2, size: '40px', weight: 600 } },
        { id: 'aisp-body', type: 'text', enabled: true, order: 1, props: { text: 'Every Bradley reply emits a deterministic trace of five typed atoms. Each atom has a fixed Σ (signature), a verifier, and an ADR. The trace pane renders all five live; the EXPORT button ships them as a spec. PATCH (ADR-045) carries the JSON-Patch operations applied to the config tree. INTENT (ADR-053) carries the classified verb plus target type plus ordinal scope. SELECTION (ADR-057) carries the 2-step template choice with reasoning. CONTENT (ADR-060) carries section-aware generated copy. ASSUMPTIONS (ADR-064) carries the declared assumptions and proposed clarifications. Sub-2% ambiguity, by construction.' } },
        { id: 'aisp-cta', type: 'link', enabled: true, order: 2, props: { text: 'See AISP open core on GitHub →', url: 'https://github.com/bar181/aisp-open-core' } },
      ],
      content: {},
    },
    {
      type: 'pricing', id: 'pricing-open-core', enabled: true, order: 4, variant: 'two-column',
      layout: { display: 'grid', columns: 2, gap: '32px', padding: '96px 32px', maxWidth: '1180px' },
      style: { background: PARCHMENT, color: INK },
      components: [
        { id: 'tier-open', type: 'pricing-card', enabled: true, order: 0, props: { name: 'Open core', price: 'Free', cadence: 'forever', features: 'MIT license · clone, fork, self-host\nSingle-page sites · chat + listen + builder modes\nBYOK keys · runs entirely in your browser\nLocal SQLite · no backend, no telemetry\n.heybradley zip exports for portability\n5-provider LLM matrix · cost cap · 30-day audit retention', cta: 'Use open core →', url: 'https://github.com/bar181/hey-bradley-core' } },
        { id: 'tier-commercial', type: 'pricing-card', enabled: true, order: 1, props: { name: 'Commercial', price: 'Coming', cadence: 'post-MVP', features: 'Hosted demo without BYOK · account-based\nMulti-page sites + complex SPAs (dashboards, web apps)\nSupabase auth + persistence · team workspaces\nUpload references (style guides, brand voice, codebases)\nAgentic support system for existing codebases\nCommercial tiers (Starter / Pro / Enterprise)', cta: 'Email Bradley', url: 'mailto:bar183@cornell.edu', highlighted: true } },
      ],
      content: { heading: 'Open core today. Commercial when ready.', subheading: 'Everything you can self-host is in the open-core repo, MIT-licensed. The commercial path is a separate repo, post-MVP.' },
    },
    {
      type: 'quotes', id: 'testimonials-thesis', enabled: true, order: 5, variant: 'cards',
      layout: { display: 'grid', columns: 2, gap: '32px', padding: '96px 32px', maxWidth: '1180px' },
      style: { background: CREAM, color: INK },
      components: [
        { id: 'q1', type: 'testimonial', enabled: true, order: 0, props: { quote: 'The 55% problem is real. Most software work happens before coding — clarifying intent, scoping, writing the spec. Hey Bradley owns that layer; everyone else is downstream.', author: 'Capstone reviewer note', role: 'Harvard ALM advisor', avatarInitial: 'H' } },
        { id: 'q2', type: 'testimonial', enabled: true, order: 1, props: { quote: 'The whole pipeline runs on AgentProxy in tests. Zero real LLM cost during 8 sprints. Then BYOK at runtime. That is the right open-core boundary.', author: 'Engineering review', role: 'Open-core RC', avatarInitial: 'E' } },
      ],
      content: { heading: 'What people who read the spec say.', subheading: 'Harvard ALM Digital Media Design capstone · May 2026 defense.' },
    },
    {
      type: 'action', id: 'cta-final', enabled: true, order: 6, variant: 'default',
      layout: { display: 'flex', direction: 'column', align: 'center', gap: '24px', padding: '96px 32px', maxWidth: '900px' },
      style: { background: INK, color: CREAM },
      components: [
        { id: 'cta-heading', type: 'heading', enabled: true, order: 0, props: { text: 'The whiteboard is the demo. The spec is the moat.', level: 2, size: '48px', weight: 600 } },
        { id: 'cta-sub', type: 'text', enabled: true, order: 1, props: { text: 'Type something. Talk. Click. Hey Bradley builds and the spec writes itself. Open core, MIT-licensed, BYOK keys, no backend.' } },
        { id: 'cta-button', type: 'button', enabled: true, order: 2, props: { text: 'Try it now', url: '/builder', style: 'filled', size: 'lg' } },
        { id: 'cta-secondary', type: 'link', enabled: true, order: 3, props: { text: 'Read the build journal →', url: '/blog' } },
      ],
      content: {},
    },
    {
      type: 'footer', id: 'footer-01', enabled: true, order: 7, variant: 'simple',
      layout: { display: 'flex', gap: '32px', direction: 'row', justify: 'between', align: 'center', padding: '40px 32px' },
      style: { background: CREAM, color: TAUPE },
      components: [
        { id: 'brand', type: 'text', enabled: true, order: 0, props: { text: 'Hey Bradley · v1.0.0-RC1 · MIT' } },
        { id: 'links', type: 'text', enabled: true, order: 1, props: { text: 'AISP · GitHub · Blog · Docs' } },
        { id: 'attribution', type: 'text', enabled: true, order: 2, props: { text: 'Built with Hey Bradley · Harvard ALM Capstone · May 2026' } },
      ],
      content: {},
    },
  ],
}

export default heyBradleyFlagship
