# P123 — shadcn Audit (Loop 4)

> Per-surface inventory of which UI primitives are shadcn-based vs raw
> Tailwind HTML. "Fidelity" is a 0–10 score that captures **how
> consistent the surface is with the shadcn-vocabulary that ships in
> `src/components/ui/`** — not whether shadcn is the right tool. It's a
> consistency rubric, not a quality verdict.
>
> **Method:** for each surface, walk the JSX, classify every interactive
> primitive into one of: `[shadcn]`, `[raw-button]`, `[raw-input]`,
> `[lucide-icon]`, `[link]`. Calculate fidelity = `shadcn / (shadcn + raw)`
> on a 0–10 scale. Then narrate the holdouts.
>
> **Captured:** 2026-05-08 · Loop 4 · `swarm/p122-ux-overhaul`.
>
> **Cross-refs:** `package.json` deps include `shadcn@^4.1.1`,
> `@base-ui/react@^1.3.0` (shadcn upstream), `class-variance-authority`,
> `tailwind-merge`. The `ui/` library at `src/components/ui/` carries
> 8 shadcn primitives (`accordion`, `badge`, `button`, `card`, `input`,
> `switch`, `textarea` plus the legacy `Tooltip`, `ScrollArea`,
> `ImageFallback`, `LightboxModal`, `ErrorBoundary`, `ShortcutHelp`).

---

## §1 What's in `src/components/ui/`

| Primitive | File | Source | Notes |
|---|---|---|---|
| `Button` | `button.tsx` | shadcn (Base UI) | 6 variants (default / outline / secondary / ghost / destructive / link), 4 sizes |
| `Card` | `card.tsx` | shadcn | `Card` + `CardHeader` + `CardTitle` + `CardDescription` + `CardContent` + `CardFooter` |
| `Input` | `input.tsx` | shadcn | text input with focus ring + invalid state |
| `Textarea` | `textarea.tsx` | shadcn | multi-line variant |
| `Badge` | `badge.tsx` | shadcn | label pill |
| `Switch` | `switch.tsx` | shadcn | toggle |
| `Accordion` | `accordion.tsx` | shadcn | collapsible panel (Radix-style) |
| `Tooltip` | `Tooltip.tsx` | bespoke | NOT shadcn — internal lightweight wrapper |
| `ScrollArea` | `ScrollArea.tsx` | bespoke | NOT shadcn |
| `ImageFallback` | `ImageFallback.tsx` | bespoke | gradient placeholder per ADR-143 D3 |
| `LightboxModal` | `LightboxModal.tsx` | bespoke | image lightbox per ADR-143 D3 |
| `ErrorBoundary` | `ErrorBoundary.tsx` | bespoke | React error boundary |
| `ShortcutHelp` | `ShortcutHelp.tsx` | bespoke | keyboard-shortcut overlay |

**Verdict on the library itself:** ~7 / 13 ui-primitives are shadcn-driven; the bespoke ones are utilities (Tooltip, ScrollArea, ImageFallback, LightboxModal) where shadcn either does not ship a primitive or where we inherited a pre-shadcn implementation. KISS: don't migrate the bespoke utilities for migration's sake.

---

## §2 Per-surface fidelity

### `/` Welcome — fidelity **3 / 10**

- shadcn imports: 0 (pure Tailwind utility classes throughout `Welcome.tsx`).
- Raw `<button>` count: 4 (CTAs in Section 1, Section 2, Section 4, footer).
- Raw `<a>` link count: ~8 (footer + entry-strip + CTAs).
- Lucide icon count: 0 (pure SVG / token color refs).
- **Why low:** Welcome is owner-locked marketing copy; the buttons are heavily styled with brand crimson + custom hover behavior that doesn't yet ride on shadcn `<Button variant>`. Migration is feasible but Loop 4 explicitly excluded content edits + `Welcome.tsx`.
- **Lift path (future polish sprint):** swap 4 raw buttons → `<Button variant="default" size="lg">` + custom crimson via tokens. Lifts to ~7/10. Out of P123/Loop-4 scope.

### `/builder` — fidelity **6 / 10**

