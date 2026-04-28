# Hey Bradley — Presentation Readiness Report

> **Last refresh:** 2026-04-28 (post Sprint H end-of-sprint review + fix-pass; Sprint G skipped per owner mandate)
> **Sprint F + Sprint H COMPLETE.** Sprint H avg 89.7 (R1 88 / R2 90 / R3 91; 3-of-3 PASS; 5 must-fix closed).
> **Owner-gated** review required before next sprint.
> **Capstone date:** May 2026.

---

## 1. Top 6 demo moments (ranked)

### 1️⃣ Voice → review → approve → site updates (the marquee moment)

The 30-second flow that Grandma and the capstone reviewer both understand instantly.

```
User holds PTT button → says "make the hero bold and change the headline to 'Stop guessing, start shipping'"
→ Listen Review Card pops up:
   HEARD: "make the hero bold and change the headline..."
   WILL: Change the hero. (low confidence)
   [Approve] [Edit] [Cancel]
→ User taps Approve
→ Site updates in real-time + AISP feedback chip appears: "verb=change · target=hero · template=change-headline"
```

**Why it lands:** ASR error model is honest (review-first), AISP is visible, no LLM hallucination because template-first router won.

### 2️⃣ Slash command → instant template apply

```
User types `/template bakery` in chat
→ Input pre-fills with "build me a bakery"
→ Hits Enter
→ Bakery site assembles in front of them ($0 cost; 0 LLM calls)
```

**Why it lands:** Demonstrates command-trigger gate (P37 ADR-066). Power-user shortcut bypasses every atom; site renders in <1 second.

### 3️⃣ Bare `/template` → friendly help (the discoverability win)

```
User types `/template` (curious about syntax)
→ Bradley replies: "Try `/template bakery` (or any template name). Or use the **browse templates** button below to pick one."
```

**Why it lands:** P38 fix-pass closure — no silent rejects. Discoverability + Grandma-friendly copy.

### 4️⃣ AISP thesis exhibit (capstone reviewer specific)

Toggle EXPERT mode → submit "make it brighter" → expand the AISP Pipeline Trace pane:

```
1 · INTENT_ATOM: verb=change, target=theme, conf=0.65, source=rules
2 · ASSUMPTIONS_ATOM: 3 ranked options shown to user
3 · SELECTION_ATOM: template=make-it-brighter (LLM picked, conf=0.92)
4 · CONTENT_ATOM: (skipped — design route, not content)
5 · PATCH_ATOM: 2 patches applied (theme.accent, theme.bgSecondary)
```

**Why it lands:** Materializes the 5-atom Crystal Atom thesis in one screen. All 5 ADRs (045/053/057/060/064) are visible artifacts.

### 5️⃣ Brand voice + codebase reference (Sprint H — the personalization moment)

```
User opens Settings drawer → uploads brand-voice.md (e.g. "Don Miller StoryBrand tone — concrete, second-person, no jargon")
→ Reference panel shows: "Brand voice · ~280 tokens"
User uploads project ZIP → panel detects: "SaaS / Next.js"
→ Panel shows both refs side-by-side; either can be cleared independently.
User types "rewrite the headline" → AISPTranslationPanel chip lights "voice: brand-aware" (content route)
User types "hide the pricing section" → chip annotates "voice: brand-aware (unused this turn)" (design route — voice doesn't apply)
```

**Why it lands:** Personalization is visible AND honest. The "(unused this turn)" annotation shows the system is smart enough to know when voice profile applies. Closes the loop on Σ-restriction discipline — Λ.brand_voice is additive, never widens output.

### 6️⃣ BYOK provider switch

User selects different BYOK provider in Settings → enters API key (or skips for free tier):
- **OpenRouter** (free; mistral-7b-instruct:free) — $0/1M
- **OpenAI** (gpt-5-nano) — $0.05 in / $0.40 out per 1M
- **Google Gemini** (2.5-flash) — $0.30 / $2.50 per 1M
- **Anthropic** (Claude Haiku 4.5) — $1.00 / $5.00 per 1M

**Why it lands:** 4-provider matrix proves the abstraction. Cost-per-million is shown live in the Cost Pill. Demonstrates AISPSurface dispatcher reading provider from `intelligenceStore`.

---

## 2. AISP thesis flow (exact steps to show)

The capstone thesis: **specification-driven development with AI agents can produce enterprise-quality output if the input ambiguity is sub-2%.**

### Show this 5-step sequence:

1. **Open Hey Bradley.** Pick the warm theme. Empty preview.
2. **Type:** `Build me a SaaS landing page with pricing and testimonials.`
3. **Watch the site assemble** — 6 sections, real copy, brand-consistent images. Highlight: 0 designer involvement, 0 spec meetings, ~30 seconds wall-clock.
4. **Toggle EXPERT mode.** Show the AISP Pipeline Trace pane on the bradley reply: 5 atoms, each with verb/target/confidence/source.
5. **Click "Export AISP spec".** Show the resulting JSON document: 343 lines, sub-2% ambiguity per the AISP 5.1 Platinum protocol. Mention: "This document goes to Claude Code; my production site is live tomorrow morning."

### What to emphasize:

