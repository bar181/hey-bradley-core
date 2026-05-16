# P128 — Session Log

> Running log of every dispatch, decision, and fix. Primary source for any
> later agent that needs to understand what happened in P128.

---

## 2026-05-16 — Step 0 (P127 merged, P128 branch)

- P127 merged to main via PR #6 → squash commit `fc2f9b4f222589e933278cb0333e26485a3d52a5`.
- Production smoke: `/` 200, `/builder` 200.
- Cut `swarm/p128-agentics-ui` off main @ `fc2f9b4f2`.
- Scaffolded preflight + session-log + retrospective with explicit ordering: **template quality lift before UI work**.

---

## 2026-05-16 — F1 baseline re-review (6 parallel reviewer agents)

Dispatched 6 parallel reviewer agents — one per non-AISP spec — to establish loop-0 baseline against iter-3.1-verified P127 outputs.

**Baseline composite: 53.8/100. ALL 6 below 75 bar.**

| Spec | Score | Headline finding |
|---|---|---|
| North Star | 51.7 | "general users" audience, unmeasurable win, no differentiator |
| Features | 58.0 | layout-as-feature padding, no section IDs, no dependency graph |
| Architecture | 38.0 | "DDD theater" on brochureware, no stack/hosting/integrations |
| CSS | 69.0 | no breakpoints, no motion-reduce, hex missing `#`, no light/dark pair |
| Build Plan | 40.3 | "8-12 days" fantasy, tautological DoD, no stack named |
| Human Spec | 66.0 | hallucinated mission when description empty, "leverage unprecedented" fluff |

Per-spec baseline reports saved to `template-iterations/baseline-{spec}.md`.

## 2026-05-16 — F2 + F3 — Loop 1 (all 6 templates revised in one batch)

Folded in: (a) baseline-reviewer concrete revisions, (b) web-search insights on 2026 best practices for SaaS stack / North Star metrics / design tokens / P0-P1-P2 prioritization, (c) Mermaid diagrams (quality > quantity per owner directive).

