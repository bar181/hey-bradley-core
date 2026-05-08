# Public-Site Staleness Audit

**Date:** 2026-05-04
**Branch:** claude/verify-flywheel-init-qlIBr
**Latest commit:** 43cbf95
**Scope:** All user-facing marketing + product pages under `src/pages/`
**Mode:** RESEARCH ONLY — no source modifications

## Summary

**FAIL — major rewrites needed.** All 9 user-facing marketing pages contain stale claims. The most prominent (Welcome, About, OpenCore, HowIBuiltThis, Progress, Blog) display headline counters that are 3-15+ phases out of date. Phase counts (52 phases / P69) are 40 phases behind reality (109 phases / P109). ADR counts (96, 130) are 32+ ADRs short of the canonical 128. Test counts (730, 1162) are well below the cumulative 1491+ regression. Persona scores cite the stale P101 RC pre-fix-pass numbers (84/84/85) instead of the post-P102 v2.0.0-RC1 boundary (86/86/88). Composite scoring quotes "79–84/100" rather than the v2.0.0-RC1 "86.7/100". Several pages still describe Planning/Agentics as "coming in v2" or assume v1.0.0-RC1 is the ship boundary. The HEADLINE_STATS data source (`src/data/progress-eval.ts`) is itself stale and feeds Blog + Progress with wrong numbers.

The audit is a full FAIL. Recommended fix is a mechanical truth-up sprint (single agent, ≤200 LOC) updating numeric constants + persona quotes + mode-status copy across the 9 pages and the underlying data source.

---

## Per-page findings

### src/pages/Welcome.tsx — FAIL

- L77: `1162+` tests passing — should be `237` (current literal regression at P109) or `~1491+` (cumulative session GREEN; CLAUDE.md preferred figure)
- L78: `130` ADRs Accepted — should be `128`
- L79: `43` templates — should be `51` examples (note: surface uses "templates" but EXAMPLE_SITES is the underlying constant)
- L81: composite `79–84/100` (vs SOTA 80) — should be `86.7/100` (vs Lovable 80) per ADR-132 / P102 seal
- L116-118: `99 phases sealed (P15–P101), 130 ADRs Accepted, 1162+ PURE-UNIT tests GREEN, composite 79–84/100` — should be `~99 phases sealed (P11–P109), 128 ADRs Accepted, ~1491+ PURE-UNIT tests GREEN, composite 86.7/100` 
- L168: `21 themes. 43 example sites. 18 section types. 300 images.` — themes correct (21), example sites should be `51`, sections + images correct
- L181-182: Open core vs commercial copy says commercial features "post-MVP" — accurate framing but ADR-114/115 + P89b clarify commercial track is Tier-2-deferred (cosmetic; clarify if updating)

**Status: FAIL** (5 P1 stale numbers + 1 P3 framing nit)

### src/pages/About.tsx — FAIL

- L33: `As of P69 (May 2026)` — should be `As of P109 (May 2026)`
- L35: `52 phases through P69` — should be `~99 phases through P109`
- L37-38: `96 ADRs Accepted and 730 PURE-UNIT tests GREEN` — should be `128 ADRs Accepted and ~1491+ PURE-UNIT tests GREEN` (or 237 literal regression)
- L186-190: 5-stage journey shows stages 3 (LLM MVP) / 4 (Open Core) / 5 (Post-Open-Core) as "Planned"/"Future" — STALE; LLM MVP is COMPLETE (P17-P19, ADR-082 Open Core RC sealed at P58, ADR-133 v2.0.0-RC1 boundary at P103); Stage 5 mostly Tier-2-deferred per ADR-114
- L189: Stage 4 "Open Core: Public open-source release of the free builder" status `Planned` — should be `Complete` (v1.0.0-RC1 sealed at P58/P84; v2.0.0-RC1 sealed at P103)

**Status: FAIL** (4 P1 stale numbers + 2 P1 stale stage-status claims)

### src/pages/AISP.tsx — NEEDS-UPDATE