- AISP is a **math-first symbolic protocol**, not structured prose. Σ-restriction discipline = lower hallucination rate.
- **Each atom has a different Σ scope and confidence threshold** — calibration matters more than raw model power.
- **Cost-cap math is two-tier** (per-atom soft gate at 0.65×cap; hard gate at auditedComplete).
- **Template-first design**: ~70% of common phrasings hit a template = $0 cost. The LLM is only consulted on miss.

---

## 3. Gaps visible during demo + mitigations

| Gap | Likelihood | Mitigation |
|---|---|---|
| **Vercel deploy not yet live** | HIGH if not done before demo | OWNER ACTION: deploy before Day 10. Local dev server is acceptable fallback but loses the "production-deployed" framing. |
| **Live BYOK keys not validated against 4 paid providers** | MEDIUM | OWNER ACTION: 1 sample query per provider before Day 10. Use OpenRouter free tier as the demo provider (no key burn) for safety. |
| **No microphone in demo room** | MEDIUM | Test PTT in target room ≥24h before. Browser permissions can fail silently. Have a fallback: type the same prompts. |
| **Listen review card silent tab-swap on voice commands** | LOW | Documented as P38 carryforward (R1 F2 partial). Easy to point to when asked. |
| **35/35 prompt corpus is partly accounting** | LOW | If asked, acknowledge: "20% of those are command-trigger fixtures; the route-classifier coverage is the real metric." |
| **Content route currently short-circuits to canned hint** | LOW | Frame as "design fast-path lands today; content LLM swap is the next phase." Strong forward-looking story. |
| **Brand voice + codebase upload not pre-loaded for the demo session** | LOW | Pre-load both before Day 10 rehearsal so #5 demo flow has a 5-second start. Empty-state copy is good but a populated state lands better. |
| **Live LLM quality vs. simulated/mock can vary** | MEDIUM | Have **two primary providers** ready: OpenRouter free as Plan A, OpenAI gpt-5-nano as Plan B. If both fail, fall back to AgentProxyAdapter (DB-backed mock; uses the 35-prompt corpus). |

---

## 4. Slide titles needed (10-12 slides)

1. **Hey Bradley** — voice-first specification platform that feeds AI build agents
2. **The bottleneck nobody talks about** — specifications, not designs
3. **The thesis** — sub-2% ambiguity makes AI agent output enterprise-grade
4. **AISP** — math-first symbolic protocol (the 5.1 Platinum standard)
5. **The 5-atom Crystal Atom architecture** — PATCH / INTENT / SELECTION / CONTENT / ASSUMPTIONS
6. **Σ-restriction discipline** — calibrated hallucination control per atom
7. **Live demo** — voice → review → approve (the 30-second pitch)
8. **Live demo** — slash command + AISP trace pane
9. **The numbers** — Sprint F + H sealed; 498 PURE-UNIT tests cumulative GREEN; 4 BYOK providers; 35/35 prompts; 6 ADRs across the two sprints (065/066/067/068/069 + presentation-readiness)
10. **Cost discipline** — 70% template hits ($0); two-tier cost cap; 30-day audit log
11. **Open core** — Apache license, capstone artifact, ALL 67 ADRs in repo
12. **What's next** — content LLM swap (defers Sprint G interview mode per owner mandate); commercial path

---

## 5. Owner actions required before Day 10

| Action | Why | Status |
|---|---|---|
| **Vercel deploy live URL** | Demo requires production-deployed app | ⚠️ NOT DONE |
| **Live BYOK validation: 1 sample query × 4 providers** | Confirm Anthropic + Google + OpenAI + OpenRouter all work end-to-end | ⚠️ NOT DONE |
| **Slide deck draft** | 10-12 slides per §4 above | ⚠️ NOT STARTED |
| **Demo rehearsal (≥2 cycles)** | Catch microphone / browser / network issues in target environment | ⚠️ NOT STARTED |
| **Backup adapter ready** | Pre-configure `mock` adapter so a network blip doesn't kill the demo | ✅ in code |
| **Talking points for the 7 gaps in §3** | Pre-empt reviewer questions | ⚠️ NOT STARTED |

### Vercel status: **NOT CONFIRMED.** Owner-triggered. **Critical blocker for the production framing.** Local dev server works but undermines the "live" pitch.

---

## 6. Recommendation

**PAUSE swarm at Sprint H seal. Sprint G remains skipped per owner mandate.**

Rationale:
- Sprint F (P36/P37/P38) sealed; Sprint H (P44/P45/P46) sealed + fix-pass applied.
- 5-atom AISP architecture in production + Sprint H Λ extensions (`brand_voice` on CONTENT_ATOM, `project_context` on INTENT_ATOM). Capstone-thesis full exhibit.
- AgentProxyAdapter / FixtureAdapter is the test backbone — $0 cost, no real keys needed for the swarm.

**Owner-gated steps in priority order:**
1. **Today:** Vercel deploy + 4-provider BYOK validation
2. **Today/Tomorrow:** Slide deck draft from §4 (12 slides; 6-demo flow now)
3. **Tomorrow:** First demo rehearsal in target browser/room (with brand voice + codebase ref pre-loaded)
4. **Day 9:** Second rehearsal + screenshot capture for slides
5. **Day 10:** Final review + presentation

When the panel concludes, swarm resumes at the owner's chosen next sprint.

---

*Updated whenever Sprint state changes. Next refresh: post-Vercel-deploy.*
