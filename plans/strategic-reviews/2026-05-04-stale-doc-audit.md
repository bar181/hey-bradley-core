# Stale-Doc Audit

> **Date:** 2026-05-04 · **Branch:** `claude/verify-flywheel-init-qlIBr` · **Latest commit:** `43cbf95`
> **Mode:** RESEARCH ONLY — non-source documentation surfaces audited against canonical state.

## Summary

Canonical state (truth, post-FINAL-CLEANUP):

- **Tests:** 237/237 GREEN cumulative regression at this anchor.
- **ADR files on disk:** 128 (highest ID = ADR-137).
- **EXAMPLE_SITES (templates):** 51.
- **Phases sealed:** P11 → P109 + 5-PROJECTS + FINAL-CLEANUP.
- **Crystal Atoms:** 8 (suite COMPLETE).
- **Modes:** 3 routed.
- **Section types:** 18 / **Themes:** 21 / **Blog posts:** 12.
- **Boundary:** v2.0.0-RC1 (ADR-133).
- **Persona scores (P102 / ADR-132):** Grandma 86 / Framer 86 / Lars 88.
- **SOTA composite:** 86.7/100 vs Lovable 80/100.

13 of 16 audited surfaces carry stale numeric or status claims. Most claims are **frozen at P101 / v2.0.0-RC1 boundary**; the FINAL-CLEANUP arc P104–P109 + 5-PROJECTS landed AFTER those docs were last touched. Two surfaces (`docs/validation/*`) are correctly aligned. README.md has the most severe drift (still claims v1.0.0-RC1 + 41 templates + 5 atoms + 107 ADRs). Adoption guides are anchored to the 5-atom narrative and don't reflect the 8-atom AISP suite.

**No P1 doc-level integrity violations** (no false security claims, no broken external links flagged). All findings are P2 (publishable surface drift) or P3 (cosmetic / historical-record nuance).

---

## Per-document findings

### CHANGELOG.md — NEEDS-UPDATE (P2)

- L7-9 `[v2.0.0-RC1]` entry stops at P101. Missing P102 / P103 / P104 / P105 / P106 / P107 / P108 / P109 + 5-PROJECTS + FINAL-CLEANUP.
- L9 "**101 phases sealed (P11 → P101)**" — stale. Truth: P11 → P109.
- L9 "~1300+ cumulative pure-unit GREEN" — stale. Truth: 237 cumulative regression GREEN; (~1491+ if counting P109 anchor in CLAUDE.md).
- L9 "**122 ADRs on disk (IDs run ADR-001 — ADR-131 with documented gaps)**" — stale. Truth: 128 / ADR-137.
- L9 + L19 + L158 "43 templates" — stale. Truth: 51 EXAMPLE_SITES.
- L120-122 "Persona scores at v2.0.0-RC1 seal — Grandma 84 / Framer 84 / Lars 85" — stale. Truth (P102 / ADR-132): 86 / 86 / 88; **0/3 floor breaches**.
- L118 "vs Lovable 80 / 100 baseline: Hey Bradley scored **79 — 84 / 100**" — stale. Truth (P103 / ADR-133): 86.7/100 composite.
- L155 "Phases: 101 sealed (P11 → P101)" — stale.
- L156 "Tests: ~1300+ cumulative pure-unit GREEN at P101 seal" — stale.
- L157 "ADRs: 122 files on disk; ADR IDs run ADR-001 — ADR-131" — stale.
- L158 "Templates: 43" — stale. Should be 51.
- **Status: NEEDS-UPDATE**

### docs/launch/owner-launch-checklist.md — PASS (P3)

- L3 "Generated at P103 seal" — historical record (correct). Document predates FINAL-CLEANUP.
- L10 "BYOK smoke test ... budget ~$0.05" — matches gap-audit completion-report.md L82.
- 32 LOC; 17 owner items aligned with `docs/validation/completion-report.md` "Remaining Items (Human Only — 17 items)".
- **Status: PASS** (frozen at P103 by design; cross-refs hold).

### docs/launch/release-notes-v2.0.0-rc1.md — NEEDS-UPDATE (P2)

