# ADR-043: API Key Storage & Trust Boundaries

**Status:** Accepted
**Date:** 2026-04-27
**Deciders:** Bradley Ross + claude-flow swarm
**Phase:** 17

---

## Context

ADR-042 defines a browser-only LLM adapter that consumes a provider API key. Two paths supply that key: a dev-only env var (`VITE_LLM_API_KEY`) and a production-only BYOK input under Settings. Both paths cross security boundaries. This ADR records where keys live, what the deployed bundle contains, and the explicit guarantees we make to users.

The threat model is short but unforgiving. Vite inlines `VITE_*` env vars at build time. A production build accidentally configured with `VITE_LLM_API_KEY=sk-…` would ship that key to every browser that loads the site. A BYOK key persisted to local storage that then leaked through an export artifact would betray a user who shared their project file. Either failure is irrecoverable once it ships.

---

## Decision

### 1. Dev mode

- `VITE_LLM_API_KEY` is read from `.env.local` and bundled into the dev server only.
- A build-time assertion in `vite.config.ts` fails the build if `mode === 'production' && env.VITE_LLM_API_KEY` is non-empty.
- A CI grep step rejects any commit whose diff matches `sk-[A-Za-z0-9]{20,}` or `AIza[A-Za-z0-9_-]{20,}` outside `.env.example` (which holds only an empty placeholder).
- The `.env.local` file is `.gitignore`'d and listed in the security checklist.

### 2. Production mode

- The deployed bundle ships **no** key. Period.
- Users paste their own key in `LLMSettings.tsx`.
- The "Remember on this device" checkbox is **off** by default.
  - **Off:** key is held in `intelligenceStore` memory and lost on tab close.
  - **On:** key is written to the SQLite `kv` table (per ADR-040) under the row `byok_key`.
- "Remember" is a deliberate, named opt-in. The label and microcopy state the storage location.

### 3. Network boundary

- LLM calls hit the provider directly (Anthropic / Google) from the user's browser.
- The user's IP address and API key are visible to that provider. This is the definition of BYOK; it is not a leak, it is the contract.
- No request passes through any Hey Bradley server, because there is none.

### 4. Critical link to P16 — export hygiene

ADR-040's `exportImport.ts` strips the `SENSITIVE_KV_KEYS` set (which **must** include `byok_key`) before writing `db.sqlite` into the `.heybradley` zip. **This guarantees BYOK keys do not leak when a user shares a `.heybradley` archive.** It is the single most important security guarantee in P17. Any change to `kv` key naming for credentials must update `SENSITIVE_KV_KEYS` in the same commit; a regression here would silently exfiltrate keys through the most-used user flow (sharing a project).

### 5. Mitigations across the surface

- **UI masking.** Any rendered key is prefix-masked (`sk-…abcd`, last 4 only). The full value never appears on screen after entry.
- **No logging.** The key is excluded from console logs, error toasts, telemetry, and the `llm_calls.error_text` column. `classifyError` redacts before it returns.
- **No URL.** The key is never placed in a query string, fragment, or `Referer`-able header.
- **CI grep.** Pre-commit and CI both run the regex check above. PRs failing the grep are blocked.

---

## Alternatives considered

- **Server-side proxy that holds the key.** Rejected for MVP. Introduces a backend, violates ADR-029, and shifts the trust model. Reconsider post-MVP if non-BYOK users become a goal.
- **Encryption at rest of the BYOK key in `kv`.** Rejected for MVP. Browsers do not provide durable secret storage; an encryption key derived from a user-supplied passphrase is real work and a real UX cost. The threat model (local device compromise) is not meaningfully changed by client-side encryption with a client-held key. Deferred to post-MVP if a passphrase flow ships.
- **Session-only storage (`sessionStorage`).** Rejected. The "Remember on this device" UX is explicit about persistence; covertly downgrading to session storage would surprise users who chose the durable option.
- **OAuth flow per provider.** Rejected. Out of scope for MVP and not uniformly supported across providers.

---

## Consequences

### Positive

- **Operationally simple.** No secrets to rotate on our side. No vault. No KMS. The user owns their key end-to-end.
- **Export-safe by construction.** `SENSITIVE_KV_KEYS` makes the most likely leak vector — a shared project file — structurally impossible.
- **Auditable.** CI grep and the build-time `vite.config.ts` assertion catch the two failure modes that matter.

### Negative

- **Users must understand BYOK.** `SECURITY.md` and the Settings copy state explicitly that keys go directly to the provider and that "Remember" persists locally. Some users will paste a key without reading; that is acceptable risk for MVP.
- **Local device compromise reveals the key.** A user with malware on their machine has bigger problems, but the BYOK key is among the things they would lose. Mitigated only by user awareness and the option to leave "Remember" off.

### Risks

- **A future migration adds a `kv` row that holds a credential and forgets to update `SENSITIVE_KV_KEYS`.** Mitigated by code review, the ADR-041 migration discipline, and a sentinel test in `tests/persistence.spec.ts` that asserts every `byok_*` and `*_secret` row is stripped on export.
- **A logger is added downstream that captures the key.** Mitigated by the no-logging rule above, the `classifyError` redaction, and the CI grep on log output samples.

---

## Out of scope (post-MVP)

- Server-side proxy.
- Encryption at rest with a user passphrase.
- Key rotation, multi-key support, organization keys.
- Hardware-backed credential storage (WebAuthn-style).

---

## Implementation pointer

- `src/contexts/intelligence/llm/keys.ts` — BYOK in/out of `kv`; in-memory fallback; redaction helpers
- `src/components/settings/LLMSettings.tsx` — BYOK input, "Remember" toggle, prefix-masking
- `src/contexts/persistence/exportImport.ts` — `SENSITIVE_KV_KEYS` strip on export (must include `byok_key`)
- `vite.config.ts` — production-build assertion that `VITE_LLM_API_KEY` is empty
- `scripts/check-no-leaked-keys.mjs` — CI grep for `sk-…` / `AIza…` shapes
- `SECURITY.md` — user-facing statement of the BYOK contract
- Phase 17 plan: `plans/implementation/mvp-plan/03-phase-17-llm-provider.md`

---

## Related ADRs

- ADR-040: Local SQLite Persistence — owner of the `kv` table and `SENSITIVE_KV_KEYS` export strip
- ADR-042: LLM Provider Abstraction — consumer of the keys this ADR governs
