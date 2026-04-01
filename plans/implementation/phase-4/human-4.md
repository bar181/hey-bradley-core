# Hey Bradley — SWARM DIRECTIVE: Left Panel 3-Tab Design + Listen/Chat UX

**Phase:** 5 (continuation — design + structural changes, not full functionality)  
**Priority:** P0  
**Scope:** Left panel restructure, right panel toggle behavior, response styling. NOT building real voice/LLM — this is the UX container for future functionality.

---

## 1. LEFT PANEL: 3 TABS

```
┌───────────────────────────────────────────┐
│  [📋 Builder]  [💬 Chat]  [🔴 Listen]    │
└───────────────────────────────────────────┘
```

### Tab Behavior

| Tab Selected | Left Panel Shows | Right Panel | Center Panel |
|-------------|-----------------|-------------|--------------|
| **Builder** | Section list + Theme row + Add Section | ON (editors visible) | Reality/Data/XAI/Workflow tabs |
| **Chat** | Conversation area + input | **OFF** (collapsed/hidden) | Reality (full width — preview expands) |
| **Listen** | Red pulsing orb + caption area | **OFF** (collapsed/hidden) | Reality (full width — preview expands) |

**When right panel is OFF:** The center canvas expands to fill the right panel's space. The user sees more of their website preview. This reinforces "AI is driving, you're watching."

**When switching back to Builder tab:** Right panel fades back in (200ms transition). Center canvas returns to normal width.

---

## 2. BUILDER TAB (No Changes)

Exactly as current. Section list, Theme row, Add Section. This is done.

---

## 3. CHAT TAB

### Design Principle: Closed Captioning, Not Chatbot

The chat is **NOT** a chatbot conversation with paragraphs of text. It's closed-captioning energy — short, punchy lines that appear and scroll. Think TV subtitles, not Slack messages.

### Layout

```
┌─────────────────────────────────────┐
│  [📋 Builder]  [💬 Chat]  [🔴 Listen]│
├─────────────────────────────────────┤
│                                     │
│  you: make this brighter            │  ← Simple label, no avatar, no timestamp
│                                     │
│  ▌ sure thing — trying              │  ← Typewriter animating, cursor blinks
│    summer colors ☀️                 │     Short. Personality. Emoji ok.
│                                     │
│  you: add testimonials              │
│                                     │
│  done — added 3 customer            │  ← No "Bradley:" label needed after first
│  quotes ✓                           │
│                                     │
│  you: headline Dream Big            │
│                                     │
│  updated ✓                          │  ← Ultra-short for simple changes
│                                     │
│                                     │
│ ▸ History (5)  ─────────────────── │  ← Accordion, collapsed by default
│                                     │
├─────────────────────────────────────┤
│ Try: "dark mode" · "add pricing"   │  ← Hint (when input empty)
├─────────────────────────────────────┤
│  Tell Bradley what to build...  ➤  │  ← Text input only. No mic button.
└─────────────────────────────────────┘
```

### Response Styling Rules

| Rule | Example | Why |
|------|---------|-----|
| **Max 2 lines per response** | "done — added 3 customer quotes ✓" | Closed captioning = scannable |
| **No "Bradley:" label** after the first welcome message | Just the text, differentiated by indent or subtle color | Less visual noise |
| **User messages lowercase "you:"** | "you: make this brighter" | Casual, not formal |
| **Personality in responses** | "sure thing ☀️", "on it", "nice choice 🎯" | Brief warmth, not verbose |
| **✓ for success, ✗ for failure** | "updated ✓" / "hmm, I didn't understand that ✗" | Instant status |
| **Ultra-short for simple ops** | "updated ✓", "done ✓", "switched ✓" | Don't over-explain |
| **Typewriter for AI only** | 30ms per character, cursor blinks | User text appears instantly |
| **No timestamps** in the main view | Timestamps only in History accordion | Keep it clean |
| **No avatars, no bubbles** | Plain text with subtle styling differences | Minimalist |