- L5 "Branch sealed at: P101 / AW-RC" — historical (correct for v2.0.0-RC1 release-candidate boundary; P102+ are post-RC sprints).
- L71 "Hey Bradley v2.0.0-RC1: 79 — 84 / 100 raw" — stale. Truth (P103 / ADR-133): 86.7/100 composite. The release notes describe the RC at PRE-P102 honesty; P102 was the fix-pass that closed the floor breaches BEFORE tagging.
- L76-78 Persona "Grandma 84 / Framer 84 / Lars 85" — stale. Truth (P102 / ADR-132): 86 / 86 / 88; 0/3 below floor.
- L82-83 "P102 token migration LIFTS Grandma + Framer to ≥85 ... Agentics live-wire LIFTS Lars to ≥88" — written in future tense; P102 ALREADY landed.
- L131 "Phases: 101 sealed (P11 → P101)" — stale (RC1 boundary frozen at P101 is correct, but the v2.0.0-RC1 release artifact is now post-P109; document this somewhere).
- L132 "Tests: ~1300+ cumulative pure-unit GREEN" — stale.
- L133 "ADRs: 122 files on disk; IDs run ADR-001 — ADR-131" — stale.
- L136 "Templates: 43" — stale. Truth: 51 (with E2E + 5-PROJECTS).
- L99 "ruvector ... 126 entries" — historical record; matches CLAUDE.md.
- **Status: NEEDS-UPDATE** (release notes can be appended with a "Post-RC seal arc" section or have numbers updated in-place; persona scores in particular are misleading because P102 fixed them BEFORE tag was cut).

### docs/launch/show-hn-post.md — NEEDS-UPDATE (P2)

- L17 "~1300+ pure-unit tests passing across 101 sealed phases (P11 → P101). 131 ADRs Accepted. 43 templates" — three stale claims in one line. Truth: ~1491+ at P109 anchor / P11 → P109 / 128 ADRs / 51 templates.
- L19 "Honest about persona scores. Grandma 84 / Framer 84 / Lars 85" + "SOTA composite 79–84/100 vs Lovable 80/100" — stale. Truth: 86 / 86 / 88; composite 86.7/100. The honesty positioning is the right tone but the numbers undersell.
- L29-37 links — `/demo/full-site` + `/planning` + `/agentics` routes match canonical (3 modes routed since P90).
- **Status: NEEDS-UPDATE** (this is the public-facing launch post; the persona-score undersell is the highest-impact cosmetic stale).

### docs/launch/demo-video-script.md — NEEDS-UPDATE (P2)

- L63 "~1300+ pure-unit tests GREEN at P101 seal" — stale.
- L65 "43 templates" — stale.
- L67 "131 ADRs Accepted on disk" — stale (128).
- L71 "101 phases sealed (P11 → P101)" — stale.
- L72 "Persona scores — Grandma 84 / Framer 84 / Lars 85 (ADR-094 rubric; ADR-131 honest)" — stale.
- L73 "SOTA composite 79–84/100 vs Lovable 80/100 (ADR-127 §C)" — stale; should reference ADR-132 / ADR-133 86.7/100.
- L92-96 ADR cross-refs (ADR-116 / 118 / 119 / 120 / 121 / 122 / 128 / 129 / 130 / 131) — all valid; nothing post-P101 referenced.
- **Status: NEEDS-UPDATE**.

### docs/launch/product-hunt-tagline.md — NEEDS-UPDATE (P3)

- L9 description "8 Crystal Atoms ... 43 templates ... v2.0.0-RC1" — "43 templates" stale. Truth: 51.
- 260-char hard cap — replacing "43 templates" → "51 templates" preserves cap (1 char neutral).
- **Status: NEEDS-UPDATE**.

### docs/launch/agentics-foundation-beta.md — NEEDS-UPDATE (P3)

- L17 "We just sealed the four moat priorities and tagged `v1.0.0-RC1`" — historical ladder reference (predates v2.0.0-RC1 cut).
- L43 "Watch the five atoms fire" — stale. Truth: 8 Crystal Atoms (suite COMPLETE).
- L88 "Harvard ALM ... capstone, May 2026" — historical (correct).
- **Status: NEEDS-UPDATE** (5 atoms → 8 atoms reframing is the only material change).

### docs/launch/release-notes-v1.0.0-rc1.md — PASS (P3)

- v1.0.0-RC1 historical record. Should NOT be updated (frozen at v1.0.0-RC1 seal date 2026-05-01).
- L18 "41 vertical-positioned templates ... All 51 Template-Intelligence entries carry `exampleQueries`" — note: 51 here refers to T-I library entries (21 themes + 15 sections + 15 contents), NOT EXAMPLE_SITES. Distinct number, not stale.
- **Status: PASS** (historical-record pin).

