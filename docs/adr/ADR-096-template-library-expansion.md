# ADR-096 — Template Library Expansion Standard

- **Status:** Accepted
- **Date:** 2026-05-01
- **Phase:** P68 / OC-4 (Templates Round 2)
- **Cross-refs:** ADR-079 (Premium Templates), ADR-091 (Canonical Component Quality), ADR-087 (Design Token System), ADR-095 (Library-Wide Polish Standard)

## Context

P64 / OC-3 added 3 templates (coffee-roaster, dev-conference, podcast-show)
on top of the 23-template baseline, landing the library at **26**. P68 / OC-4
adds **11 more** across three vertical clusters (4 healthcare/wellness,
4 creator/personal-brand, 3 dev-tools/OSS), landing the registry at **37**.
The stated user target was "40+"; the honest reframe at preflight was 37
with a documented 3-template gap-filler carry-forward (`OC-4 round 3` or
deferred). ADR-096 codifies the cadence + quality bar so future rounds are
mechanical to plan and easy to spec-gate.

Where ADR-079 set the *aesthetic* bar for premium templates, ADR-096 sets
the *expansion contract*: what shape new templates take, how the registry
absorbs them, and what filter UI surfaces them.

## Decision — 5 enforceable standards

1. **JSON-only.** Each new template MUST be a `.json` MasterConfig under
   `src/data/examples/`. Hand-curated `.ts` template format is reserved
   for flagship-tier templates that need TypeScript-level composition
   (e.g. `hey-bradley-flagship`, `b2b-agency`); routine vertical templates
   never qualify.
2. **Hero discipline.** Hero `layout.padding` MUST be `"80px 24px"` (per
   OC-1 design discipline). Hero `style:` block MUST contain ONLY the
   `background` + `color` keys — no `fontFamily`, no `borderRadius`, no
   inline overrides that bypass the theme contract (per ADR-087).
3. **Established fonts only.** `theme.typography.fontFamily` and
   `headingFamily` MUST be one of: `Inter`, `Fraunces`, `JetBrains Mono`,
   `Playfair Display`. No `system-ui`, no novel families.
4. **Real copy.** No Lorem, no `dolor sit amet`, no generic "Lorem ipsum".
   Copy MUST be vertical-distinct (a clinic template's copy is unmistakably
   medical; a CLI-tool template's copy is unmistakably developer-facing).
5. **Distinct primary background.** Each new template's
   `theme.palette.bgPrimary` MUST differ from existing templates (heuristic:
   ≥`#10` hex distance OK; identical-string repeat is a failure).

## Bounded-context impact

Within the `configuration` bounded context (template registry —
`src/data/examples/index.ts`) and the `ui-shell` bounded context
(`TemplateBrowsePicker.tsx` filter UI extension). The registry edit is a
mechanical 11-import + 11-EXAMPLE_SITES-entry append; the picker edit
adds a fourth filter pill row (`Visual style`) alongside the existing
persona / industry / complexity rows from P67/A2.

## Out of scope

- Agentic-product templates (deferred to OC-15 — those have a different
  schema and live alongside agentic data-model work per ADR-089).
- Per-mode template variants for AW work (Whiteboard / Planning /
  Agentics) — separate UX surface, separate ADR if it ships.
- Tier-2 SaaS-dashboard flagship template — commercial track only.
- The 3-template gap to reach a literal 40+ count — explicitly documented
  carry-forward (`OC-4 round 3`).

## Acceptance gates (enforced by `tests/p68-oc4-templates-round2.spec.ts`)

- All 11 new template files exist on disk under `src/data/examples/`.
- Registry imports + EXAMPLE_SITES entries for all 11.
- Hero padding `"80px 24px"` for all 11.
- Hero `style:` block has ONLY `background` + `color` keys (no extras).
- No file references `system-ui`.
- Every `fontFamily` / `headingFamily` is one of the four allowed.
- Distinct `bgPrimary` across the 11 new templates (≥10 unique values).
- Dev-tools subset (cli-tool / oss-library / api-docs-landing) carries
  AISP / spec-driven / ambiguity terminology in at least one section's copy.
- `TemplateBrowsePicker.tsx` ships the visual-style filter
  (`data-testid="filter-visual-style-..."`).
- Library count ≥ 37 templates registered.

## Consequences

**Positive.** The registry reaches 37 with a homogeneous quality bar; the
filter UI scales gracefully (visual-style is the fourth axis on the same
pill-row pattern). Every future expansion round inherits ADR-096's 5
standards by reference — preflight planning is reduced to "list the
verticals" and the spec gate catches drift mechanically. Combined with
ADR-079 (aesthetic discipline) and ADR-091 (canonical component quality),
the open-core library now has three mutually-reinforcing quality contracts.

**Negative.** Ongoing curation cadence required — each round needs
vertical research (real copy is not free) and someone has to reject
templates that fail the 5 standards. The "no system-ui" rule is mildly
restrictive but already a project-wide invariant. The `bgPrimary`
distinctness rule has a soft heuristic (≥`#10` hex distance) that's easy
to game; the test enforces strict-string-distinct as a stricter floor.
