# ADRs to Create During MVP

> Each entry here is a stub-with-rationale. Author the full ADR in `docs/adr/` using this template content as the spine. Numbers continue from the existing series (current high water: ADR-037).

ADR template:

```markdown
# ADR-{NN}: {Title}

**Status:** Accepted | Proposed | Superseded
**Date:** YYYY-MM-DD
**Deciders:** Bradley Ross + claude-flow swarm
**Phase:** {phase number}

## Context
…

## Decision
…

## Alternatives considered
…

## Consequences
…

## Related ADRs
…
```

---

## ADR-038 — Kitchen Sink Reference Example

**Status:** Accepted
**Phase:** 15

### Context
We need a single example that exercises every shipped section type and variant — both as a regression target during phases 15–20 and as an onboarding option for curious novices.

### Decision
Add `src/data/examples/kitchen-sink.json` containing one instance of every section type and the canonical variant for each. Surface as a starter card on the Onboarding page.

### Alternatives considered
- A docs-only "all sections" catalogue page → rejected; doesn't exercise the live renderer.
- One Kitchen Sink per theme → rejected; redundant; one example covers the rendering surface.

### Consequences
- Single JSON to maintain; updated whenever a section variant lands.
- Onboarding card count rises from 3 to 4 default starters.

### Related ADRs
- ADR-022 (Section Type Registry)
- ADR-024 (Layout Variants)

---

## ADR-039 — Standard Blog Page

**Status:** Accepted
**Phase:** 15

### Context
The user requested a "standard blog page" example. Multi-page authoring is post-MVP, but a single-page blog landing is reachable today via the existing `blog` section type.

### Decision
Add `src/data/examples/blog-standard.json`: nav + `blog` section with three inline posts + footer.

### Alternatives considered
- Multi-page editor in MVP → rejected; large scope; out of MVP charter.
- Reuse Kitchen Sink → rejected; novice expects a recognizable site type.

### Consequences
- One additional starter card; no schema changes.
- Sets up future multi-page work without committing to it.

### Related ADRs
- ADR-022 (Section Type Registry)
- ADR-031 (JSON Data Architecture)

---

## ADR-040 — Local SQLite Persistence (sql.js + IndexedDB)

**Status:** Accepted
**Phase:** 16

### Context
`localStorage` is fragile (5–10 MB cap, sync API, no relations). The MVP charter forbids a backend. We need a local relational store for projects, chat, transcripts, and audit log.

### Decision
Adopt `sql.js` (SQLite-WASM) backed by IndexedDB. Lazy-load wasm on first persistence call. The DB lives at one IndexedDB key (`hb-db`) and is exported/imported via `.heybradley` zip.

### Alternatives considered
- `Dexie` over IndexedDB only → rejected; no SQL, no joins.
- `wa-sqlite` → rejected; larger surface, slower init.
- `localStorage` → rejected; size + relational gaps.
- Server DB → rejected; out of MVP scope.

### Consequences
- ~700 KB wasm chunk, lazy-loaded.
- Single source of truth for relational state.
- Easy export and inspection (sqlite tooling).

### Related ADRs
- ADR-001 (JSON Single Source)
- ADR-031 (JSON Data Architecture)

---

## ADR-041 — Schema Versioning

**Status:** Accepted
**Phase:** 16

### Context
A local DB needs migrations to evolve safely.

### Decision
Forward-only numbered SQL files in `src/contexts/persistence/migrations/` (e.g. `000-init.sql`). The DB stores `schema_version`; on boot, the runner applies any pending migrations in order. No down migrations.

### Alternatives considered
- Up/down pairs → rejected; complexity not worth it for a single-tenant local DB.
- Generated migrations from a schema DSL → rejected; KISS.

### Consequences
- Linear, auditable migration history.
- Mistakes require a new "fix" migration; rollback is a write, not a destruction.

### Related ADRs
- ADR-040

---

## ADR-042 — LLM Provider Abstraction (browser-only, BYOK + env var)

**Status:** Accepted
**Phase:** 17

### Context
We must call an LLM from the browser, support multiple providers, and remain frontend-only.

### Decision
A single `LLMAdapter` interface with three implementations: Claude (Anthropic SDK with `dangerouslyAllowBrowser: true`), Gemini (`@google/genai`), Simulated (canned). Provider chosen at boot from env or BYOK.

### Alternatives considered
- LangChain.js → rejected; weight + churn.
- Vercel AI SDK → rejected; orientation toward Edge runtime + streaming complexity.
- Hand-rolled fetch → rejected; SDKs handle retries and shape adequately.

### Consequences
- Dependency on two SDKs (≈ 80 KB gz total after code-split).
- Browser-side calls expose user IP to the provider (acceptable per BYOK).
- Future tool-use upgrade fits behind the same interface.

### Related ADRs
- ADR-043
- ADR-044

---

## ADR-043 — API Key Storage & Trust Boundaries

**Status:** Accepted
**Phase:** 17

### Context
BYOK plus a dev env var raises questions about where keys live and what the deployed bundle contains.

### Decision
- Dev: `VITE_LLM_API_KEY` is read at dev-time only and **never** present in production builds. CI grep blocks builds with a non-empty key.
- Production: only BYOK. Keys live in the local `kv` table only when the user opts in via "Remember on this device". Otherwise key is in-memory only and lost on tab close.
- The deployed bundle ships **no** key.
- LLM calls hit the provider directly; user IP and key are exposed to that provider — that is the BYOK contract.

