# ADR-093 — Component Decomposition Standard

- **Status:** Accepted
- **Date:** 2026-04-30
- **Phase:** P67 / Polish Wave 2
- **Cross-refs:** ADR-091 (Canonical Component Quality), ADR-092 (Polish Sprint Architecture), ADR-087 (Design Token System)

## Context

`src/components/shell/ChatInput.tsx` reached **1013 LOC** at the close of P66 /
Polish Wave 1 (A6 added +46 LOC for the inline personality popover). Brutal-
honest review at P66 close called out the file's orientation cost for future
agents: any polish or feature change inside ChatInput required reading >1000
lines of mixed responsibilities (input bar + quick actions + history panel +
personality popover + Geek-mode footer + Teacher-mode chips). P67 / Wave 2
A1 split the orchestrator into a thin shell + 3 sub-components. ADR-093
codifies the **decomposition contract** — file-size caps + 1-component-per-
file rule + decomposition trigger threshold — so future surfaces (post-P67
polish, AW-* agentic, OC-CLEANUP) cannot drift back to monolith form.

## Decision — the 3 standards

1. **File-size caps.**
   - **Canonical components** (per ADR-091; consume `tokens` contract): **≤200 LOC**
   - **Non-canonical components** (any other `.tsx` component file): **≤300 LOC**
   - **Orchestrators** (compose 3+ sub-components; no own JSX leaves beyond layout): **≤250 LOC**

2. **1 component per file.** Every `.tsx` file exports **exactly ONE** primary
   React component. Helper hooks (`useFoo`), TypeScript types/interfaces,
   constants, and small render-helpers (≤30 LOC, used only inside the primary
   component) are permitted in the same file. Multiple primary components in
   one file is a violation.

3. **Decomposition trigger.** Any component file **>700 LOC** MUST decompose
   in the **next** polish sprint after detection. Files between 300–700 LOC
   are flagged in audit but not blocking. The trigger is mechanical: the
   audit is a `wc -l` check against the file list during the next polish
   sprint's A0 read-only audit phase.

## Quality bar (enforced by `tests/p67-polish-wave2.spec.ts`)

- `src/components/shell/ChatInput.tsx` ≤ **250 LOC** (orchestrator cap)
- 3 sub-components exist:
  - `src/components/shell/ChatInputBar.tsx`
  - `src/components/shell/ChatInputQuickActions.tsx`
  - `src/components/shell/ChatInputPersonalityPopover.tsx`
- Geek-mode + Teacher-mode literals (`INTENT_ATOM`, `Try:`) preserved in the
  orchestrator (or routed through it) so behavior is unchanged
- Future PRs that grow `ChatInput.tsx` past 250 LOC fail this spec — drift
  is detected at CI time, not at hand-review

## Out of scope

- Test files — tests are often longer than 300 LOC due to many cases and the
  file-size discipline does not apply
- Generated files (e.g., theme JSON, registry index files)
- ADR / spec / planning Markdown — not code
- Data registries (e.g., `src/data/examples/index.ts`) — these are data, not
  components, even when they live under `src/`
- Per-mode component variants (Whiteboard / Planning / Agentics — AW work)
- Color or token contract — separate ADR-087

## Bounded-context impact

Lives within the `ui-shell` bounded context (formalized in
`docs/ddd/ui-shell-bounded-context.md` per ADR-087). The decomposition
standard is a **quality-bar aggregate** layered alongside ADR-091 (canonical
component quality) and ADR-092 (polish sprint architecture). Future
canonical components added in any sprint MUST satisfy ADR-091 + ADR-093
together: token-driven AND decomposed.

## Consequences

**Positive.** Agent orientation cost drops sharply: a 250-LOC orchestrator
+ three ≤300-LOC sub-components is faster to read than a 1013-LOC monolith,
and the seam between sub-components surfaces the actual responsibilities.
Future polish sprints inherit the caps automatically — drift is detected by
spec, not by hand-review. Net-new agentic surfaces (Whiteboard, Planning,
Agentics) start at the bar, not below it.

**Negative.** More files in `src/components/shell/`. Cross-component prop
drilling for shared state (e.g., personality picker open/close) is now
visible at the orchestrator boundary instead of hidden inside the monolith.
Test-mock surface area grows slightly (3 sub-components × shallow mocks).

**Mitigations.** Prop types co-located near the orchestrator (or in a
sibling `ChatInput.types.ts` if they grow); shared state lifts to the
orchestrator and flows down via explicit props (no hidden context); the
700-LOC trigger is intentionally generous so genuine large components (e.g.
Builder canvas) get a grace window before forced decomposition.
