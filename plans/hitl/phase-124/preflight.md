# P124 / VERCEL DEMO MODE + CARRY-FORWARDS — Preflight

> **Mission:** Ship Vercel demo mode (`/api/demo-chat` with server-side
> Gemini key + IP rate limit + dollar cap so capstone reviewers can use the
> site without supplying any key) AND close the 6 P123 carry-forwards.
>
> **Branch:** `swarm/p124-vercel-demo-mode` (cut from P123 seal on
> `swarm/p122-ux-overhaul` after owner sign-off; local-only initially).
>
> **Predecessor:** P123 / UX-CONTINUATION + LLM-LIVE sealed 2026-05-08
> (Agentics 70 + Contact 65 met; Builder 63 (2 below); Welcome ~62-65;
> live Gemini smoke $0.000163; 4-reviewer MoE all-green post-fix-pass).

---

## 1. Owner-locked decisions

- **Server-side Gemini key** (NOT BYOK for the Vercel demo).
- **Model:** `gemini-2.5-flash` (cheap-fast tier per ADR-150 D1).
- **Budget:** ≤ $1 at first launch (set in Google AI Studio dashboard, not
  in code; CostPill must visibly tick toward this cap).
- **No auth, no accounts, no Supabase.** That's Track 2 (P125+).
- **No BYOK switching UI.** Demo mode is one-key.
- **`/api/demo-chat` only.** Site-update calls bind here.

## 2. DoD

- [ ] `/api/demo-chat` Vercel route deployed; smoke test against the
      staging URL works with no client-side key.
- [ ] Server-side `GEMINI_API_KEY` Vercel env var set + marked
      "encrypted at rest"; never echoed in any response.
- [ ] CostPill ticks visibly against the demo cap in the deployed UI.
- [ ] IP rate limit (20 req/hour) enforced and observable.
- [ ] Redaction holds end-to-end — server-side prompt log scrubbed of
      key shapes per ADR-043 + ADR-114 D3.
- [ ] All 6 P123 carry-forwards closed OR explicitly deferred with new
      carry-forward IDs.
- [ ] MoE 4-reviewer (UX / Functionality / Security / Architecture)
      green before seal.
- [ ] EOP triplet at `plans/hitl/phase-124/{preflight,session-log,retrospective}.md`.
- [ ] CLAUDE.md §12 pointer updated post-seal.

## 3. Wave plan

| Wave | Agents | Disjoint scope | Output |
|---|---|---|---|
| **W1** | A1 audit | read existing code paths + Vercel docs + ADR-150 | `docs/audit/p124-demo-mode-audit.md` |
| **W2** | A2 demo-route impl | `api/demo-chat.ts` (Vercel serverless), env-var read, model lock, JSON-Patch passthrough | route + smoke spec |
| **W3** | A3 rate limit + cost cap | IP-based rate limiter (in-memory or KV), CostPill server-side accounting, audit log | rate-limit middleware + tests |
| **W4** | A4-A9 carry-forward closures | parallel disjoint: CF-A1 Onboarding refactor or cap-raising ADR; CF-A2 D4 ordering; CF-A3 D6 vocab; CF-B1 Builder polish; CF-W11 persona audit; CF-S1 DBPanel re-audit | 6 closures |
| **W5** | A10-A13 MoE 4-reviewer | parallel disjoint UX / FN / SEC / ARCH | 4 review docs |
| **W6** | Closer | retrospective + EOP triplet + CLAUDE.md pointer + commit | seal |

W4 fans out in parallel disjoint scope. W5 runs in parallel with the
final fix wave per P123 retrospective §8 plan correction (catch
blockers before seal-time, not after).

## 4. Carry-forwards inherited from P123

| ID | Item | Owner |
|---|---|---|
| CF-P123-A1 | Onboarding.tsx 1079 LOC violation | W4-A4 (refactor or cap-raise ADR) |
| CF-P123-A2 | ADR-150 D4 system-prompt 6-element ordering | W4-A5 |
| CF-P123-A3 | ADR-150 D6 `result_kind` vs current `stage` vocabulary | W4-A6 |
| CF-P123-B1 | Builder default 63 → 65 (chrome only; content owner-locked) | W4-A7 |
| CF-P123-W11 | P122 W11 persona-Playwright audit completion | W4-A8 |
| CF-P123-S1 | DBPanel security re-audit post-`auditedComplete` redaction fix | W4-A9 |

## 5. Risks

| Risk | Mitigation |
|---|---|
| IP rate limit can be bypassed (proxy/VPN) | Pair with Google AI Studio dollar cap as ground-truth ceiling; rate limit is courtesy, cap is the safety net |
| CostPill must visibly cap at $1 | Server-side accounting authoritative; CostPill mirrors server total. Must NOT trust client-side estimate. |
| Vercel env var leaks in build output or logs | Mark "encrypted at rest"; verify zero `AIza` shapes in deployed bundle via build-time grep; CI gate. |
| Demo prompt bypasses redaction path | All `/api/demo-chat` writes MUST funnel through `redactKeyShapes` per ADR-043 + ADR-114 D3 — fitness function in MoE Sec review. |
| Onboarding 1079 LOC refactor balloons scope | Bound at ≤ 200 LOC delta; if more needed, ship cap-raising ADR instead and defer refactor to P125. |

## 6. Success exit

When DoD §2 is all-true: tag candidate `v2.0.3` (patch — no new
ADR-class change expected; ADR-150 already covers the LLM contract;
Vercel route is implementation of D1/D7).

---

*Cut from P123 seal at 2026-05-08. Track 2 (heybradley.app proper +
Supabase auth + 100 free prompts/account + BYOK) deferred to P125+
trigger conditions per `phase-124/llm-live-vercel-site.md`.*
