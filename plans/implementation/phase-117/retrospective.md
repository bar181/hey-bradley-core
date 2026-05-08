# P117 — Retrospective

> **Phase:** P117 / SECTION-CAPABILITY-AUDIT-FIX · **Sealed:** 2026-05-06

## Section capability outcomes

The owner's prompt — *"confirm Hey Bradley sections, score each section vs SOTA, identify and close gaps in parallel"* — surfaced a render-completeness bug that had been latent for ~40 phases since ADR-100 (P75 / OC-7) widened the schema enum from 16 to 18 without wiring the render path. 20 of 64 demos (`case-study` and `contact-form` types) silently rendered blank. The audit → fix loop found and closed it in one sprint.

### Numbers — before / after

| Metric | Pre-P117 | Post-P117 | Δ |
|---|---|---|---|
| Render-correct section types | 16/18 | 18/18 | +2 |
| Editor-wired section types | 16/18 | 18/18 | +2 |
| SECTION_CUES coverage | 9/18 | 15/18 | +6 |
| menu variants | 2 | 4 | +2 |
| pricing variants | 3 | 5 | +2 |
| team variants | 3 | 5 | +2 |
| Total templates (menu/pricing/team) | 53 | 59 | +6 |
| Composite vs SOTA | 7.6 | ~7.9 | +0.3 |
| Demos with broken canvas render | 20 | 0 | -20 |

### What landed

- **F1** — Render path closed for `case-study` + `contact-form` (`RealityTab.tsx` + `SimpleTab.tsx` + `assumptions.ts` + `section.ts`; 29 LOC delta across 4 files).
- **F2** — 6 NEW vs-SOTA template variants created (596 LOC across `NavbarSticky` + `NavbarMegaMenu` + `PricingCalculator` + `PricingEnterprise` + `TeamHoverBio` + `TeamWithSocial`).
- **Closer (this run)** — F2 templates wired into `RealityTab.tsx` `renderSection()` switch (the load-bearing step F2 left undone) + ADR-145 + tests + EOP + ledger sync.

## Keep / Drop / Reframe

### Keep
- **Audit → Fix → Closer 3-wave shape** — the 3 parallel READ-ONLY audit agents in Wave 1 surfaced a P1 bug (case-study / contact-form render-blank) that 40 phases of CI gates missed. Read-only audits are cheap and high-yield.
- **Render-completeness invariant in ADR-145 D1** — codifies the lock-step requirement (schema enum + render switch + editor route) that ADR-100 declared but didn't enforce. P109 drift guard reconciles 5 *declaration* sources; P117 adds the *render-path* obligation.
- **Honest composite scoring** — 7.6 → 7.9 (+0.3), not 7.6 → 8.5 — the 6 new variants close *part* of the gap, not all of it.

### Drop
- **F2-leaves-wiring-to-closer pattern** — F2 created 6 variants but did NOT wire them into the render switch, leaving production code unable to reach them. Future template-variant sprints should require the variant *and* the case branch in the same agent's diff. (Codified as carry-forward into preflight checklists, not as ADR.)
- **Audit-without-test-coverage-gate** — P109 / ADR-137 promoted section-enum drift to CI; P117 surfaces that *render-path* drift went undetected for 40 phases. The architecture-invariants spec should be extended in P118 to verify every `sectionTypeSchema` enum value has a matching `case 'X'` in `RealityTab.tsx`.

### Reframe
- **"Section variant count" as a SOTA differentiator** — P117 audit shows Webflow leads on `pricing` largely because Stripe-style usage calculators ship out-of-box. ADR-145 D2 codifies the ≥3 variants per top-5 type floor, which closes the gap incrementally rather than waiting for a per-section deep-dive.
- **Cue-map completeness as a chat/listen-mode access guarantee** — pre-P117, "add metrics" or "add picture" silently fell through (no SECTION_CUES → no INTENT_ATOM resolution). ADR-145 D3 frames cue coverage as a first-class capability, not a polish detail.

## Carry-forwards

| ID | Item | Severity | Target | Rationale |
|---|---|---|---|---|
| CF-P117-1 | 3 weak site shapes — restaurant 6 / non-profit 6 / fiction 6 | P2 | P118 candidate | Composite floor — schema enum widening per ADR-100 needed (e.g. `menu-board`, `donate-cta`, `chapter-list`). |
| CF-P117-2 | Section-type swap matrix expansion (4 → ≥10) | P2 | P118 candidate | Per ADR-144 D4 carry-forward — hero/footer/pricing/team need per-type safe-default seed components. |
| CF-P117-3 | Inline edit fan-out beyond hero (1 → ≥5 sections) | P3 | P118 candidate | Per ADR-144 D3 — defer until shared `InlineEditable` contract stabilizes against hero usage. |
| CF-P117-4 | 3 below-7.0 sections (`contact-form` 6.0 / `case-study` 6.5 / `divider` 6.4) | P2 | P118 candidate | Render path correct now; variant + cue depth still light. |
| CF-P117-5 | Architecture invariant for render-path completeness | P2 | P118 | Extend `tests/architecture-invariants.spec.ts` to assert every schema enum value has a `case 'X'` in `RealityTab.tsx` (analogue to P109 drift guard). |
| CF-P117-6 | F2 closer-wiring discipline | P3 | preflight checklist | Future template-variant sprints must include render-switch wiring in same agent diff. |
| CF-P117-7 (carried) | Husky hook wire (sandbox-blocked) | P3 | owner-action | From ADR-138 D3 / ADR-139 D3 / ADR-140 D3. |
| CF-P117-8 (carried) | Full Σ_512 → ADR-C07 Wave 4 60-day upstream WASM crate | P3 | upstream | From ADR-140 D1 honest stopgap. |
| CF-P117-9 (carried) | LLM-enriched voice extraction | P3 | CF#4 BYOK owner-required | From ADR-141 D4. |

## Process notes

- Sprint shape: 3 audits (Wave 1) → 2 fixes (Wave 2) → 1 closer (Wave 3) over a single working day at velocity. P116 + P117 sealed back-to-back.
- Test coverage: 22 cases / 10 describes / 195 LOC test file — bigger than typical ≤200 LOC cap because variant-existence enumeration adds 6 cases for free.
- LOC discipline: ADR-145 55 LOC ≤120 cap (54% headroom); test 195 LOC ≤250 cap (22% headroom).
- Zero new dependencies; KISS preserved per P116 baseline.
- Both tsc strict configs CLEAN.
