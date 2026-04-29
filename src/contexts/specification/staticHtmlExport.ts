/**
 * Sprint N P57 Wave 2 (N1) — Static HTML exporter.
 *
 * Composes a single self-contained HTML document from a MasterConfig. NO
 * server, NO CDN, NO external assets — every byte is inlined so the file
 * works fully offline (e.g. dropped on a USB stick, mailed as an attachment,
 * unzipped on a kiosk). Pairs with shareSpecBundle.ts: that path produces a
 * JSON data-URL for the spec; this path produces a renderable HTML preview
 * of the user's site.
 *
 * Defence-in-depth: every text value is funneled through `redactKeyShapes`
 * before it reaches the serializer (ADR-067). HTML escaping is hand-rolled
 * (no new deps). The output is well-formed: every tag closed, every attribute
 * quoted.
 *
 * Attribution footer ("Built with Hey Bradley") is visible by default. The
 * shared-spec attribution toggle path (?heybradley=hidden) is owned by N3 —
 * this file just renders the visible footer; N3 will swap it via the
 * read-side rehydrator when the query flag is present.
 */
import type { MasterConfig, Section, Component } from '@/lib/schemas'
import { redactKeyShapes } from '@/contexts/intelligence/llm/keys'

const ATTRIBUTION_HTML =
  '<p class="hb-attr">Built with <a href="https://heybradley.dev" rel="noopener">Hey Bradley</a></p>'

function esc(s: unknown): string {
  if (s === null || s === undefined) return ''
  return redactKeyShapes(String(s))
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function pickProp(c: Component | undefined, key: string): string {
  if (!c || c.enabled === false) return ''
  const v = c.props?.[key]
  return typeof v === 'string' ? v : ''
}

function findComp(section: Section, id: string): Component | undefined {
  return section.components?.find((c) => c.id === id)
}

function renderHero(section: Section): string {
  const headline = pickProp(findComp(section, 'headline'), 'text')
    || (section.content?.heading as { text?: string } | undefined)?.text
    || ''
  const subtitle = pickProp(findComp(section, 'subtitle'), 'text')
    || (section.content?.subheading as string | undefined)
    || ''
  const ctaText = pickProp(findComp(section, 'primaryCta'), 'text')
    || (section.content?.cta as { text?: string } | undefined)?.text
    || ''
  const ctaUrl = pickProp(findComp(section, 'primaryCta'), 'url')
    || (section.content?.cta as { url?: string } | undefined)?.url
    || '#'
  const cta = ctaText
    ? `<p><a class="hb-cta" href="${esc(ctaUrl)}">${esc(ctaText)}</a></p>`
    : ''
  return `<section class="hb-section hb-hero" data-type="hero">
  <h1>${esc(headline)}</h1>
  ${subtitle ? `<p class="hb-lead">${esc(subtitle)}</p>` : ''}
  ${cta}
</section>`
}

function renderGenericSection(section: Section): string {
  const title =
    (section.content?.title as string | undefined)
    || (section.content?.heading as string | undefined)
    || pickProp(findComp(section, 'title'), 'text')
    || pickProp(findComp(section, 'heading'), 'text')
    || ''
  const body =
    (section.content?.body as string | undefined)
    || (section.content?.text as string | undefined)
    || pickProp(findComp(section, 'body'), 'text')
    || ''
  const items = Array.isArray(section.content?.items)
    ? (section.content.items as Array<Record<string, unknown>>)
    : []
  const itemsHtml = items.length
    ? `<ul class="hb-items">${items
        .map((it) => {
          const t = typeof it.title === 'string' ? it.title : ''
          const d = typeof it.description === 'string' ? it.description : ''
          return `<li>${t ? `<strong>${esc(t)}</strong>` : ''}${d ? ` — ${esc(d)}` : ''}</li>`
        })
        .join('')}</ul>`
    : ''
  return `<section class="hb-section hb-${esc(section.type)}" data-type="${esc(section.type)}">
  ${title ? `<h2>${esc(title)}</h2>` : ''}
  ${body ? `<p>${esc(body)}</p>` : ''}
  ${itemsHtml}
</section>`
}

function renderSection(section: Section): string {
  if (section.enabled === false) return ''
  if (section.type === 'hero') return renderHero(section)
  if (section.type === 'footer') return '' // rendered separately below
  return renderGenericSection(section)
}

function renderFooter(config: MasterConfig): string {
  const footer = config.sections.find((s) => s.type === 'footer' && s.enabled !== false)
  const author = config.site?.author || config.site?.brandName || ''
  const inner = footer
    ? esc((footer.content?.text as string | undefined) || author)
    : esc(author)
  return `<footer class="hb-footer">
  ${inner ? `<p>${inner}</p>` : ''}
  ${ATTRIBUTION_HTML}
</footer>`
}

function inlineCss(config: MasterConfig): string {
  const p = config.theme?.palette
  const bg = p?.bgPrimary || '#0b0f17'
  const surface = p?.bgSecondary || '#111827'
  const text = p?.textPrimary || '#f3f4f6'
  const muted = p?.textSecondary || '#9ca3af'
  const accent = p?.accentPrimary || '#e8772e'
  const font = config.theme?.typography?.fontFamily || 'Inter, system-ui, sans-serif'
  const headingFont = config.theme?.typography?.headingFamily || font
  const radius = config.theme?.borderRadius || '12px'
  return `:root{--bg:${esc(bg)};--surface:${esc(surface)};--text:${esc(text)};--muted:${esc(muted)};--accent:${esc(accent)};--radius:${esc(radius)};}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--text);font-family:${esc(font)};line-height:1.7;}
main{max-width:1080px;margin:0 auto;padding:48px 20px;}
h1,h2,h3{font-family:${esc(headingFont)};line-height:1.2;margin:0 0 16px;}
h1{font-size:2.5rem}h2{font-size:1.75rem;margin-top:48px}
.hb-section{padding:32px 0;border-bottom:1px solid rgba(255,255,255,0.06);}
.hb-section:last-of-type{border-bottom:0}
.hb-hero{padding:64px 0 48px;border-bottom:0}
.hb-lead{color:var(--muted);font-size:1.125rem;max-width:640px}
.hb-cta{display:inline-block;margin-top:16px;padding:12px 22px;background:var(--accent);color:var(--bg);text-decoration:none;border-radius:var(--radius);font-weight:600}
.hb-items{padding-left:20px}.hb-items li{margin:6px 0}
.hb-footer{max-width:1080px;margin:0 auto;padding:32px 20px;color:var(--muted);font-size:0.875rem;border-top:1px solid rgba(255,255,255,0.06)}
.hb-attr{margin-top:8px;font-size:0.75rem;opacity:0.7}
.hb-attr a{color:var(--accent);text-decoration:none}`
}

export function exportStaticHtml(config: MasterConfig): Blob {
  const title = esc(config.site?.title || config.site?.brandName || 'Untitled site')
  const description = esc(config.site?.description || config.site?.tagline || '')
  const sectionsHtml = config.sections
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map(renderSection)
    .filter(Boolean)
    .join('\n')
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="generator" content="Hey Bradley static export">
${description ? `<meta name="description" content="${description}">` : ''}
<title>${title}</title>
<style>${inlineCss(config)}</style>
</head>
<body>
<main>
${sectionsHtml}
</main>
${renderFooter(config)}
</body>
</html>
`
  return new Blob([html], { type: 'text/html;charset=utf-8' })
}
