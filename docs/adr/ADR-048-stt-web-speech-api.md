# ADR-048: STT for Listen Mode — Web Speech API, Push-to-Talk Only

**Status:** Accepted
**Date:** 2026-04-27
**Deciders:** Bradley Ross + claude-flow swarm
**Phase:** 19

---

## Context

Phase 18 + 18b shipped the chat pipeline (system prompt → adapter → JSON-patch envelope → atomic apply). Phase 19 turns on Listen mode, which is functionally the same pipeline with one additional input source: a microphone. The chat side is finished; the only new question is **how do we turn speech into text** without re-opening the no-backend constraint (ADR-029).

Three options were on the table:

1. **Browser-native `SpeechRecognition` API** (Web Speech) — zero bundle cost, ships in Chrome / Edge / Safari out of the box.
2. **Whisper compiled to WASM** — runs entirely in-browser, model size 200+ MB per visitor, multi-second cold start, hostile to a "thinking on your feet" demo UX.
3. **Server-side Whisper** — requires a Supabase Edge Function or similar; violates the frontend-only constraint and re-opens BYOK trust boundaries (ADR-043).

---

## Decision

Use the browser-native `SpeechRecognition` / `webkitSpeechRecognition` API behind a thin adapter, with a **push-to-talk** interaction model:

- Hold the Listen button > 250 ms to start the recognizer.
- Release to stop.
- Auto-stop at 12 s as a hard ceiling (prevents runaway sessions on stuck UIs).
- **No** wake word, **no** continuous listening, **no** voice activity detection (VAD).

The resulting transcript is handed to the existing `chatPipeline` — Listen does not get its own LLM path. Voice and text both produce a Crystal-Atom-shaped patch envelope (ADR-044) and write the same `llm_calls` + `llm_logs` rows (ADR-047).

### Why NOT Whisper

- **WASM build:** 200+ MB model download per visitor, multi-second initialization, dominates Time-to-Interactive. Every demo visitor would pay this even if they never speak.
- **Server-side:** violates ADR-029's frontend-only constraint; would force us to operate (and pay for) inference on behalf of every visitor, which then re-opens ADR-043's BYOK trust model.

### Why push-to-talk

- **Privacy:** the mic is hot only while the user is physically holding the button — no always-on listening.
- **Mental model:** matches Slack huddles, Discord PTT, and walkie-talkies; users do not need to be taught.
- **Eliminates VAD / hotword detection:** no need for end-of-utterance heuristics, no need for "Hey Bradley…" wake-word DSP, no false-trigger UX.

### Trade-offs

- **Browser support:** Chrome / Edge / Safari ship the API; Firefox requires a flag. Unsupported browsers land on `NullSTTAdapter`, which renders an explanatory banner and keeps the chat input as the working fallback.
- **Vendor-controlled model:** Google's recognizer drives Chrome/Edge; Apple's drives Safari. Accuracy varies by language, accent, and microphone quality. We accept this — the alternative is shipping a 200 MB model per visitor.
- **Network required:** vendor recognizers send audio to vendor servers. Air-gapped environments degrade gracefully via `NullSTTAdapter`.
- **Privacy disclosure:** audio is sent to the user's browser vendor (Google for Chrome, Apple for Safari) for transcription. The Hey Bradley project never sees raw audio bytes — only the final text transcript. This will be documented in `SECURITY.md` (deferred to P20).

---

## Implementation pointer

- `src/contexts/intelligence/stt/sttAdapter.ts` — interface (parallel to `LLMAdapter`)
- `src/contexts/intelligence/stt/webSpeechAdapter.ts` — Web Speech wrapper
- `src/contexts/intelligence/stt/nullSTTAdapter.ts` — unsupported-browser stub + banner copy
- `src/contexts/intelligence/stt/factory.ts` — `createSTTAdapter()` selection (feature-detect → web | null)
- `src/store/listenStore.ts` — Zustand store (PTT state, transcript, error)
- `src/components/left-panel/ListenTab.tsx` — PTT button UI + transcript display
- `src/contexts/intelligence/chatPipeline.ts` — voice transcript routes through the same pipeline as text chat (P18 architecture preserved; one path, two input sources)

---

## Privacy & trust

- Audio stream **never** hits Hey Bradley servers — there are no Hey Bradley servers (ADR-029).
- Audio is sent to the user's browser vendor for transcription. The vendor's privacy policy applies to the audio bytes; we do not see them.
- Final transcripts are persisted to `listen_transcripts` (P16 schema) only after a successful pipeline submit, not on every interim result.
- `listen_transcripts` is included in `.heybradley` zip exports **by default** — it is user-authored content, not a secret. If listen content is sensitive, the user can clear it via the existing **Settings → Clear Local Data** flow (same path that wipes chat history).
- `error_text` on any STT failure follows the same `redactKeyShapes` discipline as ADR-043 — defense in depth, even though no key shapes should appear in a transcript.

---

## Alternatives considered

- **Whisper-WASM in-browser.** Rejected. Model size (200+ MB), cold-start latency, and the per-visitor bandwidth cost dominate any accuracy upside. The WASM ecosystem will mature; revisit post-MVP.
- **Server-side Whisper (Supabase Edge Function or similar).** Rejected. Re-opens the no-backend constraint (ADR-029) and the BYOK trust boundary (ADR-043).
- **Continuous listening with VAD.** Deferred. Requires UX research on false-trigger tolerance, end-of-utterance heuristics, and an always-on mic indicator that meets users' privacy expectations.
- **Wake word ("Hey Bradley…").** Deferred. Adds DSP latency, an always-on audio path, and a privacy story the MVP charter does not need. Revisit when continuous listening is on the table.

---

## Status

Accepted.

---

## Related ADRs

- ADR-029: Pre-LLM MVP Architecture — frontend-only constraint that rules out server-side STT
- ADR-040: Local SQLite Persistence — `listen_transcripts` is persisted via the existing repo, not a new table
- ADR-044: JSON Patch Contract — voice transcripts produce the same patch envelope as text chat
- ADR-046: Multi-Provider LLM Architecture — Listen reuses whichever adapter is currently active; no STT-specific routing
- ADR-047: LLM Logging & Observability — voice-originated calls write the same `llm_logs` rows as text-originated calls

---

## Reference

- Web Speech API spec (W3C): https://wicg.github.io/speech-api/
- MDN: `SpeechRecognition` — https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition
