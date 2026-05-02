# P96 — Export Claude Code (Markdown Bundle) (Preflight)

> **Phase:** P96 · **Sprint:** AW-EXPORT-CLAUDE-CODE · **Date:** 2026-05-01
> **Predecessor:** P95 sealed at `f2f6995` (~1179+ GREEN, 121 ADRs)
> **Cross-refs:** ADR-101 (Spec Export Quality), ADR-108 (AISP Adoption), ADR-110 (AISP Visibility), ADR-117 (Process Map SVG), ADR-118-120 (PROCESS/DDD/AGENT atoms), ADR-121 (SpecWorkbench)
> **Planning docs:** plans/implementation/phase-95/00-04 (the workbench-arc planning sprint covers P96)

## Reframe (per owner Q2 update)

P96 emits a **markdown bundle** — NOT a ZIP. Single `.md` file with explicit `# === FILE: <path> ===` section markers (mirrors polyglot adoption pattern from P83). User pastes into split script OR feeds the whole bundle to Claude Code. Tier-2 can add File System Access API for true multi-file directory writes.

**Workbench reframe:** Hey Bradley produces SPECS, not code. P96 export = markdown bundle of `CLAUDE.md` + ADRs + human spec + AISP spec + process map + phase plans. The downstream consumer (Claude Code, etc.) reads the bundle and writes implementation in their own repo.

## 7-step methodology

1. **Research** — done in plans/implementation/phase-95/00-understanding.md (P96 BLOCKED on Q2; now resolved)
2. **Decompose** — done in 01-decomposition.md (P96 task table)
3. **Architect** — A3 ships ADR-122 (markdown bundle decision)
4. **Spec** — AISP Σ for exportClaudeCode emitter; human spec for what gets exported
5. **Plan** — this preflight + agent roster below
6. **Build** — A1 emitter module + A2 SpecWorkbench wire + UI button
7. **Reflect** — A3 EOP triplet at phase-96/seal/

## 3 agents · 1 wave (parallel; A1+A2 disjoint files; A3 closer)

### A1 — exportClaudeCode emitter module (pure)
**Owns:**
- `src/contexts/specification/exportClaudeCode.ts` (NEW; ≤300 LOC)

Required exports:
```ts
import type { PhaseCard } from '@/components/agentics/SpecWorkbench'

export interface ExportClaudeCodeBundle {
  /** The full markdown bundle as a single string (with file markers). */
  markdown: string
  /** Logical files inside the bundle (for testability + future directory write). */
  files: { path: string; content: string }[]
  /** Slug for filename. */
  slug: string
  /** Suggested filename for browser download. */
  filename: string  // e.g., 'coffee-roaster-spec-bundle.md'
}

export function buildClaudeCodeBundle(phase: PhaseCard, projectSlug?: string): ExportClaudeCodeBundle
```

Behavior:
- Build a logical file list:
  - `CLAUDE.md` — project-context preamble (purpose, atoms summary, methodology link)
  - `process-map.md` — phase + sprint + wave + agent breakdown for THIS phase
  - `human-spec/north-star.md` — phase.humanSpec.northStar
  - `human-spec/sadd.md` — phase.humanSpec.sadd
  - `human-spec/implementation-plan.md` — phase.humanSpec.implementationPlan
  - `aisp/phase-aisp.md` — phase.aispSpec (verbatim Σ block)
  - `adrs/ADR-{id}.md` — one per phase.adrRefs entry (stub if href absent: "See {href} or repo /docs/adr/")
  - `agents/wave-{n}.md` — one per sprint with agentScopes + DoD
- Concatenate into single `.md` string with `# === FILE: <path> ===` markers between each
- Slug from projectSlug or phase.id (kebab-case)
- Filename: `{slug}-spec-bundle.md`

**Constraints:** Pure module; no React imports; no store imports. TypeScript-strict.

### A2 — SpecWorkbench export button + UI download
**Owns:**
- `src/components/agentics/SpecWorkbench.tsx` (EDIT — add a 4th tab `export` OR a header button "Export Claude Code" that downloads the bundle; cap final ≤340 LOC, +40 budget)

OR (cleaner): create `src/components/agentics/ExportClaudeCodeButton.tsx` (NEW; ≤80 LOC) — small button component A1 wires SpecWorkbench to import + render. Pick whichever keeps SpecWorkbench under the cap.

Behavior:
- Button: "Export Claude Code (.md)" — token-styled per ADR-091; `data-testid="export-claude-code-button"`
- On click: `buildClaudeCodeBundle(activePhase) → blob → anchor download`
- Show transient "Bundle exported" toast or inline confirmation
- Disabled state when no active phase

**Constraints:** No new deps; reuse browser-standard `Blob` + `URL.createObjectURL` + anchor click pattern (mirrors `staticHtmlExport` if existing pattern is there). Token-compliant.

### A3 — ADR-122 + tests + EOP closer
**Owns:**
- `docs/adr/ADR-122-export-claude-code-markdown-bundle.md` (NEW; ≤120 LOC; Status: Accepted; cites ADR-101 + ADR-108 + ADR-121)
  - 4 decisions: (1) markdown bundle (not ZIP) per Q2 update; (2) single concatenated `.md` file with `# === FILE: <path> ===` markers; (3) File System Access API for true multi-file directory writes deferred to Tier-2; (4) bundle is the canonical Hey Bradley OUTPUT — workbench is a spec factory, not a code generator
- `tests/p96-export-claude-code.spec.ts` (NEW; ≥15 cases)
- `plans/implementation/phase-96/seal/{02-post-review.md, session-log.md, retrospective.md}`
- `CLAUDE.md` sync (ADRs 121 → 122; tests +15; capabilities entry)

**Constraints:** ADR ≤120 LOC; Status Accepted markdown-bold tolerated; tests use `@playwright/test`; ROOT = `process.cwd()`; both tsc strict configs clean.

## Hard rules
1. NO new dependencies (no JSZip, no fs-promises wrapper, etc.)
2. NO animation libs
3. Markdown bundle uses only Blob + anchor download (browser-standard)
4. Output bundle is HUMAN-READABLE and LLM-INGESTIBLE (no binary)
5. NO touching files outside owned list
6. TypeScript-strict; both `tsc --noEmit` and `tsc -p tsconfig.app.json` strict clean
7. KISS — single-file bundle with markers; multi-file directory write is Tier-2

## Acceptance gates
- ADR-122 Accepted citing ADR-101 + ADR-108 + ADR-121
- exportClaudeCode.ts emits bundle with ≥6 logical files
- Bundle filename: `{slug}-spec-bundle.md`
- SpecWorkbench has visible Export button (or 4th tab)
- ≥15 P96 tests GREEN
- Cumulative ≥884 session OC chain regression
- Both tsc strict configs clean

## Visual / UX note (per owner brief)

Agentics mode 3-pane layout already lands the visual story. The Export button placement should feel natural — header bar of SpecWorkbench (top-right) is the recommended slot since it's a primary action. KISS — no redesign this sprint.

## Carry-forwards (Tier-2)
- File System Access API for true multi-file `.md` directory write
- Per-file copy buttons in SpecWorkbench
- Bundle versioning + diff against prior export
