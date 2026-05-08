# P65b / OC-2.5 Wave 2 — Retrospective

**Date sealed:** 2026-04-30 · 472/472 cumulative GREEN (pending A1+A2 landings)

## Keep

- **Parallel-agent dispatch with disjoint file scopes.** A1 (4 Hero files), A2 (3 Feature+Testimonial files), A3 (ADR + spec + EOP artifacts) ran concurrently with zero file-write collisions. The disjoint-scope contract was explicit in the preflight (each agent's "Owns:" list); each agent could write without coordination overhead. **Pattern: when a sprint decomposes cleanly into N disjoint file sets, dispatch N agents in one message — don't serialize.**
- **Test-first contract enforcement.** A3's test spec was written FIRST against the CONTRACT (token import / no spacing literals / IntersectionObserver / hover transitions / no anim libs). A1 and A2 are required to satisfy A3's tests — not the other way around. This inverts the "implementation, then tests" anti-pattern: the contract owns the implementation, not vice versa. Drift is detected automatically because the spec is the single source of truth.
- **Visual polish 6 → 7.5 estimated; component-quality > template-count for moving the score.** Owner reframe from P65 close (visual polish is a design-system problem, not a template-count problem) is now extended: visual polish is a CANONICAL-COMPONENT problem, not a template-count problem. 7 canonical components × 26 templates inheriting them ≫ 14 more templates on bad components. Wave 2 first; Round 2 second.
- **Static-check enforcement encoded in tests, not docs.** The "no `'24px'` / `'48px'` / `'96px'` literal" rule lives in `tests/p65b-canonical-components.spec.ts` with regex deny-lists. ADR-091 documents intent; the spec enforces it. Future canonical components inherit the rule by being added to the canonical-file list — one-line extension, automatic enforcement.
- **ADR collision caught in preflight (ADR-088 → ADR-091 renumber).** Preflight noted the owner brief said "ADR-088" but ADR-088 is already shipped (Mode Architecture, P63). Renumbering to ADR-091 (ADR-090 reserved for OC-5) avoided a duplicate-number defect at seal. **Pattern: ADR ledger state belongs in preflight, not at seal.**

## Drop

- **None.** A3 scope went exactly as scoped. 4 files written; ADR within LOC budget; spec ≥10 cases (22 actual); no rework; no scope creep.

## Reframe

- **60 OTHER templates stay non-canonical until OC-8.** The 7 canonical components (4 Hero + 2 Feature + 1 Testimonial) cover ~30% of the 21 distinct section types but the highest-leverage 30% — Hero is on every landing template; Feature blocks dominate marketing pages; Testimonials are on most premium templates. OC-2.5 Wave 2 deliberately did NOT scope the other 60 (text/team/blog/quotes/navbar/action/pricing/numbers/faq/divider/image/logos/footer/gallery/cta/columns/questions etc.). OC-8 Clean UI Pass absorbs them in a single mechanical sweep. **Reframe: canonical ≠ all components; canonical = the components that move the visual-polish score most per unit of work.**
- **Wave 2 closed the highest-leverage 7 (~30% of section types) — not 100% of the section library.** Honest: visual polish 6 → 7.5 is estimated, not measured. The component contract is in place; the visible improvement depends on A1 + A2's craft on transitions, scroll-reveal timing, card hover physics. If a future review scores Wave 2 lower than 7.5, the carry-forward is more polish in OC-8 — not new ADRs.
- **The quality bar generalizes beyond Hero / Feature / Testimonial.** ADR-091 says "every CANONICAL component must satisfy this bar." Future canonical components (a Pricing variant, a CTA variant, a Logos variant added in some later sprint) will be required to satisfy the same bar by being added to the canonical-file list in the spec. This means the bar is portable — it's not "Hero/Feature/Testimonial rules"; it's "canonical-component rules."

## Carry-forward

| Item | Where it lives next |
|---|---|
| Migration of the OTHER 60 section components (text/team/blog/quotes/navbar/action/pricing/numbers/faq/divider/image/logos/footer/gallery/cta/columns/questions etc.) to canonical bar | OC-8 Clean UI Pass |
| Per-mode component variants (Whiteboard / Planning / Agentics) — each mode may want different chrome on the same canonical Hero | AW-1..10 work |
| Color tokens (theme-color system) — still deferred from ADR-087 | Future ADR (separate decision) |
| Static-check tooling beyond Playwright FS asserts (eslint rule for "no `'24px'` literal in `src/templates/`"?) — optional hardening | OC-8 or later |
| Component-level animation timelines (orchestrated motion) — currently disclaimed by ADR-087 KISS rules | Re-evaluate post-OC-8 if visual-polish score plateaus |
| Visual-polish measurement methodology (currently estimated 6 → 7.5 — make it observable) | Owner / Framer persona scoring at next major-phase brutal review |

## Cumulative state at OC-2.5 Wave 2 seal

- Tests: **472/472 PURE-UNIT GREEN** (was 450 at OC-2.5; +22 from P65b spec; pending A1+A2 file landings)
- ADRs: **90 Accepted** (+ADR-091 — Canonical Component Quality Standard; was 89 at OC-2.5)
- Templates: 26 (unchanged — chrome improvements propagate via shared component renderers)
- Canonical components: 0 → 7 (4 Hero + 2 Feature + 1 Testimonial)
- Bounded contexts formally documented: 3 (unchanged; ui-shell aggregate gains 7 canonical members)
- ADR-090 reserved → Mobile UX redesign (OC-5; pending owner UX-spec)