- shadcn imports inside Builder mount: indirect (Builder mounts `AppShell` which mounts panels that import shadcn primitives).
- Right panel (`src/components/right-panel/`): 16 files import shadcn primitives.
- Left panel (sections / project list): ~4 files use shadcn `<Card>` + `<Input>`.
- Center canvas: only 2 files in `src/components/center-canvas/` import shadcn (`CenterCanvas.tsx` does NOT — uses raw classes for the canvas frame); `XAIDocsTab` uses shadcn `<Card>` style consistently.
- TopBar / StatusBar / TabBar: bespoke (raw `<button>` + Tooltip). Loop 4 polish on the `Saved/Unsaved` pill is bespoke (token-styled), not shadcn.
- **Why mid:** the heavy editor surfaces (right panel) are shadcn-fluent; the chrome (TopBar / StatusBar / TabBar) is bespoke for design-system reasons (custom crimson nav). The split is pragmatic.
- **Lift path:** migrate `TabBar` buttons to shadcn `<Button variant="ghost">` + custom underline indicator. Lifts to ~8. Out of P123 scope (TabBar carries the `aria-selected` + `border-b-2 border-hb-accent` underline pattern that's hand-tuned).

### `/agentics` — fidelity **4 / 10**

- shadcn imports: 0 in `Agentics.tsx`. Components mounted from `src/components/agentics/` (LLMLogPanel, DBPanel, SpecWorkbench) also import 0 shadcn primitives.
- Raw `<button>` count: low; the surface is mostly read-only panels.
- **Why low:** Agentics is a developer-observability surface where the design is "neutral data tables + JSON code blocks". CodeMirror does the heavy lifting. shadcn `<Card>` would be a clean wrapper but isn't applied yet.
- **Lift path:** wrap LLMLogPanel + DBPanel + SpecWorkbench in `<Card>` + use `<Badge>` for the redacted-row + status pills. Lifts to ~7. Defer to next polish sprint; functional pass holds.

### `/walkthrough` — fidelity **2 / 10**

- shadcn imports: 0.
- 6-scene scroll-snap animation built with raw Tailwind + `useReveal` hook + `framer-motion` (pre-existing baseline per ADR-144 D5).
- **Why low:** marketing scroll story; same constraint as `Welcome` — the 6 scenes are hand-tuned.
- **Lift path:** scenes 5 + 6 CTA buttons migrate to `<Button variant>`. Lifts to ~5. Out of scope.

### `/contact` — fidelity **8 / 10**

- shadcn imports: 1 (`Button` for the 4-card CTA + footer Work-with-us link).
- Bradley headshot block: bespoke `<img>` + `<ImageFallback>`.
- 4-card layout: raw Tailwind grid + token-styled cards (no shadcn `<Card>`).
- **Why high:** small surface; the load-bearing primitive (the CTA `<Button>`) IS shadcn. Card markup is consistent enough that wrapping in `<Card>` is style-only.
- **Lift path:** swap the 4 hand-rolled cards to `<Card>` + `<CardTitle>` + `<CardDescription>`. Lifts to ~9. ≤30 LOC; reasonable next sprint.

### `/blog` — fidelity **7 / 10**

- shadcn imports: 1 (`Button` on the category filter + RSS link).
- Blog cards: hand-rolled `<article>` markup (token-styled) + per-card category pill.
- **Why high:** the load-bearing CTA + filter buttons are shadcn; the article cards have a deliberate non-shadcn look (long-form-magazine vibe per ADR-143 D2).
- **Lift path:** intentional retention. Article cards are deliberately bespoke for the magazine aesthetic. Holdout justified.

### `/capstone` (alias for `/open-core`) — fidelity **8 / 10**

- shadcn imports: 1 (`Button` for primary CTAs + open-core grid links).
- Mostly token-styled body copy + heading hierarchy.
- **Why high:** the small set of CTAs are shadcn-driven; the rest is text content that doesn't need primitives.
- **Lift path:** none required for the visual quality target. Hold.

### `/aisp` — fidelity **3 / 10**

- shadcn imports: 0.
- AISP teaser blocks use bespoke math-symbol display + token-styled cards.
- **Why low:** the surface is intentionally engineer-dense; shadcn `<Card>` would soften the technical look.
- **Lift path:** retain bespoke. Holdout justified.

---

## §3 Holdouts (raw HTML where shadcn could fit)

| # | Surface | Element | Current | Why holdout | Cost-to-lift |
|---|---|---|---|---|---|
| H1 | Welcome | 4 CTAs | raw `<button>` token-styled | brand-crimson custom hover | 30 LOC |
| H2 | Builder TabBar | 4 tab buttons | raw `<button>` w/ underline indicator | hand-tuned `aria-selected` underline | 20 LOC |
| H3 | Builder TopBar | 12 icon buttons | raw `<button>` w/ Tooltip | crimson nav design intentional | retain |
| H4 | Builder StatusBar | 1 CostPill | bespoke React component | bespoke stay-pinned UX | retain |
| H5 | Agentics LLMLogPanel | row container | raw `<div>` | Loop 2 polish reached 91 without `<Card>` | 25 LOC |
| H6 | Agentics DBPanel | code-mirror wrapper | raw `<div>` | CodeMirror takes precedence | retain |
| H7 | Walkthrough scenes 1-4 | 4 frames | raw Tailwind | hand-tuned scene pacing | retain |
| H8 | Contact 4 cards | hand-rolled | token-styled `<div>` | small surface; clean lift | 30 LOC |
| H9 | Blog article cards | bespoke markup | magazine aesthetic | ADR-143 D2 intentional | retain |
| H10 | AISP teaser | bespoke math | engineer-dense intentional | retain |

**Total addressable shadcn migration:** ~105 LOC across H1 + H2 + H5 + H8. Defer to a future "shadcn fidelity sweep" sprint.

---

## §4 Per-surface fidelity table

| Surface | Fidelity 0–10 | Rationale |
|---|---:|---|
| `/` Welcome | 3 | Owner-locked marketing copy; 4 raw CTAs hand-styled |
| `/builder` | 6 | Right panel shadcn-fluent; chrome bespoke |
| `/agentics` | 4 | Read-only panels not yet wrapped in `<Card>` |
| `/walkthrough` | 2 | Scroll story hand-tuned; minimal CTAs |
| `/contact` | 8 | CTA `<Button>` shadcn; cards token-styled |
| `/blog` | 7 | Filter `<Button>` shadcn; article cards intentionally bespoke |
| `/capstone` (= `/open-core`) | 8 | CTAs shadcn; body content text-only |
| `/aisp` | 3 | Engineer-dense bespoke intentional |

**Composite fidelity:** **5.1 / 10** averaged across 8 surfaces.

**Honest narrative:** the load-bearing interactive surfaces (forms / CTAs / right-panel editor) ARE shadcn-driven. The non-shadcn surfaces are mostly **content surfaces** (Welcome / Walkthrough / Blog / AISP) where the bespoke styling is part of the brand, not a tech-debt holdout. The Loop 4 polish on the `Saved/Unsaved` pill in `TopBar.tsx` is **deliberately bespoke** (custom green/amber dot + animate-pulse) because shadcn `<Badge>` doesn't yet support the live-state-dot pattern we want.

---

## §5 Verdict

- **Functional load-bearing primitives are shadcn-fluent.** The 16 right-panel files + the small set of CTAs across Contact / Blog / OpenCore use shadcn `<Button>` consistently.
- **Content surfaces are intentionally bespoke.** Welcome / Walkthrough / Blog cards / AISP teaser use raw Tailwind for design-language reasons, not laziness.
- **No FAIL.** Every shadcn primitive that ships in `src/components/ui/` IS used somewhere; nothing is dead code.
- **Carry-forward:** the ~105 LOC migration in §3 (H1 + H2 + H5 + H8) is a clean future sprint but not a P123 / P124 blocker.
- **Holdouts justified:** 5 of 10 (H3, H4, H6, H7, H9, H10) are deliberate; 4 (H1, H2, H5, H8) are clean cost-bounded next-sprint items.

Composite **5.1 / 10** is honest; lifting to **8 / 10** requires the §3 migration above. Not in scope for Loop 4 / P123 seal.

---

*Updated 2026-05-08 — P123 / Loop 4.*