### docs/launch/reviewer-impression-audit.md — PASS (P3)

- L33 "first neural symbolic language with 512 symbols" — AISP description; correct.
- L106 "post-RC" recommendations — frozen at audit date.
- L28 references `README.md:127-135` engineering scoreboard with "80 ADRs" — at the time of the audit. Historical record.
- **Status: PASS** (audit artifact is a snapshot; not a current-state claim).

### CLAUDE.md — NEEDS-UPDATE (P2)

- L295-ish "ADRs: 128 files on disk; ADR IDs run ADR-001 through ADR-137" — **CORRECT** at P109 anchor.
- L289-ish "Templates: 51" / "Crystal Atoms: 8" / "Section types: 18" / "Themes: 21" / "Blog posts: 12" — all CORRECT.
- L312-ish "Tests: Cumulative ~1491+ PURE-UNIT GREEN at P109 seal" — internally consistent; the P109 entry says cumulative regression 237 GREEN at P109 anchor. The two numbers measure different things (cumulative all-spec count vs P101+ regression-window subset). Both numbers valid.
- L74-275 narrative covers P109 + FINAL-CLEANUP; cross-refs ADR-137 + 5-PROJECTS.
- **Status: NEEDS-UPDATE only IF surfaces below it (CHANGELOG, release notes, README) get updated** — CLAUDE.md is itself the canonical anchor. The P109 entry already reflects post-FINAL-CLEANUP state.
- **Verdict: PASS** (CLAUDE.md is the truth source the audit cross-references against; nothing stale at P109 anchor).

### README.md — NEEDS-UPDATE (P2 — most severe drift)

- L8 release badge `v1.0.0-RC1` — stale. Truth: v2.0.0-RC1 (ADR-133).
- L26 "Inspect the 5 atoms" — stale. Truth: 8 Crystal Atoms (AISP suite COMPLETE since P94 / ADR-120).
- L34 "## The 5-atom AISP Crystal Atom architecture" — stale section heading.
- L36 "Every Bradley reply emits a deterministic trace of five typed atoms" — stale.
- L46 "Plus DECOMP_ATOM (ADR-099) at the front of the pipeline" — only DECOMP mentioned; PROCESS / DDD / AGENT (ADR-118 / 119 / 120) not referenced.
- L130 "18 section types, 12 themes, 41 templates across 8+ verticals" — stale: 12 themes (truth: 21); 41 templates (truth: 51).
- L143 "ADRs Accepted | 107 (range ADR-045 through ADR-107)" — **most stale claim in the doc**; truth: 128 files (range 001–137).
- L144 "PURE-UNIT tests cumulative at P82 / OC-CLEANUP seal | ~984 GREEN" — anchor is at P82; truth: ~1491+ at P109.
- L147 "Themes / examples / section types | 12 / 41 / 18" — themes wrong; templates wrong.
- L149 "Crystal Atoms in production | 5 (+ DECOMP front-of-pipeline)" — stale.
- L159 "**`v1.0.0-RC1` — public release candidate.** Sprint M and Sprint N sealed." — stale; should be v2.0.0-RC1.
- L82-86 "Three modes" table — Builder / Chat / Listen, NOT Whiteboard / Planning / Agentics. The README "modes" map to chat-input modes within the Whiteboard surface, NOT the post-P90 three product modes. **This is conceptually stale**: at v2.0.0-RC1, "modes" means Whiteboard / Planning / Agentics per ADR-116.
- **Status: NEEDS-UPDATE** (the README is the public face and is anchored to v1.0.0-RC1 / P82; needs a v2.0.0-RC1 pass).

### docs/aisp-adoption/00-getting-started.md — NEEDS-UPDATE (P2)

- L22 "## The 5 atoms (plus DECOMP)" — stale. Truth: 8 atoms (5 baseline + DECOMP + PROCESS + DDD + AGENT). The adoption table at L27-34 lists 5 + DECOMP only; no PROCESS / DDD / AGENT.
- L24 "Every Hey Bradley pipeline run can emit traces for up to five Crystal Atoms" — stale.
- L43 `"version": "aisp-1.2"` — current bundle version; matches `01-bundle-schema.md:3`.
- L11 "ADR-053 (INTENT_ATOM)" anchor — correct.
- **Status: NEEDS-UPDATE** (AISP adoption surface is supposed to enumerate the consumable atoms; missing 3 of 8).

### docs/aisp-adoption/01-bundle-schema.md — PASS (P3)