### Alternatives considered
- Server-side proxy → rejected for MVP; introduces backend.
- Encryption at rest of the BYOK key → deferred (post-MVP); browsers don't offer durable secret storage.

### Consequences
- Operationally simple; no secrets to rotate on our side.
- Users must understand they own their key. `SECURITY.md` makes this explicit.

### Related ADRs
- ADR-042

---

## ADR-044 — JSON Patch as the LLM Return Contract

**Status:** Accepted
**Phase:** 18

### Context
The LLM mutates the site config. Returning prose, HTML, or full JSON snapshots increases ambiguity, cost, and risk.

### Decision
The model must return only `{ "patches": JSONPatch[], summary?: string }` where each patch uses `op ∈ {add, replace, remove}`. Validated by Zod, applied atomically by `configStore.applyPatches`.

### Alternatives considered
- Full JSON snapshot → rejected; large + lossy on partial updates.
- LangChain runnable graph → rejected; out of scope.
- Model-emitted code → rejected; security and complexity.

### Consequences
- Simpler validator and renderer.
- A predictable failure surface: malformed JSON / invalid path / invalid value.
- Tool-use upgrade later does not change the envelope.

### Related ADRs
- ADR-001 (JSON Single Source)
- ADR-045

---

## ADR-045 — System Prompt = AISP Crystal Atom

**Status:** Accepted
**Phase:** 18

### Context
We want the LLM to behave deterministically against the JSON contract. AISP is designed for low-ambiguity AI-to-AI communication.

### Decision
The system prompt embeds an AISP Crystal Atom (`Ω, Σ, Γ, Λ, Ε`). The Crystal Atom describes the schema, allowed ops, valid section types, and a verification clause the model is asked to self-check before answering. The model output remains plain JSON (per ADR-044).

### Alternatives considered
- Plain English prompt only → rejected; higher ambiguity and worse compliance in early tests.
- AISP both in prompt and response → rejected; duplicate complexity; the JSON envelope is enough.

### Consequences
- Slightly larger system prompt (≈ 320 tokens).
- Compliance gains observed in early manual tests.
- Sets up a longer-term AISP-as-orchestration story without coupling MVP to it.

### Related ADRs
- ADR-026 (AISP Output)
- ADR-032 (Section-Level Crystal Atoms)
- ADR-044

---

## ADR-046 — Web Speech API for STT (push-to-talk MVP)

**Status:** Accepted
**Phase:** 19

### Context
Listen mode needs real STT. Whisper requires server or a heavy in-browser model. We are frontend-only.

### Decision
Use the browser-native `SpeechRecognition` API behind a thin `STTAdapter`. Push-to-talk button. No wake word, no continuous listening, no VAD.

### Alternatives considered
- Whisper-WASM → rejected; ~200 MB model, slow init.
- Server-side Whisper → rejected; backend.
- Continuous listen → deferred (post-MVP).

### Consequences
- Cross-browser inconsistency: Chrome/Edge/Safari supported; Firefox shows a banner.
- Adapter interface lets us swap to Whisper later with no UI change.

### Related ADRs
- ADR-042
- ADR-044

---

## ADR-047 — Cost Telemetry & Hard Cap

**Status:** Accepted
**Phase:** 20

### Context
A misbehaving prompt or stuck retry can spike cost. Users need a calm, visible bound.

### Decision
Track per-session USD spend in memory and audit log; show a footer pill (green/amber/red); refuse calls at cap. Default cap `$1.00`, range `0.10–20.00`, configurable in Settings.

### Alternatives considered
- Token-only cap → rejected; less intuitive than USD.
- Server-side rate limit → rejected; backend.
- No cap → rejected; runaway cost is the largest BYOK concern.

### Consequences
- Predictable UX at the failure mode that matters most.
- Audit log enables post-mortem on cost incidents.

### Related ADRs
- ADR-042
- ADR-044

---

## Authoring Checklist (per ADR)

- [ ] Frontmatter complete (Status, Date, Deciders, Phase)
- [ ] Context is one short paragraph (≤ 5 sentences)
- [ ] Decision states *what* and *where it lives in code*
- [ ] Alternatives considered are listed with one-line rejections
- [ ] Consequences include both upsides and trade-offs
- [ ] Related ADRs cross-link
- [ ] File saved to `docs/adr/ADR-{NN}-{slug}.md` per existing convention

---

## ADR Numbering Reservation

| # | Title | Phase | Owner |
|---|---|---|---|
| 038 | Kitchen Sink Example | 15 | coder + reviewer |
| 039 | Standard Blog Page | 15 | coder + reviewer |
| 040 | Local SQLite Persistence | 16 | architect |
| 041 | Schema Versioning | 16 | architect |
| 042 | LLM Provider Abstraction | 17 | architect + security-auditor |
| 043 | API Key Trust Boundaries | 17 | security-auditor |
| 044 | JSON Patch Contract | 18 | architect + reviewer |
| 045 | System Prompt = AISP | 18 | architect |
| 046 | Web Speech STT | 19 | architect |
| 047 | Cost Cap | 20 | architect + security-auditor |

Reserved up to ADR-047. Post-MVP reserves 048+.
