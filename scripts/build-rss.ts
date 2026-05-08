// scripts/build-rss.ts — manual-run RSS 2.0 generator for Hey Bradley blog.
// P82 / OC-CLEANUP: one-shot regeneration. Build-step automation deferred to
// P83+ per ADR-097 §Out of scope. Usage: npx tsx scripts/build-rss.ts
// KISS: registry duplicated here (vs imported from src/lib/blogPosts.ts) to
// avoid pulling Vite's import.meta.glob into a Node CLI. Collapses on build-step.
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

interface Post { slug: string; title: string; subtitle: string; date: string }

const POSTS: Post[] = [
  { slug: 'multi-page-mvp-stays-atomic', title: 'How Multi-Page MVPs Stay Atomic', subtitle: 'Page-aware patches without breaking the spec contract.', date: '2026-05-01' },
  { slug: 'the-open-core-boundary', title: "The Open-Core Boundary: What Ships Free, What's Tier-2", subtitle: 'How we draw the line between MVP and commercial.', date: '2026-05-01' },
  { slug: 'pm-architect-designer-now-one-person', title: 'The PM, Architect, and Designer Are Now One Person', subtitle: 'Founders carry three lanes by force, not choice. Lane-aware capture is what makes that survivable.', date: '2026-05-01' },
  { slug: 'spec-first-vs-vibe-coding', title: 'Spec-First vs Vibe-Coding: A Head-to-Head Comparison', subtitle: 'Vibe works for one prompt. Spec-first wins on the second.', date: '2026-05-01' },
  { slug: 'built-open-core-in-2-days-with-swarm', title: 'Built an Open-Core Product in 2 Days With a Swarm', subtitle: 'What 50× velocity actually looks like when the swarm holds the gate.', date: '2026-05-01' },
  { slug: 'template-first-beats-llm-from-scratch', title: 'Why Template-First Beats LLM-From-Scratch Every Time', subtitle: 'Lovable starts at 60-70%. Templates start at 90%. The math is decided before the first prompt.', date: '2026-05-01' },
  { slug: 'building-hey-bradley-with-hey-bradley', title: 'Building Hey Bradley With Hey Bradley', subtitle: 'Dogfooding the spec layer to ship the spec layer.', date: '2026-05-01' },
  { slug: 'the-55-percent-problem', title: 'The 55% Problem', subtitle: 'Most AI-assisted-build effort is spent on ambiguity removal, not code. The tools optimize the wrong half.', date: '2026-05-01' },
  { slug: 'lovable-vs-hey-bradley', title: 'Lovable Builds the Site. Hey Bradley Designs It First.', subtitle: 'Why the spec layer is the real bottleneck — and the moat.', date: '2026-04-29' },
  { slug: 'six-sprints-two-days', title: 'Six Sprints in Two Days', subtitle: 'What sustained 50× velocity actually feels like, and why discipline is the brake.', date: '2026-04-29' },
  { slug: 'aisp-made-visible', title: 'AISP, Made Visible', subtitle: 'How always-on atom traces turn the spec layer from invisible plumbing into the headline feature.', date: '2026-04-29' },
  { slug: 'jira-vs-agentics', title: 'Why Jira Is Incompatible With Agentic Development', subtitle: 'The relay-race tracker meets a wave-gate workflow — and the relay race loses.', date: '2026-04-29' },
]

const SITE = 'https://heybradley.dev'

function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
}

function rfc822(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00Z`).toUTCString()
}

function renderItem(p: Post): string {
  const url = `${SITE}/blog/${p.slug}`
  return `    <item>\n      <title>${escapeXml(p.title)}</title>\n      <link>${url}</link>\n      <guid isPermaLink="true">${url}</guid>\n      <description>${escapeXml(p.subtitle)}</description>\n      <pubDate>${rfc822(p.date)}</pubDate>\n    </item>`
}

function build(): string {
  const items = [...POSTS].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0)).map(renderItem).join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Hey Bradley Blog</title>
    <link>${SITE}/blog</link>
    <description>Field notes from a Harvard ALM capstone — AISP, agentic engineering, and the spec layer.</description>
    <language>en-us</language>
    <lastBuildDate>${rfc822('2026-05-01')}</lastBuildDate>
    <generator>scripts/build-rss.ts (P82 / OC-CLEANUP)</generator>
${items}
  </channel>
</rss>
`
}

const outPath = resolve(process.cwd(), 'public/blog/feed.xml')
writeFileSync(outPath, build(), 'utf8')
process.stdout.write(`wrote ${outPath} (${POSTS.length} items)\n`)
