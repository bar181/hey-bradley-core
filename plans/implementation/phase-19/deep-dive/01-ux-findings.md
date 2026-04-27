# P19 Deep-Dive — Chunk 1: UX Brutal Review (R1)

> **Reviewer:** R1 — UX brutal-honest persona walks (Grandma + Framer + Capstone)
> **Verdict:** **66/100 composite** — P19 lowered the score by adding a third surface (Listen tab) without earning the polish budget back.
> **Source:** `/tmp/claude-0/.../tasks/a4dca112255d06612.output` (R1) + R1-followup (a875e5351d15932cd).

---

## 1. Persona Scoreboard

| Persona | Target | Pre-P19 | Post-P19 | Δ | Status |
|---|---:|---:|---:|---:|---|
| **Grandma** (70-yo, no tech background) | 70 | 70 | **58** | -12 | **FAIL** |
| **Framer designer** | 80 | 78 | **72** | -6 | FAIL by 8 |
| **Capstone reviewer** (Harvard ALM panel) | 85 | 82 | **78** | -4 | FAIL by 7 |
| **Composite** | 78 | 77 | **66** | -11 | needs fix-pass |

**Why the regression?** P19 added Listen mode behind a tab. The Listen surface is technically correct (PTT works, transcript persists, errors surface) but its UX overlap with chat creates a *third* model the user has to keep in their head: "Type vs Click vs Speak — what does each one do?" Grandma stalls on this; Framer thinks it's a gimmick; Capstone says "good demo, not yet a product."

---

## 2. Grandma persona walk (58/100 — FAIL by 12)

### Setup
- Grandma is given the live URL on a phone-on-stand setup.
- No verbal instructions beyond "this builds a website for you."
- Time-on-task budget: 5 minutes to get a recognizable site.

### Step-by-step

**T+0:00 — Lands on Welcome page.**
- ✅ Hero copy is plain-English: "Tell Bradley what you want; he builds it."
- ❌ "Choose a starter" carousel scrolls horizontally on phone. Grandma swipes vertically and misses 4 of 5 starters. **Fix: vertical-list fallback on viewport <600px.**
- ✅ "Skip and start fresh" CTA is visible.

**T+0:30 — Picks a starter (cooking blog).**
- ✅ Onboarding loads cleanly.
- ❌ DRAFT mode shows the LEFT panel with a 3-tab strip (Chat / Listen / Spec). The Listen tab has a microphone icon. Grandma taps it to "see what it does."
- ❌ ListenTab opens to PTT with no preamble; the privacy disclosure ("Voice goes to Apple/Google. Audio not stored.") only appears AFTER she clicks the mic. She panics and closes the tab. **Fix: privacy disclosure must render INLINE before the mic, not behind the click.**
- ❌ The Listen tab tooltip says "Microphone capture (alpha)" — "alpha" is jargon. **Fix: change to "Speak to Bradley (preview)."**

**T+1:30 — Returns to Chat tab.**
- ✅ Chat input is friendly; placeholder reads "Ask Bradley to change anything."
- ✅ She types "make my hero say Welcome to Sunny's Sourdough" and hits enter.
- ✅ Hero updates. **Win.**

**T+2:00 — Tries "make it warmer."**
- ❌ Falls through to canned hint: "Try one of: …" The fallback hint is a generic 5-line list. Grandma doesn't know which of the 5 patterns matches her intent. **Fix: prefix the hint with "I didn't catch that. Try…" so it sounds conversational.**
- ❌ Same generic hint regardless of error kind (cost cap, validation fail, timeout) — collapses 5 different errors into one wall of text.

**T+2:45 — Tries "swap the photo."**
- ❌ Canned-chat fallback fires. She gives up on chat and goes hunting for an image picker. Finds it in the right panel after 60s. **Fix: image-MVP fixture handler for "swap the photo."**

**T+3:30 — Sees the demo sliders in left panel.**
- ❌ DRAFT mode still shows three demo sliders ("Hero pulse intensity", "Tagline reveal speed", "Background motion"). She thinks these are real controls and starts dragging them. The sliders animate the orb only — they have NO effect on the actual site. **Fix: hide demo sliders in DRAFT mode entirely; show only in EXPERT.**

**T+5:00 — Time's up.**
- Hero copy updated; nothing else.
- Self-rating "I think it works but I'm not sure what I did wrong."
- Score: 58/100 (target 70). **FAIL.**

### Grandma must-fix queue

