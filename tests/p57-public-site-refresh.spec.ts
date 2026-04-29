/**
 * P57' Public Site Refresh — Blog System + Progress Snapshot.
 *
 * Pure-unit (FS-level reads). Mirrors P54/P55/P56 spec docstring style.
 * NO browser bootstrap. NO aisp barrel imports. Each assertion body ≤6 lines.
 *
 * Some cases may fail until A1 (Blog/BlogPost/blogPosts.ts), A2
 * (Progress/progress-eval.ts), A3 (Welcome/OpenCore/AISP refresh), and
 * A4 (blog markdown posts) land — those are expected-failures by design
 * and GREEN-flip on Wave 1 seal.
 *
 * ADR-080.
 */
import { test, expect } from '@playwright/test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const BLOG = join(ROOT, 'src/pages/Blog.tsx')
const BLOG_POST = join(ROOT, 'src/pages/BlogPost.tsx')
const BLOG_LIB = join(ROOT, 'src/lib/blogPosts.ts')
// Routes live in src/main.tsx in this repo (no App.tsx). Wave-5 fix-pass.
const APP = join(ROOT, 'src/main.tsx')
const PROGRESS = join(ROOT, 'src/pages/Progress.tsx')
const PROGRESS_EVAL = join(ROOT, 'src/data/progress-eval.ts')
const WELCOME = join(ROOT, 'src/pages/Welcome.tsx')
const OPEN_CORE = join(ROOT, 'src/pages/OpenCore.tsx')
const ADR = join(ROOT, 'docs/adr/ADR-080-public-site-blog-and-progress.md')
const POST_1 = join(ROOT, 'src/pages/blog/posts/six-sprints-two-days.md')
const POST_2 = join(ROOT, 'src/pages/blog/posts/aisp-made-visible.md')
const POST_3 = join(ROOT, 'src/pages/blog/posts/lovable-vs-hey-bradley.md')

test.describe("P57'.1 Blog system — pages + lib exist with expected exports", () => {
  test('Blog.tsx, BlogPost.tsx, blogPosts.ts ship with named exports', () => {
    expect(existsSync(BLOG) && existsSync(BLOG_POST) && existsSync(BLOG_LIB)).toBe(true)
    expect(readFileSync(BLOG, 'utf8')).toMatch(/export\s+(default\s+)?(function|const)\s+Blog\b|export\s*\{\s*Blog\b/)
    expect(readFileSync(BLOG_POST, 'utf8')).toMatch(/export\s+(default\s+)?(function|const)\s+BlogPost\b|export\s*\{\s*BlogPost\b/)
    const lib = readFileSync(BLOG_LIB, 'utf8')
    expect(lib.includes('listBlogPosts') && lib.includes('getBlogPost') && lib.includes('renderMarkdown')).toBe(true)
  })
})

test.describe("P57'.2 Blog routes wired in App.tsx", () => {
  test('App.tsx contains both /blog and /blog/:slug paths', () => {
    const src = readFileSync(APP, 'utf8')
    expect(src).toContain('path="/blog"')
    expect(src).toContain('path="/blog/:slug"')
  })
})

test.describe("P57'.3 Blog index — testids present", () => {
  test('Blog.tsx contains blog-index testid AND blog-post-card- prefix', () => {
    const src = readFileSync(BLOG, 'utf8')
    expect(src).toContain('blog-index')
    expect(src).toContain('blog-post-card-')
  })
})

test.describe("P57'.4 KISS dep guard — markdown parser is hand-rolled", () => {
  test('blogPosts.ts does NOT import marked / react-markdown / remark / unified', () => {
    const src = readFileSync(BLOG_LIB, 'utf8')
    expect(/from\s+['"]marked['"]/.test(src)).toBe(false)
    expect(/from\s+['"]react-markdown['"]/.test(src)).toBe(false)
    expect(/from\s+['"]remark['"]|from\s+['"]unified['"]/.test(src)).toBe(false)
  })
})

test.describe("P57'.5 Progress page + eval data exist with expected exports", () => {
  test('Progress.tsx exports Progress; progress-eval.ts exports PROGRESS_ITEMS + HEADLINE_STATS', () => {
    expect(existsSync(PROGRESS) && existsSync(PROGRESS_EVAL)).toBe(true)
    expect(readFileSync(PROGRESS, 'utf8')).toMatch(/export\s+(default\s+)?(function|const)\s+Progress\b|export\s*\{\s*Progress\b/)
    const data = readFileSync(PROGRESS_EVAL, 'utf8')
    expect(data.includes('PROGRESS_ITEMS') && data.includes('HEADLINE_STATS')).toBe(true)
  })
})

test.describe("P57'.6 Progress route wired in App.tsx", () => {
  test('App.tsx contains /progress path', () => {
    expect(readFileSync(APP, 'utf8')).toContain('path="/progress"')
  })
})

test.describe("P57'.7 Progress eval has ≥12 items", () => {
  test('PROGRESS_ITEMS array contains at least 12 score: entries', () => {
    const src = readFileSync(PROGRESS_EVAL, 'utf8')
    const matches = src.match(/score\s*:/g) || []
    expect(matches.length).toBeGreaterThanOrEqual(12)
  })
})

test.describe("P57'.8 Progress headline stats — six canonical fields present", () => {
  test('source contains all six HEADLINE_STATS keys', () => {
    const src = readFileSync(PROGRESS_EVAL, 'utf8')
    const keys = ['codingDays', 'daysToDefense', 'phasesSealed', 'adrsAccepted', 'testsGreen', 'sprintsSealed']
    for (const k of keys) expect(src).toContain(k)
  })
})

test.describe("P57'.9 Welcome refresh — build-snapshot section present", () => {
  test('Welcome.tsx contains welcome-build-snapshot-section testid', () => {
    expect(readFileSync(WELCOME, 'utf8')).toContain('welcome-build-snapshot-section')
  })
})

test.describe("P57'.10 OpenCore capabilities refreshed — Sprint J/K/L/M cited", () => {
  test('OpenCore.tsx contains personality (case-insensitive) AND latency AND Sprint', () => {
    const src = readFileSync(OPEN_CORE, 'utf8')
    expect(/personality/i.test(src)).toBe(true)
    expect(/latency/i.test(src)).toBe(true)
    expect(src.includes('Sprint')).toBe(true)
  })
})

test.describe("P57'.11 Blog posts on disk — three flagship posts ship", () => {
  test('six-sprints-two-days.md, aisp-made-visible.md, lovable-vs-hey-bradley.md all exist', () => {
    expect(existsSync(POST_1)).toBe(true)
    expect(existsSync(POST_2)).toBe(true)
    expect(existsSync(POST_3)).toBe(true)
  })
})

test.describe("P57'.12 ADR-080 — file shape + cross-refs", () => {
  test('exists, Status: Accepted, ≤120 LOC, refs ADR-022 + ADR-077 + ADR-078 + ADR-079', () => {
    expect(existsSync(ADR)).toBe(true)
    const src = readFileSync(ADR, 'utf8')
    expect(src).toContain('Status:** Accepted')
    expect(src.split('\n').length).toBeLessThanOrEqual(120)
    expect(src.includes('ADR-022') && src.includes('ADR-077') && src.includes('ADR-078') && src.includes('ADR-079')).toBe(true)
  })
})
