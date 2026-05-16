# P123 / Loop 3 — Full LLM E2E Evidence

**Run started:** 2026-05-08T19:37:45.046Z
**Run completed:** 2026-05-08T19:38:06.433Z
**Model:** `gemini-2.5-flash` (per ADR-150 D1 lock)
**Total LLM calls:** 13
**Total cost:** $0.008163
**Total latency (sum):** 21362 ms
**Avg latency per call:** 1643 ms
**Total tokens:** 1818 in / 3047 out
**Pass rate (shape-valid):** 13 / 13
**Budget remaining:** 37 calls / $0.991674
**Key reference (redacted):** `AIza***fsY`

## Per-call type results

### 1-site-update-chat — 3 call(s) · $0.000430 · 3/3 shape-valid

| # | Started | Latency (ms) | In tok | Out tok | Cost ($) | Result kind | Shape OK |
|---|---|---|---|---|---|---|---|
| 1 | 2026-05-08T19:37:45.046Z | 946 | 167 | 45 | 0.000163 | `patch_returned` | ✅ |
| 2 | 2026-05-08T19:37:45.995Z | 804 | 158 | 25 | 0.000110 | `patch_returned` | ✅ |
| 3 | 2026-05-08T19:37:46.800Z | 699 | 159 | 44 | 0.000158 | `patch_returned` | ✅ |

<details><summary>Per-prompt detail (verbatim user prompt + redacted response preview)</summary>

**Prompt 1:**

```
Make the hero subhead say: Built in 8 weeks at Harvard ALM
```

**Response preview (redacted, ≤200 chars):**

```json
[{"op":"replace","path":"/sections/0/subtitle","value":"Built in 8 weeks at Harvard ALM"}]
```

**Prompt 2:**

```
Add a pricing section after the hero
```

**Response preview (redacted, ≤200 chars):**

```json
[{"op":"add","path":"/sections/1","value":{"type":"pricing"}}]
```

**Prompt 3:**

```
Change the CTA button text color to crimson
```

**Response preview (redacted, ≤200 chars):**

```json
[{"op":"add","path":"/sections/0/components/2/styles/color","value":"crimson"}]
```

</details>

### 2-site-update-listen — 2 call(s) · $0.000222 · 2/2 shape-valid

| # | Started | Latency (ms) | In tok | Out tok | Cost ($) | Result kind | Shape OK |
|---|---|---|---|---|---|---|---|
| 1 | 2026-05-08T19:37:47.509Z | 597 | 160 | 27 | 0.000116 | `patch_returned` | ✅ |
| 2 | 2026-05-08T19:37:48.107Z | 731 | 155 | 24 | 0.000107 | `patch_returned` | ✅ |

<details><summary>Per-prompt detail (verbatim user prompt + redacted response preview)</summary>

**Prompt 1:**

```
change the hero headline to Welcome to Hey Bradley
```

**Response preview (redacted, ≤200 chars):**

```json
[{"op":"replace","path":"/sections/0/headline","value":"Welcome to Hey Bradley"}]
```

**Prompt 2:**

```
add a testimonials section
```

**Response preview (redacted, ≤200 chars):**

```json
[{"op":"add","path":"/sections/-","value":{"type":"testimonials"}}]
```

</details>

### 3-decomp — 2 call(s) · $0.000892 · 2/2 shape-valid

| # | Started | Latency (ms) | In tok | Out tok | Cost ($) | Result kind | Shape OK |
|---|---|---|---|---|---|---|---|
| 1 | 2026-05-08T19:37:48.839Z | 1192 | 118 | 166 | 0.000450 | `atom_returned` | ✅ |
| 2 | 2026-05-08T19:37:50.032Z | 1165 | 121 | 162 | 0.000441 | `atom_returned` | ✅ |

<details><summary>Per-prompt detail (verbatim user prompt + redacted response preview)</summary>

**Prompt 1:**

```
Make the hero brighter and add a pricing section
```

**Response preview (redacted, ≤200 chars):**

