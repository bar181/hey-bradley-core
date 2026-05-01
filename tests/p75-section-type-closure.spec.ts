/**
 * P75 / OC-7 — Section Type Closure (case-study + contact-form)
 *
 * PURE-UNIT FS-read pattern. No source-code imports — every assertion reads
 * the file from disk, asserts text invariants, and uses `existsSync` guards
 * so missing files surface as clean failures rather than module-resolution
 * crashes.
 *
 * Cross-refs: ADR-100 (this phase), ADR-091 (canonical-component), ADR-098
 * (template intelligence).
 */

import { test, expect } from '@playwright/test';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const describe = test.describe;

const ROOT = process.cwd();
const read = (rel: string): string =>
  existsSync(resolve(ROOT, rel)) ? readFileSync(resolve(ROOT, rel), 'utf8') : '';

const SECTION_SCHEMA = 'src/lib/schemas/section.ts';
const CASE_STUDY_COMPONENT = 'src/templates/case-study/CaseStudyCards.tsx';
const CONTACT_FORM_COMPONENT = 'src/templates/contact-form/ContactFormSimple.tsx';
const CASE_STUDY_EDITOR = 'src/components/right-panel/simple/CaseStudySectionSimple.tsx';
const CONTACT_FORM_EDITOR = 'src/components/right-panel/simple/ContactFormSectionSimple.tsx';
const QUICK_ADD = 'src/components/left-panel/QuickAddPicker.tsx';
const ADR_FILE = 'docs/adr/ADR-100-section-type-completeness.md';

