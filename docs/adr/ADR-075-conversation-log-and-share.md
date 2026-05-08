# ADR-075: Conversation Log Viewer + Share Spec

**Status:** Accepted
**Date:** 2026-04-29
**Deciders:** Bradley Ross
**Phase:** P52

## Context

Sprint J wow-factor mandate. P50 (a12fd57) shipped the personality engine
+ composition wiring; P51 (6d3f27e) made it visible via picker + onboarding
+ 5 bubble styles. P52 closes Wave 3 with two surfaces aimed at distinct
audiences: a Conversation Log viewer (power users, EXPERT-only) that joins
`chat_messages` + `llm_logs` into a single auditable timeline; and a
Share Spec button (the viral mechanic) that bundles the user's full spec
(North Star + SADD + AISP + MasterConfig) into a clipboard data URL.

Per locked decision D5 in `plans/implementation/sprint-j-personality/
03-sprint-j-locked.md`, share-spec is **clipboard data URL only** in this
sprint. A hosted short link is captured in `plans/strategic-reviews/
2026-04-29-product-evaluation.md` as recommendation #2 and deferred.

## Decision

### Conversation Log (EXPERT-mode tab)

`src/components/center-canvas/ConversationLogTab.tsx` mounts as a 6th
EXPERT tab next to Pipeline. Reads `loadConversationLog(filter)` from
`src/contexts/specification/conversationLogExport.ts`, which joins
`chat_messages` ⨝ `llm_logs` by `(session_id, created_at)`. Filters:
session id, provider, personality, date-range (kv-driven). Two export
buttons (`log-export-md`, `log-export-json`) auto-download a Blob via
`URL.createObjectURL`.

Privacy boundary: **every value passes through `redactKeyShapes` before
render AND before serialization at export.** Defence-in-depth per ADR-067
(`brand_context_*` precedent) and the P46 fix-pass (R2 L1 redactor at
persist + injection boundaries). Prompt hashes are short-displayed (8 chars).

This surface previews the Tier-2 commercial migration story: the joined
query is the same shape that hosted Supabase will serve.

### Share Spec (clipboard data URL)

`src/components/shell/ShareSpecButton.tsx` + `src/contexts/specification/
shareSpecBundle.ts` compose a JSON object `{ generatedAt, version, northStar,
sadd, aisp, masterConfig }`, run it through `redactKeyShapes`, and encode as
`data:application/json;base64,…`. One click → `navigator.clipboard.writeText`
+ ephemeral toast. Defensive: clipboard API failure falls through to a
console.log of the URL.

The spec composer is fail-closed at the field level — if any sub-exporter
throws, that field becomes `null` and a DEV `console.warn` fires; the
bundle never throws. Mounted desktop-only (`hidden md:inline-flex`); the
mobile mount is owned by P53 hamburger.

## Trade-offs

- **Clipboard data URL won't survive most messengers.** Acknowledged
  trade-off for $0 cost and zero-server discipline this sprint. Hosted
  short link deferred per strategic-reviews capture.
- **Joining tables in the app layer** (not in SQL) keeps the existing
  repos read-only and avoids a new migration.
- **Filter UI is text-input only** (KISS) — date pickers and provider
  drop-downs deferred. Power-user surface; raw input is acceptable.
- **`redactKeyShapes` runs at every boundary** (render + MD export +
  JSON export + bundle compose) rather than once at the source — costs a
  pass per render, but defence-in-depth is cheap on a power-user surface
  with low render frequency.

## Consequences

- (+) Power users get a single auditable timeline of every turn.
- (+) Share Spec exists as a viral mechanic for the capstone demo.
- (+) Σ-discipline preserved across ADR-045/053/057/060/064/067/068/073/074/075.
- (+) Clean migration path for Tier-2 hosted spec links (just swap the
  data URL for a server-issued short link).
- (-) Data URL share is brittle in messaging apps; full payload is
  visible to anyone with clipboard access.
- (-) ConversationLogTab's filter UI is rough — power users only.

## Cross-references

- **ADR-040** — kv + sql.js (chat_messages + llm_logs underlying storage)
- **ADR-045** — PATCH_ATOM Σ (bundle composes only persisted state; no Σ widening)
- **ADR-067** — brand_context export-strip (redaction-at-boundary precedent)
- **ADR-068** — codebase context (same redaction discipline)
- **ADR-073** — P50 personality composition (drives the personality column in the log)
- **ADR-074** — P51 picker + onboarding (drives the active-personality chip)

## Status as of P52 seal

- ADR-075 full Accepted ✅
- ConversationLogTab + tab registration + CenterCanvas wiring shipped
- conversationLogExport (MD + JSON) shipped
- ShareSpecButton + shareSpecBundle shipped
- ChatInput desktop mount shipped (mobile mount → P53 hamburger)