### Visual Styling

```css
/* User messages */
.chat-user {
  color: var(--text-muted);        /* Softer — the input, not the star */
  font-size: 13px;
  padding: 4px 0;
}
.chat-user::before {
  content: "you: ";
  font-weight: 600;
  color: var(--text-secondary);
}

/* AI responses */
.chat-ai {
  color: var(--text-primary);       /* Brighter — the AI is the focus */
  font-size: 14px;
  padding: 4px 0 8px 0;            /* Extra bottom padding = visual breathing */
}

/* Typewriter cursor */
.chat-cursor {
  display: inline-block;
  width: 2px;
  height: 14px;
  background: var(--accent-primary);  /* Crimson cursor */
  animation: blink 0.8s infinite;
}
```

### History Accordion

Collapsed by default. Shows count badge. When expanded:

```
▸ History (5)
  ┌────────────────────────────────────┐
  │ 10:32  dark mode ✓                 │  ← One line per action
  │ 10:33  added testimonials ✓        │     Timestamp + what changed
  │ 10:34  headline → "Dream Big" ✓    │     No user/AI distinction needed
  │ 10:35  theme → Agency ✓            │
  │ 10:40  [listen] bakery site ✓      │  ← Listen actions tagged
  └────────────────────────────────────┘
```

Each line is a single row. No expanding. No detail. Just a log. If the user wants details, they check the DATA tab (JSON diff) or the future CHANGES view.

---

## 4. LISTEN TAB

### Design Principle: The Orb IS the Interface

The red pulsing orb is the **only visual element that matters** in listen mode. Everything else is secondary. Think: a lava lamp with closed captions.

### Layout

```
┌─────────────────────────────────────┐
│  [📋 Builder]  [💬 Chat]  [🔴 Listen]│
├─────────────────────────────────────┤
│                                     │
│                                     │
│                                     │
│              ◉                      │  ← Red pulsing orb
│          (glowing)                  │     Takes 50-60% of panel height
│                                     │     3 CSS layers: core + blur + ambient
│                                     │
│                                     │
│                                     │
│  "build me a bakery site with       │  ← Caption area (bottom 20% of panel)
│   warm colors..."                   │     Closed-captioning style
│                                     │     Updates every few seconds
│                                     │
│ ▸ History (3)  ─────────────────── │  ← Same shared accordion
│                                     │
├─────────────────────────────────────┤
│       [ ● START LISTENING ]         │  ← Big button, crimson, full-width
└─────────────────────────────────────┘
```

### Orb Specifications

```
SIZE: 120px diameter (core) + 200px glow radius
POSITION: Centered horizontally, ~35% from top of panel

Three CSS layers:
  Layer 1 (core):    60px, solid #A51C30, border-radius: 50%
  Layer 2 (mid-glow): 120px, #A51C30 at 40% opacity, blur(20px)
  Layer 3 (ambient):  200px, #A51C30 at 15% opacity, blur(40px)

PULSE SPEEDS:
  Idle/waiting:    animation-duration: 3s    (slow breathe)
  User speaking:   animation-duration: 1.5s  (medium pulse)
  AI processing:   animation-duration: 0.5s  (fast pulse, brighter glow)
```

### Caption Area (Below Orb)

This is **closed captioning**, not a transcript. Key rules:

| Rule | Detail |
|------|--------|
| **Only show AI responses as captions** | Don't show the user's speech as text during listening. The user KNOWS what they said. |
| **After listening ends**, show a brief summary | "heard: bakery site with testimonials" — one line, italic, muted |
| **AI processing captions** appear as typewriter | "applying wellness theme..." → "building sections..." → "ready ✓" |
| **Max 2 lines visible at once** | Old captions fade out as new ones appear |
| **Font: italic, slightly larger** | Like TV closed captions — readable from a distance |
| **Position: bottom of the orb area** | Not at the very bottom of the panel — just below the orb's glow |

