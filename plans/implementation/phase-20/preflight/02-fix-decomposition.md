# P20 Preflight — 02 Fix Decomposition

> **Purpose:** File-by-file plan for the 4 known blockers + each pulled-in carryforward item.
> **Audience:** P20 swarm coordinator + per-day developer agents.
> **Constraint:** $0 real-LLM cost in dev. FixtureAdapter / AgentProxyAdapter remain active.

---

## §A. Blocker 1: Cost-cap wiring (Day 1, ~4 hours)

### A.1 New ADR

**File:** `docs/adr/ADR-049-cost-cap-telemetry.md`
**Status:** Proposed → Accepted on Day 1
**Cross-refs:** ADR-043 (BYOK), ADR-046 (provider abstraction), ADR-047 (llm-logging — existing, NOT renumbered)

**Sections:**
- Problem: a stuck loop with a real LLM key burns money silently
- Decision: per-session USD spend tracked in memory + audit log; UI pill shows session_usd / cap_usd; calls hard-stop at cap
- Default cap: `$1.00`; range $0.10–$20.00 (CHANGEME if Capstone wants higher demo budget)
- Storage: `kv['cost_cap_usd']` (number-as-string); read on `intelligenceStore.init()`; written on Settings save
- Surface: `CostPill.tsx` in `Shell.tsx` footer; amber at 80%; red at 100%
- Cross-tab consistency: cap is per-session in-memory, NOT cross-tab; doc this limitation; rationale: cap is a soft wall, not a security boundary

### A.2 New component

**File:** `src/components/shell/CostPill.tsx` (~80 LOC)

```tsx
// Subscribes to intelligenceStore.sessionUsd + capUsd
// Renders: "$0.07 / $1.00" with color states
// data-testid="cost-pill" + "cost-pill-amber" + "cost-pill-red" for tests
// Hidden when sessionUsd === 0 (DEV smoke)
```

### A.3 Store extensions

**File:** `src/store/intelligenceStore.ts` (existing, +20 LOC)

- Add `capUsd: number` (default 1.00; loaded from kv on init)
- Add `setCapUsd(n: number)` action — clamps to [0.10, 20.00], writes kv
- `sessionUsd` already tracked via P18b llm_logs writes; just expose it

### A.4 Pre-call cap check

**File:** `src/contexts/intelligence/llm/auditedComplete.ts` (existing, +10 LOC)

Before calling `adapter.complete`:
```ts
if (intelligenceStore.sessionUsd >= intelligenceStore.capUsd) {
  return { error: { kind: 'cost_cap', message: '...' } };
}
```

(Existing `cost_cap` error kind already wired through `mapChatError` from P19 fix-pass-2 F2.)

### A.5 Settings panel

**File:** `src/components/settings/LLMSettings.tsx` (existing, +30 LOC)

Add a numeric input below provider selector:
- Label: "Session cost cap (USD)"
- Range 0.10–20.00 step 0.01
- Persists to kv on blur via `setCapUsd`

### A.6 New tests

**File:** `tests/p20-cost-cap.spec.ts` (NEW, ~120 LOC, 4 cases)

1. `under-cap shows green pill` — submit 1 prompt with FixtureAdapter; pill green
2. `at-cap shows red pill + cost_cap error` — seed sessionUsd to capUsd; submit; expect cost_cap copy from `mapChatError`
3. `over-cap blocks subsequent calls` — same as 2 + assert no llm_logs row written
4. `cap edit propagates without reload` — set cap to 0.50 in Settings; existing 0.30 session is now 60% of cap; pill flips amber

---

## §B. Blocker 2: SECURITY.md authoring (Day 2, ~2 hours)

### B.1 File

**File:** `SECURITY.md` (NEW at repo root, ~250 lines)

**Sections** (per `06-phase-20-mvp-close.md` §3.4 + R3 brutal review §"Privacy disclosure gaps"):

1. **Trust boundary** — frontend-only SPA; no backend; same-origin trust model
2. **BYOK contract**
   - Where the key lives: in-memory by default; IndexedDB `kv['byok_key']` if "Remember" ticked
   - What we send the key to: only the chosen LLM provider, via that provider's documented endpoint
   - What we never send: anything else. No analytics, no telemetry beacons, no error reporting
   - DEV mode caveat: `VITE_LLM_API_KEY` env var inlines the key into the dev bundle (P19 fix-pass-2 F6 added a runtime warn)
3. **Per-provider data flow** (one block each)
   - Claude (Anthropic): prompt + response + token counts go to Anthropic's API
   - Gemini (Google): same; routed via Google AI SDK
   - OpenRouter: prompt + response + chosen model + `HTTP-Referer: <your origin>` go to OpenRouter (this is the C06 disclosure)
   - Simulated / Mock: nothing leaves the browser
4. **What leaves the browser**
   - LLM calls (above)
   - Web Speech STT: voice → Apple/Google STT vendor (browser-mediated)
   - **No analytics**
5. **What stays in the browser**
   - All site config (master config + sections + theme)
   - Chat messages (`chat_messages` table)
   - Listen transcripts (the FINAL TEXT, NOT audio bytes — P19 fix-pass-2 F5 fixed this copy)
   - LLM logs (`llm_logs`, 30-day retention enforced at `initDB`)
6. **What `.heybradley` exports include**
   - Full master config + chat history + transcripts + audit logs
   - **NEVER** the BYOK key (registry-driven export sanitization; `SENSITIVE_TABLE_OPS` strips `byok_*` kv prefix + `llm_logs` + `example_prompt_runs`)
7. **Multi-tab visibility**
   - Two tabs of the same origin share IndexedDB (R3 brutal §6)
   - DevTools can read live state (acceptable per same-origin trust model)
8. **Reporting**
   - Open a GitHub issue with the `security` label
   - For sensitive disclosures: see `bar181/hey-bradley-core` GitHub Security tab

### B.2 Cross-references

ADR-029 (no backend), ADR-040 (export sanitization), ADR-043 (BYOK), ADR-046 (provider matrix), ADR-047 (llm logs), ADR-048 (Web Speech).

### B.3 Companion: OpenRouter privacy hint (C06)

**File:** `src/components/settings/LLMSettings.tsx` (~5 LOC)

Below the existing PROVIDER_TIER line for OpenRouter:
```tsx
{provider === 'openrouter' && (
  <p className="text-xs text-muted-foreground">
    OpenRouter sees prompts, responses, model selection, and your origin. See SECURITY.md.
  </p>
)}
```

---

## §C. Blocker 3: ADR-047 slot conflict (Day 1, ~10 minutes)

### C.1 Edits

**File:** `plans/implementation/mvp-plan/06-phase-20-mvp-close.md`
- §3.4 line ~80: change "ADR-047 — Cost Telemetry & Hard Cap" → "ADR-049 — Cost Telemetry & Hard Cap"
- Update any other ADR-047 references in this file to ADR-049

### C.2 No file rename for existing ADR-047

`docs/adr/ADR-047-llm-logging-observability.md` is sealed in P18b (`805b246`). DO NOT rename. New ADR is **ADR-049** (per `docs/adr/README.md` policy: "New ADRs continue at 049+").

---

## §D. Blocker 4: Scope-lock decision (BEFORE Day 1)

See `01-scope-lock.md` §4 approval checklist.

If user approves the recommended disposition → revised DoD = 26+2 line items, 5–7 day schedule.

---

## §E. Pulled-in carryforward — file-by-file

### §E.1 C01: 8 image-MVP fixtures (Day 3, ~4h)

**File:** `src/data/llm-fixtures/step-2.ts` (existing, +120 LOC)

8 new entries appended to `STEP2_FIXTURES`:

| # | Match pattern | Patch path | Resolution |
|---|---|---|---|
| 6 | `replace the (hero|article|featured) image with (.+)` | `featuredImage` (article) or `style/background` (hero) | description → media-library lookup; fall back to friendly empty-patch |
| 7 | `swap the (hero|article|featured) (photo|image|picture)` | same | swap to next item in same tag-bucket |
| 8 | `use a darker (hero|article) image` | same | swap to media-library item with `_dark` suffix |
| 9 | `use a brighter (hero|article) image` | same | swap to `_light` suffix |
| 10 | `make the (hero|article|featured) image rounded` | `props/style/borderRadius` | value `12px` |
| 11 | `make the (hero|article|featured) image square` | same | value `0px` |
| 12 | `center the (hero|article|featured) image` | `props/style/objectPosition` | value `center` |
| 13 | `crop the (hero|article|featured) image` | (out of MVP scope; document in canned-hint) | empty patches; friendly summary |

**File:** `src/lib/schemas/patchPaths.ts` (existing, +3 entries)
- `/sections/<n>/components/<m>/props/style/borderRadius`
- `/sections/<n>/components/<m>/props/style/objectPosition`

**File:** `src/contexts/intelligence/llm/patchValidator.ts` (no changes — `IMAGE_PATH_RE` already covers `featuredImage`/`heroImage`/`backgroundImage`/`imageUrl` post-F3)

**File:** `tests/p20-image-fixtures.spec.ts` (NEW, ~150 LOC, 8 cases)
- One per fixture; verify patch applied; verify failure mode is friendly empty-patch when path doesn't resolve

