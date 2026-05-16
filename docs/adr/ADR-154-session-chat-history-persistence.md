# ADR-154: Session Chat History Persistence Standard

**Status:** Accepted
**Date:** 2026-05-16
**Phase:** P126 / GO-LIVE — FEATURE 3
**Cross-refs:** ADR-043 (BYOK Trust Boundary) · ADR-047 (LLM Observability) · ADR-114 (Provenance Standard — redact at write) · ADR-126 (Comprehensive Logging Architecture) · ADR-149 (Audience Routing Standard) · ADR-150 (LLM Update Contract) · ADR-155 (LLM Confidence Detection + Best-Guess Fallback)

## Context

Through P125 the chat pipeline (`src/contexts/intelligence/chatPipeline.ts`) wrote rich forensic events to the sql.js `log_events` / `llm_logs` / `edit_history` tables via `comprehensiveLogs.ts`. Those tables are surfaced in Agentics through `LLMLogPanel` and `DBPanel` — engineers love them. But three needs surfaced from the P125 demo + the GO-LIVE owner brief at `plans/hitl/phase-126-go-live/human-2.md`:

1. **A user-facing, plain-English feed of what just happened.** Non-engineers can't read the `event_type='intent_classification'` payload structure; they want a chronological "you said X → I called the model → I applied 3 patches → here's where I was uncertain" surface. The Agentics audience for this is the operator demoing the product, not the engineer pulling forensics.
2. **Survivable across page reload.** The sql.js DB is rebuilt from migrations on every cold boot; the in-memory chat thread state vanishes on refresh. Owner wants the last session's worth of events to persist long enough to screenshot, export, hand off to a coding agent, or audit later.
3. **A single button to give the spec bundle (CLAUDE.md + ADRs + AISP atoms) consumer a readable trail.** AISP analysis ingests the chat-history feed as a separate dimension from the structural log_events; the export shape needs to be flat JSON, not joined SQL rows.

The persistence target choice is constrained:
- **sql.js / IndexedDB / Origin Private FS** all carry an async API + a schema-migration cost. The chat-history surface needs sync reads on first paint to avoid an empty-flash before the panel hydrates.
- **In-memory only** loses everything on reload — fails need 2.
- **Server / cloud sync** breaks the open-core BYOK-only rule (no shared cloud projects per CLAUDE.md §1; tier-2 deferral).

## Decisions

### D1 — Persist chat-history events to `localStorage` under `'hey-bradley-session-log'`

Chat-mode + listen-mode events (`user_prompt`, `llm_call_sent`, `llm_response_received`, `patch_applied`, `pipeline_error`, `confidence_low`) write to `window.localStorage` under the single key `'hey-bradley-session-log'`. The value is a JSON-stringified array of `SessionLogEntry` objects (`{ id, timestamp, eventType, summary, payload?, mode? }`). Sync API + per-origin + per-browser + survives reload + zero schema-migration cost. The 5–10 MB localStorage quota at ~1 KB/entry × 500 = 500 KB max is well within budget. Trade-off accepted: writes are blocking JS-thread work, but `JSON.stringify(arrayOf500)` benches at <2ms on the P125 reference profile so this is irrelevant compared to the LLM round-trip itself.

### D2 — FIFO eviction at 500 entries (oldest first)

`MAX_ENTRIES = 500` is the hard cap. When `appendSessionLog` would push the array over 500, the oldest entries are dropped via `slice(length - 500)`. Rationale: at typical 6 events per submit (prompt + call + response + patch + maybe confidence_low + maybe error), 500 entries ≈ 80 submits ≈ a full demo session. The owner has not asked for unbounded history; bounded + dropping-oldest matches owner expectation ("see the last session" not "audit forever") and keeps the quota math honest. Carry-forward: when the user publishes a session for AISP analysis, the export-time JSON is the artifact — the localStorage rolling window is not.

### D3 — All payloads pass through `redactKeyShapes` BEFORE write (ADR-043 + ADR-114 D3)

Every string entering the session log — `summary`, every string value in `payload` — runs through a shallow `redactPayload` pass that mirrors `redactKeyShapes` from `src/contexts/persistence/repositories/comprehensiveLogs.ts`. The two key shapes guarded:
- `/AIza[0-9A-Za-z_-]{35}/` — Google Gemini API key shape
- `/sk-[a-zA-Z0-9]{20,}/` — OpenAI / Anthropic API key shape

Match → replace with literal `'[REDACTED]'`. The session log never holds a usable BYOK key — defence-in-depth with the boundary redaction in `BYOKPanel.tsx` (P122) and the persistence-layer redaction in `comprehensiveLogs.ts` (ADR-043 D2). No payload is persisted unredacted, period.