- L3 "Spec version: `aisp-1.2`" — current.
- L46-95 atom field-shape table covers INTENT / ASSUMPTIONS / SELECTION / CONTENT / PATCH (the bundle-emitted atoms; DECOMP is pre-pipeline; PROCESS / DDD / AGENT are Planning / Agentics mode atoms NOT serialised in `bundle.atoms`).
- **Status: PASS** (bundle schema is correct — PROCESS / DDD / AGENT live outside the bundle.atoms object by design; bundle is for Whiteboard mode output).

### docs/aisp-adoption/02-reference-implementation-walkthrough.md — PASS (P3)

- Walks the TS + Python parser; references the 5 bundle-emitted atoms (intent / assumptions / selection / content / patch) — correct per bundle-schema scope.
- **Status: PASS** (parser reference; not a state claim).

### docs/aisp-adoption/03-trigger-word-taxonomy.md — PASS

- Phase reference E2E-TEST-2; cross-refs ADR-099 / 100 / 126 / 127 — all valid.
- L16 "Per ADR-100, the canonical enum is exactly 18 values" — correct.
- 18 section types listed (L18-37) — matches truth.
- **Status: PASS**.

### docs/validation/database-integrity-report.md — PASS (P3)

- L3 "Generated: 2026-05-04 ... FINAL-CLEANUP A2" — current.
- L7 verdict "PARTIAL PASS" + "all 5 P107-declared event_types now have ≥1 fixture row" — correct.
- L131-136 "Rationale for PARTIAL" lists 4 honest gaps including "(8 rows in project-4) ... `patch_applied`" — but L136 itself notes some closed in FINAL-CLEANUP.
- L120-129 verdict table with 6 PASS-ed checks — current.
- Note: completion-report.md L44 says "all 4 honest gaps CLOSED in FINAL-CLEANUP" while database-integrity-report.md still lists 1+2+3+4 in L131-136 with 4 marked "CLOSED" but 1+2+3 unstruck. Minor internal-cross-doc drift; non-blocking.
- **Status: PASS** (current; honest about partial state).

### docs/validation/completion-report.md — PASS

- L4 final commit `[FINAL-CLEANUP-HASH]` placeholder — should be filled with the actual commit hash post-merge. Cosmetic (P3).
- L62 "ADR files on disk: 128" — correct.
- L61 "EXAMPLE_SITES: 51" — correct.
- L75 "Hey Bradley v2.0.0-RC1 boundary (P103 seal): 86.7/100" — correct.
- L78-98 "17 items" owner-only checklist — aligned with `docs/launch/owner-launch-checklist.md`.
- L76 "Post-P109 + 5-projects honest delta: estimate +0 to +2 vs RC1" — honest framing.
- **Status: PASS** (current; honest; the placeholder hash is the only gap).

### plans/strategic-reviews/2026-05-04-gaps-to-done/* — PASS (P3)

- 8 chunked deep-audit docs predating P105 fix-pass dispatch.
- L00-index.md L16 "After this, gaps either get closed (P105+ sprints), get honest-deferred to Tier-2, or get an owner waiver" — frozen at audit-creation time. P105–P109 already happened; the audit is now historical.
- The audit was the **trigger** for P105+ closure work; the audit docs themselves should NOT be updated — they're the source-of-record for what was open at P104 anchor.
- **Status: PASS** (intentional historical-record pin; closure tracked in completion-report.md "Items Requiring No Human — COMPLETE" L109-122).

---

## Aggregate

