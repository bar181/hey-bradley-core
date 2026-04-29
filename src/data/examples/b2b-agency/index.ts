import type { MasterConfig } from '@/lib/schemas'

/**
 * B2B Agency premium template — Sprint M Wave 1 (A3).
 * Voice: warm, confident, results-focused — small/mid B2B agency.
 * Palette: clay #c2410c / burnt umber #92400e / cream #fef3e2 / deep slate text.
 */
export const b2bAgencyConfig: MasterConfig = {
  site: {
    title: 'Wheelhouse Studio',
    description: 'A B2B brand & build studio for companies that have outgrown their first website',
    author: 'Wheelhouse Studio',
    email: 'hello@wheelhousestudio.co',
    domain: 'wheelhousestudio.co',
    project: 'wheelhouse-studio',
    version: '1.0.0-RC1',
    spec: 'aisp-1.2',
    purpose: 'agency',
    audience: 'business',
    tone: 'warm',
    brandName: 'Wheelhouse Studio',
    tagline: 'Brand, site, and story for B2B teams who are done sounding like everyone else.',
    voiceAttributes: ['warm', 'confident', 'results-focused', 'human'],
  },
  theme: {
    preset: 'agency',
    mode: 'light',
    palette: {
      bgPrimary: '#fef3e2',
      bgSecondary: '#fbe4c4',
      textPrimary: '#1c1917',
      textSecondary: '#57534e',
      accentPrimary: '#c2410c',
      accentSecondary: '#92400e',
    },
    alternatePalette: {
      bgPrimary: '#1c1917',
      bgSecondary: '#292524',
      textPrimary: '#fef3e2',
      textSecondary: '#d6d3d1',
      accentPrimary: '#fb923c',
      accentSecondary: '#f97316',
    },
    typography: {
      fontFamily: 'Inter',
      headingFamily: 'Fraunces',
      headingWeight: 600,
      baseSize: '17px',
      lineHeight: 1.65,
    },
    spacing: { sectionPadding: '96px', containerMaxWidth: '1200px', componentGap: '32px' },
    borderRadius: '6px',
  },
  sections: [
    {
      type: 'menu', id: 'navbar-01', enabled: true, order: -1, variant: 'simple',
      layout: { display: 'flex', padding: '0', gap: '24px' },
      style: { background: '#fef3e2', color: '#1c1917' },
      content: {},
      components: [
        { id: 'logo', type: 'text', enabled: true, order: 0, props: { text: 'Wheelhouse' } },
        { id: 'cta', type: 'button', enabled: true, order: 1, props: { text: 'Book an intro call', url: '#cta' } },
      ],
    },
    {
      type: 'hero', id: 'hero-01', enabled: true, order: 0, variant: 'minimal',
      layout: { display: 'flex', direction: 'column', align: 'start', gap: '28px', padding: '120px 24px 80px', maxWidth: '1100px' },
      style: { background: '#fef3e2', color: '#1c1917', fontFamily: 'Fraunces' },
      content: {},
      components: [
        { id: 'eyebrow', type: 'badge', enabled: true, order: 0, props: { text: 'B2B brand & build studio · Est. 2019', variant: 'pill' } },
        { id: 'headline', type: 'heading', enabled: true, order: 1, props: { text: 'Your second website should sound like the team that built the company.', level: 1, size: '64px', weight: 600 } },
        { id: 'subtitle', type: 'text', enabled: true, order: 2, props: { text: 'We work with B2B teams between Series A and Series C — usually right after a rebrand, a pivot, or a "the site doesn\'t match us anymore" all-hands. Brand, copy, and a site that closes.' } },
        { id: 'primaryCta', type: 'button', enabled: true, order: 3, props: { text: 'Book an intro call', url: '#cta', style: 'filled', size: 'lg' } },
        { id: 'secondaryCta', type: 'button', enabled: true, order: 4, props: { text: 'See how we work', url: '#process', style: 'outline', size: 'lg' } },
        { id: 'heroImage', type: 'image', enabled: false, order: 5, props: {} },
        { id: 'trustBadges', type: 'trust', enabled: true, order: 6, props: { text: 'Trusted by Northwind Logistics, Beacon Health, Foundry Robotics, Larkin Legal, and 40+ growing B2B teams.', show: true } },
      ],
    },
    {
      type: 'logos', id: 'logos-01', enabled: true, order: 1, variant: 'grid',
      layout: { display: 'grid', columns: 5, gap: '32px', padding: '48px 24px' },
      style: { background: '#fbe4c4', color: '#57534e' },
      content: { heading: 'Recent partners', subheading: 'A few of the teams we\'ve shipped with this year.' },
      components: [
        { id: 'l-1', type: 'logo', enabled: true, order: 0, props: { name: 'Northwind Logistics', alt: 'Northwind Logistics logo' } },
        { id: 'l-2', type: 'logo', enabled: true, order: 1, props: { name: 'Beacon Health', alt: 'Beacon Health logo' } },
        { id: 'l-3', type: 'logo', enabled: true, order: 2, props: { name: 'Foundry Robotics', alt: 'Foundry Robotics logo' } },
        { id: 'l-4', type: 'logo', enabled: true, order: 3, props: { name: 'Larkin Legal', alt: 'Larkin Legal logo' } },
        { id: 'l-5', type: 'logo', enabled: true, order: 4, props: { name: 'Cedar & Co.', alt: 'Cedar & Co. logo' } },
      ],
    },
    {
      type: 'numbers', id: 'process-01', enabled: true, order: 2, variant: 'steps',
      layout: { display: 'grid', columns: 4, gap: '40px', padding: '96px 24px' },
      style: { background: '#fef3e2', color: '#1c1917' },
      content: { heading: 'How we work', subheading: 'Four phases. Eight to twelve weeks. No surprise invoices.' },
      components: [
        { id: 'p-1', type: 'value-prop', enabled: true, order: 0, props: { value: '01', label: 'Discovery', description: 'A two-week deep-dive: your buyers, your sales calls, the words your team actually uses. We come out with a brief everyone agrees on.' } },
        { id: 'p-2', type: 'value-prop', enabled: true, order: 1, props: { value: '02', label: 'Design', description: 'Brand direction, voice guide, and three visual routes. We pick one together — then we stop debating and start building.' } },
        { id: 'p-3', type: 'value-prop', enabled: true, order: 2, props: { value: '03', label: 'Build', description: 'Copy, design, and a fast, accessible site. You see progress every Friday. Your team can edit it without us when we\'re done.' } },
        { id: 'p-4', type: 'value-prop', enabled: true, order: 3, props: { value: '04', label: 'Launch', description: 'We ship, monitor for two weeks, and hand over a runbook. Then we\'re a Slack message away — not a retainer.' } },
      ],
    },
    {
      type: 'columns', id: 'features-01', enabled: true, order: 3, variant: 'cards',
      layout: { display: 'grid', columns: 3, gap: '32px', padding: '96px 24px' },
      style: { background: '#fbe4c4', color: '#1c1917' },
      content: { heading: 'What we ship', subheading: 'Three services. We do them well; we don\'t do anything else.' },
      components: [
        { id: 's-1', type: 'feature-card', enabled: true, order: 0, props: { icon: 'compass', title: 'Brand & Positioning', description: 'Who you are, who you\'re for, and the single sentence that makes the rest of the site write itself. Voice, visual identity, and a one-page brand book your team will actually use.' } },
        { id: 's-2', type: 'feature-card', enabled: true, order: 1, props: { icon: 'pen-tool', title: 'Marketing Site', description: 'A fast, honest, conversion-aware site. Hand-built where it matters; CMS where you need it. Lighthouse 95+ on launch — and a year later.' } },
        { id: 's-3', type: 'feature-card', enabled: true, order: 2, props: { icon: 'message-square', title: 'Sales Story & Pitch', description: 'The deck, the explainer, and the case studies your AEs send before the demo. Same voice as the site, same numbers as the data room.' } },
      ],
    },
    {
      type: 'quotes', id: 'testimonials-01', enabled: true, order: 4, variant: 'cards',
      layout: { display: 'grid', columns: 2, gap: '32px', padding: '96px 24px' },
      style: { background: '#fef3e2', color: '#1c1917' },
      content: { heading: 'Case studies', subheading: 'Real engagements, real numbers, real names.' },
      components: [
        { id: 't-1', type: 'testimonial', enabled: true, order: 0, props: { quote: 'Inbound demo requests went from 6 a month to 31 in the first quarter post-launch. The Wheelhouse team rewrote our entire pitch around one sentence we kept saying on sales calls but never on the site.', author: 'Maya Okonkwo', role: 'Head of Marketing, Northwind Logistics', rating: 5 } },
        { id: 't-2', type: 'testimonial', enabled: true, order: 1, props: { quote: 'We\'d been through two agencies before Wheelhouse. The difference: they ran an actual discovery instead of skipping to mood boards. Our close rate on enterprise pilots is up 40%.', author: 'David Kestler', role: 'CEO, Foundry Robotics', rating: 5 } },
        { id: 't-3', type: 'testimonial', enabled: true, order: 2, props: { quote: 'Eight weeks, on budget, no drama. The site looks like us, sounds like us, and our SDRs stopped having to explain what we do on the first call.', author: 'Priya Raman', role: 'COO, Beacon Health', rating: 5 } },
        { id: 't-4', type: 'testimonial', enabled: true, order: 3, props: { quote: 'They write better than our content team. They design better than our last agency. And they push back when we\'re wrong, which is the part we didn\'t know we needed.', author: 'Tom Larkin', role: 'Managing Partner, Larkin Legal', rating: 5 } },
      ],
    },
    {
      type: 'team', id: 'team-01', enabled: true, order: 5, variant: 'grid',
      layout: { display: 'grid', columns: 3, gap: '32px', padding: '96px 24px' },
      style: { background: '#fbe4c4', color: '#1c1917' },
      content: { heading: 'The whole team', subheading: 'Five people. No account managers. The folks on the kickoff call are the folks doing the work.' },
      components: [
        { id: 'm-1', type: 'team-member', enabled: true, order: 0, props: { name: 'Rosa Beltrán', role: 'Founder & Strategy', bio: 'Fifteen years across B2B brand and growth. Previously at Pentagram and a pre-IPO logistics startup.' } },
        { id: 'm-2', type: 'team-member', enabled: true, order: 1, props: { name: 'Henrik Voss', role: 'Design Director', bio: 'Type-led, system-minded. Designs sites that still look right after the fourth product launch.' } },
        { id: 'm-3', type: 'team-member', enabled: true, order: 2, props: { name: 'Aisha Gupta', role: 'Lead Writer', bio: 'Spent six years on B2B sales floors before switching sides. Writes copy that sales teams actually quote.' } },
      ],
    },
    {
      type: 'action', id: 'cta-01', enabled: true, order: 6, variant: 'centered',
      layout: { display: 'flex', direction: 'column', align: 'center', padding: '120px 24px', gap: '24px' },
      style: { background: '#92400e', color: '#fef3e2' },
      content: {},
      components: [
        { id: 'heading', type: 'heading', enabled: true, order: 0, props: { text: 'Let\'s see if we\'re a fit.', level: 2, size: '44px', weight: 600 } },
        { id: 'subtitle', type: 'text', enabled: true, order: 1, props: { text: 'Thirty-minute intro call. We\'ll ask a lot of questions, you\'ll ask a few, and we\'ll both know by the end. No pitch deck, no follow-up sequence.' } },
        { id: 'button', type: 'button', enabled: true, order: 2, props: { text: 'Book an intro call', url: '#contact', style: 'filled', size: 'lg' } },
      ],
    },
    {
      type: 'footer', id: 'footer-01', enabled: true, order: 7, variant: 'multi-column',
      layout: { display: 'grid', columns: 4, gap: '32px', padding: '64px 24px' },
      style: { background: '#1c1917', color: '#fef3e2' },
      content: {},
      components: [
        { id: 'brand', type: 'footer-brand', enabled: true, order: 0, props: { text: 'Wheelhouse Studio — B2B brand & build, made in Brooklyn.' } },
        { id: 'col-1', type: 'footer-column', enabled: true, order: 1, props: { heading: 'Services', links: 'Brand,Marketing Site,Sales Story' } },
        { id: 'col-2', type: 'footer-column', enabled: true, order: 2, props: { heading: 'Studio', links: 'Work,Team,Process,Notes' } },
        { id: 'col-3', type: 'footer-column', enabled: true, order: 3, props: { heading: 'Contact', links: 'hello@wheelhousestudio.co,Brooklyn NY,LinkedIn' } },
        { id: 'copyright', type: 'footer-copyright', enabled: true, order: 4, props: { text: '© 2026 Wheelhouse Studio LLC. We answer email within a working day.' } },
      ],
    },
  ],
}

export default b2bAgencyConfig