| # | Item | LOC | Time |
|---|---|---:|---:|
| G1 | Listen tab tooltip "Microphone capture (alpha)" → "Speak to Bradley (preview)" | 1 | 2m |
| G2 | Inline privacy disclosure block above PTT (don't gate on first click) | ~12 | 15m |
| G3 | Hide demo sliders in DRAFT mode (already partly shrunk in P15; this is one regex away) | ~6 | 10m |
| G4 | Prefix fallback-hint with "I didn't catch that." conversational opener | ~3 | 3m |
| G5 | Vertical-list starter carousel on `<600px` viewports | ~20 | 30m (defer to P20 if pressed) |

---

## 3. Framer designer persona walk (72/100 — FAIL by 8)

### Setup
- Mid-career product designer, used to Framer and Webflow.
- Looking for: live JSON editing, theme controls, accessible components.

### Step-by-step

**T+0:00 — Skips welcome, goes straight to EXPERT mode.**
- ✅ EXPERT mode reveals 5 center tabs (Preview / Blueprints / Resources / Data / Pipeline) and full left + right panels.
- ✅ Color picker for accent is responsive.
- ✅ Section reordering DnD works.

**T+1:00 — Tries chat for "use a serif font for headings."**
- ✅ Fixture matches; serif applied.
- ✅ Sees the patch in audit log (Pipeline tab). Likes the transparency.

**T+1:30 — Tries chat for "make headings 64px."**
- ❌ Canned hint. No fixture for typography size. **Fix: P20 — typography-size fixture or LLM-tool-use migration.**
- ❌ Framer goes to Theme panel and changes it manually — works, but defeats the chat-first promise.

**T+2:30 — Tries listen mode in EXPERT.**
- ✅ PTT works; "use a serif font" transcribes correctly.
- ✅ Same chat pipeline — same fixture matches — patch applied.
- ❌ No visual indicator that voice IS using the same pipeline. Looks like a separate feature. **Fix: surface a "via voice" pill on the chat message bubble when source=listen.**

**T+3:30 — Inspects export.**
- ✅ `.heybradley` zip downloads cleanly.
- ✅ Inspects sqlite contents: BYOK key NOT present. Listen transcripts ARE present. Confirms ADR-048 promise.
- ❌ Privacy disclosure said "Recordings are not stored" — but they SEE the transcripts in export. They feel misled. **Fix: copy clarification (item U6 below).**

**T+5:00 — Switches BYOK to OpenRouter (free tier).**
- ✅ Key save flow works; key cleared on logout.
- ❌ No disclosure that OpenRouter sees prompts + responses + origin. **Fix: provider-tier hint copy (R3 carryforward to P20).**

### Framer must-fix queue

| # | Item | LOC | Time |
|---|---|---:|---:|
| F1 | "via voice" pill on chat bubbles for source=listen | ~10 | 15m |
| F2 | OpenRouter privacy hint in LLMSettings (defers to P20 SECURITY.md sweep) | ~5 | 10m (P20) |
| F3 | Truthful listen privacy copy (audio vs transcript) | ~3 | 5m |

---

## 4. Capstone reviewer persona walk (78/100 — FAIL by 7)

### Setup
- Harvard ALM panel reviewer.
- 10-minute live demo + Q&A.
- Looking for: thesis claim alignment (JSON-driven spec → persona-rendered site).

### Demo plan

**Slide 1: "Hey Bradley is a JSON-driven spec platform."**
- ✅ Open Pipeline tab. Show the master config tree. Strong signal.

**Slide 2: "Watch a non-technical user build a blog in 60 seconds."**
- ❌ The 60-second walkthrough RUNS, but the canned hint shows up halfway through ("Try one of: …"). Capstone asks: "what just happened?"
- ❌ Demo recovers, but the moment-of-confidence is broken.

**Slide 3: "AISP Crystal Atom in the system prompt — symbolic spec language."**
- ✅ AISP block visible in `prompts/system.ts`. Good cross-reference to `bar181/aisp-open-core`.
- ❌ AISP block isn't surfaced in the UI anywhere. Capstone reviewer can't see how AISP affects the live demo. **Fix: defer to P20 Blueprint tab "AISP" sub-tab refresh.**

**Slide 4: "BYOK + 5-provider matrix."**
- ✅ LLMSettings surface is clean.
- ✅ Cost cap + audit log is impressive.
- ❌ When demoing simulated/mock mode, no pill says "you're in simulated mode." Reviewer asks: "is this real?" Demo loses minute. **Fix: simulated-mode pill in chat header.**

**Slide 5: "Local-first; no backend."**
- ✅ Open DevTools → Application → IndexedDB → `hb-db`. Show the SQLite blob.
- ✅ Show `.heybradley` export in a fresh tab. Confirms portability.

**Slide 6: "P19: Listen Mode."**
- ✅ PTT live demo works.
- ❌ Privacy disclosure copy issue (item U6) — Capstone reviewer flags as "trust hazard."

**Slide 7: "What's missing."**
- Capstone wants to see: image flow, multi-intent prompts, an "I'm stuck" help handler.
- ❌ All three are gaps R2 flagged. **Capstone score: 78/100. Loss = 7 points spread across listen polish, image flow, help/discovery.**

### Capstone must-fix queue

| # | Item | LOC | Time |
|---|---|---:|---:|
| C1 | Simulated-mode pill in chat header | ~8 | 15m |
| C2 | Truthful listen privacy copy (overlap with F3) | already in F3 | — |
| C3 | (P20) Help/discovery handler + AISP blueprint sub-tab refresh | ~80 | 4h (P20) |

---

## 5. Surface inventory — every place a user touches in P19

| Surface | LOC | Owner | UX issues found |
|---|---:|---|---|
| Welcome page | 918 | `pages/Welcome.tsx` | Carousel-on-phone (G5) |
| Onboarding | 740 | `pages/Onboarding.tsx` | (none in P19 walk) |
| Left panel — Chat tab | 509 | `components/shell/ChatInput.tsx` | Generic fallback (G4), no kind-mapped errors |
| Left panel — Listen tab | 754 | `components/left-panel/ListenTab.tsx` | Privacy timing (G2), tooltip jargon (G1), demo sliders (G3) |
| Left panel — Spec tab | 280 | `components/left-panel/SpecTab.tsx` | (none in P19) |
| Center canvas — Preview | 612 | `components/center-canvas/RealityTab.tsx` | (none) |
| Center canvas — Blueprints | 540 | `components/center-canvas/BlueprintsTab.tsx` | AISP not visible (C3, P20) |
| Center canvas — Pipeline | 380 | `components/center-canvas/PipelineTab.tsx` | (none — the audit log is a strength) |
| Right panel — Theme | 312 | `components/right-panel/ThemeSection.tsx` | (none) |
| Right panel — Sections | 529 | `components/right-panel/SectionsSection.tsx` | (none in P19) |
| Settings → LLM | 220 | `components/settings/LLMSettings.tsx` | OpenRouter privacy hint (F2, P20), simulated-mode pill (C1) |
| Settings → Data | 145 | `components/settings/DataSettings.tsx` | "Clear local data" missing per ADR-048 cross-ref (P20) |

**Net assessment:** 5 surfaces touched in P19, 3 of them regressed UX. Listen tab is the structural cause; chat error-mapping is the systemic cause.

---

## 6. Consolidated UX must-fix queue (for P19 fix-pass)

Sorted by ROI (UX score gain per minute of effort):

| # | Item | Score gain | Time | Cumulative |
|---|---|---:|---:|---:|
| G2 | Inline privacy disclosure | +6 (Grandma) | 15m | +6 |
| G3 | Hide demo sliders in DRAFT | +4 (Grandma) | 10m | +10 |
| G4 | Conversational fallback prefix | +3 (Grandma) | 3m | +13 |
| G1 | Listen tab tooltip jargon fix | +2 (Grandma) | 2m | +15 |
| F3 | Truthful listen privacy copy | +3 (Framer + Capstone) | 5m | +18 |
| C1 | Simulated-mode pill | +2 (Capstone) | 15m | +20 |
| F1 | "via voice" pill on chat bubble | +1 (Framer) | 15m | +21 |
| **Total fix-pass UX delta** | | **+21** | **65m** | **66 → 87** |

After UX fix-pass: composite **87/100** (Grandma 70, Framer 80, Capstone 85).

Items G5 (vertical carousel), F2 (OpenRouter hint), C3 (Help + AISP sub-tab refresh) deferred to P20.

---

## 7. UX residuals carried to P20 (not blockers)

| # | Item | Reason deferred |
|---|---|---|
| U1 | Vertical carousel on phone | UI surgery, not behavior; >30m |
| U2 | Help/discovery handler | New feature; needs intent classifier |
| U3 | AISP Blueprint sub-tab refresh | Cosmetic + content; Capstone flagged but not blocker |
| U4 | OpenRouter privacy hint | Batches with P20 SECURITY.md |
| U5 | "Clear local data" affordance | Cross-reference promise in ADR-048 |
| U6 | Multi-intent prompts | LLM tool-use; structural |

---

## 8. Cross-reference

- See `02-functionality-findings.md` for the prompt coverage matrix that drives the chat fallback rate (which is what triggers G4 in this UX walk).
- See `03-security-findings.md` §"Privacy disclosure gaps" for the listen-copy-truthfulness issue (F3) from a security-disclosure angle.
- See `04-architecture-findings.md` §"CLAUDE.md guideline violations" for the ListenTab.tsx 754-LOC issue that underlies G1+G2+G3 being scattered across one giant file.

---

**Author:** R1 + R1-followup brutal review consolidation
**Cross-link:** `00-summary.md` §3 (must-fix-now queue items 6 + 8)
**Next file:** `02-functionality-findings.md`
