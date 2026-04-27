# Hey Bradley — MVP Implementation Plan (Overview)

> **Status:** Active. Supersedes `plans/implementation/phase-15/updated-phases-15-to-23.md` for execution.
> **Created:** 2026-04-25
> **Target MVP:** ~5–6 weeks from Phase 15 start
> **Owner:** Bradley Ross + claude-flow swarm
> **Doc index:**
> - `00-overview.md` — this file
> - `01-phase-15-polish-kitchen-sink.md`
> - `02-phase-16-local-db.md`
> - `03-phase-17-llm-provider.md`
> - `04-phase-18-real-chat.md`
> - `05-phase-19-real-listen.md`
> - `06-phase-20-mvp-close.md`
> - `07-prompts-and-aisp.md`
> - `08-master-checklist.md`
> - `09-adrs-to-create.md`

---

## 1. North Star (program-level)

A novice can open the deployed Hey Bradley site, click a starter, type a sentence, and watch their site change — with the LLM returning **only JSON updates** and the renderer doing the rest. Voice (Listen mode) does the same thing through a push-to-talk button. **No backend service.** A local SQLite database (sql.js + IndexedDB) holds projects, chat history, and transcripts. The LLM key is read from `VITE_LLM_API_KEY` for development and from a BYOK input field in production.

> **The product is a JSON renderer with two input methods (chat, voice). The LLM's only job is to return a small JSON patch that mutates the config.**

## 2. Guiding Principles (non-negotiable)

1. **KISS.** No new abstractions, no new user-facing features beyond what is in this plan. If a feature isn't on the master checklist, it doesn't ship in MVP.
2. **Done > Perfect.** Each phase ships behind a tight DoD. Polish loops are deferred to a post-MVP phase.
3. **Novice-first.** Default mode is DRAFT. Every UI change is judged against: *can a non-technical user do this without reading docs?* Power-user controls hide behind EXPERT.
4. **JSON is the contract.** The LLM never returns prose, HTML, or component code. It returns a `JSONPatch[]` (RFC-6902 subset) validated by Zod. The store applies patches; React re-renders. Same loop chat and listen share.
5. **Frontend only.** No FastAPI, no Express, no Supabase in MVP. All persistence is browser-local. All LLM calls are direct from the browser using BYOK or a dev env var.
6. **AISP in the system prompt, not the response.** The system prompt uses a Crystal Atom to constrain behavior. The model output is a JSON patch, not AISP.
7. **Fallback, never crash.** If LLM call fails, validation fails, or no key is set → fall back to canned `cannedChat.ts` so demos keep working.

## 3. Backend Decision — NO BACKEND

| Concern | Why a backend would help | Why we skip it |
|---|---|---|
| API key safety | Hides Anthropic/Google key from browser | BYOK pattern means the user owns the key. Dev env var is local-only. |
| Persistence | Server DB enables sync across devices | sql.js + IndexedDB = SQLite in browser, no infra to run. |
| STT | Whisper is server-side | Web Speech API is browser-native and free. |
| Cost control | Server can rate-limit | Browser-side counter + hard cap is enough for MVP. |
| Multi-user | Auth needed | Out of scope for MVP. Deferred to post-MVP phase. |
| Marketing site | Static SSR/SSG | Vite build → Vercel static. Already done. |

**Implication:** the entire MVP ships as a Vercel static deployment + Vite client. Zero servers to operate. If we later need server features (auth, sync, analytics aggregation, server-side rate limit on shared keys), we add a thin BFF — *not* part of MVP.

> One pragmatic exception we accept: a *dev-only* Node script `scripts/llm-proxy.mjs` (≤80 LOC) is permitted if CORS forces it, run as `npm run dev:llm`. It is **never** deployed.

## 4. Stage Map (Phases 15 → 20)

```
┌────────────────────────────────────────────────────────────────────┐
│ Phase 15  Polish + Kitchen Sink + Blog + Novice Simplification    │
│ Phase 16  Local DB (sql.js + IndexedDB)                            │
│ Phase 17  LLM Provider Abstraction + Env Var + BYOK Scaffolding    │
│ Phase 18  Real Chat (LLM → JSON patches)                           │
│ Phase 19  Real Listen (Web Speech API → same chat pipeline)        │
│ Phase 20  Verify, Cost Caps, MVP Close, Vercel Deploy              │
└────────────────────────────────────────────────────────────────────┘
        ↑           ↑           ↑           ↑           ↑
     1–2 wk      3–4 d       3–4 d        1 wk        1 wk        3–4 d
```

The legacy roadmap (`updated-phases-15-to-23.md`) is preserved as reference. Phases 16–22 in that doc are *condensed* into Phases 16–20 here. The pre-LLM checkpoint and the LLM checkpoint are merged because the user's directive ("we will use interaction with the JSON as the driver") makes the simulated-LLM phase redundant — we go straight from canned chat to real LLM behind a fallback.

## 5. SPARC + GOAP Methodology

Each phase document uses the SPARC + GOAP template below. Both are explicit, terse, and machine-readable.

### 5.1 SPARC Sections

