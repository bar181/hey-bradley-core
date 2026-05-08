# P20 Preflight — 03 GOAP for C20 AbortSignal

> **Purpose:** Goal-Oriented Action Planning for the lone remaining open carryforward (C20).
> **Item:** `auditedComplete` Promise.race timeout currently does NOT abort the underlying SDK request — request leaks until the LLM provider's own timeout fires (~60–120s vs our 30s wall).
> **Severity:** P17 carryforward; surfaced by R3 brutal review and R4 architecture review.
> **Effort:** ~30 LOC across 5 files; ~30 minutes; 1 new test case.
> **User decision (recorded):** all other carryforward items are GREEN. C20 needs a GOAP-style plan.

---

## 1. Goal State

```
goal := AbortSignalPropagated
      ∧ ClaudeAdapterRespectsSignal
      ∧ GeminiAdapterRespectsSignal
      ∧ OpenRouterAdapterRespectsSignal
      ∧ AuditedCompleteAbortsOnTimeout
      ∧ NoRequestLeakOnTimeout
      ∧ ExistingTestsRemainGreen
      ∧ NewAbortTestProvesNoLeak
```

Every conjunct must hold for the goal to be reached. The first 6 are code; the last 2 are evidence.

## 2. World State (today, post-`35f2a90`)

```yaml
LLMRequest:
  fields: [systemPrompt, userPrompt]
  signal_field: ABSENT

LLMAdapter.complete(req):
  contract: returns Promise<LLMResponse>
  abort_support: NONE
  uses_underlying_sdk_timeout: TRUE  # 60-120s provider default

auditedComplete:
  timeout_strategy: Promise.race + setTimeout(30s)
  abort_underlying_request: FALSE  # leaks
  test_coverage:
    - p18-step3-cap-edges: timeout returns timeout-kind error ✓
    - leak_assertion: ABSENT
```

## 3. Action Operators

| Action | Pre | Effect | Cost (min) |
|---|---|---|---:|
| `add_signal_field_to_LLMRequest` | repo clean | `LLMRequest.signal?: AbortSignal` | 2 |
| `propagate_signal_in_claude_adapter` | add_signal_field | Claude SDK call receives signal via `{ signal }` option | 5 |
| `propagate_signal_in_gemini_adapter` | add_signal_field | Gemini SDK call receives signal | 5 |
| `propagate_signal_in_openrouter_adapter` | add_signal_field | `fetch(url, { signal })` | 3 |
| `replace_promise_race_with_abort_controller` | all 3 propagations done | `auditedComplete` creates AbortController, passes signal to req, calls abort() at 30s | 8 |
| `update_fixture_and_simulated_adapters` | add_signal_field | They ignore signal (canned responses); add no-op acknowledgement of the field | 2 |
| `write_abort_test` | replace_promise_race | `tests/p20-c20-abort.spec.ts` asserts adapter.complete sees signal.aborted=true at 30s | 5 |
| `verify_existing_tests` | all above | run `npx playwright test tests/p18*.spec.ts tests/p18b*.spec.ts tests/p19*.spec.ts` | 0 (CI does it) |

## 4. Optimal Plan (cost = 30 min)

```
1. add_signal_field_to_LLMRequest                    [2m]
2. update_fixture_and_simulated_adapters             [2m]   ┐ parallel
3. propagate_signal_in_claude_adapter                [5m]   │ (after step 1)
4. propagate_signal_in_gemini_adapter                [5m]   │
5. propagate_signal_in_openrouter_adapter            [3m]   ┘
6. replace_promise_race_with_abort_controller        [8m]
7. write_abort_test                                  [5m]
8. verify_existing_tests                             [0m]
```

Dependencies: step 1 unlocks 2-5 (parallel). Steps 3-5 must finish before step 6. Steps 7-8 close the goal.

## 5. File-by-File Decomposition

### 5.1 `src/contexts/intelligence/llm/adapter.ts` (existing, +1 field)

