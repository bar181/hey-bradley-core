# Phase 30 — Preflight 00 Summary

> **Phase title:** Sprint D Phase 2 — Template Persistence (User-generated templates → IndexedDB)
> **Status:** PREFLIGHT (activates post-P29 seal; Sprint D mid-arc)
> **Successor of:** P29 Sprint D P1 (91/100; Library API decoration shipped)
> **Successor:** P31 Sprint D P3 (Content Generators POC — CONTENT_ATOM)

## North Star

> **The library is decoration today; persistence makes it dynamic.** P30 ships the bridge that turns the registry-only library (P29) into a registry-union-with-DB library — users can author templates from chat conversations, persist them to IndexedDB, and have them appear in `listTemplates()` alongside the 3 baselines. Migration 003-templates.sql adds the `user_templates` table; `TEMPLATE_LIBRARY` is rebuilt from `[...TEMPLATE_REGISTRY, ...userTemplates]` at module load.

## Scope IN

- **`migrations/003-user-templates.sql`** — adds `user_templates(id TEXT PK, name, category, examples_json, kind, payload_json, created_at, updated_at)` + indexes on `(category)` and `(kind)`
- **`src/lib/repositories/userTemplatesRepo.ts`** — typed CRUD (`createUserTemplate`, `listUserTemplates`, `getUserTemplate`, `deleteUserTemplate`)
- **`src/contexts/intelligence/templates/library.ts`** — extend to merge `TEMPLATE_REGISTRY` + DB rows (lazy-init pattern; library still returns sync `readonly` array via top-level cache)
- **`createTemplateFromConversation(name, category, examples, payload)`** helper — produces a valid `TemplateMeta` row + persists via repo
- **`SENSITIVE_TABLE_OPS` registry update** — strip `user_templates` from `.heybradley` exports? (decision: NO — user templates are intentional user content, opt-in to export. Verify decision in ADR.)
- **+5 PURE-UNIT tests** (CRUD round-trip + library merge + duplicate-id handling + missing-payload handling + delete cascade)
- **ADR-059** — Template Persistence Contract

## Scope OUT (P31+)

- LLM-driven template authoring (Sprint E P34 candidate)
- Template versioning / migration of user-authored templates (post-MVP)
- Template sharing / export-as-link (post-MVP)
- UI surface for browse + create (P30 ships data-layer only; UI deferred to a later mini-phase or Sprint E)

## Effort estimate

- ~15m migration 003 + repo
- ~15m library merge + lazy-init refactor
- ~10m `createTemplateFromConversation` helper
- ~30m ADR-059 + 5 tests
- ~15m retro + seal + P31 preflight
- **Total: ~85m** at velocity (~1.5h)

## Files (planned)

| File | Type | Purpose |
|---|---|---|
| `src/db/migrations/003-user-templates.sql` | NEW | DDL for user_templates |
| `src/lib/repositories/userTemplatesRepo.ts` | NEW | Typed CRUD |
| `src/contexts/intelligence/templates/library.ts` | EDIT | Merge registry + DB; lazy-init cache |
| `src/contexts/intelligence/templates/createFromConversation.ts` | NEW | Helper to construct + persist user templates |
| `docs/adr/ADR-059-template-persistence.md` | NEW | full Accepted |
| `tests/p30-template-persistence.spec.ts` | NEW | 5+ PURE-UNIT cases |

## DoD

- [ ] Migration 003 runs cleanly on fresh DB + idempotent on re-init
- [ ] `userTemplatesRepo` CRUD round-trips correctly
- [ ] `TEMPLATE_LIBRARY` returns registry + user templates (sync API preserved)
- [ ] `createTemplateFromConversation` produces valid TemplateMeta + persists
- [ ] +5 PURE-UNIT tests GREEN
- [ ] ADR-059 full Accepted
- [ ] Build green; tsc clean; P15-P29 regression green
- [ ] Retro + STATE + Sprint D P31 preflight scaffold

## Composite target

- Grandma 76+ (held; data-layer only — no UX surface)
- Framer 89+ (held; templates surface unchanged from user POV until UI lands)
- Capstone 96+ (held; persistence is groundwork; convincing demo lands at P33 UI bridge)
- **Target: 91+ (held; intentional setup-phase pause #2 before P31 content POC)**

## Carryforward into P30 (from P29)

- C04 ListenTab full <500 LOC split
- C17 remaining 10 logic-layer casts
- C11 Vertical mobile carousel
- C12 AISP Blueprint sub-tab refresh
- AISPTranslationPanel ChatInput integration (planned for P33)
- Vercel deploy (owner-triggered)

## Cross-references

- ADR-040 (DB persistence; P16) — parent
- ADR-040b (P28; sql.js FK deferral) — referenced for FK-decision symmetry
- ADR-046 (P18b; SENSITIVE_TABLE_OPS strip rules) — referenced for export-strip decision
- ADR-050 (Template-First Chat; P23) — parent
- ADR-058 (Template Library API; P29) — direct predecessor
- ADR-059 (Template Persistence) — to be authored at P30

---

**Phase 30 activates immediately on P29 seal. Sprint D mid-arc data layer.**
