// Sprint M Wave 1 — Premium Template: SaaS Founder
// Founder-narrative-led SaaS template. Distinct from `launchpad` (dark, AI-platform).
// Aesthetic: whitespace-heavy, light mode, slate/blue palette, Inter typography.
// Section order: menu, hero, columns(features), numbers(proof), text(founder story),
// pricing, quotes(testimonials), action(cta), footer.
import type { MasterConfig } from '@/lib/schemas'

const PRIMARY = '#2563eb'   // blue-600
const PRIMARY_DARK = '#1e40af' // blue-800
const SLATE_900 = '#0f172a'
const SLATE_500 = '#64748b'
const SLATE_100 = '#f1f5f9'
const WHITE = '#ffffff'

const saasFounder: MasterConfig = {
  site: {
    title: 'Linewise',
    description: 'Pricing software for founders who hate guessing what to charge.',
    author: 'Linewise',
    email: 'hello@linewise.com',
    domain: 'linewise.com',
    project: 'linewise',
    version: '1.0.0-RC1',
    spec: 'aisp-1.2',
    purpose: 'saas',
    audience: 'business',
    tone: 'warm',
    brandName: 'Linewise',
    tagline: 'Stop guessing what to charge.',
    voiceAttributes: ['direct', 'founder-led', 'plainspoken'],
  },
  theme: {
    preset: 'saas',
    mode: 'light',
    palette: {
      bgPrimary: WHITE,
      bgSecondary: SLATE_100,
      textPrimary: SLATE_900,
      textSecondary: SLATE_500,
      accentPrimary: PRIMARY,
      accentSecondary: PRIMARY_DARK,
    },
    alternatePalette: {
      bgPrimary: SLATE_900,
      bgSecondary: '#1e293b',
      textPrimary: WHITE,
      textSecondary: '#cbd5e1',
      accentPrimary: '#60a5fa',
      accentSecondary: '#93c5fd',
    },
    typography: {
      fontFamily: 'Inter',
      headingFamily: 'Inter',
      headingWeight: 700,
      baseSize: '17px',
      lineHeight: 1.7,
    },
    spacing: {
      sectionPadding: '112px',
      containerMaxWidth: '1120px',
      componentGap: '32px',
    },
    borderRadius: '10px',
  },
  sections: [
    {
      type: 'menu', id: 'navbar-01', enabled: true, order: -1, variant: 'simple',
      layout: { display: 'flex', gap: '24px', padding: '20px 32px' },
      style: { background: WHITE, color: SLATE_900 },
      components: [
        { id: 'logo', type: 'text', enabled: true, order: 0, props: { text: 'Linewise' } },
        { id: 'cta', type: 'button', enabled: true, order: 1, props: { text: 'Start free', url: '#pricing' } },
      ],
      content: {},
    },
    {
      type: 'hero', id: 'hero-01', enabled: true, order: 0, variant: 'centered',
      layout: { display: 'flex', direction: 'column', align: 'center', gap: '28px', padding: '128px 24px 96px', maxWidth: '960px' },
      style: { background: WHITE, color: SLATE_900, fontFamily: 'Inter', borderRadius: '0px' },
      components: [
        { id: 'eyebrow', type: 'badge', enabled: true, order: 0, props: { text: 'Built by a founder, for founders', variant: 'pill' } },
        { id: 'headline', type: 'heading', enabled: true, order: 1, props: { text: "Stop building features your customers don't want.", level: 1, size: '64px', weight: 700 } },
        { id: 'subtitle', type: 'text', enabled: true, order: 2, props: { text: 'Linewise tells you what your next-best customer will actually pay for, in plain English, in under five minutes. No focus groups. No 80-page reports. Just the answer.' } },
        { id: 'primaryCta', type: 'button', enabled: true, order: 3, props: { text: 'Start free — 14 days', url: '#pricing', style: 'filled', size: 'lg' } },
        { id: 'secondaryCta', type: 'button', enabled: true, order: 4, props: { text: 'See how it works', url: '#story', style: 'outline', size: 'lg' } },
        { id: 'heroImage', type: 'image', enabled: false, order: 5, props: {} },
        { id: 'trustBadges', type: 'trust', enabled: true, order: 6, props: { text: 'Used by 1,200+ founding teams from seed to Series B', show: true } },
      ],
      content: {},
    },
    {
      type: 'columns', id: 'features-01', enabled: true, order: 1, variant: 'default',
      layout: { display: 'grid', columns: 3, gap: '40px', padding: '96px 32px', maxWidth: '1120px' },
      style: { background: WHITE, color: SLATE_900 },
      components: [
        { id: 'f1', type: 'feature-card', enabled: true, order: 0, props: { icon: 'message-square', title: 'Ask the right question', description: 'Linewise turns a vague pricing hunch into a sharp, testable question your real customers can answer in 30 seconds.' } },
        { id: 'f2', type: 'feature-card', enabled: true, order: 1, props: { icon: 'users', title: 'Talk to the right people', description: 'We route your survey to your highest-intent users — the ones who already opened a billing email this month.' } },
        { id: 'f3', type: 'feature-card', enabled: true, order: 2, props: { icon: 'compass', title: 'Get an answer, not a dashboard', description: 'One paragraph. One recommended price. One clear reason. No charts to interpret at 11pm.' } },
      ],
      content: { heading: 'Three steps. One honest answer.', subheading: 'Pricing decisions you can defend in your next board meeting.' },
    },
    {
      type: 'numbers', id: 'numbers-01', enabled: true, order: 2, variant: 'default',
      layout: { display: 'grid', columns: 3, gap: '32px', padding: '80px 32px', maxWidth: '1120px' },
      style: { background: SLATE_100, color: SLATE_900 },
      components: [
        { id: 'n1', type: 'value-prop', enabled: true, order: 0, props: { value: '4.2x', label: 'Avg. revenue lift', description: 'Within 90 days of first reprice' } },
        { id: 'n2', type: 'value-prop', enabled: true, order: 1, props: { value: '<5 min', label: 'From question to answer', description: 'Median time across all plans' } },
        { id: 'n3', type: 'value-prop', enabled: true, order: 2, props: { value: '1,200+', label: 'Founding teams', description: 'From pre-seed to Series B' } },
      ],
      content: { heading: 'Numbers we are proud to put a name on.', subheading: 'Every figure here is from real Linewise accounts in the last 12 months.' },
    },
    {
      type: 'text', id: 'story-01', enabled: true, order: 3, variant: 'default',
      layout: { display: 'flex', direction: 'column', padding: '96px 32px', maxWidth: '720px', gap: '24px' },
      style: { background: WHITE, color: SLATE_900 },
      components: [
        { id: 'eyebrow', type: 'text', enabled: true, order: 0, props: { text: 'Why I built this' } },
        { id: 'heading', type: 'heading', enabled: true, order: 1, props: { text: 'I shipped the wrong feature for two years straight.', level: 2, size: '40px', weight: 700 } },
        { id: 'body1', type: 'text', enabled: true, order: 2, props: { text: 'My last company died with $180k in the bank and a roadmap full of features nobody asked for. We had thousands of users. We had a Slack full of feedback. We still got it wrong, every single quarter.' } },
        { id: 'body2', type: 'text', enabled: true, order: 3, props: { text: 'The problem was never that we lacked data. The problem was that nobody — not me, not my designers, not my advisors — could look at the data and tell me which line on the spreadsheet would actually move revenue. I was guessing in a very expensive font.' } },
        { id: 'body3', type: 'text', enabled: true, order: 4, props: { text: 'Linewise is the tool I wish I had on day one. It does exactly one thing, and it does it in plain English: it tells you what your next paying customer is willing to pay for. Then you go build that. Nothing else.' } },
        { id: 'signoff', type: 'text', enabled: true, order: 5, props: { text: '— Maya Okafor, Founder & CEO' } },
      ],
      content: {},
    },
    {
      type: 'pricing', id: 'pricing-01', enabled: true, order: 4, variant: 'default',
      layout: { display: 'flex', gap: '24px', padding: '96px 32px', maxWidth: '1120px' },
      style: { background: SLATE_100, color: SLATE_900 },
      components: [
        { id: 'tier-1', type: 'pricing-tier', enabled: true, order: 0, props: { name: 'Starter', price: '$0', period: 'month', features: '1 active question,Up to 100 responses,Plain-English answer,Email-only support', ctaText: 'Start free', ctaUrl: '#signup', highlighted: false } },
        { id: 'tier-2', type: 'pricing-tier', enabled: true, order: 1, props: { name: 'Founder', price: '$49', period: 'month', features: 'Unlimited questions,Up to 2,500 responses,Customer-segment routing,Slack + email support,Reprice playbook', ctaText: 'Start 14-day trial', ctaUrl: '#signup', highlighted: true } },
        { id: 'tier-3', type: 'pricing-tier', enabled: true, order: 2, props: { name: 'Team', price: '$149', period: 'month', features: 'Everything in Founder,Unlimited responses,Multi-product support,SSO + audit log,Quarterly review with Maya', ctaText: 'Talk to us', ctaUrl: '#contact', highlighted: false } },
      ],
      content: { heading: 'Pricing that respects the runway.', subheading: 'Pay monthly. Cancel anytime. No annual contracts disguised as discounts.' },
    },
    {
      type: 'quotes', id: 'quotes-01', enabled: true, order: 5, variant: 'default',
      layout: { display: 'grid', columns: 2, gap: '32px', padding: '96px 32px', maxWidth: '1120px' },
      style: { background: WHITE, color: SLATE_900 },
      components: [
        { id: 'q1', type: 'quote', enabled: true, order: 0, props: { text: 'We doubled our seat price the week we ran our first Linewise question. Nobody churned. The hardest part was admitting we had been undercharging for fourteen months.', author: 'Devon Park', role: 'CEO, Inkline (Series A)' } },
        { id: 'q2', type: 'quote', enabled: true, order: 1, props: { text: 'I have used every pricing tool on the market. They all hand you a 40-page deck. Linewise hands you a sentence you can paste into Slack and act on by lunchtime.', author: 'Priya Raghavan', role: 'Founder, Backbench (seed)' } },
      ],
      content: { heading: 'Founders who repriced this quarter.', subheading: '' },
    },
    {
      type: 'action', id: 'cta-01', enabled: true, order: 6, variant: 'default',
      layout: { display: 'flex', direction: 'column', align: 'center', padding: '112px 32px', gap: '20px' },
      style: { background: PRIMARY, color: WHITE },
      components: [
        { id: 'heading', type: 'heading', enabled: true, order: 0, props: { text: 'Find out what your customers will actually pay.', level: 2, size: '40px', weight: 700 } },
        { id: 'subtitle', type: 'text', enabled: true, order: 1, props: { text: 'Free for 14 days. No credit card. The first answer usually pays for the year.' } },
        { id: 'button', type: 'button', enabled: true, order: 2, props: { text: 'Start free', url: '#signup', style: 'filled', size: 'lg' } },
      ],
      content: {},
    },
    {
      type: 'footer', id: 'footer-01', enabled: true, order: 7, variant: 'multi-column',
      layout: { display: 'grid', columns: 4, gap: '32px', padding: '64px 32px' },
      style: { background: SLATE_900, color: WHITE },
      components: [
        { id: 'brand', type: 'footer-brand', enabled: true, order: 0, props: { text: 'Linewise' } },
        { id: 'col-1', type: 'footer-column', enabled: true, order: 1, props: { heading: 'Product', links: 'How it works,Pricing,Changelog,Status' } },
        { id: 'col-2', type: 'footer-column', enabled: true, order: 2, props: { heading: 'Company', links: 'Founder story,Customers,Careers,Contact' } },
        { id: 'col-3', type: 'footer-column', enabled: true, order: 3, props: { heading: 'Legal', links: 'Privacy,Terms,Security,DPA' } },
        { id: 'copyright', type: 'footer-copyright', enabled: true, order: 4, props: { text: '© 2026 Linewise, Inc. Made by founders, in Lisbon and Brooklyn.' } },
      ],
      content: {},
    },
  ],
}

export default saasFounder
