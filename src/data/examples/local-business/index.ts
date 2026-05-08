// P60 step 2 — Local Business template (Grandma persona).
// Per template-audit.json recommendation #4. Aesthetic: warm photography,
// friendly serif headings, hours-and-location prominent. Defaults that work
// for a non-technical owner without copy-tuning.
// Sections: navbar, hero, gallery, action(hours+location CTA), team, footer.

import type { MasterConfig } from '@/lib/schemas'

const TERRACOTTA = '#c2410c'
const TERRACOTTA_DEEP = '#9a3412'
const CREAM = '#fef9f3'
const PARCHMENT = '#fdf6ec'
const INK = '#3a2412'
const TAUPE = '#7a6757'

const localBusiness: MasterConfig = {
  site: {
    title: 'Marigold & Co.',
    description: 'Family-owned florist on Main Street. Fresh arrangements daily, locally sourced.',
    author: 'Marigold & Co.',
    email: 'hello@marigold.example',
    domain: 'marigold.example',
    project: 'marigold-florist',
    version: '1.0.0',
    spec: 'aisp-1.2',
    purpose: 'agency',
    audience: 'consumer',
    tone: 'warm',
    brandName: 'Marigold & Co.',
    tagline: 'Hand-tied bouquets, since 1987.',
    voiceAttributes: ['warm', 'neighborly', 'honest'],
  },
  theme: {
    preset: 'wellness',
    mode: 'light',
    palette: {
      bgPrimary: CREAM,
      bgSecondary: PARCHMENT,
      textPrimary: INK,
      textSecondary: TAUPE,
      accentPrimary: TERRACOTTA,
      accentSecondary: TERRACOTTA_DEEP,
    },
    alternatePalette: {
      bgPrimary: INK,
      bgSecondary: '#4a3220',
      textPrimary: CREAM,
      textSecondary: '#c4b8a8',
      accentPrimary: '#fb923c',
      accentSecondary: '#fdba74',
    },
    typography: {
      fontFamily: 'Inter',
      headingFamily: 'Fraunces',
      headingWeight: 600,
      baseSize: '17px',
      lineHeight: 1.7,
    },
    spacing: {
      sectionPadding: '96px',
      containerMaxWidth: '1080px',
      componentGap: '32px',
    },
    borderRadius: '8px',
  },
  sections: [
    {
      type: 'menu', id: 'navbar-01', enabled: true, order: -1, variant: 'simple',
      layout: { display: 'flex', gap: '24px', padding: '20px 32px' },
      style: { background: CREAM, color: INK },
      components: [
        { id: 'logo', type: 'text', enabled: true, order: 0, props: { text: 'Marigold & Co.' } },
        { id: 'nav-shop', type: 'link', enabled: true, order: 1, props: { text: 'Shop', url: '#gallery' } },
        { id: 'nav-visit', type: 'link', enabled: true, order: 2, props: { text: 'Visit', url: '#hours' } },
        { id: 'cta', type: 'button', enabled: true, order: 3, props: { text: 'Order online', url: '#order', style: 'filled' } },
      ],
      content: {},
    },
    {
      type: 'hero', id: 'hero-01', enabled: true, order: 0, variant: 'centered',
      layout: { display: 'flex', direction: 'column', align: 'center', gap: '24px', padding: '112px 24px 80px', maxWidth: '900px' },
      style: { background: CREAM, color: INK, fontFamily: 'Fraunces', borderRadius: '0px' },
      components: [
        { id: 'headline', type: 'heading', enabled: true, order: 0, props: { text: 'Hand-tied bouquets, since 1987.', level: 1, size: '56px', weight: 600 } },
        { id: 'subtitle', type: 'text', enabled: true, order: 1, props: { text: 'Family-owned florist on Main Street. We arrange every bouquet ourselves, in our shop, with flowers from local growers we know by name. Same-day delivery within 5 miles.' } },
        { id: 'primaryCta', type: 'button', enabled: true, order: 2, props: { text: 'Order for today', url: '#order', style: 'filled', size: 'lg' } },
        { id: 'secondaryCta', type: 'button', enabled: true, order: 3, props: { text: 'Visit the shop', url: '#hours', style: 'outline', size: 'lg' } },
      ],
      content: {},
    },
    {
      type: 'gallery', id: 'gallery-arrangements', enabled: true, order: 1, variant: 'grid-3',
      layout: { display: 'grid', columns: 3, gap: '24px', padding: '64px 32px', maxWidth: '1080px' },
      style: { background: CREAM, color: INK },
      components: [
        { id: 'g1', type: 'gallery-card', enabled: true, order: 0, props: { title: 'Spring market', caption: 'Tulips, ranunculus, and sweet pea — early-March arrivals from Hudson Valley.', alt: 'spring bouquet' } },
        { id: 'g2', type: 'gallery-card', enabled: true, order: 1, props: { title: 'Wedding garden', caption: 'White peony, garden roses, eucalyptus. Hand-tied for ceremony or reception tabletops.', alt: 'wedding garden bouquet' } },
        { id: 'g3', type: 'gallery-card', enabled: true, order: 2, props: { title: 'Sympathy', caption: 'Soft white and cream lilies, calla, and stephanotis. Delivered same-day, gently presented.', alt: 'sympathy arrangement' } },
        { id: 'g4', type: 'gallery-card', enabled: true, order: 3, props: { title: 'Just because', caption: 'Seasonal mixed bouquet — what looked best at market that morning. Refreshed every Tuesday and Friday.', alt: 'mixed bouquet' } },
        { id: 'g5', type: 'gallery-card', enabled: true, order: 4, props: { title: 'Dried & forever', caption: 'Lavender, statice, baby\'s breath. Lasts a year, looks better every month.', alt: 'dried arrangement' } },
        { id: 'g6', type: 'gallery-card', enabled: true, order: 5, props: { title: 'Plants for offices', caption: 'Pothos, monstera, snake plant. We deliver, place them, and check in monthly to keep them happy.', alt: 'office plant care' } },
      ],
      content: { heading: 'What we make', subheading: 'Six things we do well. Tap any one to order, or call the shop and ask for Maggie.' },
    },
    {
      type: 'action', id: 'hours-and-location', enabled: true, order: 2, variant: 'split',
      layout: { display: 'grid', columns: 2, gap: '40px', padding: '80px 32px', maxWidth: '1080px' },
      style: { background: PARCHMENT, color: INK },
      components: [
        { id: 'hours', type: 'info-block', enabled: true, order: 0, props: { heading: 'Visit us', body: 'Monday–Friday · 9:00am – 6:30pm\nSaturday · 8:00am – 5:00pm\nSunday · closed (delivery only)\n\n218 Main Street\nGarrison, NY 10524\n(845) 424-4500' } },
        { id: 'order', type: 'info-block', enabled: true, order: 1, props: { heading: 'Order online', body: 'Same-day delivery cutoff is 1pm. Orders placed after that go out next morning.\n\nWe text you a photo before delivery — if anything is off, we redo it.\n\nNo subscription required, no app to download. We are humans answering the phone.', cta: { text: 'Start an order', url: '#order' } } },
      ],
      content: {},
    },
    {
      type: 'team', id: 'team-shop', enabled: true, order: 3, variant: 'default',
      layout: { display: 'grid', columns: 3, gap: '32px', padding: '80px 32px', maxWidth: '1080px' },
      style: { background: CREAM, color: INK },
      components: [
        { id: 't1', type: 'team-member', enabled: true, order: 0, props: { name: 'Maggie Chen', role: 'Owner & lead designer', bio: 'Took over from her grandmother in 2008. CSF certified. Knows every grower in a 50-mile radius.' } },
        { id: 't2', type: 'team-member', enabled: true, order: 1, props: { name: 'Diana Reyes', role: 'Wedding & event coordinator', bio: 'Eight years at Marigold. Will sit with you for an hour over coffee before quoting a wedding.' } },
        { id: 't3', type: 'team-member', enabled: true, order: 2, props: { name: 'Tomas Park', role: 'Delivery & shop floor', bio: 'Drives the green van. If your bouquet arrived perfect, that\'s Tomas. He notices.' } },
      ],
      content: { heading: 'The people who arrange your flowers.', subheading: 'Three of us. Same shop, same hands, every day.' },
    },
    {
      type: 'footer', id: 'footer-01', enabled: true, order: 4, variant: 'simple',
      layout: { display: 'flex', gap: '24px', direction: 'row', justify: 'between', align: 'center', padding: '40px 32px' },
      style: { background: PARCHMENT, color: TAUPE },
      components: [
        { id: 'brand', type: 'text', enabled: true, order: 0, props: { text: 'Marigold & Co. · Garrison NY · since 1987' } },
        { id: 'links', type: 'text', enabled: true, order: 1, props: { text: 'Instagram · Facebook · Email' } },
        { id: 'attribution', type: 'text', enabled: true, order: 2, props: { text: 'Built with Hey Bradley' } },
      ],
      content: {},
    },
  ],
}

export default localBusiness
