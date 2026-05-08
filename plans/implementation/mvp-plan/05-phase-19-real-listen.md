# Phase 19 — Real Listen Mode (Web Speech API → Same Chat Pipeline)

> **Stage:** C — Real LLM
> **Estimated effort:** 4–6 days
> **Prerequisite:** Phase 18 closed (real chat operational with patch apply + fallback).
> **Successor:** Phase 20 — MVP Close.

---

## North Star

> **A novice presses and holds the Talk button, says one sentence, and the site changes — using the exact same LLM pipeline as chat.**

---

## 1. Specification (S)

### 1.1 What changes

1. Replace the canned listen demo with a **push-to-talk** (PTT) button that drives `webkitSpeechRecognition` / `SpeechRecognition`.
2. The interim and final transcripts display under the orb (existing `Typewriter` component).
3. On final transcript → call the **exact same chat pipeline** from Phase 18 (`applyPatches`, fallback, etc.).
4. Persist final transcripts in `listen_transcripts` (already in P16).
5. If Web Speech is unavailable (Firefox/Safari without flags), show a banner: *"Voice not supported in this browser"* and hide the Talk button. The canned listen demo remains accessible.

### 1.2 What does **not** change

- The orb visuals (`RedOrb`).
- The chat pipeline.
- The store contracts.
- DRAFT/EXPERT/BUILD/LISTEN composition.

### 1.3 Novice impact

- Listen mode now actually listens on supported browsers.
- Push-to-talk avoids accidental capture; novices report comfort with this pattern.

### 1.4 Why not Whisper?

- Whisper requires either a server (violates frontend-only) or a 200+ MB browser model (violates KISS).
- Web Speech API works on Chrome / Edge / Safari (with permissions). That covers the great majority of MVP users.
- Whisper is documented as a post-MVP upgrade behind the same `STTAdapter` interface introduced here.

---

## 2. Pseudocode (P)

```
initListen():
  if !window.SpeechRecognition && !window.webkitSpeechRecognition:
    listenStore.set({ supported: false })
    return
  rec = new SpeechRecognition()
  rec.continuous = false
  rec.interimResults = true
  rec.lang = 'en-US'
  rec.onresult = e => {
    interim = ''
    final = ''
    for r in e.results:
      if r.isFinal: final += r[0].transcript
      else interim += r[0].transcript
    listenStore.set({ interim, final })
  }
  rec.onerror = err => listenStore.set({ error: classify(err) })
  rec.onend = () => listenStore.set({ recording: false })

onTalkButtonDown():
  rec.start(); listenStore.set({ recording: true, error: null })

onTalkButtonUp():
  rec.stop()
  // wait briefly for final transcript
  await waitForFinal(800ms) → text
  if text.trim().length === 0: return
  appendTranscript(text)
  // SAME chat pipeline as Phase 18:
  await chatPipeline.submit(text)
```

---

## 3. Architecture (A)

### 3.1 DDD context

`Intelligence` extended with an STT adapter. The mutation path is unchanged from Phase 18.

### 3.2 Files touched / created

| Action | Path | Purpose |
|---|---|---|
| CREATE | `src/contexts/intelligence/stt/sttAdapter.ts` | Interface |
| CREATE | `src/contexts/intelligence/stt/webSpeechAdapter.ts` | Default |
| CREATE | `src/contexts/intelligence/stt/index.ts` | Factory; null-adapter when unsupported |
| CREATE | `src/store/listenStore.ts` | `{ supported, recording, interim, final, error }` |
| EDIT | `src/components/left-panel/ListenTab.tsx` | Wire PTT to the adapter; keep canned demo as a separate "Demo" toggle |
| EDIT | `src/components/listen-mode/RedOrb.tsx` | Drive scale/blur from amplitude when supported (best-effort) |
| EDIT | `src/components/listen-mode/Typewriter.tsx` | Render `interim` + `final` |
| CREATE | `src/contexts/intelligence/chatPipeline.ts` | Extracted from Phase 18 wiring; shared by chat and listen |
| CREATE | `docs/adr/ADR-046-stt-web-speech.md` | Decision record |
| CREATE | `tests/listen-fallback.spec.ts` | Stubs `SpeechRecognition`; asserts pipeline |
| EDIT | `package.json` | (no new deps required) |

