# ADR-030: Spec Rendering Architecture — Markdown to Professional Documents

**Status:** Proposed
**Date:** 2026-04-04
**Deciders:** Bradley Ross
**Supersedes:** None

---

## Context

Hey Bradley has 6 enterprise spec generators (North Star, Architecture, Build Plan, Features, Human Spec, AISP Spec) that power the XAI DOCS tab. Five of these generators produce markdown output. The sixth (AISP) produces a custom Crystal Atom format with its own dedicated syntax highlighter (`AISPHighlighted`).

The current rendering approach for the 5 markdown generators uses a `<pre>` tag with a basic line-by-line colorizer called `HumanHighlighted`. This component applies CSS classes based on line prefixes (e.g., lines starting with `#` get bold, lines starting with `|` get monospace) but does **not** actually parse or render markdown. The result:

- **Tables** render as raw pipe-delimited text (`| Column | Column |`) instead of HTML `<table>` elements
- **Bold/italic** markers (`**text**`, `_text_`) appear as literal characters
- **Headings** are just colored lines with `#` prefixes still visible
- **Lists** show raw `-` or `1.` prefixes with no indentation structure
- **Links** display as `[text](url)` literals instead of clickable anchors
- **Code blocks** have no background differentiation or syntax highlighting

For a capstone presentation at Harvard, the specs need to look like professional documents, not terminal output. The AISP generator is not affected by this decision — its Crystal Atom format is not markdown and its custom highlighter is purpose-built and working correctly.

---

## Options Considered

### Option 1: react-markdown + remark-gfm + @tailwindcss/typography (Recommended)

Install `react-markdown` (renders markdown AST to React components), `remark-gfm` (adds GFM table/strikethrough/autolink support), and `@tailwindcss/typography` (provides `prose` utility classes for instant professional typographic styling).

**Pros:**
- Industry-standard React markdown rendering — large ecosystem, well-maintained
- `remark-gfm` handles GFM tables, task lists, strikethrough, and autolinks out of the box
- `@tailwindcss/typography` `prose` classes provide immediate Stripe/Linear-quality document styling with zero custom CSS
- Renders to real React components — accessible, semantic HTML (`<table>`, `<h1>`, `<strong>`, `<a>`)
- Dark mode support via `prose-invert` or custom `prose` color overrides that map to existing `hb-*` CSS custom properties
- No `dangerouslySetInnerHTML` — XSS-safe by default since the AST is rendered as React elements
- Zero changes needed to the 5 markdown generator functions — they continue to output plain markdown strings
- Custom component overrides allow fine-grained control (e.g., mapping `<a>` to open in new tab, mapping `<table>` to add custom classes)

**Cons:**
- Adds 3 new npm packages (react-markdown ~90 KB, remark-gfm ~15 KB, @tailwindcss/typography ~15 KB gzipped)
- Violates the project's "no new npm packages unless absolutely necessary" guideline — but this is a presentation-quality rendering concern, not a nice-to-have

**Estimated effort:** 2-4 hours

### Option 2: Enhanced HumanHighlighted with Manual Parsing

Extend the existing `HumanHighlighted` component to manually parse tables, bold/italic, links, headings, and nested lists.

**Pros:**
- Zero new dependencies
- Full control over every rendering detail

**Cons:**
- Requires building a partial markdown parser from scratch — tables alone need column alignment, header detection, and cell content parsing
- Inline formatting (`**bold**`, `_italic_`, `` `code` ``, `[links](url)`) requires regex-based inline parsing that is fragile and incomplete
- Nested lists require tracking indentation state across lines
- Every new markdown feature used by a generator requires a new parsing rule
- High maintenance burden: 5 generators may introduce new markdown patterns at any time
- Estimated 500+ lines of brittle regex-based parsing code
- The result will always be a subset of markdown — guaranteed to break on edge cases

**Estimated effort:** 8-16 hours, with ongoing maintenance

### Option 3: marked + DOMPurify for Pre-rendered HTML

Use `marked` to compile markdown to an HTML string, sanitize it with `DOMPurify`, and inject it via `dangerouslySetInnerHTML`.

**Pros:**
- Full markdown rendering with fewer dependencies than Option 1
- `marked` is fast and lightweight (~35 KB gzipped)

**Cons:**
- Requires `dangerouslySetInnerHTML` — even with DOMPurify, this is a security surface area
- Produces raw HTML strings, not React components — breaks React's reconciliation model
- No component-level customization (cannot override how `<table>` or `<a>` renders without post-processing the HTML string)
- Styling requires writing raw CSS for the injected HTML — cannot use Tailwind utility classes on the rendered elements
- Accessibility is harder to control since the HTML is opaque to React

**Estimated effort:** 3-5 hours

---

## Decision

**Option 1: react-markdown + remark-gfm + @tailwindcss/typography**

