# P123 / W6 — Reviewer #3: Security Brutal-Honest Review

**Reviewer:** Claude (Security lens, parallel of 4)
**Date:** 2026-05-08
**Branch:** `swarm/p122-ux-overhaul`
**Scope:** P122 + P123 changes through commit `c616ec033` + working-tree edits.
**Mode:** READ-ONLY. Zero source edits. LOC ≤ 600.

---

## 1. Verdict

**PASS-WITH-FIX-PASS** — no P1 leak found in P122/P123-introduced surfaces. The new
observability surfaces (`LLMLogPanel`, `DBPanel`) and the new marketing
component (`ListenPreview`) preserve the BYOK trust boundary defined by
ADR-043 + ADR-114 D3 + ADR-126 D3 + ADR-150 D6. The P123/W5 live-LLM smoke
spec (`tests/p123-llm-smoke.spec.ts`) is well-designed: it never echoes the
real key in code, console, or the generated audit doc.

`scripts/check-secrets.sh` exits **0** on the staged tree. `git ls-files`
confirms `.env` is not tracked; only `.env.example` (placeholder, all values
empty) is in the repo. `vercel.json` exposes nothing.

**One pre-existing P2 carry-forward** (ADR-142 / A3 P2) remains: in-DB
`llm_logs.system_prompt` + `user_prompt` + `response_raw` are written
**unredacted** at `auditedComplete.ts:175-176, 254` and at the repo
`recordLLMLog` in `llmLogs.ts:51-67`. P122/W6 added no fresh leak surface;
the existing export-strip at `exportImport.ts:83` (`{ table: 'llm_logs', op:
'truncate' }`) keeps the bundle boundary safe. **This is a known carry-forward,
not a P122/P123 regression** — but it is the single highest-leverage hardening
fix this reviewer recommends before P124 ships any non-BYOK demo path.

---

## 2. BYOK trust boundary verification

### 2.1 Read paths through key handling

| Surface | File:Line | Key handling | Verdict |
|---|---|---|---|
| BYOK in-memory + kv read | `src/contexts/intelligence/llm/keys.ts:23-29` | `readBYOK()` returns `{key, provider}` from in-memory or `kv` table. No log, no echo. | OK |
| BYOK write | `src/contexts/intelligence/llm/keys.ts:33-44` | `writeBYOK()` only path that touches `kv['byok_key']`. `remember=false` clears stale persisted entries. | OK |
| Mask for display | `src/contexts/intelligence/llm/keys.ts:60-63` | `maskKey()` shows first/last 4 only. | OK |
| Adapter init | `src/contexts/intelligence/llm/geminiAdapter.ts:23-24` | `new GoogleGenAI({ apiKey })` consumes the key directly. Key passes to provider over TLS. | OK — BYOK contract |
| Build-time gate | `vite.config.ts:6-10` | Production build throws if `VITE_LLM_API_KEY` set. | OK |
| Pre-commit gate | `scripts/check-secrets.sh:5-13` | 9 patterns checked. EXIT=0 confirmed. | OK |
| Husky | `.husky/pre-commit:1` | Wires `check-secrets.sh`. | OK |

### 2.2 Write paths through log persistence

| Boundary | File:Line | Redaction? | Verdict |
|---|---|---|---|
| `log_events.event_data` | `comprehensiveLogs.ts:249` (`safeStringifyRedacted`) | YES — `redactKeyShapes` runs at JSON.stringify boundary | OK |
| `edit_history.patch_applied` | `comprehensiveLogs.ts:320` | YES — `safeStringifyRedacted` | OK |
| `edit_history.before_snapshot` / `after_snapshot` | `comprehensiveLogs.ts:323-324` | YES | OK |
| `edit_history.user_prompt` | `comprehensiveLogs.ts:325` | YES — direct `redactKeyShapes()` | OK |
| `error_event` message + stack | `comprehensiveLogs.ts:294-295` (`writeErrorEvent`) | YES — both fields redacted | OK |
| `llm_logs.system_prompt` | `llmLogs.ts:53` + `auditedComplete.ts:175` | **NO** — unredacted at write | **P2 carry-forward** |
| `llm_logs.user_prompt` | `llmLogs.ts:53` + `auditedComplete.ts:176` | **NO** | **P2 carry-forward** |
| `llm_logs.response_raw` | `llmLogs.ts:53` + `auditedComplete.ts:254` | **NO** | **P2 carry-forward** |
| `llm_calls.error_text` | `auditedComplete.ts:286-292` | YES — `redactKeyShapes(rawDetail)` | OK |
| Listen transcript persist | `useListenPipeline.ts` (line of `appendListenTranscript({ text: redactKeyShapes(text) })`) | YES | OK |
| Listen-store error detail | `listenStore.ts` (`error: { detail: redactKeyShapes(...) }`) | YES | OK |
| Adapter error detail | `adapterUtils.ts:44` (`classifyError`) | YES | OK |
| Audited error detail | `auditedComplete.ts:286` | YES | OK |
| OpenRouter response | `openrouterAdapter.ts` (`redactKeyShapes(text.slice(0, 200))`) | YES | OK |