**Companion:** Update `migrations/001-example-prompts.sql` to seed image prompts in the `example_prompts` corpus (so AgentProxyAdapter mirrors FixtureAdapter — closes the bypass flagged in fix-pass-2 finding §1).

### §E.2 C02: Help/discovery handler (Day 3, ~30m)

**File:** `src/data/llm-fixtures/step-2.ts` (+ ~30 LOC)

```ts
{
  matchPattern: /^(what can you (do|help with)|help|hi|hello|i'm stuck|show me)\??\.?$/i,
  envelope: (): FixtureEnvelope => ({
    patches: [],
    summary: `I can change your site by chat. Try one of these:\n\n` +
             `• "Make the hero say 'Welcome to my bakery'"\n` +
             `• "Change the accent color to blue"\n` +
             `• "Use a serif font for headings"\n` +
             `• "Replace the hero image with a sunset"\n` +
             `• "Write a short blog article about gardening"\n\n` +
             `Speak using the mic, or type — both work the same.`,
  }),
},
```

**File:** `tests/p20-help-handler.spec.ts` (NEW, ~50 LOC, 1 parametrized case across 6 phrasings)

### §E.3 C04: ListenTab split (Day 5, ~4h)

**Source file:** `src/components/left-panel/ListenTab.tsx` (754 LOC) → split into:

| New file | LOC | Concern |
|---|---:|---|
| `src/components/left-panel/listen/OrbAnimation.tsx` | ~180 | RedOrb wrapper + pulse/burst animation refs |
| `src/components/left-panel/listen/DemoSimulator.tsx` | ~200 | The canned demo prompts + slider controls (DRAFT mode hides per F10) |
| `src/components/left-panel/listen/PttSurface.tsx` | ~250 | PTT button + privacy disclosure + transcript display + mapListenError |
| `src/components/left-panel/listen/OrbSettings.tsx` | ~80 | EXPERT-only: orb pulse intensity, burst speed, motion controls |
| `src/components/left-panel/ListenTab.tsx` | ~80 | Composition root; wires the 4 sub-components |

Verify `data-testid` selectors preserved across split (`listen-ptt`, `listen-transcript`, etc.) so existing tests stay green.

### §E.4 C06: OpenRouter privacy hint (Day 2, ~10m)

See §B.3 above.

### §E.5 C11: Vertical mobile carousel (Day 5, ~30m)

**File:** `src/pages/Welcome.tsx` (existing, ~20 LOC)

Wrap the starter carousel in a `useMediaQuery('(max-width: 600px)')` check; render vertical list on mobile.

**Test:** Add a Playwright case with `viewport: { width: 400, height: 800 }` asserting all 5 starters reachable without horizontal scroll.

### §E.6 C12: AISP Blueprint refresh (Day 6, ~4h)

**File:** `src/components/center-canvas/BlueprintsTab.tsx` (existing, ~100 LOC)

Add a "AISP" sub-tab that:
- Renders the Crystal Atom from `prompts/system.ts` in a `<pre>` block with syntax highlighting
- Cross-links to `bar181/aisp-open-core` via external link
- Shows the active site's "AISP fingerprint" (one-liner: theme preset + section count + voice attributes)

### §E.7 C14: SENSITIVE_TABLE_OPS sentinel (Day 5, ~30m)

**File:** `tests/p20-sentinel.spec.ts` (NEW, ~60 LOC)

Read all `migrations/*.sql`; for each `CREATE TABLE`, parse column names; assert any column matching `/prompt|text|key|secret|password/i` is in `SENSITIVE_TABLE_OPS` registry OR has an explicit allow-list comment in the migration file.

### §E.8 C15: Import lock (Day 3, ~30m)

**File:** `src/contexts/persistence/exportImport.ts` (existing, ~15 LOC)

In `importBundle`, after replacing the DB, run:
```sql
DELETE FROM example_prompts;
-- re-seed from migration 001 (read SQL from import.meta.glob)
```

This forces `example_prompts` to be canonical-seeded post-import, blocking malicious bundle envelope-tampering.

**Test:** `tests/p20-import-lock.spec.ts` (NEW, ~80 LOC)
- Build a `.heybradley` bundle with a doctored `example_prompts` row
- Import it
- Assert `AgentProxyAdapter` returns the canonical envelope, not the doctored one

### §E.9 C16: FK on llm_logs.session_id (Day 2, ~15m)

**File:** `src/contexts/persistence/migrations/003-llm-logs-fk.sql` (NEW, ~10 LOC)

