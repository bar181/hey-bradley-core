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
import { ATTRIBUTION_LABEL, ATTRIBUTION_URL } from './attribution'

// P76 / OC-9: attribution stitched from the canonical attribution.ts constants
// so the export footer cannot drift from the share / hosted-spec surfaces.
const ATTRIBUTION_HTML =
  `<p class="hb-attr">Built with <a href="${ATTRIBUTION_URL}" rel="noopener">${ATTRIBUTION_LABEL}</a> · <span class="hb-attr-url">heybradley.dev/spec</span></p>`

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
  // P76 / OC-9: emit a polished mini-document, not a raw skeleton.
  // - Fluid type via clamp() so headlines scale across viewports.
  // - System-font fallback stack chained behind theme font.
  // - Token-derived spacing scale (24/48/80px section rhythm).
  // - Subtle gradient accent on hero + hover/focus on CTA.
  // - Footer divider + middle-dot attribution typography.
  return `:root{--bg:${esc(bg)};--surface:${esc(surface)};--text:${esc(text)};--muted:${esc(muted)};--accent:${esc(accent)};--radius:${esc(radius)};--maxw:1200px;}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;background:var(--bg);color:var(--text);font-family:${esc(font)},system-ui,-apple-system,Segoe UI,Roboto,sans-serif;line-height:1.7;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;}
main{display:block}
.hb-section{max-width:var(--maxw);margin:0 auto;padding:80px 24px;}
@media (max-width:640px){.hb-section{padding:56px 20px;}}
h1,h2,h3{font-family:${esc(headingFont)},system-ui,-apple-system,Segoe UI,Roboto,sans-serif;line-height:1.15;margin:0 0 20px;letter-spacing:-0.01em;font-weight:700;}
h1{font-size:clamp(2rem,5vw,3.5rem);letter-spacing:-0.02em}
h2{font-size:clamp(1.5rem,3vw,2.25rem);margin-top:8px}
h3{font-size:clamp(1.125rem,2vw,1.375rem)}
p{margin:0 0 16px;max-width:68ch}
a{color:var(--accent)}
.hb-hero{padding:120px 24px 96px;background:linear-gradient(180deg,color-mix(in srgb,var(--accent) 6%,var(--bg)) 0%,var(--bg) 100%);}
@media (max-width:640px){.hb-hero{padding:80px 20px 64px;}}
.hb-hero h1{max-width:18ch}
.hb-lead{color:var(--muted);font-size:clamp(1.0625rem,1.5vw,1.25rem);max-width:54ch;margin-bottom:32px}
.hb-cta{display:inline-block;margin-top:8px;padding:14px 28px;background:var(--accent);color:#fff;text-decoration:none;border-radius:var(--radius);font-weight:600;font-size:1rem;letter-spacing:0.01em;transition:transform 120ms ease,filter 120ms ease,box-shadow 120ms ease;box-shadow:0 1px 2px rgba(0,0,0,0.08),0 4px 12px color-mix(in srgb,var(--accent) 22%,transparent);}
.hb-cta:hover{transform:translateY(-1px);filter:brightness(1.06);box-shadow:0 2px 4px rgba(0,0,0,0.10),0 8px 20px color-mix(in srgb,var(--accent) 28%,transparent);}
.hb-cta:focus-visible{outline:2px solid var(--accent);outline-offset:3px;}
.hb-items{padding-left:0;list-style:none;display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px;margin:24px 0 0;}
.hb-items li{padding:20px 22px;background:var(--surface);border:1px solid color-mix(in srgb,var(--text) 8%,transparent);border-radius:var(--radius);}
.hb-items li strong{display:block;color:var(--text);font-size:1.0625rem;margin-bottom:4px;}
.hb-footer{max-width:var(--maxw);margin:0 auto;padding:48px 24px 56px;color:var(--muted);font-size:0.9375rem;border-top:1px solid color-mix(in srgb,var(--text) 8%,transparent);}
.hb-footer p{margin:0 0 8px}
.hb-attr{margin-top:16px;font-size:0.8125rem;color:var(--muted);opacity:0.85;letter-spacing:0.01em;}
.hb-attr a{color:var(--accent);text-decoration:none;font-weight:500;}
.hb-attr a:hover{text-decoration:underline;text-underline-offset:3px;}
.hb-attr-url{opacity:0.75;}
.hb-page-nav{position:sticky;top:0;z-index:10;display:flex;gap:16px;flex-wrap:wrap;justify-content:center;padding:14px 24px;background:color-mix(in srgb,var(--bg) 92%,transparent);backdrop-filter:saturate(140%) blur(8px);border-bottom:1px solid color-mix(in srgb,var(--text) 8%,transparent);}
.hb-page-nav a{color:var(--text);text-decoration:none;font-size:0.9375rem;font-weight:500;padding:6px 10px;border-radius:8px;transition:background 120ms ease,color 120ms ease;}
.hb-page-nav a:hover{background:color-mix(in srgb,var(--accent) 14%,transparent);color:var(--accent);}
.hb-page{scroll-margin-top:64px;border-top:1px solid color-mix(in srgb,var(--text) 6%,transparent);}
.hb-page:first-of-type{border-top:0;}`
}

function renderSectionsList(sections: Section[]): string {
  return sections
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map(renderSection)
    .filter(Boolean)
    .join('\n')
}

export function exportStaticHtml(config: MasterConfig): Blob {
  const title = esc(config.site?.title || config.site?.brandName || 'Untitled site')
  const description = esc(config.site?.description || config.site?.tagline || '')
  const pages = config.pages
  const isMultiPage = !!(pages && pages.length > 1)
  let bodyInner: string
  if (isMultiPage && pages) {
    const navHtml = `<nav class="hb-page-nav" aria-label="Site pages">${pages
      .map((p) => `<a href="#page-${esc(p.id)}">${esc(p.title)}</a>`)
      .join('')}</nav>`
    const pagesHtml = pages
      .map((p) => `<section id="page-${esc(p.id)}" class="hb-page" data-page-id="${esc(p.id)}">\n${renderSectionsList(p.sections)}\n</section>`)
      .join('\n')
    bodyInner = `${navHtml}\n<main>\n${pagesHtml}\n</main>`
  } else {
    bodyInner = `<main>\n${renderSectionsList(config.sections)}\n</main>`
  }
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
${bodyInner}
${renderFooter(config)}
</body>
</html>
`
  return new Blob([html], { type: 'text/html;charset=utf-8' })
}
