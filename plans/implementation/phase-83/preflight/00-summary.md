# P83 / OC-17 — AISP Adoption Push (Preflight)

> **Phase:** P83 · **Sprint:** OC-17 · **Date:** 2026-05-01
> **Predecessor:** P82 sealed at `1196d42` (~984+ GREEN, 107 ADRs, 41 templates, 12 blog posts)
> **Cross-refs:** ADR-053 (INTENT_ATOM), ADR-082 (Open Core RC), ADR-097 (Blog Content Strategy), ADR-098 (Template Intelligence), ADR-099 (DECOMP_ATOM), ADR-104 (Page-Aware Pipeline)
> **Public AISP spec repo:** https://github.com/bar181/aisp-open-core

## Reframe — adoption boundary

Owner brief: "P83 OC-17 (AISP adoption push: 1-2 weeks external community engagement, README, 3rd-party ref impls)". The 1-2 weeks community engagement is post-RC marketing work — not a code sprint deliverable. What ships THIS sprint:

1. **README rewrite** — AISP-first positioning; quickstart for 3rd-party adopters; clear "what is AISP" + "how do I consume it"
2. **AISP adoption guide** — `docs/aisp-adoption/` — getting-started doc + reference-implementation skeleton + integration surface explainer
3. **3rd-party reference impl** — minimal `examples/3rd-party-consumer/` showing how to read an AISP bundle in a separate framework (Next.js stub + a Python parser stub) — proof of polyglot consumability
4. **AISP page polish** — `src/pages/AISP.tsx` hero + adoption CTA + link to public spec repo

## 3 parallel agents · disjoint scopes

### A1 — README + AISP page polish
**Owns:**
- `README.md` (EDIT — AISP-first rewrite; opening 3 paragraphs lead with "spec layer is the moat"; add "Adopting AISP in your project" section with 5-step quickstart; keep all existing sections present, just resequence + augment; cap at ≤300 LOC)
- `src/pages/AISP.tsx` (EDIT — hero copy polish; add adoption CTA section pointing to public AISP repo `https://github.com/bar181/aisp-open-core`; ADR-091 token compliance; surgical edit, no refactor)

**Constraints:** Backward-compat — every existing README anchor link must still resolve. NO new dependencies. KISS — content edits only, not architectural rewrite.

### A2 — Adoption guide + 3rd-party reference impl
**Owns:**
- `docs/aisp-adoption/00-getting-started.md` (NEW; ≤200 LOC) — what AISP is, the 5 atoms, the bundle shape, where to get a sample bundle (link to share-spec endpoint), how to parse it
- `docs/aisp-adoption/01-bundle-schema.md` (NEW; ≤150 LOC) — schema reference for an AISP bundle: top-level fields, atom shapes, version field, slug naming convention (`{slug}-aisp-v{version}.txt`)
- `docs/aisp-adoption/02-reference-implementation-walkthrough.md` (NEW; ≤200 LOC) — line-by-line walkthrough of the reference impl
- `examples/3rd-party-consumer/README.md` (NEW; ≤80 LOC) — TL;DR + how to run
- `examples/3rd-party-consumer/parse-aisp-typescript.ts` (NEW; ≤120 LOC) — minimal TypeScript parser; reads a bundle JSON; extracts atoms; logs them. Self-contained — no Hey Bradley imports, just a JSON parse.
- `examples/3rd-party-consumer/parse-aisp-python.py` (NEW; ≤100 LOC) — same surface in Python; uses stdlib `json` only; demonstrates polyglot consumability
- `examples/3rd-party-consumer/sample-bundle.json` (NEW; ≤200 LOC) — small but representative AISP bundle the parsers can run against; pull values from one of the existing example templates (e.g., `coffee-roaster.json`)

**Constraints:** Both parsers must run without external dependencies — only stdlib + JSON. The TS file may use plain `JSON.parse` + node types; do NOT add `package.json` to examples/3rd-party-consumer/. Keep each file at the LOC cap or below.

### A3 — ADR-108 + tests + EOP
**Owns:**
- `docs/adr/ADR-108-aisp-adoption-standard.md` (NEW; ≤120 LOC; Status: Accepted; cites ADR-053 + ADR-082 + ADR-098)
  - Decisions: (1) AISP bundle schema is the public adoption surface; bundle JSON shape is stable across minor versions; (2) `docs/aisp-adoption/` is the canonical adoption guide tree; (3) reference impls in TypeScript + Python prove polyglot consumability; (4) external community engagement is post-RC marketing, not a code-sprint deliverable
- `tests/p83-aisp-adoption.spec.ts` (NEW; ≥12 cases; Playwright `test.describe`/`test`; FS-read PURE-UNIT pattern):
  - P83.1 ADR-108 file shape (4)
  - P83.2 README has AISP adoption section (1)
  - P83.3 docs/aisp-adoption/ has 3 files (3 — getting-started, bundle-schema, reference-implementation-walkthrough)
  - P83.4 examples/3rd-party-consumer/ has 4 files (4 — README, parse-aisp-typescript, parse-aisp-python, sample-bundle)
  - P83.5 KISS — no animation libs in P83 source (1)
  - P83.6 EOP triplet (3)
- `plans/implementation/phase-83/{02-post-review.md, session-log.md, retrospective.md}`
- `CLAUDE.md` sync (ADRs 107 → 108; tests +12; capabilities entry)

**Constraints:** ADR ≤120 LOC; tests use `@playwright/test`; ROOT = `process.cwd()`.

## Hard rules
1. NO new dependencies (in repo OR in examples/3rd-party-consumer/)
2. NO Framer Motion / GSAP / Lottie / React Spring / animejs
3. NO touching files outside owned list
4. Backward-compat — every existing README anchor must still work
5. NO shell commands inside agents (except tsc + targeted playwright run + grep verification)
6. TypeScript-strict
7. KISS — adoption guide content is concise + ships first; community-engagement is post-RC

## Acceptance gates
- README has visible "Adopting AISP" / "Quickstart for 3rd-party adopters" section
- 3 adoption guide docs land at `docs/aisp-adoption/`
- 4 reference-impl files land at `examples/3rd-party-consumer/`
- Both parsers (TS + Python) parse the sample bundle without errors (syntactic validation only — no runtime test required)
- ADR-108 Accepted citing ADR-053 + ADR-082 + ADR-098
- ≥12 P83 tests GREEN
- Full session OC chain regression (P62-P83) GREEN — ≥667
- tsc strict clean

## Carry-forwards (post-P83)
- True community engagement (1-2 weeks marketing window) → post-RC
- AISP versioning policy + RFC process → P84 OC-18 candidate
- Localization of adoption guide → Tier-2
- Live demo of 3rd-party consumer running → P84