- L97 (COMPONENTS): describes 5 Crystal Atom components (Ω/Σ/Γ/Λ/Ε) — these are the **5 baseline components** of an AISP atom; CORRECT framing for what AISP-the-protocol is, NOT a list of Hey Bradley's 8 atoms. No update needed for that distinction. (See AISPDualView component for separate atom-count surface.)
- No explicit phase/test/ADR counters on this page — BYOK survives the audit-grep
- L93 "Five Crystal Atom Components" — these are the 5 AISP Σ-section components, not Hey Bradley's 8 production atoms (PATCH+INTENT+SELECTION+CONTENT+ASSUMPTIONS+DECOMP+PROCESS+DDD+AGENT). The phrasing is correct but easily confused. **Cosmetic clarity opportunity** — consider adding a footnote like "Hey Bradley extends this with 3 specialized atoms (DECOMP/PROCESS/DDD) + AGENT for 8 total in the production AISP suite."
- L225: `(Sprint L · ADR-078)` — correct ADR ref; not stale

**Status: NEEDS-UPDATE** (1 P3 cosmetic clarity around 5 vs 8 atoms; otherwise clean)

### src/pages/OpenCore.tsx — FAIL

- L94: `12 themes, 15 example websites, 6 enterprise spec generators, 300+ media images, 13 image effects` — themes wrong (should be `21`); example websites wrong (should be `51`)
- L284: `96 Architecture Decision Records document every significant choice` — should be `128`
- L292: `28K+ TS/TSX across 227 source files` — correct per CLAUDE.md (~28,400 lines)
- L296-297: `730 PURE-UNIT tests GREEN` — should be `~1491+` (cumulative) or `237` (current regression)
- L300-301: `96 Architecture Decision Records` — should be `128`
- L306-307: `52 phases sealed (P15–P69)` — should be `~99 phases sealed (P11–P109)`
- L313: `5-mode personality system (professional / fun / geek / teacher / coach)` — verify against current PersonalityPicker; if 5 modes correct, fine
- L314-318: Sprint J/K/L/M capabilities listed — accurate capabilities BUT no mention of P85-P109 work (Multi-page MVP, page-aware pipeline, agentic-product templates, AISP adoption surface, three-mode product architecture, Process Map, 8 Crystal Atoms, SpecWorkbench, Export Claude Code, KISS reviewer, Seal Panel, comprehensive logging, schema guards, dead-code purge)
- L339: `12 themes, 15 examples, 300+ images, 6 spec generators, 13 image effects` (Hey Bradley repo card) — themes wrong (should be `21`), examples wrong (should be `51`)

**Status: FAIL** (5 P1 stale numbers + 1 P2 missing 24-phase capability summary)

### src/pages/HowIBuiltThis.tsx — FAIL

- L9: `ADRs: '96'` — should be `128`
- L11: `Tests Passing: '730'` — should be `~1491+` (or `237` literal)
- L8: `Dev Hours: '~60'` — likely STALE; CLAUDE.md does not name an authoritative dev-hours figure post-P69 (cosmetic; defer)
- L14-28 (PHASES array): trajectory ends at P21 with score 95 — STALE; needs P22-P109 entries OR an explicit "Current state: P109 / v2.0.0-RC1" callout
- L45: `'43 Architecture Decision Records'` — should be `128`
- L47: lists ADR-045 / ADR-040 / ADR-043 / ADR-054 — fine for historic context but should reference recent ADRs (e.g., ADR-126/127/130/133/137)
- L84: `52 Phases. One Human. Many Agents.` — should be `~99 Phases. One Human. Many Agents.` (or "P11-P109" framing)
- L87-91: `52 sealed phases through P69 ... 96 ADRs and 5 DDD bounded contexts` — should be `~99 sealed phases through P109 ... 128 ADRs and 5 DDD bounded contexts`
- L110: `Phase Trajectory (P1-P21)` — should be `Phase Trajectory (P1-P109)` — title alone implies trajectory ends at P21
- L174: `21 phases` — should be `~99 phases`
- L307: `52 phases sealed (P15–P69)` — should be `~99 phases sealed (P11–P109)`

**Status: FAIL** (8 P1 stale numbers + 1 P2 trajectory list ends at P21)

### src/pages/Docs.tsx — NEEDS-UPDATE

