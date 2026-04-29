# Owner brief — Personality + Mobile + Suggestion + Onboarding (raw)

> **Source:** Owner brain-dump 2026-04-29 after Sprint I seal (e08bc94, 91/100, 550/550 GREEN, C11 closed).
> **Status:** Captured verbatim for traceability. Sprint planning file lives at `01-sprint-j-plan.md` in this same folder.
> **Purpose:** Pivot from the original Sprint J (Agentic Support System) and Sprint K (Release) to a presentation-wow + commercial-differentiation arc. The full reasoning is preserved here so future sessions can grade plan-vs-vision.

---

## Vision (verbatim from owner)

3-part LLM response architecture:

```
1. JSON patches    → silent, updates the site
2. Personality msg → shown in chat bubble
3. Log entry       → saved to DB, viewable in expert mode
```

Five personality modes:

| ID | Name | Tone | Target user |
|---|---|---|---|
| `professional` | Executive | Clean, precise, confident | Founders, execs, Sarah persona |
| `fun` | Spicy | Sarcastic wit, emoji, opinions | Marcus persona, early adopters |
| `geek` | Agentic Engineer | AISP references, technical depth, dry humor | Lars persona |
| `teacher` | Coach (school) | Encouraging, simple words, celebrates wins | Grandma persona, novices |
| `coach` | Startup Coach | Motivational, action-oriented, direct | Founders in build mode |

Same input ("Make the hero brighter") → 5 distinct outputs:
- Professional: "Updated hero color palette to warm tones. Theme consistency maintained across all sections."
- Fun: "Oh we're going BRIGHTER? Bold choice. Done — your hero is now legally required to wear sunglasses. 🕶️"
- Geek: "INTENT_ATOM classified: `modify.theme.hero` @ 0.94 confidence. Applied warm-palette patch. Δ backgroundColor: #1a1a2e → #ff6b35. No drift detected."
- Teacher: "Great idea! I made your hero section much brighter — like turning up the lights in a room! Take a look at the preview. What do you think? 🌟"
- Coach: "Brighter hero = more attention above the fold. Smart move. Done. What's your CTA saying? Let's make sure it converts."

---

## Strategic context (owner)

Lovable mobile shipped 2026-04-27 (iOS + Android). Apple blocked vibe-coding apps that download new code (Replit, Vibecode hit). Hey Bradley's browser-native architecture sidesteps the restriction.

> "The faster they ship code, the more painful your problem becomes. A founder who can vibe-code in 20 minutes on their phone still has zero architecture spec, no AISP, no implementation plan. The 55% problem gets worse, not better."

Personality system functions as commercial flywheel:

```
User interaction
  → Prompt + response saved to vector DB
  → Aggregate patterns identified (what users struggle to ask, which templates,
    where sessions abandon, what personality gets engagement)
  → AI improves (better template suggestions, auto-detect missing features,
    personality auto-calibration per user)
  → Product improves itself
```

Per-personality learning potential:
- Grandma → confusion patterns → auto-suggestion chips
- Geek → AISP usage → lead-gen proxy for agentic engineers
- Fun → which responses get shared → virality optimization
- Coach → conversion from free → paid after specific interactions

---

## Mobile UX layout (owner sketch)

```
MOBILE LAYOUT (< 768px)
┌─────────────────────────┐
│  Hey Bradley   ☰        │  hamburger: specs, AISP, logs, settings
├─────────────────────────┤
│  [Chat] [Listen] [View] │  sticky tab toggle (3 only, no Builder)
├─────────────────────────┤
│  ACTIVE TAB CONTENT     │
│  (chat OR preview OR    │
│   listen controls)      │
└─────────────────────────┘
│  Input bar (sticky)     │  always visible in chat/listen
└─────────────────────────┘
```

- Builder hidden on mobile entirely
- Preview tab → sticky top nav on the preview itself
- Hamburger hides everything advanced (specs, AISP, logs, settings)
- Personality selector lives in hamburger (icon/emoji per mode)

---

## Wow factor ranking (owner)

1. Personality system with live toggle — switching mid-chat is shareable
2. Mobile listen mode — hold-button voice → site updates
3. AISP geek-mode easter egg — Crystal Atom in bubbles (`Ω→modify Σ→hero Γ→0.94 ✓`)
4. Share-your-spec button — one-tap shareable AISP + human-readable plan
5. Suggestion chips after every response — 3 next actions
6. Personality-aware onboarding — first AI question: "How would you like me to talk to you?"

---

## Original 3-phase queue from owner

- **P50 — Personality System** (dual response format + 5 modes + picker + ADR-073)
- **P51 — Mobile UX** (responsive layout, remove Builder on mobile, 3-tab nav, sticky preview, hamburger, ADR-074)
- **P52 — Suggestion Chips + Share** (post-response chips, share-your-spec, personality-aware chip content, ADR-075)

---

## Owner addition (this turn)

> "I also think we need to have a more user-friendly onboarding where the user selects, or save as part of the user's profile."

Onboarding implication: **personality picker fires on first run** (or whenever no personality is set in kv) BEFORE the chat input is enabled. User profile gets a personality preference saved alongside any future profile fields.

---

## Mandate for the planner

Per the same message:

> "do not start with the personality trait sprint - let's review, web research if needed, confirm the existing capabilities and identify the gaps, create a new personality sprint (3-6 phases) - before creating adr or ddd, save a sprint plan including a north star, implementation plan, any adr to create, and tests - provide details in text output so i can review"

Action set:
1. Audit existing capabilities (chatPipeline, AgentProxyAdapter, intelligenceStore, EXPERT mode, llm_logs, chat_messages, settings drawer, onboarding).
2. Identify gaps against the personality + mobile + suggestion + onboarding vision.
3. Draft a 3-6 phase sprint plan with north star + impl plan + ADRs + tests.
4. Present plan in text for owner review BEFORE any ADR / DDD / code is written.