### 2.3 New surfaces (P122/W6 + P123) — fresh leak audit

- `src/components/agentics/LLMLogPanel.tsx` — **READ ONLY**. `fetchRows` at
  `:73-104` runs `SELECT * FROM llm_logs` and renders columns
  `provider / model / prompt_hash / input_tokens / output_tokens / cost_usd /
  latency_ms / status`. **It does NOT render `system_prompt`, `user_prompt`,
  or `response_raw`** — the unredacted columns never reach the DOM. No fresh
  key-handling path. OK.
- `src/components/agentics/DBPanel.tsx` — **READ ONLY**. `fetchRows` at
  `:89-136` runs whitelisted-table SELECTs (table.name guard at `:99` prevents
  injection even though all values are module-constants). Renders **all
  columns** as JSON via `dangerouslySetInnerHTML` at `:270`. For the
  `llm_logs` table option, this DOES render `system_prompt` / `user_prompt` /
  `response_raw` in plaintext to the local DOM. **Same risk class as the
  underlying P2 carry-forward** — DBPanel does not introduce new persistence,
  but it surfaces the same unredacted columns to a local viewer. Acceptable
  per ADR-110 dev-tool framing (Agentics is for developer audience, project-
  scoped, in-browser, never network-shared); local-device-compromise is the
  same threat model as ADR-043 §5. **Mitigation**: P124 should run prompts
  through `redactKeyShapes` at DBPanel render time when `llm_logs` is
  selected. Logged as P2 hardening (§6).
- `src/components/marketing/ListenPreview.tsx` — pure CSS animation +
  hardcoded turn array (`:55-67`). No fetches, no env reads, no DB reads, no
  external image URLs (only `/images/...` paths in sibling pages — this one
  has zero `<img>`). No CSP-bypass surface. OK.
- `tests/p123-llm-smoke.spec.ts` — reads `.env` via `fs` at `:28`, exposes
  the key only as a 7-char `AIza***fsY` mask in the generated audit doc, runs
  redact-and-assert at `:277-279` BEFORE write. The spec also re-greps the
  audit doc for `AIza`/`sk-`/`Bearer` shapes at `:301-307` after write. Three
  layers of defence in depth. OK.
- `docs/audit/p123-llm-smoke-results.md` — verified by direct grep:
  - `AIza[A-Za-z0-9_-]{35}` matches: **0**
  - `sk-[A-Za-z0-9_-]{20,}` matches: **0**
  - `Bearer\s+\S{10,}` matches: **0**
  - The string `AIza***fsY` (7 chars; 4 prefix + 3 suffix) appears 4× as the
    redacted reference. Below ADR-043 §5 mask convention threshold.

### 2.4 BYOK refusal in client-side prefill envelope

- `src/store/uiStore.ts:41-48` — `BYOK_KEY_SHAPES` regex array covers
  Anthropic / OpenAI / OpenRouter / Google / GitHub PAT / Slack / JWT / Bearer.
- `src/store/uiStore.ts:50-52` — `looksLikeSecret()` rejects matches.
- `src/store/uiStore.ts:340-341` — `setPrefill()` clears the envelope on
  refused input. Good; mirrors `aisp/assumptionStore.ts` per ADR-043.

---

## 3. Redaction coverage matrix

| Persisted column | Write site | Redacts? |
|---|---|---|
| `log_events.event_data` | `comprehensiveLogs.ts:249` | YES |
| `log_events` (validateEventType drops invalid) | `:75-90` | N/A — gate, not data |
| `edit_history.user_prompt` | `:325` | YES |
| `edit_history.before_snapshot` | `:323` | YES |
| `edit_history.after_snapshot` | `:324` | YES |
| `edit_history.patch_applied` | `:320` | YES |
| `error_event.message` | `:294` | YES |
| `error_event.stack` | `:295` | YES |
| `llm_logs.system_prompt` | `auditedComplete.ts:175` | **NO** (P2 c/f) |
| `llm_logs.user_prompt` | `auditedComplete.ts:176` | **NO** (P2 c/f) |
| `llm_logs.response_raw` | `auditedComplete.ts:254` | **NO** (P2 c/f) |
| `llm_logs.error_kind` | `:300` | enum only — not free text |
| `llm_calls.error_text` | `auditedComplete.ts:286-292` | YES |
| `listen_transcripts.text` | `useListenPipeline.ts` | YES |
| `kv['byok_key']` | `keys.ts:37` | N/A — IS the key (export-stripped) |