Pipeline re-run with revised templates → `runs/` overwritten. Loop-0 outputs preserved at `template-iterations/loop-1-runs/` (note: directory naming was confusing — that's actually the BASELINE runs preserved before loop-1 ran; the loop-1 OUTPUTS overwrote `runs/`).

**Loop-1 composite: 83.0/100. 5 of 6 templates cleared ≥80.**

| Spec | Baseline | Loop 1 | Δ | Pass |
|---|---|---|---|---|
| North Star | 51.7 | 84.0 | +32.3 | ✅ |
| Features | 58.0 | 84.0 | +26.0 | ✅ |
| Architecture | 38.0 | 82.0 | +44.0 | ✅ |
| CSS | 69.0 | 88.0 | +19.0 | ✅ |
| Build Plan | 40.3 | 84.7 | +44.4 | ✅ |
| Human Spec | 66.0 | 75.3 | +9.3 | ❌ |

Human Spec laggard: CTA paraphrasing + tautological theme-mode notes.

## 2026-05-16 — Loop 2 (Human Spec only)

Added competitor allowlist (Squarespace / Webflow / Framer / Medium / Substack / Toptal / etc.) + banned vague placeholders. Pipeline re-run.

**Loop-2 Human Spec: 76.7/100 (+1.4) — still below bar.** CTA paraphrasing persisted.

## 2026-05-16 — Loop 3 (Human Spec — programmatic CTA extraction)

Updated `scripts/p127-spec-updater.mjs` to extract hero `primaryCta.props.text` programmatically and inject as `{{exactCta}}` template variable. Template requires literal double-quoted match in paragraph 3. Also pre-computed `themeModeNote` (only fires on genuine palette-luminance contradiction).

**Loop-3 Human Spec: 85.7/100 (+9.0). ALL 6 TEMPLATES NOW ≥80.**

Per-site loop-3 scores:
- Blog: 86 (CTA `"Read the Stories"` quoted verbatim)
- Portfolio: 84 (CTA `"View Projects"` quoted verbatim)
- Marketing: 87 (CTA `"Book a Discovery Call"` quoted verbatim; theme-mode contradiction note fired correctly)

**Final composite: 84.7/100 (vs baseline 53.8 → +30.9).**

## 2026-05-16 — F3 ADR-156 mini-addenda

Appended Mini-ADR addenda 1-6 (one per spec) to `docs/adr/ADR-156-spec-update-pipeline.md` documenting what changed in each template and why, plus the engine changes for `exactCta` + `themeModeNote` extraction.

## 2026-05-16 — Step 3 complete — owner gate cleared

Per owner directive: "Do not ship the Agentics card UI until the non-AISP templates are at 75/100 or better on the brutal-honest rubric." We exceeded that bar at **80+ across all 6** (composite 84.7).

Cost: $0.26 across all 3 loops + reviewer agents. UI work (F4-F8) now unblocked but **not started** — reporting to owner per directive "Report after Step 3 (template quality scores). Do not proceed to Step 4 without Step 3 complete."

---

## 2026-05-16 — F6 README + ABSTRACT (commit bd2b13874)

Per Phase 129 human-1.md F6 directive: rewrote `README.md` (396 lines, under 400-line cap) with two-half structure:

**First half (what + why):** TOC · §1 Capstone summary (Bradley Ross, Harvard ALM DGMD E-599, May 2026) · §2 Abstract (full text) · §3 The 55% problem · §4 Six core value props · §5 AISP deep-dive (512-symbol, `Ambig(D)<0.02`, 100% reproduction, 8-atom Crystal Atom table) · §6 Novel ideas + core concepts · §7 Three modes · §8 Developer adoption path · §9 Wiki guides + phase-level details · §10 Engineering scoreboard.

**Second half (how — divider `§11 — Getting started —`):** §11 Quick start · §12 BYOK + cost discipline · §13 Self-hosting · §14 Contributing + project process · §15 License + author + contact-for-applications.

Also fixed `ABSTRACT.md` — restored the missing "Software is no longer written. It is specified." opening (file was clipping mid-sentence); reformatted with proper section breaks. 19 lines.

## 2026-05-16 — F1 listen review card removed (commit 249f1d14a)

Per owner directive 2026-05-16: the pre-pipeline `ListenReviewCard` defeated listen mode's core value prop ("site updates while you're still talking"). The approve click turned listen into a slower chat mode. Per the same directive, the P126 F5 low-confidence pattern (best-guess patch + persona note + Chat-History deep-link) is the safety gate going forward.

Surgical removal:
- `useListenPipeline.ts` — `submitListenFinal` now calls `runListenPipeline` directly. Removed `ListenReviewState`, `pttReview` state, `handleListenApprove`/`Edit`/`Cancel`, `buildActionPreview` import.
- `ListenTranscript.tsx` — dropped `ListenReviewCard` import + render block + 4 picked-prop names.
- `ListenControls.tsx` — dropped `pttReview` from picked state + all guards; simplified aria-label / button label / disabled gates.
- Deleted: `src/components/left-panel/listen/{ListenReviewCard.tsx, listenActionPreview.ts}`.
- Tests: `p37-listen-split.spec.ts` updated with regression guards asserting review handlers/state are ABSENT; `p36-listen-enhanced.spec.ts` + `p36-fix-pass.spec.ts` → `.obsolete-p128` (tested deleted behavior).
- `handleListenClarificationAccept` retained as a safety net for the rare "zero patches applied + intent ambiguous" edge.

F1 5-check audit re-run:
1. Transcript appears while speaking — ✅ unchanged
2. Patch fires on silence/stop — ✅ NOW LITERAL (no approve gate)
3. Preview headline updates — ✅ shared chat-pipeline path (P126/P127 verified)
4. CostPill increments — ✅ `intelligenceStore.recordUsage` on every adapter call
5. Chat history logs the listen event — ✅ `writeLogEvent(..., inputType:'listen')` + `appendListenTranscript`

Gates: `npm run build` GREEN 6.25 s 792.42 KB gzip · ARCH 12/12 PASS · 28/28 listen tests PASS · secrets-guard clean.

## 2026-05-16 — Session close — state snapshot

**Branch:** `swarm/p128-agentics-ui`
**Last commit:** `249f1d14a`

| # | Feature | Status |
|---|---|---|
| F1 | Listen mode review-card removal | **COMPLETE** — 5/5 checks PASS, 28/28 tests PASS, build 792.42 KB gzip green, ARCH 12/12 |
| F2 | Input mode dropdown | NOT STARTED |
| F3 | BYOK modal (next priority per owner directive) | NOT STARTED |
| F4 | Resizable panels | NOT STARTED |
| F5 | Tech-debt sweep | NOT STARTED |
| F6 | README 396 lines + ABSTRACT.md | **COMPLETE** (commit `bd2b13874`) |

**Step-3-template-quality-lift** (the original P128 Step 3) also COMPLETE at commit `521f88d69`: all 6 non-AISP spec templates ≥80/100 (composite 84.7).

Next session resumes at F3 BYOK modal per the `next-session-grounding.md` doc on this branch.

---

*Append entries below as work proceeds. Format: `## YYYY-MM-DD — Topic`.*