```sql
-- sql.js doesn't enforce FK without PRAGMA; flip on at session level
PRAGMA foreign_keys = ON;
-- Recreate llm_logs with FK
CREATE TABLE llm_logs_new (
  ... (same columns as 002) ...
  FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
);
INSERT INTO llm_logs_new SELECT * FROM llm_logs;
DROP TABLE llm_logs;
ALTER TABLE llm_logs_new RENAME TO llm_logs;
UPDATE schema_version SET value = 3;
```

(Note: sql.js + IndexedDB needs PRAGMA enable each session — wire in `initDB`.)

### §E.10 C17: parseMasterConfig Zod helper (Day 6, ~2h)

**File:** `src/lib/schemas/masterConfig.ts` (NEW, ~150 LOC)

Define a Zod schema for `MasterConfig` and export `parseMasterConfig(json: unknown): MasterConfig`. Replace 11 `as unknown as MasterConfig` casts in `configStore.ts` + 17 in `data/examples/index.ts`.

### §E.11 C18: Audit log LRU bound (Day 6, ~30m)

**File:** `src/contexts/persistence/repositories/llmLogs.ts` (existing, ~15 LOC)

In `pruneOldLLMLogs`, also delete oldest rows beyond a 10K row count limit:
```ts
db.exec(`DELETE FROM llm_logs WHERE id NOT IN (SELECT id FROM llm_logs ORDER BY ts_ms DESC LIMIT 10000)`);
```

### §E.12 C20: AbortSignal plumb-through (Day 1, ~30m, paired with cost-cap work)

**File:** `src/contexts/intelligence/llm/llmAdapter.ts` (existing interface, +1 field)

Add `signal?: AbortSignal` to `LLMRequest`.

**Files:** `claudeAdapter.ts`, `geminiAdapter.ts`, `openrouterAdapter.ts` — pass `signal` to underlying SDK / fetch call.

**File:** `auditedComplete.ts` — replace `Promise.race` timeout with `AbortController.abort()` after 30s; pass signal to adapter.

**Test:** Extend `tests/p18-step1.spec.ts` with an abort case.

---

## §F. Day-by-day mapping (cross-link)

| Day | §A cost-cap | §B SECURITY | §C ADR fix | §E.* carryforwards |
|---|---|---|---|---|
| Day 1 (Mon) | A.1–A.6 + C20 | — | C.1, C.2 | E.12 (paired) |
| Day 2 (Tue) | — | B.1–B.3 | — | E.4, E.9 |
| Day 3 (Wed) | — | — | — | E.1, E.2, E.8, mvp-e2e draft |
| Day 4 (Thu) | — | — | — | Vercel deploy + getting-started.md |
| Day 5 (Fri) | — | — | — | E.3, E.5, E.7, deferred-features Disposition |
| Day 6 (Mon W2) | — | — | — | E.6, E.10, E.11 + persona reviews |
| Day 7 (Tue W2) | — | — | — | RETRO + REVIEW + Master checklist 100% green + tag |

---

## §G. Test count growth projection

| Today | After P20 |
|---:|---:|
| 46 targeted active | 60+ targeted active (+14: cost-cap×4, image×8, help×1, sentinel×1, import-lock×1, mvp-e2e×10 …actually +25 with mvp-e2e steps counted as 10 separate cases) |
| 63 total Playwright | 88+ total |
| 29 spec files | 35+ |

---

## §H. Risk register (carry from `06-phase-20-mvp-close.md` §7 + new from this preflight)

| Risk | Likelihood | Mitigation |
|---|---|---|
| Vercel deploy fails on sql.js wasm | M | Pre-build local `vite preview`; confirm `assetsInclude: ['**/*.wasm']` in vite.config.ts |
| Step 4 live-LLM smoke surfaces a real-API quirk after P20 tag | M | Run smoke locally with one $0.01 spend BEFORE tag; rebudget if regression |
| Persona scores miss target on phone | M | C11 mobile carousel (Day 5) closes this |
| ADR-049 vs renumber — if user prefers ADR sequence cleanup | L | Easy to flip; keep ADR-049 as recommended (preserves history) |
| C04 ListenTab split breaks `data-testid` selectors → tests red | M | Split incrementally; run targeted Playwright after each sub-component extracted |
| 26-item DoD over-runs 7 days | M | Polish-week items (E.3/E.5/E.6/E.10/E.11) can spill to post-MVP if needed; must-fix items (E.1/E.2/E.4/E.7/E.8/E.9/E.12) are all <30m and on critical path |

---

**Cross-link:** `00-summary.md`, `01-scope-lock.md`
**Effort:** all line items above sum to ~26 hours of focused work + persona-review days. Matches the 5–7 day P20 estimate.
**Real-LLM cost:** $0 in dev. ~$0.01 if Step 4 smoke runs.