### Caption Sequence (Canned Demo)

```
[0s]   Orb slow pulse. Caption: empty.
[1s]   User clicks START LISTENING. Orb speeds up to medium.
[3s]   Orb goes back to slow. Caption (muted, italic): "heard: bakery site with warm colors"
[4s]   Orb speeds to fast. Caption (typewriter): "on it..."
[5s]   Caption (typewriter): "applying wellness theme"
[7s]   Caption (typewriter): "adding sections..."  
[9s]   JSON loads. Site appears in center preview.
[10s]  Caption: "your bakery site is ready ✓"
[11s]  Orb returns to slow pulse.
[12s]  Auto-switch to Builder tab. Right panel fades in.
```

### Listen → Builder Transition

When listen simulation completes:
1. Caption shows "ready ✓" for 2 seconds
2. Orb fades to slow pulse
3. Left panel auto-switches to Builder tab (with 300ms crossfade)
4. Right panel fades in (200ms)
5. Center canvas adjusts width back to accommodate right panel
6. User sees their new site + editing tools

---

## 5. RIGHT PANEL TOGGLE

### Implementation

```typescript
// In uiStore or panelStore
interface PanelState {
  rightPanelVisible: boolean;
  setRightPanelVisible: (visible: boolean) => void;
}

// When left panel tab changes:
const handleTabChange = (tab: 'builder' | 'chat' | 'listen') => {
  if (tab === 'builder') {
    setRightPanelVisible(true);
  } else {
    setRightPanelVisible(false);  // Chat and Listen hide right panel
  }
};
```

### CSS Transition

```css
.right-panel {
  transition: width 200ms ease, opacity 200ms ease;
}
.right-panel[data-visible="false"] {
  width: 0;
  opacity: 0;
  overflow: hidden;
}
```

The center canvas flex-grows to fill the space. No jump — smooth transition.

---

## 6. NO MIC IN CHAT TAB

**Chat is text-only.** No microphone button. Clean separation:
- Chat = type commands
- Listen = speak (when real voice is implemented)

The mic button on chat input is removed. If a user wants to speak, they switch to Listen tab. This eliminates the "what's the difference?" confusion.

---

## 7. WHAT THIS PHASE BUILDS vs DEFERS

### Phase 5 Builds (NOW):
- 3-tab left panel structure (Builder / Chat / Listen tabs)
- Right panel show/hide based on active tab
- Chat tab with conversation area + typewriter responses + history accordion
- Listen tab with orb placeholder + caption area + START LISTENING button
- Builder tab unchanged
- Canned chat commands (already working from earlier in Phase 5)

### Deferred:
- Real voice input / STT (Phase 7+)
- Real LLM responses (Phase 7+)  
- Listen simulation scripted sequence (Phase 6)
- CHANGES center tab (Phase 6 or backlog)
- Orb pulse speed responding to actual audio levels (Phase 7+)

---

## 8. VERIFICATION

| # | Check | Severity |
|---|-------|----------|
| 1 | 3 tabs visible in left panel (Builder, Chat, Listen) | P0 |
| 2 | Clicking Chat tab hides right panel, center expands | P0 |
| 3 | Clicking Listen tab hides right panel, center expands | P0 |
| 4 | Clicking Builder tab shows right panel, center contracts | P0 |
| 5 | Chat typewriter animates responses character-by-character | P0 |
| 6 | Chat responses are max 2 lines, with personality | P1 |
| 7 | History accordion shared between Chat and Listen | P1 |
| 8 | Listen tab shows red pulsing orb centered in panel | P0 |
| 9 | START LISTENING button renders at bottom of Listen tab | P0 |
| 10 | Orb has 3 CSS layers (core + blur + ambient glow) | P1 |
| 11 | No mic button on Chat input | P1 |
| 12 | Transition between tabs is smooth (200-300ms) | P2 |
| 13 | All existing tests still pass | P0 |