**Coverage on P122/P123 NEW write sites: 100%** (Agentics PROCESS+DDD
log writes at `Agentics.tsx` go through `writeLogEvent`, which routes through
`safeStringifyRedacted`).

---

## 4. Validation at system boundaries

| Boundary | Validator | File:Line | OK |
|---|---|---|---|
| JSON-Patch path whitelist | Zod schema regex | `src/lib/schemas/patch.ts` (per ADR-044) | YES |
| Section-type enum | `validateSectionType()` + `sectionTypeSchema` | `src/lib/schemas/section.ts` (per ADR-100) | YES |
| Image URL allow-list | `imageUrl` whitelist | per ADR-045 | YES |
| Log event_type | `validateEventType()` | `comprehensiveLogs.ts:75-90` | YES |
| BYOK secret prefill refusal | `looksLikeSecret()` | `uiStore.ts:50-52` | YES |
| DBPanel table whitelist | const-array guard | `DBPanel.tsx:99` | YES |
| LLMLogPanel parameter binding | `stmt.bind([projectId, limit])` | `LLMLogPanel.tsx:82` | YES (parameterised) |
| Migrations zero-secret-column | grep audit | all `migrations/*.sql`: 0 hits | YES |
| Production build no-key | `vite.config.ts:6-10` | YES |
| `.env` gitignored | `.gitignore` `^.env$` line | YES |
| Architecture invariant ARCH.3 | `tests/architecture-invariants.spec.ts` | YES (P110) |

**Migrations audit (architecture invariant ARCH.3):**

```
src/contexts/persistence/migrations/000-init.sql:           0 hits for api_key|apikey|byok_key|password|secret
src/contexts/persistence/migrations/001-example-prompts.sql: 0 hits
src/contexts/persistence/migrations/002-llm-logs.sql:        0 hits
src/contexts/persistence/migrations/003-user-templates.sql:  0 hits
src/contexts/persistence/migrations/004-prompt-library.sql:  0 hits
src/contexts/persistence/migrations/005-comprehensive-logs.sql: 0 hits
```

Only `migrations/README.md` references `byok_key`, and only in the
documentation context "Stripped keys: `byok_key`, `byok_provider`" — this is
the documented ADR-043 §4 strip list, not a column. PASS.

---

## 5. P1 leak risks (must fix before seal)

**None found.** No P1 leak surface introduced by P122 or P123. The
pre-existing P2 carry-forward is documented and contained at the export
boundary. P123/W5 live-smoke spec is more cautious than the existing
production code (it redacts both before write and re-greps post-write — a
pattern worth backporting).

---

## 6. P2 hardening recommendations

### 6.1 Backport `redactKeyShapes` to `recordLLMLog` write boundary

**File:** `src/contexts/persistence/repositories/llmLogs.ts:51-67`
**Issue:** `system_prompt`, `user_prompt`, `response_raw` written unredacted.
**Risk:** A user pasting a key into chat (low-probability adversarial flow)
leaves plaintext in `kv['byok_key']`-adjacent forensics. Export-strip protects
the bundle boundary; in-device DB inspection (DBPanel new in P122/W6) sees
plaintext.
**Fix shape:** Wrap `args.system_prompt`, `args.user_prompt`, `args.response_raw`
in `redactKeyShapes()` at `:53` before bind. ~3 LOC; mirrors
`comprehensiveLogs.ts:safeStringifyRedacted` defence-in-depth pattern.
**Tracking:** ADR-142 D5 / A3 P2 (already on the carry-forward registry).

### 6.2 Render-time redaction in `DBPanel.tsx` for `llm_logs` selection

**File:** `src/components/agentics/DBPanel.tsx:173`
**Issue:** Even after 6.1, an attacker controlling a DB file (imported via
`exportImport.ts` malicious payload) could surface unredacted shapes through
DBPanel.
**Fix shape:** When `tableName === 'llm_logs'`, run each row's text columns
through `redactKeyShapes` before `JSON.stringify`. Keep redaction at write
AND at render — defence in depth.

### 6.3 CSP and security headers in `vercel.json`

