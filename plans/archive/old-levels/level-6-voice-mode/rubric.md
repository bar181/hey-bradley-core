# Level 6: Voice Mode — Rubric

> Scoring criteria for evaluating Level 6 implementation quality.

## Scoring Scale
| Score | Meaning |
|-------|---------|
| 0 | Not implemented |
| 1 | Partially implemented, major gaps |
| 2 | Implemented with minor issues |
| 3 | Fully implemented, meets all criteria |

---

## Phase 6.1 — Microphone Button

| # | Requirement | Score (0-3) | Notes |
|---|-------------|-------------|-------|
| 6.1.1 | Microphone button visible in chat input area | | |
| 6.1.2 | Recording state indicated visually (red pulse on mic icon) | | |
| 6.1.3 | Real-time transcript populates chat input as user speaks | | |
| 6.1.4 | Browser microphone permission handled gracefully (explanation + prompt) | | |
| 6.1.5 | Fallback message shown for unsupported browsers | | |
| 6.1.6 | Click to start, click again to stop recording | | |
| 6.1.7 | Transcript sent as chat message on recording stop | | |
| 6.1.8 | Works on Chrome, Edge, and Safari (desktop and mobile) | | |

**Phase 6.1 Total:** __ / 24

---

## Phase 6.2 — Listen Mode (Task Queue)

| # | Requirement | Score (0-3) | Notes |
|---|-------------|-------------|-------|
| 6.2.1 | Listen mode toggle activates continuous STT | | |
| 6.2.2 | Speech accumulated over ~15-second intervals | | |
| 6.2.3 | LLM translates accumulated speech into structured task list | | |
| 6.2.4 | Approval UI allows approve, edit, or reject per task | | |
| 6.2.5 | Approved tasks batch-processed into JSON patches | | |
| 6.2.6 | Patches applied to configStore and preview updates | | |
| 6.2.7 | Workflow tab shows real-time pipeline progress | | |
| 6.2.8 | Red orb pulse speed reflects processing state | | |
| 6.2.9 | Pipeline visible end-to-end (speech > tasks > approval > patches) | | |
| 6.2.10 | Stable performance over 5+ minutes of continuous listening | | |

**Phase 6.2 Total:** __ / 30

---

## Phase 6.3 — Virtual Whiteboard

| # | Requirement | Score (0-3) | Notes |
|---|-------------|-------------|-------|
| 6.3.1 | Auto-apply toggle available within Listen mode | | |
| 6.3.2 | No approval step — tasks auto-execute after LLM processing | | |
| 6.3.3 | Site updates visible every ~15 seconds as user talks | | |
| 6.3.4 | Undo available for auto-applied change batches | | |
| 6.3.5 | Visual feedback highlights recently changed sections | | |
| 6.3.6 | Session stable over 10+ minutes of continuous use | | |
| 6.3.7 | Rate limiting prevents excessive LLM calls | | |
| 6.3.8 | "Wow factor" — the site visibly builds itself as user talks | | |

**Phase 6.3 Total:** __ / 24

---

## Overall Metrics

| Metric | Target | Actual |
|--------|--------|--------|
| Phase 6.1 Score | >= 20 / 24 | |
| Phase 6.2 Score | >= 25 / 30 | |
| Phase 6.3 Score | >= 20 / 24 | |
| **Combined Score** | **>= 65 / 78** | |
| STT transcript accuracy (clear speech) | >= 90% | |
| Listen mode pipeline latency (speech to patch) | < 20s | |
| Session stability (continuous use) | >= 10 min | |
| Task list generation accuracy | >= 85% | |
| Auto-apply undo reliability | 100% | |
| Browser compatibility (mic button) | Chrome, Edge, Safari | |
| Memory usage growth over 10 min session | < 50MB | |