- L9: `12 professional themes or start with one of 17 pre-built example sites` — themes wrong (should be `21`); example sites wrong (should be `51`)
- L14: `300-image media library` — correct
- L31-52 (SECTION_TYPES): 20 entries listed, but several are aliases not canonical 18 per ADR-100. Actual canonical 18: menu, hero, columns, pricing, action, footer, quotes, questions, numbers, gallery, image, divider, text, logos, team, blog, case-study, contact-form. Surface lists `cta`, `features`, `faq`, `testimonials`, `value-props` (5 aliases) which are NOT in canonical 18; missing `blog`, `case-study`, `contact-form` (3 canonical types). Per ADR-100 + ADR-134 + ADR-137 these aliases live in `validateSectionType` runtime helper only, not as canonical types.
- L54-67 (THEMES): 12 themes hardcoded — should be `21` (CLAUDE.md confirms 21 themes incl. dark-feminine/industrial-modern/cozy-maximalist + earlier 18-set from P72 OC-TI)
- L67: theme list ends at `neon` — missing 9 themes
- L92-93 (Hero count summary): `{SECTION_TYPES.length} section types, {totalVariants} variants, {THEMES.length} themes, {SPEC_GENERATORS.length} spec generators` — uses array length so dynamic; MUST update arrays for figures to be honest

**Status: NEEDS-UPDATE** (3 P1 stale arrays — section types misaligned with canonical 18, themes 12→21, examples 17→51)

### src/pages/BYOK.tsx — PASS

- Provider table (Claude, Gemini, OpenRouter, Simulated, AgentProxy) — accurate
- L53: `local 18-prompt corpus` for AgentProxy — verify against current corpus (P81 / OC-16 / ADR-106 says 500+ prompts; this surface still cites 18 — could be specifically the AgentProxy fixture subset, in which case verify literal subset count; **flag as P3** without action)
- No phase/test/ADR counters on this page
- Cost-cap copy ($1.00 default, 80% threshold, $0.10–$20 range) — verify against current ChatSettings; copy is reasonable
- Privacy promises (no analytics, no telemetry, BYOK never leaves browser) — accurate per ADR-043 + ADR-114 D3

**Status: PASS** (1 P3 verify-only on AgentProxy 18-prompt count)

### src/pages/Blog.tsx — FAIL

- L7-15: imports `HEADLINE_STATS` from `@/data/progress-eval` — that data source is itself STALE (see Progress.tsx finding)
- L10-15: STATS array shows `codingDays / sprintsSealed / adrsAccepted / testsGreen` — values are pulled from HEADLINE_STATS which is stale (52 phases / 96 ADRs / 730 tests / 17 sprints all outdated; see progress-eval.ts L23-30)
- Stats banner directly affected by upstream data staleness
- Blog post cards / tag filter / RSS link — all fine
- 12 blog posts in `src/pages/blog/posts/` confirmed; ADR-097 floor of 12 met
- L191-194 footer: Harvard ALM Capstone framing — fine

**Status: FAIL** (cascades from HEADLINE_STATS staleness; 4 P1 stale stats banner values)

### src/pages/Progress.tsx — FAIL

- L99: `HEADLINE_STATS[card.key]` for all 6 stat cards — values from `src/data/progress-eval.ts` are STALE
- **`progress-eval.ts` L23-30 canonical stats:**
  - `codingDays: 2` — likely STALE (build-in-public was 2-day claim; absolute time has passed; verify against current truth)
  - `daysToDefense: 14` — STALE (May 2026 defense was ~3 weeks out at P69; if today is 2026-05-03 the defense gate may already have passed or be much closer)
  - `phasesSealed: 52` — should be `~99` (P11→P109)
  - `adrsAccepted: 96` — should be `128`
  - `testsGreen: 730` — should be `~1491+` cumulative or `237` regression
  - `sprintsSealed: 17` — STALE (per CLAUDE.md sprint count has grown via P58-P109 sprint chain; needs hand-recount)
- L43-46 (PROGRESS_ITEMS): Σ-restriction discipline scored "across 79 ADRs" — should reference 128 ADRs
- L141-144: "Eighteen items, scored 1-10 against the Sprint J system-wide review and the 2026-04-29 product evaluation" — STALE benchmark date; current state per ADR-132 is v2.0.0-RC1 / P102 persona scores 86/86/88 composite 86.7/100
- L73: `built in 2 days, ready in 10` — was the P101 RC pitch; may be stale framing post-v2.0.0-RC1
- L214: `Sprint M sealed · 2026-04-29` — should be `v2.0.0-RC1 sealed · post-P109` or similar
- Page does not surface persona scores (Grandma 86 / Framer 86 / Lars 88) at all — opportunity to add

**Status: FAIL** (6 P1 stale HEADLINE_STATS + 2 P2 stale benchmark dates + 1 P2 missing persona scores)

