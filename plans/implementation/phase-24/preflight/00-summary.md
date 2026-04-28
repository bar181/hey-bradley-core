# Phase 24 — Preflight 00 Summary

> **Phase title:** Sprint B Phase 2 — Section Targeting via `/hero-1` keyword scoping
> **Status:** PREFLIGHT (activates post-P23 seal)
> **Successor of:** P23 (Sprint B P1 — Simple Chat templates) sealed at composite 88/100
> **Successor:** P25 (Sprint B P3 — Intent translation: messy → structured to-do)
> **Source:** `plans/implementation/phase-22/wave-1/A2-sprint-plan-review.md` §B + ADR-051 stub

## North Star

> **A user types `change /hero-1 to "Welcome"` (or "hide /footer") and only the targeted section is mutated — even when multiple of the same type exist.**

## Scope IN

- **`/<type>-<index>` keyword scoping** in user input. Examples:
  - `/hero-1` — first hero section
  - `/blog-2` — second blog section (in multi-section configs like kitchen-sink)
  - `/footer` — single footer (no index needed when only one)
- **Parser** that extracts `/scope-tokens` from chat input BEFORE template/LLM dispatch
- **Template engine extension**: when scope is provided, override the default `findSectionByType` resolution with the scope-targeted index
- **Backward compatible**: chat without scope tokens behaves exactly as P23 (template router resolves first-enabled section by type)
- **ADR-051** — Section Targeting Syntax (full author; replaces stub)
- **+5 Playwright cases** — scope hits + scope misses + ambiguous-scope + scope-with-no-template + scope-on-LLM-fallthrough

## Scope OUT

- Multi-intent in same prompt ("change /hero-1 AND hide /footer") — Sprint B P25 or post-MVP
- Component-level scoping (`/hero-1/heading`) — defer to Sprint C
- AISP-driven intent (Sprint C P26)
- LLM scoping awareness (LLM gets full config; scoping happens client-side; LLM patches still routed through validator)

## Effort estimate

- ~30m parser
- ~30m template engine extension
- ~30m ADR-051 + 5 tests
- ~30m wire into chatPipeline + retro + seal
- **Total: ~2h** (vs original 4-6 day estimate; ~12-24× faster at velocity)

## Files (planned)

| File | Type | Purpose |
|---|---|---|
| `src/contexts/intelligence/templates/scoping.ts` | NEW | `parseSectionScope(text)` → `{ scope: { type, index } | null, cleanText: string }` |
| `src/contexts/intelligence/templates/router.ts` | EDIT | accept optional `scope` in match context; pass to template envelope |
| `src/contexts/intelligence/templates/registry.ts` | EDIT | hide-section + change-headline templates honor scope override |
| `src/contexts/intelligence/templates/types.ts` | EDIT | add `scope?: SectionScope` to `TemplateMatchContext` |
| `src/contexts/intelligence/chatPipeline.ts` | EDIT | call `parseSectionScope` before `tryMatchTemplate`; pass scope through |
| `docs/adr/ADR-051-section-targeting.md` | EDIT | stub → full Accepted |
| `tests/p24-section-targeting.spec.ts` | NEW | 5 cases |

## DoD

- [ ] `parseSectionScope(text)` extracts `/type-N` tokens (case-insensitive); returns scope + cleaned text
- [ ] Template router passes scope into `TemplateMatchContext`
- [ ] `hide-section` template honors scope override (hides specific indexed section, not first-by-type)
- [ ] `change-headline` template honors scope override
- [ ] Backward compat: P23 tests still pass (no scope = original behavior)
- [ ] +5 Playwright cases green
- [ ] ADR-051 full Accepted
- [ ] Build green; tsc clean
- [ ] Retro + STATE update + P25 preflight scaffold

## Composite target

- Grandma 76+ (held; no UX surface change)
- Framer 86+ (held; power-user feature)
- Capstone 92+ (held / +1 if scoping syntax demos cleanly)
- **Target: 88/100**

## Carryforward into P24

From P23:
- Test flakiness — add `tests/p24-templates-router-unit.spec.ts` for unit-style verification
- C04 ListenTab split (defer further)
- C17 Zod helper (defer further)
- C15/C16 (defer further)

## Cross-references

- P23 retrospective: `phase-23/retrospective.md`
- ADR-050 (Template-First Chat Architecture; sealed P23)
- ADR-051 (Section Targeting Syntax — stub from P21; full author at P24)
- A2 sprint plan review: `phase-22/wave-1/A2-sprint-plan-review.md` §B
- Phase-21 MEMORY.md: cross-session anchor

---

**Phase 24 activates immediately on owner greenlight.** ADR-051 stub already in place.