The dependency cost is justified for the following reasons:

1. **Capstone presentation quality.** The specs are the primary deliverable of Hey Bradley. Rendering them as raw text undermines the product's credibility. Professional document rendering is not cosmetic — it is core functionality.

2. **Correctness over cleverness.** Option 2 (manual parsing) would produce a fragile, incomplete markdown subset. Markdown parsing is a solved problem. Building a custom parser violates the principle of not reinventing standard infrastructure.

3. **Security.** Option 1 renders to React components with no `innerHTML`. Option 3 requires `dangerouslySetInnerHTML` even with sanitization. For a capstone project that may be evaluated for security practices, Option 1 is the defensible choice.

4. **Maintenance cost.** The 5 generators will evolve as new sections and features are added. Option 1 handles any valid markdown automatically. Options 2 and 3 require manual updates when generators produce new patterns.

5. **Tailwind integration.** The project already uses Tailwind CSS throughout. `@tailwindcss/typography` extends the existing system rather than introducing a parallel styling approach. The `prose` classes can be themed using the existing `hb-*` CSS custom properties to match the warm cream chrome design language.

---

## Implementation

### Package Installation

```bash
npm install react-markdown remark-gfm @tailwindcss/typography
```

### Tailwind Configuration

Add the typography plugin to `tailwind.config.ts`:

```typescript
plugins: [
  require('@tailwindcss/typography'),
],
```

Optionally extend `prose` colors to use Hey Bradley's design tokens:

```typescript
typography: {
  DEFAULT: {
    css: {
      '--tw-prose-body': 'var(--hb-text-secondary)',
      '--tw-prose-headings': 'var(--hb-text-primary)',
      '--tw-prose-links': 'var(--hb-accent)',
      '--tw-prose-bold': 'var(--hb-text-primary)',
      '--tw-prose-code': 'var(--hb-accent)',
      '--tw-prose-th-borders': 'var(--hb-border)',
      '--tw-prose-td-borders': 'var(--hb-border)',
    },
  },
},
```

### XAIDocsTab Changes

Replace the `<pre>` + `HumanHighlighted` block with a `ReactMarkdown` component for markdown tabs. The AISP tab continues to use `AISPHighlighted` unchanged.

```tsx
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// In the render — replace the <pre> block:
<div className="rounded-lg bg-hb-surface p-5 max-h-[calc(100vh-16rem)] overflow-y-auto">
  {currentTab.format === 'aisp' ? (
    <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono text-hb-text-secondary">
      <AISPHighlighted text={specText} />
    </pre>
  ) : (
    <div className="prose prose-sm max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {specText}
      </ReactMarkdown>
    </div>
  )}
</div>
```

### What Gets Removed

The `HumanHighlighted` component (~20 lines) is deleted entirely. It is not used anywhere else in the codebase.

### What Stays Unchanged

- All 5 markdown generator functions — they continue to return plain markdown strings
- The `AISPHighlighted` component — Crystal Atom format is not markdown
- Copy-to-clipboard and download actions — they operate on the raw `specText` string, not the rendered output
- The tab bar, tab state, and all other XAIDocsTab logic

---

## Consequences

### Positive

- **Professional rendering** — tables, headings, bold, links, and lists render as real HTML elements with proper styling
- **Zero generator changes** — all 5 markdown generators work without modification
- **Dark/light mode** — `prose` classes support both modes via CSS custom property overrides
- **Future-proof** — any valid markdown the generators produce will render correctly without code changes
- **Accessible** — semantic HTML elements (`<table>`, `<h1>`, `<a>`) work with screen readers
- **XSS-safe** — no `dangerouslySetInnerHTML` anywhere in the rendering path

### Negative

- **3 new dependencies** — adds ~120 KB gzipped to the bundle (react-markdown + remark-gfm + @tailwindcss/typography)
- **Typography plugin scope** — `@tailwindcss/typography` adds prose utility classes globally; must ensure they do not leak into non-document areas

### Risks

- `prose` class defaults may conflict with existing `hb-*` styles in specific edge cases (mitigated by scoping `prose` to the spec content `<div>` only and overriding colors with design tokens)
- `react-markdown` major version changes could require component override updates (mitigated by pinning the major version)

---

## References

- ADR-026: AISP Spec as Primary Output — establishes the HUMAN/AISP dual-view architecture
- ADR-009b: Warm Light Chrome — design token system that prose colors must align with
- ADR-025: Visual-First Design — quality bar that spec rendering must meet
- XAI DOCS Tab: `src/components/center-canvas/XAIDocsTab.tsx`
- Spec generators: `src/lib/specGenerators/index.ts` (6 generators, 5 markdown)
- react-markdown: https://github.com/remarkjs/react-markdown
- @tailwindcss/typography: https://tailwindcss.com/docs/typography-plugin