- **Specification (S)** — One-paragraph problem statement. What changes, what does not. Novice impact called out.
- **Pseudocode (P)** — High-level algorithm in plain English / minimal pseudo-TS.
- **Architecture (A)** — Files touched, DDD bounded contexts, ADRs to create, schemas.
- **Refinement (R)** — Iteration checkpoints. What we *intentionally* defer.
- **Completion (C)** — DoD checklist. Tests required to pass. Persona scores.

### 5.2 GOAP Section

- **Goal state** — A predicate over the world (config, store, deployed bundle) that must be true at phase exit.
- **Actions** — `(name, preconditions, effects, cost)` tuples.
- **Plan** — Optimal action sequence (chosen by smallest cost respecting preconditions).
- **Replan trigger** — Specific failure that forces re-derivation.

### 5.3 Why both?

SPARC organizes intent; GOAP organizes execution. Agents that pick up a phase doc can read SPARC for context and execute the GOAP plan deterministically. When a precondition is invalidated mid-phase, GOAP replans without renegotiating the goal. This is anti-drift in practice.

## 6. Domain-Driven Design (DDD) — Bounded Contexts in Play

The MVP introduces / formalizes four bounded contexts. Files are already partially organized this way (`src/contexts/`); the plan completes the split.

| Context | Aggregate root | Owns | Touched in |
|---|---|---|---|
| **Configuration** | `MasterConfig` | Site JSON, sections, themes | All phases |
| **Persistence** | `Project` | Local DB (sql.js), import/export, BYOK key vault | P16, P17 |
| **Intelligence** | `LLMSession` | Provider adapter, prompt assembly, patch validation | P17, P18, P19 |
| **Specification** | `SpecBundle` | 6 spec generators, AISP Crystal Atoms | (existing; not modified in MVP) |

Cross-context rules:

- Configuration is the only writer to the live store. Intelligence emits patches; Configuration applies them.
- Persistence reads/writes the Configuration aggregate as a whole (snapshot).
- Intelligence depends on Configuration (read-only) and Persistence (read/write of session log).
- Specification depends on Configuration (read-only).

ADR-001 (JSON Single Source) and ADR-010 (Single Source of Truth) remain authoritative. The new ADRs in this plan extend them, never override.

## 7. ADRs to Create During MVP

(Full templates in `09-adrs-to-create.md`.)

| ADR # | Title | Phase |
|---|---|---|
| ADR-038 | Kitchen Sink reference example | 15 |
| ADR-039 | Standard Blog Page (single-page demo) | 15 |
| ADR-040 | Local SQLite Persistence (sql.js + IndexedDB) | 16 |
| ADR-041 | Schema Versioning & Migrations | 16 |
| ADR-042 | LLM Provider Abstraction (browser-only, BYOK + env-var) | 17 |
| ADR-043 | API Key Storage & Trust Boundaries | 17 |
| ADR-044 | JSON Patch as LLM Return Contract | 18 |
| ADR-045 | System Prompt = AISP Crystal Atom | 18 |
| ADR-046 | Web Speech API for STT (push-to-talk MVP) | 19 |
| ADR-047 | Cost Telemetry & Hard Cap | 20 |

## 8. Master Acceptance Test (MVP exit)

A fresh user, never having used Hey Bradley, in a private browser, on a 13" laptop:

1. Loads the deployed URL within 3 s.
2. Picks **Kitchen Sink** from onboarding.
3. Pastes their Anthropic API key into the BYOK field; the badge flips to **Connected to Claude**.
4. Types in chat: *"Make the hero say 'Bake Joy Daily' and change the accent to forest green."*
5. Within 6 s the preview reflects both changes; the JSON tab shows the same diff.
6. Holds the **Talk** button and says: *"Add a pricing section."*
7. Within 8 s of releasing, a pricing section appears.
8. Clicks **Save**; reloads the page; the project is restored from local DB.
9. Clicks **Export**; downloads a `.heybradley` zip containing JSON + DB snapshot.
10. Disconnects internet; the existing project still loads, edits still work, only LLM calls fail with a graceful banner.

If any step fails, MVP is not done.

## 8.1 Interactive Validation (LLM phases)