### 3.3 ADR to author

#### ADR-046 — Web Speech API for STT (push-to-talk MVP)

- **Decision:** Use the browser-native Web Speech API for MVP; push-to-talk model; no continuous listening, no wake word.
- **Rationale:** Zero-dependency, free, sufficient quality for short commands. Whisper-grade STT is post-MVP.
- **Trade-offs:** Inconsistent cross-browser support; no offline mode; vendor-controlled model. Acceptable for MVP since chat fallback covers any voice failure.
- **Status:** Accepted.

### 3.4 STTAdapter shape

```ts
// src/contexts/intelligence/stt/sttAdapter.ts
export interface STTAdapter {
  supported: boolean;
  start(): void;
  stop(): Promise<string>;          // resolves to final transcript
  onInterim(cb: (text: string) => void): () => void;
  onError(cb: (e: STTError) => void): () => void;
}
```

Two implementations:

- `WebSpeechAdapter` — wraps `SpeechRecognition`; `stop()` resolves on `onend` after a short grace.
- `NullSTTAdapter` — `supported: false`; methods no-op; `stop()` resolves with empty string.

### 3.5 Shared chat pipeline (extracted in this phase)

```ts
// src/contexts/intelligence/chatPipeline.ts
export async function submit(text: string, opts: { source: 'chat'|'listen' }) {
  appendUserMessage(text);
  const adapter = useIntelligenceStore.getState().adapter;
  const sys = buildSystemPrompt({ json: configStore.getState().json });
  const r = await adapter.complete({ systemPrompt: sys, userPrompt: text, schema: PatchEnvelopeSchema });
  if (!r.ok) return fallback(text, opts.source);
  const env = PatchEnvelopeSchema.safeParse(r.json);
  if (!env.success) return fallback(text, opts.source);
  const errs = validatePatches(env.data.patches, configStore.getState().json);
  if (errs.length) return fallback(text, opts.source);
  configStore.getState().applyPatches(env.data.patches);
  appendBradleyMessage(env.data.summary ?? defaultSummary(env.data.patches));
  audit(r, env.data.patches, opts.source);
}
```

Both `ChatInput.tsx` and `ListenTab.tsx` call this single function.

### 3.6 Orb amplitude (best-effort)

Web Speech does not expose amplitude. We approximate by sampling `getUserMedia` audio in parallel during recording (a tiny `AudioContext` analyzer, ~50 LOC). If `getUserMedia` is denied, fall back to a steady pulse — orb still animates, just not amplitude-linked. This is *intentionally minimal*; do not rebuild the orb.

### 3.7 PTT UX rules

- Button label: **Talk** (DRAFT) / **Push to Talk** (EXPERT).
- Hold ≥ 250 ms before recording starts; tap = no-op (avoids accidental triggers).
- Visual: orb scales with amplitude; transcript shows live interim text.
- On release: 800 ms grace window for final transcript before submitting.
- Max recording: 12 s; auto-stop with banner "I caught: '…' — submitting" if user holds longer.
- Disabled while a previous request is in flight.

---

## 4. Refinement (R)

### 4.1 Checkpoints

- **A — STT online.** Hold Talk, speak, release → final transcript appears in the typewriter.
- **B — Pipeline integration.** Same utterance produces a JSON patch via the Phase 18 pipeline; preview updates.
- **C — Unsupported browser.** Listen tab shows a banner and disables Talk; canned demo reachable from a small "Watch a Demo" link.
- **D — Audio permission denied.** Friendly recovery message; Talk button stays usable for next attempt.
- **E — Empty transcript.** No-op; do not submit.
- **F — In-flight request.** Disabled state on Talk; releasing during a previous request shows "Hold on, finishing the last one…"

### 4.2 Intentionally deferred

