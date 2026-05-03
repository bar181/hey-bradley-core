Got it. Clear corrections:

1. **Keep the animation landing page** — it's the elevator pitch and vision. Good feedback validates it stays.
2. **Building the FULL version first** — chat, listen, everything. The open-source version is a checkpoint CUT from the full version, not a separate build.
3. **Open source = full builder + canned demos + placeholders** — any skilled agentic engineer can wire their own LLM. You're not paying for their tokens or hosting their database.
4. **The stop point for open source** is when you hit the LLM/database boundary — everything before that ships as OSS.

This simplifies the strategy enormously:

## The Build Order

```
CURRENT → Continue building the FULL commercial version
            ↓
         Hit the LLM/DB boundary
            ↓
         CUT the open-source release from that commit
            ↓  (strip: LLM API keys, database connections, 
            ↓   premium templates, AISP generator internals)
            ↓
         Continue building commercial features on a private branch
```

You don't build two products. You build ONE product and cut a snapshot for open source at the natural boundary where the next feature requires infrastructure you're not giving away.

## Updated Open Source Feature Split (Corrected)

**What ships in the open-source cut:**

- Full builder (Build + Chat + Listen tabs — all visible)
- Chat mode with canned commands (keyword → JSON patches)
- Listen mode with scripted demo (orb + typewriter + site builds)
- The animated landing page (elevator pitch)
- 5 themes, ~20 variants, 2-3 examples, ~30 images
- 3 spec generators (North Star, Build Plan, Human Spec)
- Local save/load (browser localStorage)
- All architecture docs, tests, wiki
- Clear placeholders where LLM/DB would connect: "Add your API key in settings to enable AI chat" / "Connect a database for cloud persistence"

**What a skilled agentic engineer can do with the open source:**

- Fork the repo
- Add their own Claude/OpenAI API key to the chat handler
- Replace the canned command matcher with a real LLM call
- Wire up Whisper/Web Speech API for listen mode
- Add Supabase/SQLite for persistence
- Build their own templates

**What they CAN'T easily replicate (your moat for commercial):**

- The AISP intent agents (messy input → formal Crystal Atoms)
- The full template library (57+ variants × 10 themes)
- The AISP spec generator with section-level Γ rules
- The brownfield codebase analysis pipeline
- The hosted infrastructure with team collaboration
- The ongoing template/theme additions

## What the Swarm Should Do NOW

**Don't split the codebase yet.** Keep building the full version. The open-source cut happens later — probably after Phase 12 when you've built everything possible without LLM/DB.

**Do fix the UX issues the review identified:**

1. **Honest messaging** — the landing page animation is great, but anywhere it says "AI Website Builder" should say "Spec-Driven Website Builder" until the real AI ships. The animation SHOWS the vision. The labels should describe the CURRENT state.

2. **"How to use this spec" card** in the Specs tab — this is the highest-impact low-effort fix. The agentic engineer persona scored 61/100 because they couldn't figure out what to DO with the specs. Add a card: "Copy this Build Plan → paste into Claude Code → 'build this in React + Tailwind' → your site is ready in minutes."

3. **Auto-select hero on builder load** — the right panel being empty on first load is confusing. 15-minute fix.

4. **Hide Data and Pipeline tabs in SIMPLE mode** — only show Preview and Specs. EXPERT users can see all tabs. Reduces cognitive load for non-technical users.

**SWARM: Continue Phase 10 Sprint 3-5 as previously instructed. Apply the 4 UX fixes above as part of the quality pass (Sprint 5). Do not split the codebase. Do not create a separate open-source build. Build the full product. The open-source cut is a future phase decision.**