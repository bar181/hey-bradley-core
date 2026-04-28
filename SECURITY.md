# Security Policy — hey-bradley-core (open core)

> **Author:** Bradley Ross (bar181@yahoo.com)
> **Status:** Authored P22 deep-review fix-pass (closes ADR-043 cross-reference + P20 DoD item 8)
> **Scope:** open-core repository only. The commercial version (separate repo, post-MVP) has its own security policy.

## TL;DR

Hey Bradley runs **entirely in your browser**. No backend. No analytics. When you bring an API key, it stays in your browser's memory (or optionally IndexedDB on your machine). The deployed bundle ships **no key**, ever.

## 1. Trust boundary

- **Frontend-only SPA.** No server-side code in this repo. No backend hosted by us.
- **Same-origin trust model.** Anything running on `localhost:5173` (dev) or your deployed Vercel URL has access to the same IndexedDB + in-memory state.
- **No analytics.** No telemetry beacons. No third-party tracking scripts.
- **Network calls only to:** the LLM provider you chose (Claude / Gemini / OpenRouter); the browser's built-in STT vendor (Apple/Google) when you use Listen mode.

## 2. BYOK (Bring Your Own Key) contract

### Where the key lives

- **Default:** in-memory only. The key is stored in a Zustand store (`intelligenceStore.byokKey`); it disappears when the tab closes.
- **If you tick "Remember on this device":** the key is persisted to IndexedDB at the kv-key prefix `byok_*`. Same-origin scripts (including DevTools) can read it.
- **Never:** the key is never sent to our servers (we don't have any), never logged to console, never written to non-`byok_*` table columns.

### What we send the key to

- Only the chosen LLM provider, via that provider's documented endpoint:
  - Claude: `api.anthropic.com`
  - Gemini: `generativelanguage.googleapis.com`
  - OpenRouter: `openrouter.ai/api`
- Simulated and AgentProxy modes do **not** send anything anywhere.

### What we never do with the key

- No analytics; no error reporting service; no DevTools telemetry.
- No second `Authorization` header to any URL except the chosen provider.
- Key is **never written to URL query strings, fragments, or `Referer` headers**.

### DEV-mode caveat

If you run `npm run dev` with `VITE_LLM_API_KEY` set in `.env.local`, that key is **inlined into the dev-mode JavaScript bundle**. Anyone who can load `localhost:5173` can read it via DevTools Sources. The runtime emits a one-time `console.warn` to alert you (P19 fix-pass-2 F6).

**Do NOT**:
- Run the dev server with `vite --host` (exposes localhost beyond your machine) while `VITE_LLM_API_KEY` is set.
- Tunnel the dev server (e.g. ngrok) with the key set.
- Commit `.env.local` (it's in `.gitignore`; husky pre-commit also blocks key-shape patterns).

The build-time guard in `vite.config.ts` aborts production builds if `VITE_LLM_API_KEY` is non-empty. **Production deployments ship NO key.**

## 3. Per-provider data flow

| Provider | What goes to the provider | What comes back |
|---|---|---|
| **Claude (Anthropic)** | System prompt + user prompt + conversation history; standard `messages.create` request | Response text + token counts + finish-reason |
| **Gemini (Google AI Studio)** | Same shape as Claude; via `@google/genai` SDK | Same |
| **OpenRouter** | Same as Claude/Gemini PLUS your origin URL via `HTTP-Referer` header | Same. **OpenRouter sees the model you selected.** |
| **Simulated** | Nothing leaves the browser; canned responses | n/a |
| **AgentProxy (mock)** | Nothing leaves the browser; reads from local SQLite seed (`example_prompts` table) | n/a |
| **Fixture (DEV-only)** | Nothing leaves the browser; regex-matched canned envelopes | n/a |

## 4. What leaves the browser

| Surface | Recipient | Bytes |
|---|---|---|
| LLM chat call | Chosen provider (above) | Prompt + history + key (Authorization header) |
| Listen-mode voice | Browser's built-in STT vendor (Apple Speech / Google Speech via Web Speech API) | Audio stream while PTT held |
| External marketing links | GitHub, LinkedIn, AISP open-core (visitor-initiated) | Standard browser referer |

**Nothing else.** No `pinghome` calls, no analytics events, no error reports.

## 5. What stays in the browser

| Data | Storage | Retention |
|---|---|---|
| Site config (MasterConfig JSON) | IndexedDB (sql.js) `projects` table | until user deletes the project |
| Chat messages + responses | IndexedDB `chat_messages` table | until user deletes the project |
| Listen transcripts (final TEXT only; no audio) | IndexedDB `listen_transcripts` table | until user deletes the project |
| LLM call audit | IndexedDB `llm_calls` + `llm_logs` tables | 30-day retention; auto-pruned at every `initDB` |
| BYOK key (if "Remember" ticked) | IndexedDB `kv` table at `byok_key` | until user clicks "Forget this device's API key" |
| Cost cap setting | IndexedDB `kv` at `cost_cap_usd` | persistent |

## 6. What `.heybradley` exports include — and what's stripped

When you click Export, the app produces a zip containing your project state. The export is **registry-driven** (`SENSITIVE_TABLE_OPS` in `exportImport.ts`) so future schema additions don't accidentally leak.

**Stripped from every export:**
- `byok_*` kv prefix (BYOK key + provider) — sweep `WHERE k LIKE 'byok_%'`
- `pre_migration_backup` kv key (DB snapshot before migration)
- Entire `llm_logs` table (system prompts + user prompts + raw responses)
- `example_prompt_runs` table (real LLM responses joined to user prompts)
- `llm_calls.error_text` (nulled before export; redacted in-memory anyway)

**Included (intentional):**
- Your site config + chat messages + listen transcripts. You're choosing to share these by exporting.

If you find a sensitive column in an exported `.heybradley` zip that ISN'T in the strip-list above, **report it** as a security issue (see §8).

## 7. Multi-tab same-origin visibility

Two browser tabs on the same origin share IndexedDB. If you open Hey Bradley in two tabs:
- Both tabs see your chat history + BYOK key (when "Remember" is on).
- Cross-tab writes are coordinated via Web Locks (`navigator.locks.request('hb-db-write')`) + BroadcastChannel (`hb-db`) for invalidation.
- **Closing one tab does NOT clear in-memory state in the other tab.**

Implication: an "incognito" window assumption is partial. Other incognito tabs in the same private session can read your state. Standard browser same-origin trust model applies.

## 8. Reporting

For sensitive disclosures: open a GitHub issue at `bar181/hey-bradley-core` with the **`security`** label, OR email **bar181@yahoo.com** directly.

**Do NOT** file a public issue containing:
- A real API key (even truncated)
- Repro steps that include a key
- Screenshots that show a key

Coordinate disclosure timeline; we'll respond within 7 days for HIGH-severity issues.

## 9. Defenses currently in place

- **Husky pre-commit guard** (`scripts/check-secrets.sh`): rejects commits whose staged diff contains 9 key-shape patterns (Anthropic, OpenAI, Google AI, HuggingFace, GitHub PAT, Groq, xAI, OpenRouter, generic JWT).
- **Vite build-time assertion** (`vite.config.ts`): aborts `npm run build` if `VITE_LLM_API_KEY` is non-empty.
- **Patch validator path whitelist** (`patchValidator.ts`): LLM-emitted JSON patches can only modify allow-listed paths in MasterConfig; prototype-key pollution blocked via `Object.getOwnPropertyNames` recursion.
- **Patch validator CSS-injection guard:** `UNSAFE_VALUE_RE` blocks `javascript:`, `data:text/html`, `vbscript:`, `<script`, `on\w+=`, `\burl\(`, `@import`. `IMAGE_PATH_RE` allow-lists image URL fields.
- **Site-context interpolation sanitize** (`prompts/system.ts:escapeForPromptInterpolation`): strips `\r\n"\\` from purpose/audience/tone before embedding in system prompt.
- **`redactKeyShapes` uniform** across all 6 LLM adapters + Web Speech STT error path.
- **Cost cap** (`auditedComplete.ts`): per-session USD ceiling, default $1.00, range $0.10–$20. Pre-call projection prevents over-cap calls.

## 10. ADR cross-references

- ADR-029: No backend (foundational decision)
- ADR-040: Local SQLite persistence
- ADR-041: Schema versioning + migration
- ADR-043: API-key trust boundaries (this document operationalizes that ADR)
- ADR-046: Multi-provider LLM architecture
- ADR-047: LLM logging + 30-day retention
- ADR-048: STT Web Speech API
- ADR-054: DDD bounded contexts (Persistence + Intelligence boundaries are security-relevant)

## 11. Out of scope

- **Commercial version** (separate repo, post-MVP) — has its own security policy covering Supabase auth, hosted demo without BYOK, multi-page sites.
- **CSP / SRI / hosting headers** — Vercel-side configuration; not in this repo.
- **Encryption-at-rest for IndexedDB** — relies on browser's same-origin model; not encrypted by us. Acceptable per ADR-043 §3.

---

*Last updated: 2026-04-27 P22 deep-review fix-pass. Authored by Bradley Ross.*