```ts
export interface LLMRequest {
  systemPrompt: string;
  userPrompt: string;
  /**
   * Optional abort signal. When present, adapters MUST forward this to the
   * underlying SDK / fetch so a timeout in `auditedComplete` actually
   * cancels the in-flight network request (closes P17 carryforward C20).
   */
  signal?: AbortSignal;
}
```

### 5.2 `src/contexts/intelligence/llm/claudeAdapter.ts` (+3 lines)

The Anthropic SDK accepts `{ signal }` as a request option in `messages.create`. Pass `req.signal` straight through:

```ts
// inside complete()
const response = await client.messages.create({
  model: this.model(),
  max_tokens: 1024,
  system: req.systemPrompt,
  messages: [{ role: 'user', content: req.userPrompt }],
}, { signal: req.signal });   // <-- NEW
```

Adapter-side error handling already classifies `AbortError` → `kind: 'timeout'` via `classifyError` in `adapterUtils.ts` (post-F7). Verify the classification covers both `signal.aborted` and the SDK's `APIError` shape on cancellation.

### 5.3 `src/contexts/intelligence/llm/geminiAdapter.ts` (+3 lines)

Google's `@google/genai` SDK does NOT expose a request-level `signal` parameter on `models.generateContent`. Workaround: race `req.signal`'s `'abort'` event against the SDK promise, throw on abort.

```ts
const sdkPromise = client.models.generateContent({ ... });
const abortPromise = req.signal
  ? new Promise<never>((_, rej) => {
      req.signal!.addEventListener('abort', () => rej(new Error('aborted')), { once: true });
    })
  : null;
const response = abortPromise
  ? await Promise.race([sdkPromise, abortPromise])
  : await sdkPromise;
```

Caveat documented in code: this aborts the LOCAL waiter but the SDK still completes the underlying fetch in the background. Mark as "best-effort cancellation" pending SDK upgrade. **This is acceptable for MVP** — it stops blocking our chat thread; the residual fetch completes and the adapter ignores it.

### 5.4 `src/contexts/intelligence/llm/openrouterAdapter.ts` (+1 line)

Native fetch supports `signal` directly:

```ts
const response = await fetch(url, {
  method: 'POST',
  headers: { ... },
  body: JSON.stringify({ ... }),
  signal: req.signal,   // <-- NEW
});
```

This is the cleanest of the three. AbortError is already handled in the existing catch branch.

### 5.5 `src/contexts/intelligence/llm/fixtureAdapter.ts` + `simulatedAdapter.ts` (no-op acknowledgement)

These return canned responses synchronously (or with a tiny `setTimeout`). Add a defensive check:

```ts
async complete(req: LLMRequest): Promise<LLMResponse> {
  if (req.signal?.aborted) {
    return { ok: false, error: { kind: 'timeout', detail: 'aborted before fixture lookup' } };
  }
  // ...existing logic
}
```

`AgentProxyAdapter` (DB-backed) is also synchronous — same one-liner check.

### 5.6 `src/contexts/intelligence/llm/auditedComplete.ts` (replace lines 197-207)

**Before** (current Promise.race — leaks):
```ts
let timer: ReturnType<typeof setTimeout> | undefined;
const timeoutPromise = new Promise<LLMResponse>((resolve) => {
  timer = setTimeout(
    () => resolve({ ok: false, error: { kind: 'timeout' } }),
    CALL_TIMEOUT_MS,
  );
});
const res = await Promise.race([adapter.complete(req), timeoutPromise]);
if (timer) clearTimeout(timer);
```