### src/pages/Onboarding.tsx — NEEDS-UPDATE

- L31: `planning: "Planning mode is live — open /planning to map a project."` — CORRECT (Planning live since P90 / ADR-116)
- L32: `agentics: "Agentics mode is live — open /agentics for the spec workbench."` — CORRECT
- L750: `EXAMPLE_SITES.length` count chip — DYNAMIC (correctly displays 51)
- L487-492: `DEFAULT_EXAMPLE_NAMES` — array references `'Stories from the kitchen'`, `'Sweet Spot Bakery'`, `'CloudSync Enterprise'`, `'Kitchen Sink Demo'` — ALL must be names that exist in EXAMPLE_SITES; `defaultExamples` filter (L494) silently drops missing entries. CRITICAL: if `'Stories from the kitchen'` is not in current EXAMPLE_SITES the default-row falls to 3 examples. Worth verifying these 4 names exist post-P109 example renames.
- No phase/ADR/test counters on this page — clean
- L308: `Coming Soon` badge for FutureCapabilityCard with `available: false` — used for Spec Upload + GitHub Connect + Project History — these are accurate as Tier-2/post-RC items per ADR-114

**Status: NEEDS-UPDATE** (1 P3 verify DEFAULT_EXAMPLE_NAMES still match current EXAMPLE_SITES; otherwise mostly clean)

---

## Aggregate findings

| Severity | Count | Pages affected |
|----------|-------|----------------|
| P1 (false claim — stale stat / wrong number / wrong status) | 41 | Welcome (5), About (6), OpenCore (5), HowIBuiltThis (8), Docs (3), Blog (4), Progress (6), HEADLINE_STATS source (4 separate cascading) |
| P2 (stale framing / missing recent capabilities) | 7 | About (1 stage-status), OpenCore (1 missing-capabilities), HowIBuiltThis (1 trajectory-list), Progress (3 benchmark + persona-scores), Blog (1) |
| P3 (cosmetic / verify-only) | 4 | AISP (1 atom-count clarity), BYOK (1 verify), Onboarding (1 verify), Welcome (1 framing) |

**Total findings: 52 (41 P1, 7 P2, 4 P3)**

---

## Recommended fixes (ordered by leverage)

### Tier 1 — single-source data fix (closes 10 of the 41 P1 with one edit)

1. **`src/data/progress-eval.ts:23-30`** — update `HEADLINE_STATS` to canonical:
   ```ts
   codingDays: <verify current>,
   daysToDefense: <recompute from defense date>,
   phasesSealed: 99,    // P11..P109 inclusive
   adrsAccepted: 128,
   testsGreen: 1491,    // cumulative; or 237 for current regression — PICK ONE
   sprintsSealed: <recount from CLAUDE.md sprint chain>,
   ```
   Cascades to: Blog stats banner (4 numbers) + Progress stat cards (6 numbers).

### Tier 2 — Welcome.tsx hero stats (most-trafficked surface)

2. **`src/pages/Welcome.tsx:77-81`** — social proof bar:
   ```tsx
   <span><strong>~1491+</strong> tests passing</span>
   <span><strong>128</strong> ADRs Accepted</span>
   <span><strong>51</strong> examples</span>
   <span><strong>12</strong> blog posts</span>
   <span>composite <strong>86.7/100</strong> (vs SOTA 80)</span>
   ```
3. **`src/pages/Welcome.tsx:116-118`** — "Building in public" copy:
   ```tsx
   ~99 phases sealed (P11–P109), 128 ADRs Accepted, ~1491+ PURE-UNIT tests GREEN,
   composite 86.7/100 (vs SOTA 80).
   ```
4. **`src/pages/Welcome.tsx:168`** — capabilities sentence: change `43 example sites` → `51 example sites`.

### Tier 3 — About.tsx P109 truth-up

5. **`src/pages/About.tsx:33-38`** — capstone scoreboard callout:
   - "As of P69" → "As of P109"
   - "52 phases through P69" → "~99 phases through P109"
   - "96 ADRs Accepted and 730 PURE-UNIT tests GREEN" → "128 ADRs Accepted and ~1491+ PURE-UNIT tests GREEN"
6. **`src/pages/About.tsx:186-190`** — 5-stage journey: change Stage 3 (LLM MVP), Stage 4 (Open Core) status from "Planned" to "Complete"; keep Stage 5 framing as "Future" (Tier-2 commercial).

