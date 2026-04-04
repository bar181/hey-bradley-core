# Level 6: Voice Mode — Implementation Plan

## Prerequisites
- Level 5 complete (LLM chat working, section inference working)

---

## Phase 6.1 — Microphone Button

**Goal:** Web Speech API STT. Click to record, transcript populates chat input in real-time.

**Definition of Done:**
- Microphone button visible in chat input area
- Clicking starts Web Speech API recording (SpeechRecognition)
- Visual indicator shows recording state (red pulse on mic icon)
- Transcript populates chat input field in real-time (interim results)
- Clicking again stops recording
- Transcript sent as chat message on stop
- Browser permission prompt handled gracefully (explanation before prompt)
- Fallback message for unsupported browsers (Safari < 14.1, Firefox without flag)

**Research Requirements:**
- Web Speech API (SpeechRecognition) browser compatibility matrix
- Whisper API as fallback for unsupported browsers (cost implications)
- Microphone permission UX best practices (explain before prompting)
- Real-time transcript display patterns (interim vs final results)
- Mobile browser support considerations

**Deliverables:**
- Microphone button component — toggle mic on/off with visual state
- Web Speech API integration — SpeechRecognition setup, event handling
- Recording state UI — red pulse animation on mic icon, waveform optional
- Real-time transcript — interim results populate chat input as user speaks
- Permission handling — pre-prompt explanation, error state for denied permission
- Browser fallback — detection + graceful degradation message

---

## Phase 6.2 — Listen Mode (Task Queue)

**Goal:** Continuous listening. Every ~15 seconds, LLM translates accumulated speech into a task list. User approves tasks. LLM generates patches for approved tasks.

**Definition of Done:**
- Listen mode toggle activates continuous STT (distinct from single-shot mic)
- Speech accumulated over ~15-second intervals
- LLM Call 1: translates accumulated speech into structured task list
- Task list presented to user for approval (approve all, approve individually, reject)
- User can modify task descriptions before approval
- LLM Call 2: approved tasks converted to JSON patches
- Patches applied to configStore sequentially
- Workflow tab shows real-time pipeline progress
- Red orb pulse speed reflects processing state (slow = idle, fast = processing)

**Research Requirements:**
- Continuous speech recognition patterns (handling interim vs final results over long sessions)
- Task queue design for batched LLM processing (accumulate, batch, process)
- Approval UX patterns (inline task list vs modal vs sidebar panel)
- Speech-to-intent batching strategies (combining related utterances)
- Memory management for continuous STT (preventing memory leaks)
- Red orb animation states mapping to pipeline stages

**Deliverables:**
- Continuous STT service — manages long-running SpeechRecognition sessions
- 15-second interval processing — accumulates speech, triggers LLM on interval
- Task list generation — LLM parses speech buffer into discrete tasks
- Approval UI — task list with approve/edit/reject per item and bulk actions
- Batch patch generation — converts approved tasks to JSON patches
- Workflow tab integration — real-time pipeline visualization
- Orb state management — pulse speed tied to Listen mode processing state

---

## Phase 6.3 — Virtual Whiteboard

**Goal:** Auto-apply mode. No approval gate. Site updates every ~15 seconds as user talks. "The site builds itself as you talk."

**Definition of Done:**
- Auto-apply toggle within Listen mode (off by default, requires explicit enable)
- No approval step — tasks auto-execute after LLM processing
- Site updates visible every ~15 seconds as user talks
- Undo available for auto-applied changes (batch undo per 15s interval)
- "The site builds itself as you talk" experience achieved
- Visual feedback shows what changed (highlight/flash on updated sections)
- Performance stable over extended sessions (10+ minutes continuous use)

**Research Requirements:**
- Undo strategy for auto-applied batches (store snapshots per interval)
- Visual diff/highlight for recently changed sections (CSS transition + overlay)
- Memory management for long listening sessions (GC, buffer limits)
- Rate limiting for continuous LLM calls (max calls per minute, queue overflow)
- User safety — confirmation before enabling auto-apply ("changes apply without review")

**Deliverables:**
- Auto-apply mode toggle — within Listen mode panel, with safety confirmation
- Continuous processing pipeline — speech to tasks to patches without approval gate
- Visual change indicators — sections flash/highlight when auto-updated
- Undo for auto-batches — revert last N intervals, stored as configStore snapshots
- Session stability — memory monitoring, buffer cleanup, graceful degradation
- Rate limiting — max LLM calls per minute, queue management for burst speech
