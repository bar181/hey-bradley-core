/**
 * P65 / OC-2.5 — Design Token System (ADR-087)
 *
 * Canonical source of truth for non-color design tokens (spacing,
 * typography, radius, shadow, motion). Section components MUST import
 * from this file; templates SHOULD reference token-derived classes via
 * the Tailwind arbitrary-value syntax or via component prop API.
 *
 * KISS: no new CSS files; Tailwind only; tokens in this file.
 * Motion: Tailwind transitions only; no Framer Motion or JS animation
 * libraries (per ADR-087).
 *
 * Existing 26 templates with self-contained style: blocks are EXEMPT
 * this sprint; migration is OC-8 Clean UI Pass.
 */

export interface DesignTokens {
  spacing: {
    'section-y': string
    'section-y-mobile': string
    'container-x': string
    'stack-gap': string
    'stack-gap-lg': string
  }
  typography: {
    display: string
    h1: string
    h2: string
    body: string
    'body-sm': string
    'line-height': string
  }
  radius: {
    sm: string
    md: string
    lg: string
    xl: string
  }
  shadow: {
    card: string
    elevated: string
  }
  motion: {
    duration: { fast: string; base: string; slow: string }
    ease: { 'in-out': string }
  }
}

export const tokens: DesignTokens = {
  spacing: {
    'section-y': '96px',
    'section-y-mobile': '64px',
    'container-x': '24px',
    'stack-gap': '24px',
    'stack-gap-lg': '48px',
  },
  typography: {
    display: 'clamp(2.5rem, 5vw, 4rem)',
    h1: 'clamp(2rem, 4vw, 3rem)',
    h2: 'clamp(1.5rem, 3vw, 2.25rem)',
    body: '1.125rem',
    'body-sm': '0.9375rem',
    'line-height': '1.6',
  },
  radius: { sm: '6px', md: '12px', lg: '20px', xl: '32px' },
  shadow: {
    card: '0 2px 12px rgba(0,0,0,0.08)',
    elevated: '0 8px 32px rgba(0,0,0,0.12)',
  },
  motion: {
    duration: { fast: '150ms', base: '200ms', slow: '300ms' },
    ease: { 'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)' },
  },
}

export default tokens