Phase 18 (and Phase 19's STT addition) ship as **three small steps each**, not single pushes. The user gates every transition.

| Step | What proves out | Demoable artefact |
|---|---|---|
| 1 | The wire — one hardcoded round trip mutates the JSON and re-renders | Test button in Settings |
| 2 | The contract — one real user prompt with full validation + golden test | Chat input itself |
| 3 | The depth — all starters, fallback, mutex, audit, cost cap | Full DoD per phase |

If Step 1 fails (CORS, key shape, browser issue), it's solved *before* validator code is written. This is the difference between debugging a 50 LOC integration and bisecting 700 LOC of pipeline.

## 9. Operating Model

### 9.1 Cadence

- **Day-start (10 min)** — read `SWARM.md`, current phase README, master checklist; pick the next unchecked DoD item.
- **Mid-day (15 min)** — review swarm output; correct via short instruction file.
- **Day-end (10 min)** — close the day in the phase's `session-log.md`; update master checklist.

### 9.2 Swarm Configuration

```bash
npx @claude-flow/cli@latest swarm init \
  --v3-mode \
  --topology hierarchical-mesh \
  --max-agents 8 \
  --strategy specialized
```

Standard agent set per phase:

- 1 × `planner` (decomposes the phase into goals)
- 1 × `architect` / `system-architect` (DDD/ADR alignment)
- 2 × `coder` (parallel implementation)
- 1 × `tester` (Playwright + Vitest where used)
- 1 × `reviewer` (self-review checklist before human gate)
- 1 × `security-auditor` (only in P16+ once keys/storage are involved)

### 9.3 Self-Review Checklist (run before human gate)

- [ ] `npx tsc --noEmit` clean
- [ ] `npm run build` succeeds
- [ ] `npm test` (Playwright) green; count ≥ previous
- [ ] No `console.log` added (DEV-only refs allowed via `import.meta.env.DEV`)
- [ ] No `as any` introduced
- [ ] Files added under correct directories per `CLAUDE.md`
- [ ] DoD items in this phase's checklist all flipped to ✓
- [ ] Master checklist updated
- [ ] Session log updated
- [ ] Demo flow (chat 1 line + listen 1 utterance + save + reload) recorded as a passing test

## 10. Glossary

| Term | Meaning |
|---|---|
| **JSON patch** | RFC-6902 array of `{op, path, value}` mutations against `MasterConfig`. We support `add`, `replace`, `remove` only. |
| **Crystal Atom** | An AISP block (Ω, Σ, Γ, Λ, Ε) inserted into the system prompt to constrain LLM output. |
| **Adapter** | A provider-specific implementation of `LLMAdapter`. Phase 17 ships `ClaudeAdapter`, `GeminiAdapter`, `SimulatedAdapter`. |
| **BYOK** | Bring-Your-Own-Key. End user pastes their LLM API key; key is held only in localStorage. |
| **Push-to-talk (PTT)** | Listen mode requires holding a button to record. Replaces the auto-listen design until post-MVP. |
| **Patch validator** | Zod schema that ensures the patch references valid section IDs, types, and values before apply. |
| **Cost cap** | Per-session token + USD limit; UI banner appears at 80%, calls hard-stop at 100%. |

## 11. Risk Register (top 5)

| Risk | Mitigation | Owner |
|---|---|---|
| LLM returns invalid JSON | Zod schema → 1 retry with `"You must return only the JSON object matching this schema"` → fallback to canned reply | Phase 18 |
| User pastes wrong API key shape | Lightweight format check + first call validates with a no-op | Phase 17 |
| Web Speech API unavailable (Firefox) | Show "Voice not supported in this browser" banner, hide PTT button | Phase 19 |
| sql.js bundle size bloats build | Lazy-load wasm; dynamic import on first persistence call | Phase 16 |
| Token cost runs away in dev | Hard cap, env var `VITE_LLM_MAX_USD` (default $1) | Phase 20 |

## 12. Out of Scope (explicit)

### 12.1 Narrowed editable surface (April 26 update; images added)

For MVP only **four things are user-editable through chat / listen**:

1. **Theme** — colors (6 slots), heading + body font, base spacing scale.
2. **Hero section** — heading text + level, subheading, CTA (text + URL), background color, **background image (chosen from the media library)**, layout variant.
3. **Images** — limited to **selecting** an image from the existing 300-entry media library catalog. No upload, no generation, no cropping. The LLM returns a library URL or a vetted CDN URL.
4. **Article page** — single-page article/blog with title, body, author, **hero image (library URL)**, background.

Everything else (other section types, multi-page authoring, image upload/generation/crop, advanced layout knobs) is **out of MVP**. Other pages can be added post-MVP. Kitchen Sink remains as a developer-only reference.

The path whitelist (≈ 20 paths now, with images) lives in `src/lib/schemas/patchPaths.ts` (Phase 18 single source of truth) and is template-injected into the system prompt.

Out of scope (continued):

- Auth, accounts, cloud sync, sharing
- Multi-user collaboration
- Server-side anything
- Whisper, OpenAI, custom STT
- Streaming token-by-token (we render the JSON patch atomically)
- Image generation
- AISP in the LLM response body
- Multi-page editor (blog post page in P15 is a *single static demo page*, not a multi-page editor)
- New section types beyond the 16 already shipped
- Marketplace, payments, tiers
- Database other than local SQLite

These items are explicitly *deferred*. They go in `plans/deferred-features.md` with the disposition `Post-MVP`.

## 13. How To Use This Plan

1. Read this overview once.
2. Read the phase doc you are about to execute (`01`–`06`).
3. Read `07-prompts-and-aisp.md` only when starting Phase 17.
4. Tick off items in `08-master-checklist.md` as they land.
5. When a precondition is invalidated, do **not** rewrite the SPARC section — re-derive only the GOAP plan.

A swarm review of this plan was run on creation; results in `plans/implementation/mvp-plan/REVIEW.md` (added once review completes).
