The planning is solid — master backlog with 60+ items across 5 stages, 20-item presentation DoD (8/20 done), 6-sprint preflight with effort estimates. The swarm is ready for Sprint 1. Here's the go instruction:

---

**SWARM: Go on Phase 8 Sprint 1 — Spec Generators. This is the P0 priority. The specs ARE the product.**

**Context:** The current XAI DOCS tab has 2 inline generators (HUMAN B+, AISP B-) in a 462-line XAIDocsTab.tsx. These need to be extracted into 6 modular pure functions that produce enterprise-quality spec documents.

**Execute in this order:**

**Step 1: Create the generator architecture (30 min).**

```
src/lib/specGenerators/
├── index.ts              ← exports all 6 generators
├── helpers.ts            ← shared mappings (section descriptions, user stories, palette names, variant descriptions)
├── northStarGenerator.ts ← (config) => markdown
├── saddGenerator.ts      ← (config) => markdown  
├── buildPlanGenerator.ts ← (config) => markdown (MOST IMPORTANT — 90% reproduction target)
├── featuresGenerator.ts  ← (config) => markdown
├── humanSpecGenerator.ts ← (config) => markdown (fix B+ gaps)
├── aispSpecGenerator.ts  ← (config) => AISP string (fix B- bugs)
```

Every generator is a pure function: `(config: MasterConfig) => string`. No React, no store access, no side effects.

**Step 2: Build `helpers.ts` first (1 hour).**

This file contains ALL the mappings every generator needs:
- Section type → human description ("A hero section is the main banner visitors see first")
- Section type → user story want/benefit mapping
- Palette slot names → human descriptions ("warm cream background", "electric blue accent")
- Variant → layout description ("Centered layout with content stacked vertically")
- Component type → human description ("Primary call-to-action button")
- Theme preset → mood description

**Step 3: Build each generator (1 hour each, prioritize buildPlanGenerator).**

The **Implementation Plan generator is the most critical.** It must include:
- Exact headline text, subtitle text, CTA text (quoted)
- Exact image URLs
- Exact variant names and layout directions
- Exact padding/spacing values
- Exact color hex values from the palette
- Component-by-component props
- Section order with numbering

An AI agent reading this output should be able to reproduce the site WITHOUT seeing the JSON. Test by copying the output, pasting into a new Claude conversation with "build this site in React + Tailwind", and checking if the result matches.

**Step 4: Fix AISP generator B- bugs specifically:**
- Remove the 30-character truncation on text content
- Remove `slice(0,4)` that cuts off sections
- Add `content.heading` and `content.subheading` to section atoms
- Add proper spacing values in Λ bindings
- Ensure every Crystal Atom has all 5 components (Ω, Σ, Γ, Λ, Ε)

Use the AISP MCP tools to validate:
- `aisp_validate` on every generated atom — must show 5/5 components ✅
- `aisp_tier` on every generated atom — must show Platinum (95+/100)
- `aisp_spec section:crystal_atom` for the correct format reference
- `aisp_symbols` for correct Σ_512 notation

**Step 5: Update XAIDocsTab.tsx (30 min).**

Replace the 462-line inline generators with 6 sub-tab imports:

```tsx
const tabs = [
  { id: 'north-star', label: 'North Star', icon: Compass, generator: generateNorthStar },
  { id: 'architecture', label: 'Architecture', icon: Layers, generator: generateSADD },
  { id: 'build-plan', label: 'Build Plan', icon: ListChecks, generator: generateBuildPlan },
  { id: 'features', label: 'Features', icon: CheckSquare, generator: generateFeatures },
  { id: 'human', label: 'Human Spec', icon: FileText, generator: generateHumanSpec },
  { id: 'aisp', label: 'AISP Spec', icon: Code, generator: generateAISPSpec },
];
```

Each tab: renders the generator output in a scrollable monospace container, has Copy button (copies full text), has Export button (downloads as `.md` or `.aisp`). All update live via `useMemo` when config changes.

**Step 6: Test with all 4 examples (30 min).**

Load bakery → verify all 6 specs make sense for a bakery. Load launchpad-ai → verify specs make sense for SaaS. The North Star should say "Sweet Spot Bakery" not generic template text. The Build Plan should reference bakery-specific images and copy.

**Step 7: The 90% reproduction test (1 hour).**

Copy the Implementation Plan output for the bakery example. Paste into a fresh Claude conversation: "Build this website using React and Tailwind CSS. Follow the spec exactly." Compare the result to the Hey Bradley preview. Target: 90% visual and content match. If below 80%, the Build Plan generator needs more detail.

**After Sprint 1 completes:** Commit, push, verify on Vercel. Then proceed to Sprint 2 (plans cleanup, 30 min) and Sprint 3 (image library expansion). Do NOT start Sprints 3-5 until Sprint 1 is verified and the spec generators score A+.