| Document | Severity | Notes |
|----------|----------|-------|
| README.md | **P2** | Most severe drift; v1.0.0-RC1 badge + 5-atom + 41-template + 107-ADR claims; "modes" table is pre-P90 |
| CHANGELOG.md | **P2** | Stops at P101; 101-phase / 122-ADR / 43-template / 84-persona claims all stale |
| docs/launch/release-notes-v2.0.0-rc1.md | **P2** | Persona scores undersell (84/84/85 vs truth 86/86/88); 79-84/100 vs truth 86.7/100; 122/43/101 stale |
| docs/launch/show-hn-post.md | **P2** | Public-facing; persona-score undersell + 1300/101/131-ADR/43-template stale |
| docs/launch/demo-video-script.md | **P2** | Same stale numbers as show-hn-post |
| docs/aisp-adoption/00-getting-started.md | **P2** | Lists 5 atoms + DECOMP; missing PROCESS / DDD / AGENT framing |
| docs/launch/product-hunt-tagline.md | P3 | "43 templates" → "51 templates" |
| docs/launch/agentics-foundation-beta.md | P3 | "Five atoms fire" → "Eight atoms fire"; v1.0.0-RC1 anchor |
| docs/validation/completion-report.md | P3 | `[FINAL-CLEANUP-HASH]` placeholder needs the actual hash |
| docs/validation/database-integrity-report.md | P3 | Internal cross-doc drift on "all 4 honest gaps closed" |
| CLAUDE.md | PASS | Truth source; P109 anchor current |
| docs/launch/owner-launch-checklist.md | PASS | Frozen at P103 by design; aligned with completion-report.md 17 items |
| docs/launch/release-notes-v1.0.0-rc1.md | PASS | Historical-record pin |
| docs/launch/reviewer-impression-audit.md | PASS | Historical audit snapshot |
| docs/aisp-adoption/01-bundle-schema.md | PASS | Bundle scope correct |
| docs/aisp-adoption/02-reference-implementation-walkthrough.md | PASS | Parser ref; no state claims |
| docs/aisp-adoption/03-trigger-word-taxonomy.md | PASS | 18-section enum + ADR refs current |
| plans/strategic-reviews/2026-05-04-gaps-to-done/* | PASS | Intentional historical pin (trigger for P105+ closure) |

---

## Recommended fixes (ordered by impact)

1. **README.md L8 / L143 / L144 / L147 / L149 / L159 / L82-86** — full v2.0.0-RC1 pass: badge → v2.0.0-RC1; ADRs Accepted → 128 (range 001–137); cumulative tests → ~1491+ at P109; themes 12 → 21; templates 41 → 51; Crystal Atoms 5 → 8; modes table → Whiteboard / Planning / Agentics per ADR-116.
2. **CHANGELOG.md L7-19 + L155-158** — append a `## [v2.0.0-RC1 — Post-RC seal arc]` section enumerating P102 / P103 / P104 / P105 / P106 / P107 / P108 / P109 + 5-PROJECTS + FINAL-CLEANUP. Update headline counters (101 → 109 phases; 122 → 128 ADRs; 1300 → 1491+ tests; 43 → 51 templates; persona 84/84/85 → 86/86/88).
3. **docs/launch/release-notes-v2.0.0-rc1.md L71 / L76-78 / L82-83 / L131-136** — persona scores must read 86 / 86 / 88 (P102 fix-pass landed BEFORE tag); composite 86.7/100 not 79–84/100; convert "P102 lifts X to Y" future tense → past tense; Numbers section update.
4. **docs/launch/show-hn-post.md L17 / L19** — single-pass numeric refresh; flip persona honesty section to current scores (the +6.7 vs Lovable framing is stronger than the original +0–4 honesty haircut).
5. **docs/launch/demo-video-script.md L63 / L65 / L67 / L71 / L72 / L73** — Concrete-numbers section refresh.
6. **docs/aisp-adoption/00-getting-started.md L22-34** — expand atom table from 5+DECOMP → 8 atoms; clarify which atoms ship in `bundle.atoms` (5 baseline + DECOMP) vs. which ship in Planning / Agentics modes (PROCESS / DDD / AGENT).
7. **docs/launch/product-hunt-tagline.md L9** — `43 templates` → `51 templates`.
8. **docs/launch/agentics-foundation-beta.md L43** — `the five atoms fire` → `the eight atoms fire`.
9. **docs/validation/completion-report.md L4** — replace `[FINAL-CLEANUP-HASH]` with actual commit (43cbf95 at branch tip).

---

## Verdict

**PARTIAL** — 13 of 18 audited surfaces have stale public-facing claims (3 P2 + 4 P2 + 6 P3). Zero P1 doc-level integrity violations. CLAUDE.md (truth source) + 4 PASS-ed launch docs + 3 PASS-ed adoption guides + 2 PASS-ed validation reports + the historical strategic-review folder are aligned or intentionally frozen.

The highest-impact stale surface is **README.md** (most-trafficked public face; v1.0.0-RC1 badge alone undermines launch credibility). Second-highest is the **persona-score undersell** in release-notes-v2.0.0-rc1.md / show-hn-post.md / demo-video-script.md (the 84/84/85 + 79–84/100 framing makes the project look weaker than the canonical P102 / ADR-132 86/86/88 + 86.7/100 truth).

Findings: **13** total · **6 P2** · **6 P3** · **0 P1**.
