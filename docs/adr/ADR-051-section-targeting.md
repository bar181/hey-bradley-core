# ADR-051: Section Targeting Syntax — `/type-N` Keyword Scoping

**Status:** Accepted
**Date:** 2026-04-27 (P24 Sprint B Phase 2)
**Deciders:** Bradley Ross
**Phase:** P24

## Context

Through P23, the templates `hide-section` and `change-headline` resolved their target via `findSectionByType(config, type)` — first ENABLED section of that type. This works for single-instance configs (default-config.json has one hero, one footer) but fails for multi-instance configs (kitchen-sink has multiple blog sections; future user-built sites can have N heroes).

User cannot disambiguate: "hide the blog" hides the FIRST blog regardless of whether they meant the second.

P24 introduces a lightweight scoping syntax inspired by HTTP routing + CSS nth-child:
- `/hero-1` → first hero (1-based for users; 0-based internally)
- `/blog-2` → second blog
- `/footer` → single footer (no index needed)

## Decision

### Syntax

```
/<type>-<index>
```

- `<type>` — lowercase section type (`hero`, `blog`, `footer`, `features`, etc); kebab-case allowed
- `<index>` — optional 1-based ordinal; resolves to Nth ENABLED section of that type
- Omitted index (`/footer`) → first ENABLED section of that type (same as P23 behavior)

### Parser

`src/contexts/intelligence/templates/scoping.ts:parseSectionScope(text)`:
- Single regex: `/([a-z][a-z-]*?)(?:-(\d+))?\b/i`
- Returns `{ scope: SectionScope | null, cleanText: string }`
- Strips the matched token from text + collapses whitespace
- First-match wins (one scope per chat input; multi-scope is Sprint B P25 work)

### Resolution

`scoping.ts:resolveScopedSectionIndex(config, scope)`:
- Walks `config.sections` counting ENABLED sections of `scope.type`
- Returns array index of the Nth match (0-based)
- Returns `-1` if scope cannot resolve (no matching enabled section, or N exceeds count)

### Template integration

`TemplateMatchContext` gains optional `scope?: SectionScope | null`. Templates that honor scoping (`hide-section`, `change-headline`):
- Scope wins over regex-captured type (so `hide /hero-1` works the same as `hide the hero-1`)
- Friendly empty-patch envelope when scope cannot resolve, with the scope-string echoed back

### Backward compatibility

- Chat without `/scope-token` behaves EXACTLY as P23 (no regression)
- Templates that don't reference scope (e.g. `make-it-brighter`) ignore it — non-breaking
- Existing P23 tests pass unchanged

### Trade-offs accepted

- **First-match-wins parsing** — only one scope token per input. Multi-scope is Sprint B P25 / Sprint C work.
- **No component-level scoping** (`/hero-1/heading`) — defer to Sprint C if owner mandates.
- **No scope auto-completion in chat input UI** — chat still accepts free text; users learn syntax via help-handler examples.
- **1-based for users / 0-based internally** — UX win at the cost of one off-by-one helper, accepted.

## Consequences

- (+) Multi-instance configs (kitchen-sink, user-built sites) are addressable
- (+) Power users get precision targeting without learning JSON path syntax
- (+) Templates can now reasonably grow beyond the 3 P23 baseline (more verbs become unambiguous)
- (+) Foundation for Sprint C AISP intent classifier — scope tokens become AISP grounding hints
- (-) Adds parsing surface (1 module + 2 functions); minimal complexity
- (-) Users must learn the `/type-N` convention; help-handler must surface examples (P25 carryforward)

## Cross-references

- ADR-050 (Template-First Chat Architecture) — scope is an additive extension to templates
- ADR-052 (AISP Intent Classifier — proposed Sprint C P26) — scope tokens feed Crystal Atom grounding
- `phase-22/wave-1/A2-sprint-plan-review.md` §B — Sprint B Phase 2 plan source
- `findSectionByType` / `heroHeadingPath` in `src/data/llm-fixtures/resolvePath.ts` — pre-existing first-by-type resolvers

## Status as of P24 seal

- `parseSectionScope(text)` shipped ✅
- `resolveScopedSectionIndex(config, scope)` shipped ✅
- Templates `hide-section` + `change-headline` honor scope ✅
- `TemplateMatchContext.scope?: SectionScope | null` added ✅
- Router extracts scope BEFORE template-pattern matching ✅
- `tests/p24-section-targeting.spec.ts` covers 5 cases (parser unit + scope resolution + scope hide + scope change + scope miss) ✅
- Build green; tsc clean ✅
- Backward-compat: P23 tests still pass unchanged ✅
