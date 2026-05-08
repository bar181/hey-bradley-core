# P123 / UI-CONTINUATION + LLM-SMOKE — Preflight

> **Mission:** Lift the 3 surfaces P122 left below floor + run live Gemini
> smoke on chat + listen modes per ADR-150. Specifically: Contact 58 → 65,
> Builder default 55 → 65, Agentics 60 → 70. Plus end-to-end live BYOK proof.
>
> **Branch:** `swarm/p123-ui-continuation` (cut from `swarm/p122-ux-overhaul`
> after P122 seals; local-only until owner sign-off).
>
> **Predecessor:** P122 / UX-OVERHAUL + LLM-LIVE sealed 2026-05-08
> (4 of 8 surfaces met target; 56/100 composite; 60/100 public-only).

---

## 1. Owner-locked decisions (inherited from `phase-122/human-2.md`)

- Default template: Hey Bradley dark/crimson — **locked** (no rework).
- `MarketingNav.tsx` — **do-not-touch.**
- `Welcome.tsx` hero copy — **do-not-touch.**
- AISP Crystal Atom view — **do-not-touch.**
- Listen-mode core UI — **do-not-touch.**
- BlogPost / About / Docs body copy — **do-not-touch.**
- LLM model lock: cheap-fast tier only (`gemini-2.5-flash` /
  `claude-haiku-4.5` / `gpt-5-nano`). Pro/opus/sonnet **forbidden** for
  site-update calls per ADR-150.
- Total LLM smoke spend across P123: **≤ $0.10** (10-prompt cap from ADR-150
  budget; P122 used 0 of the lifetime 10).

## 2. Scoring rubric

Same 4-dimensional rubric as P122 (`plans/hitl/phase-122/preflight.md` §2).
A surface scores the **minimum** of its weakest dimension across:

- Visual modernity
- Language clarity
- Button / component quality
- New-visitor confidence

Anchors: 40 = today's pre-P122 baseline · 60 = Wix-tier · 80 = pro-built
marketing page · 90+ = Stripe / Linear / Vercel parity.

| Surface | P122 sealed at | P123 target |
|---|---:|---:|
| `/contact` | 58 | **65** |
| Builder default (`/builder` whiteboard) | 55 | **65** |
| `/agentics` | 60 | **70** |
| (regression guard) Welcome / Capstone / Walkthrough / Blog | 60-62 | **≥ 60 hold** |
| (regression guard) AISP | 55 | **≥ 55 hold** (engineer-track per ADR-146 D3) |

## 3. DoD (every box must check to seal P123)

- [ ] Build passes: `npm run build` zero errors.
- [ ] `npm run check:invariants` green (12/12 ARCH fitness).
- [ ] `npm run check:adr-lint` green.
- [ ] **Contact** re-scored ≥ 65 across all 4 dimensions.
- [ ] **Builder default** re-scored ≥ 65.
- [ ] **Agentics** re-scored ≥ 70.
- [ ] Regression guards: Welcome / Capstone / Walkthrough / Blog re-scored
      ≥ 60. AISP re-scored ≥ 55.
- [ ] **Live Gemini chat smoke**: 1 prompt → JSON-Patch → preview update
      visibly applied. Cost recorded in `llm_logs`. CostPill ticks visibly.
- [ ] **Live Gemini listen smoke**: 1 voice prompt OR 1 simulated transcript
      → JSON-Patch → preview update.
- [ ] **LLMLogPanel verification**: both smoke prompts appear in the
      Agentics LLMLogPanel with redaction holding (no `sk-` / `AIza` /
      `Bearer` / `key=` shapes in payload).
- [ ] **Total LLM smoke spend** ≤ $0.10 (≤ 10 prompts).
- [ ] **4-reviewer MoE** (UX / Functionality / Security / Architecture) —
      all-green before seal. Reviewer artifacts at
      `plans/hitl/phase-123/reviews/{ux,fn,sec,arch}.md`.
- [ ] EOP triplet: `preflight.md` (this) + `session-log.md` +
      `retrospective.md`.
- [ ] CLAUDE.md §12 pointer updated post-seal.

## 4. Wave plan

