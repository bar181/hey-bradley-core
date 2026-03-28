# Level 6: Voice Mode — Retrospective & Test Plan

## Playwright Test Plan

> **Note on voice testing:** Automated voice testing requires mock STT responses since Playwright cannot produce real microphone input. All tests intercept the Web Speech API SpeechRecognition interface and inject synthetic transcript events. For CI, a mock STT service replaces the browser API entirely. Live microphone tests are manual-only.

### Phase 6.1 — Microphone Button

#### Test: Microphone button renders and toggles
```
- Navigate to builder with chat panel visible
- Verify microphone button is present in chat input area
- Click microphone button
- Verify button enters "recording" state (red pulse animation class applied)
- Click microphone button again
- Verify button returns to "idle" state
```

#### Test: Real-time transcript population (mocked STT)
```
- Mock SpeechRecognition to emit interim results: "change", "change the", "change the hero"
- Click microphone button to start recording
- Verify chat input field updates in real-time with interim transcript
- Mock final result: "change the hero headline"
- Click microphone button to stop
- Verify chat input contains final transcript "change the hero headline"
- Verify message is sent to chat (appears in chat history)
```

#### Test: Browser permission handling
```
- Mock navigator.mediaDevices.getUserMedia to reject with NotAllowedError
- Click microphone button
- Verify user-friendly error message appears (not raw browser error)
- Verify message explains how to grant microphone permission
- Verify mic button returns to idle state
```

#### Test: Unsupported browser fallback
```
- Mock window.SpeechRecognition and window.webkitSpeechRecognition as undefined
- Navigate to builder
- Click microphone button
- Verify fallback message appears ("Voice input not supported in this browser")
- Verify chat input remains functional for text input
```

### Phase 6.2 — Listen Mode (Task Queue)

#### Test: Listen mode activation and continuous STT
```
- Verify Listen mode toggle is present (distinct from single-shot mic)
- Enable Listen mode toggle
- Verify UI enters Listen mode state (dark background #0a0a0f if applicable)
- Verify continuous STT starts (SpeechRecognition.continuous = true)
- Mock speech events over 15+ seconds
- Verify speech is accumulated (not sent as individual messages)
```

#### Test: 15-second interval task list generation
```
- Enable Listen mode
- Mock STT to emit: "make the hero dark and add a testimonial from John"
- Wait for 15-second interval to trigger
- Verify LLM is called with accumulated speech buffer
- Verify task list appears with 2 tasks:
  1. "Change hero section to dark theme"
  2. "Add testimonial from John"
- Verify each task has approve/reject controls
```

#### Test: Task approval and patch application
```
- Enable Listen mode and trigger task list generation (mocked)
- Verify task list with 2 tasks appears
- Approve task 1, reject task 2
- Verify LLM is called to generate patch for task 1 only
- Verify configStore updates with task 1 changes
- Verify task 2 changes are not applied
- Verify Workflow tab shows pipeline: speech > classification > approval > patch > applied
```

#### Test: Red orb state reflects processing
```
- Enable Listen mode
- Verify orb pulse is slow (idle/listening state)
- Trigger 15-second interval processing
- Verify orb pulse speeds up during LLM processing
- Verify orb returns to slow pulse after processing completes
```

#### Test: Pipeline visibility in Workflow tab
```
- Enable Listen mode
- Trigger a full pipeline cycle (speech > tasks > approval > patches)
- Switch to Workflow tab
- Verify pipeline stages are visible with timing for each step
- Verify current stage is highlighted
- Verify completed stages show checkmarks
```

### Phase 6.3 — Virtual Whiteboard

#### Test: Auto-apply toggle and safety confirmation
```
- Enable Listen mode
- Verify auto-apply toggle is visible
- Click auto-apply toggle
- Verify confirmation dialog appears ("Changes will apply without review")
- Confirm
- Verify auto-apply mode is active
```

#### Test: Auto-applied changes without approval gate
```
- Enable Listen mode with auto-apply on
- Mock STT: "change hero headline to Hello World"
- Wait for 15-second interval
- Verify no approval UI appears
- Verify hero headline updates to "Hello World" automatically
- Verify visual highlight/flash appears on hero section
```

#### Test: Undo for auto-applied batches
```
- Enable auto-apply mode
- Mock 3 intervals of speech, each producing changes
- Verify 3 batches of changes are applied
- Click undo
- Verify last batch is reverted (configStore snapshot restored)
- Click undo again
- Verify second batch is reverted
- Verify first batch changes remain
```

#### Test: Session stability over extended use
```
- Enable auto-apply mode
- Mock continuous STT events over simulated 10-minute session
  (accelerated: 40 intervals of 15 seconds each)
- Verify no memory leak (monitor heap size via performance API)
- Verify all intervals processed without errors
- Verify final configStore state is consistent
- Verify undo history is capped (not unbounded growth)
```

#### Test: Rate limiting prevents excessive LLM calls
```
- Enable auto-apply mode
- Mock rapid-fire STT events (simulating very fast speech)
- Verify LLM calls are rate-limited (max N per minute)
- Verify queued intervals are processed in order
- Verify no dropped intervals (all speech eventually processed)
```

---

## Retrospective

### What Went Well
_(To be filled after Level 6 completion)_

### What Could Be Improved
_(To be filled after Level 6 completion)_

### Key Decisions Made
_(To be filled after Level 6 completion)_

### Lessons Learned
_(To be filled after Level 6 completion)_

### Action Items for Future Levels
_(To be filled after Level 6 completion)_