### D4 — Cross-tab + in-tab sync via `storage` + custom `hey-bradley:session-log-changed` event

Two events drive the React re-render in `useSessionLog`:
- Native `'storage'` event (browser-fired in OTHER same-origin tabs when localStorage changes) — keeps multiple Agentics tabs in the same window in sync.
- Custom `'hey-bradley:session-log-changed'` event dispatched on `window` after every write — keeps the writer's own tab in sync (the native `'storage'` event does NOT fire in the tab that issued the write).

`useSessionLog` listens to both, calls `readSessionLog()` on either, and bumps React state. The hook is fire-and-forget at the listener layer; any throw from JSON.parse or storage access is swallowed and DEV-warned. Logging code must NEVER break the runtime that calls it (ADR-126 D4 fire-and-forget extends to this surface).

### D5 — Writer-side hooks are `safeLog` fire-and-forget

The 6 writer call-sites in `chatPipeline.ts` (one `user_prompt` at submit entry, one `llm_call_sent` + one `llm_response_received` in `runLLMPipeline`, three `patch_applied` at each apply branch (decomp / template / legacy-template / LLM / synth), one `confidence_low` on the low-confidence path, two `pipeline_error` on the catch + the non-throw error-kind path) all go through `safeLog(...)`, which wraps `appendSessionLog` in a try/catch and DEV-warns on throw. The pipeline never awaits a session-log write; logging latency is invisible to the user; a misbehaving localStorage (quota exceeded, JSON.parse corruption) cannot break a chat submit.

## Consequences

- One new file: `src/contexts/intelligence/sessionLog/index.ts` (~213 LOC) — module + React hook.
- One new component: `src/components/agentics/ChatHistoryPanel.tsx` (~247 LOC) — reverse-chronological feed with type-colored badges, relative timestamps, expandable payload JSON, Export JSON button (downloads `hey-bradley-session-log-${YYYYMMDD-HHMM}.json`), Clear button (with confirm).
- One new tab in `src/pages/Agentics.tsx`: `Chat History` (4th in the obs-tab strip; was `spec | log | db`, now `spec | log | db | history`). Deep-link supported via `?tab=history` URL search param.
- Six writer hooks added to `src/contexts/intelligence/chatPipeline.ts`: each guarded by `safeLog` so logging never throws into chat runtime.
- Zero new dependencies; zero hex literals in `src/components/` (the badges use CSS variables `var(--hb-accent-light)`, `var(--hb-blue-dim)` and `rgba(...)` / `rgb(...)` shorthands — none match the 6-char `#[0-9a-fA-F]{6}` regex that ARCH.2 counts).
- BYOK trust boundary preserved per ADR-043 + ADR-114 D3: the session log never holds an unredacted key shape.

### Anti-patterns (explicitly forbidden)

- **Do NOT sync chat history to a server.** The owner's open-core promise stays open-core; per-origin-per-browser is the boundary.
- **Do NOT email / share / copy the log out to a third party.** Export JSON is local-only; the user chooses what to do with the file.
- **Do NOT include the session log in the AISP / CLAUDE.md export bundle.** The spec-export contract is a structural snapshot, not a turn-by-turn diary; the two have different consumers (downstream agent vs. retrospective auditor). See CF below.

## Carry-forwards

- **CF-P126-F3-1:** When the user explicitly "publishes" a session for AISP analysis, the chat-history JSON exports as a separate sidecar file (`session-log.json`) alongside the structural `claude-md.md` + `aisp-spec.json` artifacts. Implementation deferred until the AISP analysis pipeline lands — this is the boundary where chat history transitions from "user diary" to "audit artifact" and the redaction pass should run again at sidecar-export time as belt-and-suspenders.
- **CF-P126-F3-2:** Storage-quota-exceeded handling currently relies on FIFO eviction at 500 entries; if a deployed user hits the 5 MB origin quota for other reasons (other features writing to localStorage), the `setItem` call will throw and `safeLog` swallows it. A future surface could expose `quotaExceeded` as a StatusBar dot — deferred until anyone reports it.
- **CF-P126-F3-3:** The redaction pass is shallow (top-level string values in `payload`). Nested structures (e.g. `payload.nested.apiKey`) are NOT walked. Today no writer passes nested structures so the shallow pass is correct; if writers add nested payloads, the redactor should be made recursive in lockstep.
- **CF-P126-F3-4:** Multi-window session-log conflict resolution is best-effort. If two tabs write concurrently, the last write wins (browser JS is single-threaded within a tab but localStorage writes between tabs are serialized by the storage subsystem; no atomicity guarantee on read-modify-write). Acceptable today (demo / single-operator). If multi-window collaborative editing lands, the write must be moved into a worker or a CRDT.