describe('P75.1 — schema enum widening (case-study + contact-form)', () => {
  test('SectionType enum file exists', () => {
    expect(existsSync(resolve(ROOT, SECTION_SCHEMA))).toBe(true);
  });

  test('SectionType enum contains case-study', () => {
    const src = read(SECTION_SCHEMA);
    expect(src).toMatch(/['"]case-study['"]/);
  });

  test('SectionType enum contains contact-form', () => {
    const src = read(SECTION_SCHEMA);
    expect(src).toMatch(/['"]contact-form['"]/);
  });

  test('SectionType enum carries 18 canonical section types', () => {
    const src = read(SECTION_SCHEMA);
    const required = [
      'hero', 'menu', 'columns', 'pricing', 'action', 'footer',
      'quotes', 'questions', 'numbers', 'gallery', 'logos', 'team',
      'image', 'divider', 'text', 'blog', 'case-study', 'contact-form',
    ];
    for (const name of required) {
      expect(src, `enum missing "${name}"`).toMatch(new RegExp(`['"]${name}['"]`));
    }
  });
});

describe('P75.2 — case-study component (canonical grade)', () => {
  test('CaseStudyCards.tsx exists', () => {
    expect(existsSync(resolve(ROOT, CASE_STUDY_COMPONENT))).toBe(true);
  });

  test('CaseStudyCards.tsx imports tokens (canonical-component per ADR-091)', () => {
    const src = read(CASE_STUDY_COMPONENT);
    expect(src).toMatch(/tokens|token/);
  });

  test('CaseStudyCards.tsx ships hover-lift transition', () => {
    const src = read(CASE_STUDY_COMPONENT);
    expect(src).toMatch(/hover|transition/);
  });
});

describe('P75.3 — contact-form component (visual-only, no real submission)', () => {
  test('ContactFormSimple.tsx exists', () => {
    expect(existsSync(resolve(ROOT, CONTACT_FORM_COMPONENT))).toBe(true);
  });

  test('ContactFormSimple.tsx imports tokens (canonical-component per ADR-091)', () => {
    const src = read(CONTACT_FORM_COMPONENT);
    expect(src).toMatch(/tokens|token/);
  });

  test('ContactFormSimple.tsx contains form input + textarea elements', () => {
    const src = read(CONTACT_FORM_COMPONENT);
    expect(src).toMatch(/<input/);
    expect(src).toMatch(/<textarea/);
  });

  test('ContactFormSimple.tsx contains a submit button', () => {
    const src = read(CONTACT_FORM_COMPONENT);
    expect(src).toMatch(/type=["']submit["']|<button/i);
  });

  test('ContactFormSimple.tsx emits no real network submission (no fetch / axios / XMLHttpRequest call)', () => {
    const src = read(CONTACT_FORM_COMPONENT);
    expect(src).not.toMatch(/\bfetch\s*\(/);
    expect(src).not.toMatch(/\baxios\b/);
    expect(src).not.toMatch(/XMLHttpRequest/);
  });
});

describe('P75.4 — section editors (collapse + a11y discipline)', () => {
  test('CaseStudySectionSimple editor file exists', () => {
    expect(existsSync(resolve(ROOT, CASE_STUDY_EDITOR))).toBe(true);
  });

  test('ContactFormSectionSimple editor file exists', () => {
    expect(existsSync(resolve(ROOT, CONTACT_FORM_EDITOR))).toBe(true);
  });

  test('CaseStudy editor uses useState + aria-expanded + transition-all duration-200', () => {
    const src = read(CASE_STUDY_EDITOR);
    expect(src).toMatch(/useState/);
    expect(src).toMatch(/aria-expanded/);
    expect(src).toMatch(/transition-all\s+duration-200/);
  });

  test('ContactForm editor uses useState + aria-expanded + transition-all duration-200', () => {
    const src = read(CONTACT_FORM_EDITOR);
    expect(src).toMatch(/useState/);
    expect(src).toMatch(/aria-expanded/);
    expect(src).toMatch(/transition-all\s+duration-200/);
  });

  test('Both editors expose a collapse-toggle testid', () => {
    const a = read(CASE_STUDY_EDITOR);
    const b = read(CONTACT_FORM_EDITOR);
    expect(a).toMatch(/data-testid=/);
    expect(b).toMatch(/data-testid=/);
  });
});

describe('P75.5 — QuickAdd integration (both new cards reachable)', () => {
  test('QuickAddPicker exists', () => {
    expect(existsSync(resolve(ROOT, QUICK_ADD))).toBe(true);
  });

  test('QuickAddPicker has case-study card (testid via type-templated literal)', () => {
    const src = read(QUICK_ADD);
    // Source uses template-literal `quick-add-${card.type}`; QUICK_CARDS includes 'case-study'
    expect(src).toMatch(/data-testid=\{`quick-add-\$\{[^}]+\}`\}|data-testid=["']quick-add-case-study["']/);
    expect(src).toMatch(/['"]case-study['"]/);
  });

  test('QuickAddPicker has contact-form card (testid via type-templated literal)', () => {
    const src = read(QUICK_ADD);
    expect(src).toMatch(/data-testid=\{`quick-add-\$\{[^}]+\}`\}|data-testid=["']quick-add-contact-form["']/);
    expect(src).toMatch(/['"]contact-form['"]/);
  });
});

describe('P75.6 — Gallery audit doc (A2 trace artifact)', () => {
  test('Gallery audit results land in a phase-75 artifact', () => {
    const candidates = [
      'plans/implementation/phase-75/session-log.md',
      'plans/implementation/phase-75/02-post-review.md',
      'plans/implementation/phase-75/retrospective.md',
      'plans/implementation/phase-75/gallery-audit.md',
    ];
    const hits = candidates
      .map((rel) => read(rel))
      .filter((s) => /Gallery Audit Results|gallery audit|case-study migration/i.test(s));
    expect(hits.length).toBeGreaterThan(0);
  });
});

describe('P75.7 — KISS budget (no animation libraries pulled in)', () => {
  const BANNED = ['framer-motion', 'gsap', 'lottie', '@react-spring', 'animejs'];

  test('CaseStudyCards.tsx imports zero animation libraries', () => {
    const src = read(CASE_STUDY_COMPONENT);
    for (const lib of BANNED) {
      expect(src, `case-study leaks ${lib}`).not.toContain(lib);
    }
  });

  test('ContactFormSimple.tsx imports zero animation libraries', () => {
    const src = read(CONTACT_FORM_COMPONENT);
    for (const lib of BANNED) {
      expect(src, `contact-form leaks ${lib}`).not.toContain(lib);
    }
  });
});

describe('P75.8 — ADR-100 file shape', () => {
  test('ADR-100 file exists', () => {
    expect(existsSync(resolve(ROOT, ADR_FILE))).toBe(true);
  });

  test('ADR-100 Status: Accepted', () => {
    const src = read(ADR_FILE);
    expect(src).toMatch(/Status:\s*\**\s*Accepted/i);
  });

  test('ADR-100 length ≤ 120 LOC', () => {
    const src = read(ADR_FILE);
    const loc = src.split(/\r?\n/).length;
    expect(loc).toBeLessThanOrEqual(120);
  });

  test('ADR-100 cross-refs ADR-079, ADR-091, ADR-096, ADR-098', () => {
    const src = read(ADR_FILE);
    expect(src).toMatch(/ADR-079/);
    expect(src).toMatch(/ADR-091/);
    expect(src).toMatch(/ADR-096/);
    expect(src).toMatch(/ADR-098/);
  });
});