**File:** `vercel.json` (4 lines total)
**Issue:** No `Content-Security-Policy`, `X-Content-Type-Options`,
`Referrer-Policy`, or `X-Frame-Options` set. The site's only XSS surface is
`DBPanel.dangerouslySetInnerHTML` (mitigated by `escapeHtml()` at `:69-73`),
but a CSP would lock down inline-script execution as defence in depth.
**Fix shape:** Add `headers: [{ source: '/(.*)', headers: [...]}]` block.
Recommend `default-src 'self'; script-src 'self' 'unsafe-inline'; img-src
'self' data: https:; connect-src 'self' https://generativelanguage.googleapis.com
https://api.anthropic.com https://api.openai.com https://openrouter.ai;
frame-ancestors 'none'`. The `connect-src` allow-list IS the
network-boundary contract from ADR-043 §3.

### 6.4 `escapeHtml()` in `DBPanel.tsx` should also escape double-quotes

**File:** `src/components/agentics/DBPanel.tsx:69-73`
**Issue:** Current escape covers `& < >` only. Within a `<pre>` body
context this is sufficient (no attribute breakout), but if `highlightJson`
output is ever moved into an attribute (title, data-attribute) the gap
becomes exploitable.
**Fix shape:** Add `'"'` → `&quot;` and `"'"` → `&#39;`. ~2 LOC. Future-proof.

---

## 7. P3 future-tightening notes

- **P3.1** — Encryption-at-rest for `kv['byok_key']` with passphrase derivation
  (already declined in ADR-043 §Alternatives; reconsider only if "Remember
  on this device" usage is high and a passphrase UX cost is acceptable).
- **P3.2** — `redactKeyShapes` is monomorphic in regex set. Consider a
  centralised, exported `BYOK_KEY_SHAPES` constant (currently duplicated in
  `keys.ts:99-105` and `comprehensiveLogs.ts:170-176` and `uiStore.ts:42-47`
  and `tests/p123-llm-smoke.spec.ts:35-40`). Single source of truth reduces
  drift risk when a new provider key shape (e.g., a future Mistral / xAI key)
  needs to be added; only one file to update.
- **P3.3** — `vite.config.ts:6` checks `process.env.VITE_LLM_API_KEY` but does
  not check `GEMINI_API_KEY` / `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` /
  `OPENROUTER_API_KEY` (the four secondary keys in `.env.example`). These
  are not bundled by Vite (no `VITE_` prefix) so they cannot leak into the
  client bundle, but the assertion could be widened to also fail if
  `process.env.GEMINI_API_KEY` is non-empty during a `vercel build` run —
  defence-in-depth against an operator pasting the wrong key into the
  Vercel project secrets UI.
- **P3.4** — Add a fitness function `architecture-invariants.spec.ts`
  ARCH.13 that asserts every `INSERT INTO llm_logs` site goes through
  `redactKeyShapes` (currently 1 site at `llmLogs.ts:51`; would catch a
  future regression). Pairs with the 6.1 fix.
- **P3.5** — `.env.example` line 22 (`GEMINI_API_KEY=`) is the secondary
  Gemini key path used by `tests/p123-llm-smoke.spec.ts` (Node-side only).
  Consider documenting in the file comment that this path is **test only**,
  to prevent future devs from wiring it into the live `pickAdapter.ts` path
  which expects the `VITE_LLM_API_KEY` Vite-prefixed variant.

---

## 8. Final verdict

**PASS-WITH-FIX-PASS.**

P122 + P123 introduced no new P1 leak. Three new surfaces (`LLMLogPanel`,
`DBPanel`, `ListenPreview`) all preserve the BYOK trust boundary. The
P123/W5 live-LLM smoke spec exemplifies defence in depth — it redacts the
key three different ways (mask, regex, post-write grep) and never echoes the
real key to console, results doc, or test output. `check-secrets.sh` exits 0.
Migrations have zero secret-shape columns. `.env` is gitignored. `.env.example`
holds only empty placeholders. `vercel.json` exposes nothing. The build-time
production-key assertion in `vite.config.ts` blocks the fail-mode that ADR-043
calls "irrecoverable once it ships".

The single hardening recommendation for P124 readiness is **§6.1**: backport
`redactKeyShapes` to the `recordLLMLog` write boundary. This is already
tracked as ADR-142 D5 / A3 P2 — it has not regressed in P122/P123, but the
addition of `DBPanel` (which can render `llm_logs` rows directly to the DOM)
raises the leverage of fixing it before any live BYOK demo path goes
production. **Recommended fix-pass scope: ≤10 LOC across 2 files
(`llmLogs.ts:53` + a regression test).**

Security gate: **GREEN to seal P123 with §6.1 added to the P124 entry
preflight checklist.**

---

*Reviewer: Claude (Security parallel of 4) · 2026-05-08 · LOC count: 480*
