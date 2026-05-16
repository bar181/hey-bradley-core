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

*Append entries below as work proceeds. Format: `## YYYY-MM-DD — Topic`.*

---

*Append entries below as work proceeds. Format: `## YYYY-MM-DD — Topic`.*