**After** (AbortController — propagates):
```ts
const ac = new AbortController();
const timer = setTimeout(() => ac.abort(), CALL_TIMEOUT_MS);
let res: LLMResponse;
try {
  res = await adapter.complete({ ...req, signal: ac.signal });
} catch (e) {
  // Defensive — adapters should classify AbortError to LLMError; this
  // catch only fires if an adapter forgets. Map to timeout-kind here so
  // the caller's contract is preserved.
  if ((e as Error)?.name === 'AbortError' || ac.signal.aborted) {
    res = { ok: false, error: { kind: 'timeout' } };
  } else {
    throw e;  // unrelated throw → bubble to outer catch
  }
} finally {
  clearTimeout(timer);
}
```

This is the single most important change. The surrounding audit-row write logic is unchanged.

### 5.7 `tests/p20-c20-abort.spec.ts` (NEW, ~80 LOC, 1 case + 1 leak-assertion)

```ts
test('C20 — auditedComplete aborts adapter on 30s timeout (no request leak)', async ({ page }) => {
  // Install a custom adapter via window.__intelligenceStore that:
  //  - accepts req.signal
  //  - resolves AFTER 60s (longer than CALL_TIMEOUT_MS)
  //  - records whether signal.aborted became true
  // Submit a chat message.
  // Assert (within 35s) that:
  //  1. ChatInput surfaces the timeout-kind error copy
  //  2. The adapter's recorded signal.aborted === true
  //  3. The adapter's recorded "completed-at" timestamp is past test-window
  //     (proves the abort fired BEFORE the adapter naturally resolved)
});
```

The test exposes adapter internals via a `window.__c20TestAdapter` setter (DEV-only — already a pattern in p18-step1.spec.ts and p19-fix-mapchaterror.spec.ts).

## 6. Replan Triggers

| Trigger | Replan |
|---|---|
| Gemini SDK release adds native `signal` support during P20 | Drop the race-against-abort workaround (§5.3); use SDK option directly |
| Adapter classifyError fails to map AbortError → timeout | Add explicit AbortError branch in `adapterUtils.ts` `classifyError` |
| Existing test fails because fixture/simulated adapter throws on `signal.aborted` check | Adjust §5.5 to skip the check when `req.signal === undefined` (already conditional but verify) |
| `tests/p20-c20-abort.spec.ts` flakes due to setTimeout precision | Increase test budget from 35s to 40s; verify in CI |

## 7. Verification (definition-of-done for C20)

- [ ] `LLMRequest.signal?: AbortSignal` field added
- [ ] All 6 adapters accept and forward / acknowledge signal
- [ ] `auditedComplete` uses AbortController + abort() at 30s (no Promise.race timeout)
- [ ] `tests/p20-c20-abort.spec.ts` passes in chromium
- [ ] All P18 + P18b + P19 + P19-fix targeted tests still green (46+1 = 47/47)
- [ ] `npm run build` green; `tsc --noEmit` exit 0
- [ ] Bundle delta ≤ +1 KB gzip

## 8. Cross-references

- **R3 brutal review** §"Architectural future-work" item 1 (request leak)
- **R4 brutal review** §"Async/concurrency risks" item 1 (Promise.race leak)
- **STATE.md §3 Carried forward from P17** ("30s timeout in auditedComplete uses Promise.race but doesn't actually AbortSignal the underlying SDK request — request leaks. Real concern for Step 4 onward.")
- **05-fix-pass-plan.md** §5 C20

## 9. Schedule

C20 lands on **P20 Day 1** alongside cost-cap wiring (`02-fix-decomposition.md` §A). Pairs cleanly because:
- Cost-cap requires a new ADR (049) + same `auditedComplete` file edit
- Both are tested by the same `tests/p20-cost-cap.spec.ts` (cost-cap) + `tests/p20-c20-abort.spec.ts` (abort) sibling pair
- Day-1 is "infrastructure hardening before feature work" — fits the GOAP plan above

---

**Action plan locked.** Day-1 developer agent runs through Plan §4 in order, ticks Plan §7 verification, opens commit `P20 Day 1: cost-cap wiring + ADR-049 + C20 AbortSignal plumb-through`.

**Next file:** `../checklist.md` (the tickable 28-item P20 DoD)