| Wave | Agents | Disjoint scope | Output |
|---|---|---|---|
| **W1** | A1 audit | read-only; visit Contact + Builder + Agentics; identify named blockers | `docs/audit/p123-below-floor-audit.md` |
| **W2** | A2 Builder fix | `src/components/left-panel/`, `src/components/center-canvas/`, `src/components/right-panel/` | Builder default 55 → 65 |
| **W3** | A3 Agentics fix | `src/pages/Agentics.tsx`, `src/components/agentics/{LLMLogPanel,DBPanel,SpecWorkbench}.tsx`, empty-state copy | Agentics 60 → 70 |
| **W4** | A4 Contact fix | `src/pages/Contact.tsx` | Contact 58 → 65 |
| **W5** | A5 LLM smoke | `.env.local` BYOK key check, run 1 chat + 1 listen prompt, capture `llm_logs` row, screenshot CostPill | live LLM proof + cost record |
| **W6** | A6/A7/A8/A9 MoE 4-reviewer | parallel disjoint; UX, FN, SEC, ARCH each writes their own review | 4 review docs |
| **W7** | Closer | retrospective + EOP triplet completion + CLAUDE.md pointer + commit | seal |

W2 + W3 + W4 fan out in parallel disjoint scope (no shared files —
verified above). W5 runs after W4 to leverage any Agentics polish. W6
runs after W5 returns. W2/W3/W4 must NOT touch `Welcome.tsx`,
`Onboarding.tsx`, `Walkthrough.tsx`, `package.json` (P122 cross-wave
collision lesson per retrospective §6).

## 5. Risks + known unknowns

| Risk | Mitigation |
|---|---|
| Gemini smoke depends on `.env.local` key | If missing, smoke is owner-action; P123 still seals on the other DoD boxes with explicit "owner-required" carry-forward. |
| Live LLM spend overshoots $0.10 cap | CostPill must visibly tick before W5 fires the second prompt; if first prompt > $0.05, halt + reassess. |
| Below-floor lift requires more LOC than scoped | Bound each fix-pass at ≤ 200 LOC; if a surface needs more, split into a P124 mini-phase rather than blowing P123 budget. |
| MoE reviewer inflation (similar to old persona-pass score-padding) | Reviewers score the lowest dimension and must name 1 specific gap each — no all-green-with-no-feedback verdicts allowed. |

## 6. Carry-forwards inherited from P122

| ID | Item | Disposition in P123 |
|---|---|---|
| CF-P122-W8-1 | Walkthrough bottom CTAs → shadcn `<Button>` | W4 if scope allows; else defer to P124 |
| CF-P122-W8-2 | AISP page CTAs (5) → shadcn `<Button>` (engineer-track) | Defer (engineer-track exception) |
| CF-P122-W8-3 | TopBar icon-buttons → shadcn `<Button variant="ghost">` | W2 (lives in Builder shell) |
| CF-P122-W8-4 | OpenCore secondary CTAs (image-break / repos / final) | Defer (already at 60) |
| CF-P122-W8-5 | Onboarding template-picker raw `<button>` × 14 | Defer (separate sweep) |
| CF-P122-W8-6 | 2 swaps remaining in component-freshness budget | Use in W2 + W3 |
| CF-P122-W9-1 | Walkthrough spec ESM `__dirname` bug | W7 closer (1-line fix: `fileURLToPath(import.meta.url)`) |
| CF-P122-W11-1 | W11 persona audit document | Use as W1 input; complete or close-as-superseded |
| CF-P122-S1 | Contact 58 → 65 | **W4 owns** |
| CF-P122-S2 | Builder default 55 → 65 | **W2 owns** |
| CF-P122-S3 | Agentics 60 → 70 | **W3 owns** |
| CF-P122-LLM | Live Gemini chat smoke | **W5 owns** |
| CF-P122-LLM2 | Live Gemini listen smoke | **W5 owns** |

## 7. Success exit

When DoD §3 is all-true:
- 3 below-floor surfaces hit target.
- Live Gemini chat + listen smokes run with redacted logs.
- 4-reviewer MoE all-green.
- File `phase-123/retrospective.md` capturing the next 65 → 75 lift gaps.
- Update `CLAUDE.md` §12 pointer.
- Tag candidate: `v2.0.2` (patch — no new ADR-class architectural change
  expected; ADR-150 already covers the LLM contract).

If a surface scores 60 ≤ N < 65 at seal attempt, do NOT seal. File
`phase-123-fix-pass-1`, scope a tight ≤100 LOC fix, re-score. Maximum 2
fix-passes before escalating to owner re-scope.