- Wake word.
- Continuous listening.
- Voice activity detection.
- Whisper.
- Multi-language.
- Real-time streaming render (we still apply the full patch atomically).

---

## 5. Completion (C) — DoD Checklist

- [ ] `STTAdapter` interface and two implementations land
- [ ] Listen tab uses the real adapter when supported
- [ ] Falls back to a banner + canned demo otherwise
- [ ] Push-to-talk: hold to record, release to submit
- [ ] Final transcript persists to `listen_transcripts`
- [ ] Same `chatPipeline.submit()` powers chat and listen
- [ ] Orb animates (amplitude or steady pulse)
- [ ] One Playwright test stubs `SpeechRecognition` and exercises the pipeline
- [ ] Manual smoke test on Chrome + Safari documented in `phase-19/session-log.md`
- [ ] ADR-046 merged
- [ ] `npx tsc --noEmit` clean
- [ ] `npm run build` succeeds
- [ ] Test count ≥ previous + 2
- [ ] Master checklist updated

### Persona scoring targets

| Persona | Min |
|---|---|
| Grandma (DRAFT) | 72 |
| Capstone Reviewer | 84 |

---

## 6. GOAP Plan

### 6.1 Goal state

```
goal := STTSupportedDetected ∧ AdaptersReady ∧ PipelineExtracted ∧ ListenUsesPipeline
        ∧ FallbackBannerWorks ∧ TranscriptsPersisted ∧ TestsPass
```

### 6.2 Actions

| Action | Preconditions | Effects | Cost |
|---|---|---|---|
| `define_stt_interface` | repo clean | InterfaceReady | 1 |
| `impl_web_speech_adapter` | InterfaceReady | WebSpeechReady | 2 |
| `impl_null_adapter` | InterfaceReady | NullReady | 1 |
| `extract_chat_pipeline` | Phase18Closed | PipelineExtracted | 2 |
| `build_listen_store` | InterfaceReady | StoreReady | 1 |
| `wire_listen_tab_ptt` | StoreReady ∧ WebSpeechReady ∧ NullReady ∧ PipelineExtracted | ListenUsesPipeline | 3 |
| `add_amplitude_pulse` | StoreReady | OrbAnimates | 2 |
| `persist_final_transcript` | StoreReady ∧ DBReady | TranscriptsPersisted | 1 |
| `author_adr_046` | InterfaceReady | ADRMerged | 1 |
| `add_listen_test` | ListenUsesPipeline | TestsPass | 2 |
| `run_build` | TestsPass ∧ TranscriptsPersisted ∧ ADRMerged | GoalMet | 1 |

### 6.3 Optimal plan (cost = 17)

```
1. define_stt_interface
2. impl_web_speech_adapter   ┐
3. impl_null_adapter         │ parallel
4. extract_chat_pipeline     ┘
5. build_listen_store
6. wire_listen_tab_ptt
7. add_amplitude_pulse       ┐
8. persist_final_transcript  ┘ parallel
9. author_adr_046
10. add_listen_test
11. run_build
```

### 6.4 Replan triggers

- Safari permissions UI breaks PTT timing → use `permissions.query({name:'microphone'})` and pre-prompt before first hold.
- Final transcript routinely empty on short utterances → bump grace window 800 → 1200 ms.
- Concurrent chat input creates race conditions → guard `chatPipeline.submit` with a single in-flight lock at the pipeline level.

---

## 7. Risks & Mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| Browser support gaps | M | Null adapter + clear banner; canned demo accessible |
| Mic permission denied | M | Inline help link; do not block UI |
| Long recordings cost too much | L | 12 s cap; cap hits banner *before* LLM call |
| Cross-talk with chat | L | Single in-flight lock |
| Privacy concern | M | Settings copy: "Audio is not recorded; transcripts are local-only." Add a Clear Transcripts button. |

---

## 8. Hand-off to Phase 20

- Listen and chat both run through `chatPipeline.submit`.
- All five starter prompts work via voice on a supported browser.
- Phase 20 finalizes cost telemetry, exit tests, deploy, and persona review.