```json
{"utterance":"Make the hero brighter and add a pricing section","todos":[{"order":1,"verb":"modify","target":"section","details":"brightness of the hero section","sourceSpan":"Make the hero brighter",
```

**Prompt 2:**

```
Change theme to warm, then update copy to be more friendly
```

**Response preview (redacted, ≤200 chars):**

```json
{"utterance":"Change theme to warm, then update copy to be more friendly","todos":[{"order":1,"verb":"modify","target":"theme","details":"warm","sourceSpan":"Change theme to warm","confidence":1},{"or
```

</details>

### 4-voice-extract — 1 call(s) · $0.000095 · 1/1 shape-valid

| # | Started | Latency (ms) | In tok | Out tok | Cost ($) | Result kind | Shape OK |
|---|---|---|---|---|---|---|---|
| 1 | 2026-05-08T19:37:51.198Z | 583 | 101 | 26 | 0.000095 | `atom_returned` | ✅ |

<details><summary>Per-prompt detail (verbatim user prompt + redacted response preview)</summary>

**Prompt 1:**

```
warm cream parchment with serif font, plain spoken, no jargon, like a founder talking to a friend
```

**Response preview (redacted, ≤200 chars):**

```json
{"voiceAttributes":["warm","plain-spoken","no-jargon","founder-voice","friendly"]}
```

</details>

### 5-intent — 1 call(s) · $0.000312 · 1/1 shape-valid

| # | Started | Latency (ms) | In tok | Out tok | Cost ($) | Result kind | Shape OK |
|---|---|---|---|---|---|---|---|
| 1 | 2026-05-08T19:37:51.782Z | 1006 | 90 | 114 | 0.000312 | `atom_returned` | ✅ |

<details><summary>Per-prompt detail (verbatim user prompt + redacted response preview)</summary>

**Prompt 1:**

```
make this softer
```

**Response preview (redacted, ≤200 chars):**

```json
{"verb":"change","target":{"type":"section","index":null},"confidence":0.7,"rationale":"The request 'make this softer' is a general aesthetic change that applies to the entire section, not a specific 
```

</details>

### 6-process-atom — 1 call(s) · $0.000525 · 1/1 shape-valid

| # | Started | Latency (ms) | In tok | Out tok | Cost ($) | Result kind | Shape OK |
|---|---|---|---|---|---|---|---|
| 1 | 2026-05-08T19:37:52.789Z | 1376 | 157 | 191 | 0.000525 | `atom_returned` | ✅ |

<details><summary>Per-prompt detail (verbatim user prompt + redacted response preview)</summary>

**Prompt 1:**

```
I want to build a coffee shop site with menu, story, and contact pages
```

**Response preview (redacted, ≤200 chars):**

```json
{"phases":[{"id":"initial_planning","name":"Initial Planning","position":0,"sprints":[{"id":"sprint_1_planning","name":"Requirement Gathering & Tech Stack","waves":[{"id":"wave_1_planning","name":"Cor
```

</details>

### 7-ddd-atom — 1 call(s) · $0.001892 · 1/1 shape-valid

| # | Started | Latency (ms) | In tok | Out tok | Cost ($) | Result kind | Shape OK |
|---|---|---|---|---|---|---|---|
| 1 | 2026-05-08T19:37:54.166Z | 3765 | 147 | 739 | 0.001892 | `atom_returned` | ✅ |

<details><summary>Per-prompt detail (verbatim user prompt + redacted response preview)</summary>

**Prompt 1:**

```
An app for matchmaking founders to investors with auth, profiles, messaging, and matching
```

**Response preview (redacted, ≤200 chars):**

```json
{"contexts":[{"id":"authentication","name":"Authentication","responsibility":"Handles user registration, login, session management, and authorization checks.","owns":["User Credentials","Session Token
```

</details>

### 8-agent-atom — 1 call(s) · $0.002938 · 1/1 shape-valid

| # | Started | Latency (ms) | In tok | Out tok | Cost ($) | Result kind | Shape OK |
|---|---|---|---|---|---|---|---|
| 1 | 2026-05-08T19:37:57.933Z | 5938 | 142 | 1158 | 0.002938 | `atom_returned` | ✅ |

<details><summary>Per-prompt detail (verbatim user prompt + redacted response preview)</summary>

**Prompt 1:**

```
Decompose wave w-1 into agents.
```

**Response preview (redacted, ≤200 chars):**

```json
{"waveId":"w-1","agents":[{"id":"auth-jwt-creator","role":"auth-jwt-creator","ownedFiles":["auth/jwt.py"],"scope":"Handles the creation of JSON Web Tokens for authenticated users.","dod":["Receives us
```

</details>

### 9-assumptions — 1 call(s) · $0.000858 · 1/1 shape-valid

| # | Started | Latency (ms) | In tok | Out tok | Cost ($) | Result kind | Shape OK |
|---|---|---|---|---|---|---|---|
| 1 | 2026-05-08T19:38:03.872Z | 2560 | 143 | 326 | 0.000858 | `atom_returned` | ✅ |

<details><summary>Per-prompt detail (verbatim user prompt + redacted response preview)</summary>

**Prompt 1:**

```
make it nicer
```

**Response preview (redacted, ≤200 chars):**

```json
{"items":[{"id":"change-site-design-theme","label":"Change the overall design theme of the site","rephrasing":"change the site's visual theme to a more modern or aesthetically pleasing design","confid
```

</details>

## Aggregate stats

- Total calls: **13**
- Total tokens: **4865** (1818 in / 3047 out)
- Total cost: **$0.008163**
- Avg latency: **1643 ms**
- Min latency: **583 ms**
- Max latency: **5938 ms**
- Pass rate: **13/13** = 100.0%
- Failures (shape-invalid or errored): **0**

## ADR-150 compliance check

- **D1 model lock:** ✅ all 13 calls used `gemini-2.5-flash` (hardcoded in spec).
- **D2 response shape:** 5/5 site-update calls returned valid JSON-Patch arrays; 8/8 atom calls returned valid atom shapes.
- **D3 code-driven merge:** ✅ no LLM was asked to merge — every patch was returned as a deterministic operation array (`applyPatches` runs in production code; this Node smoke verifies the shape).
- **D5 turn budget:** ✅ 13 calls / 50-call session cap = 26.0% used.
- **D6 logging:** ✅ every call has full metric set (model, in_tokens, out_tokens, cost_usd, latency_ms, started_at, result_kind).
- **D7 cost cap:** ✅ $0.008163 / $1.00 lifetime cap = 0.8163%.

## Findings

- **STT (listen mode) note:** the user explicitly wants Web Speech API, NOT Whisper. The simulated listen tests above feed cleanTranscript-equivalent text directly to the LLM — they do not exercise actual SpeechRecognition (which requires browser audio fingerprint that headless cannot fake). Live Web Speech smoke is an owner runbook task on a real browser session.
- **Atom enrichment paths:** PROCESS_ATOM, DDD_ATOM, AGENT_ATOM, ASSUMPTIONS_ATOM, INTENT (`llmClassifier.ts`) all have working LLM-enrichment paths gated by `useIntelligenceStore` (BYOK adapter set + cost-cap not exceeded). DECOMP and voiceExtraction are rules-only at present (CF#4 BYOK live-LLM-enriched paths). This loop validates the *prompt + parse contract* of every atom by calling Gemini directly with the atom's build* prompt.

## Verdict

**PASS** — 13 calls executed, $0.008163 spent (well under the $0.02 loop budget and $1.00 lifetime cap), 13/13 (100.0%) returned valid response shapes per ADR-150 D2. All 9 call types per ADR-150 §1 were attempted.

The LLM functionality works end-to-end: yes. The Node-side smoke proves the prompt → Gemini → parse contract for every call type. The remaining round-trip (Gemini patch → applyPatches in browser → preview update + CostPill tick) is exercised by the W11 in-app smoke runbook (deferred to owner BYOK runtime per ADR-150 D7 / CF-P122-W11-1).

---

*Generated by `tests/p123-llm-e2e.spec.ts` per P123 / Loop 3 / ADR-150.*
