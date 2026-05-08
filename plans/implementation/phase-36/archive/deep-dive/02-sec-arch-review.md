# P36 Deep-Dive Review — Security + Architecture

**Reviewer:** lean combined sec/arch pass
**Scope:** ListenTab review-first UX + cross-surface AISP unification (ADR-065)
**Files reviewed:** ListenTab.tsx (875 LOC), ListenReviewCard.tsx, ListenClarificationCard.tsx, listenActionPreview.ts, uiStore.ts, ADR-065
**Verdict:** SHIP-WITH-FOLLOWUPS

---

## MUST FIX (blocking)

None. The review-first gate is well-implemented, React auto-escaping holds, and the cost-cap path
through `submitChatPipeline` is preserved (no bypass introduced — voice goes through the same
audited entry point as text). No fresh injection vectors created by P36 itself.

---

## SHOULD FIX (next phase)

### S1 — `pendingChatPrefill` is a globally-writable string with no source attribution
`uiStore.setPendingChatPrefill` accepts arbitrary strings from any caller. Any code path (or a
malicious browser extension that can `useUIStore.getState().setPendingChatPrefill(...)` against
the exposed zustand store) can stuff arbitrary text into ChatInput. Mitigation today is React
auto-escaping inside the input, BUT the value is later submitted through `submitChatPipeline` →
LLM, which is a prompt-injection vector. Recommend (a) typed envelope `{source: 'listen-edit',
text, ts}` with consumer rejection on staleness/missing source, or (b) replace with a one-shot
React context provider scoped to the shell. Not a P36 regression — but P36 introduced the field.

### S2 — Voice transcripts skip `redactKeyShapes` before chat persistence
`appendListenTranscript({session_id, text})` writes the raw transcript to `listen_transcripts`.
If a user dictates "my key is sk-ant-api03-..." (unlikely on voice, but a Grandma-tier scenario),
the BYOK leak guard from P34 is NOT applied at the listen-write site. ChatInput presumably runs
redaction; the listen path needs the same guard before `appendListenTranscript`. Cheap fix —
add `redactKeyShapes(text)` at line 166.

### S3 — ListenTab is now 875 LOC; C04-deferred threshold breached
Was ~600 pre-P36. P36 added ~150 LOC across 5 new useCallbacks. The C04 split flagged since P19
is no longer "approaching" — it's past the 500-line cap in CLAUDE.md ("Keep files under 500 lines").
Recommend P37 extracts the entire PTT pipeline (`runListenPipeline`, `submitListenFinal`,
`handleListenApprove/Edit/Cancel/ClarificationAccept`) into `useListenPipeline()` hook in
`./listen/useListenPipeline.ts`. Demo+orb stays in ListenTab; pipeline becomes testable in isolation.

### S4 — `pendingChatPrefill` couples Listen → Chat through a global field for a 1:1 message
ADR-065 §A3 calls this "soft hand-off". Architecturally it's a global-singleton anti-pattern for
what is a directed point-to-point message. Two consumers in different render trees would race on
`consumePendingChatPrefill`. Single-shot semantics work today because there is exactly one
ChatInput. If the Builder sprout introduces a second composer, this breaks silently. Either
formalize as event emitter (`emit('listen.editHandoff', text)`) or scope under a context provider.

### S5 — EXPERT pipeline trace pane (P35) does NOT cover the Listen surface
The 5-atom trace pane lives in shell/AISPSurface and is rendered by the chat pipeline result.
Voice runs through the same `submitChatPipeline` so the atoms ARE produced — but the render is
chat-bound. ADR-065 claims "voice + text now share **every** AISP UX surface" — incorrect for
the trace pane. P37 either (a) ports the trace pane render to ListenTab's reply banner or
(b) docs the gap explicitly. Currently the claim is overstated.

---

## Acknowledgments (good calls)

### G1 — Review gate uses rule-based classifier, NOT an LLM call
`buildActionPreview` runs `classifyIntent` only — <1ms, $0, never burns tokens to render the
preview. Means the +1-click cost is purely UX latency, not financial. Correct architecture for
a confirmation gate; many vendors get this wrong by calling an LLM to summarize what they're
about to ask the LLM.

### G2 — `recordAcceptedAssumption` correctly receives the voice transcript as `originalText`
Line 232-237: the BYOK leak guard from P34 (which lives inside `recordAcceptedAssumption`, per
ADR-063) applies to the voice path identically to the chat path. No special-casing needed; the
shared function shape pulled the protection through automatically. This is what good code reuse
looks like.

### G3 — `submitChatPipeline` is the single entry point; cost-cap inheritance is automatic
Voice cannot bypass cost caps because it does not have its own pipeline; it reuses the chat one.
P19's original architectural call to share `submit()` across surfaces paid off again here. The
audited-complete path (whatever the chat pipeline enforces) applies to voice for free.

### G4 — React auto-escaping is the only XSS line; transcript flows as JSX text children
`ListenReviewCard` renders `{transcript}` and `{actionPreview}` as text children — confirmed
safe under React's default JSX escaping. No `dangerouslySetInnerHTML`, no `innerHTML` writes,
no template-string-into-DOM patterns. ListenClarificationCard same. Quote-wrapping (`"{transcript}"`)
is presentational only and does not break the escape.

### G5 — Review-first UX is the right answer to ASR's silent-error problem
ADR-065 §"Why review-first on voice but not text" articulates this correctly. ASR
mis-transcriptions are silent + irreversible; a review gate is mandatory for honest voice UX.
The "+1 click" trade-off is correctly assessed — voice users tolerate confirmation (Siri pattern).
This is NOT a P19 hands-free regression because P19's hands-free promise covered capture, not
mutation; mutating voice commands ALWAYS warranted a confirmation step.

---

## Score

**Sec/Arch composite: 87/100**

- Security: **92/100** — no new vectors introduced; existing guards (cost-cap, redaction, BYOK)
  inherit correctly via `submitChatPipeline` reuse. -8 for S1 (prefill envelope) + S2 (redact at
  listen-write).
- Architecture: **82/100** — review-first design is excellent (G1, G5) but ListenTab is now 875
  LOC against a 500-cap (S3), prefill is a global where it should be a directed message (S4),
  and ADR-065's "every AISP surface" claim overstates trace-pane coverage (S5). The Sprint F
  approach is right; the implementation took on debt that needs P37 follow-through.

**Recommend:** SEAL P36, defer S1-S5 to P37 preflight as "Sprint F P2 carryforward". S3
(ListenTab split) should not slip past P37 — file size cap is a CLAUDE.md hard rule and we are
75% over.