### Tier 4 — OpenCore.tsx truth-up

7. **`src/pages/OpenCore.tsx:94`** — change `12 themes, 15 example websites` → `21 themes, 51 example websites`.
8. **`src/pages/OpenCore.tsx:284, 296-297, 300-301, 306-307`** — `96 ADRs` → `128 ADRs`; `730 tests` → `~1491+ tests`; `52 phases (P15–P69)` → `~99 phases (P11–P109)`.
9. **`src/pages/OpenCore.tsx:339`** — repo card: `12 themes, 15 examples` → `21 themes, 51 examples`.

### Tier 5 — HowIBuiltThis.tsx truth-up

10. **`src/pages/HowIBuiltThis.tsx:5-12`** — STATS array:
    ```ts
    { icon: Layers, label: 'ADRs', value: '128' },
    { icon: Layers, label: 'Tests Passing', value: '~1491+' },
    ```
11. **`src/pages/HowIBuiltThis.tsx:14-28`** — extend PHASES array P22-P109 OR add summary callout `Current state: P109 / v2.0.0-RC1 sealed`.
12. **`src/pages/HowIBuiltThis.tsx:30-49`** — METHODOLOGY card 3: `'43 Architecture Decision Records'` → `'128 Architecture Decision Records'`; refresh ADR list to include ADR-126/127/130/133/137.
13. **`src/pages/HowIBuiltThis.tsx:84-91`** — hero copy: `52 Phases` → `~99 Phases`; `52 sealed phases through P69` → `~99 sealed phases through P109`; `96 ADRs` → `128 ADRs`.
14. **`src/pages/HowIBuiltThis.tsx:110, 174`** — section title `Phase Trajectory (P1-P21)` → `(P1-P109)`; `'across 21 phases'` → `'across ~99 phases'`.
15. **`src/pages/HowIBuiltThis.tsx:307`** — STAT card `52 phases sealed (P15–P69)` → `~99 phases sealed (P11–P109)`.

### Tier 6 — Docs.tsx truth-up

16. **`src/pages/Docs.tsx:9`** — `12 professional themes or start with one of 17 pre-built example sites` → `21 professional themes or start with one of 51 pre-built example sites`.
17. **`src/pages/Docs.tsx:31-52`** — SECTION_TYPES: align with canonical 18 per ADR-100 (drop `cta`/`features`/`faq`/`testimonials`/`value-props` aliases; add `blog`/`case-study`/`contact-form`).
18. **`src/pages/Docs.tsx:54-67`** — THEMES: extend from 12 to 21 themes (add elegant, neon already present; add 9 missing per `themeLibrary.ts`).

### Tier 7 — Persona scores callout (NEW capability)

19. **Progress.tsx** — add a top-of-page persona score card surfacing `Grandma 86 / Framer 86 / Lars 88 · composite 86.7/100` per ADR-132 v2.0.0-RC1 boundary. Closes the missing-persona-scores P2 finding.

---

## Verdict

**FAIL — major rewrites needed.**

- 8 of 9 user-facing pages have at least 1 P1 stale claim
- 1 page (BYOK) PASSES (1 P3 verify-only)
- 1 page (AISP) effectively passes (1 P3 cosmetic clarity)
- 1 page (Onboarding) effectively passes (1 P3 verify-only — mode copy is already current per P90)
- The other 6 pages (Welcome, About, OpenCore, HowIBuiltThis, Docs, Blog, Progress) all FAIL with multiple P1 stale numeric claims

Estimated single-agent fix-pass at velocity: **~2-3 hours, ≤200 LOC, single PR**. Recommended sequencing:
1. `progress-eval.ts` data fix (cascade closes 10 P1)
2. Welcome + About hero/scoreboard (most-visited surfaces)
3. OpenCore + HowIBuiltThis (story pages)
4. Docs (reference page; alignment with ADR-100)
5. Optional persona-scores callout on Progress (closes P2)

After fix: re-run this audit grep against the same surfaces to confirm zero remaining P1 + ≤2 P3 cosmetic notes.

**Honest qualifier:** the cumulative test-count number choice (`~1491+` cumulative vs `237` current regression) is owner-discretion. CLAUDE.md uses both depending on context; pick one for marketing pages and stay consistent.
