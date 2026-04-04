# Hey Bradley — Plan Evaluation: Left Panel Simplification + Right Panel Hierarchy

**Date:** March 28, 2026  
**Supersedes:** `08-ux-architecture-redesign.md` (the accordion-based left panel plan)  
**Status:** Evaluated — Ready for swarm execution after review  
**AISP Tier:** Platinum (95/100)

---

## 1. EVALUATION (Score: 91/100)

### 1.1 What Changed from Plan 08

Plan 08 put accordions in the left panel (Theme, Sections, Chat, Listen). This plan strips the left panel even further — it's now a **flat clickable list** with chat and listen pinned at the bottom. The key insight: every accordion in the left panel was just a navigation item pretending to be a control group. Making them flat rows is more honest and faster to scan.

| Aspect | Plan 08 (Previous) | This Plan | Better? |
|--------|-------------------|-----------|---------|
| Left panel | 4 accordions with preview content inside | Flat clickable list, zero controls | ✅ Simpler |
| Chat/Listen | Inside accordions (hidden when collapsed) | Pinned at bottom (always visible) | ✅ Always accessible |
| Right panel tabs | SIMPLE / EXPERT / HISTORY | SIMPLE / EXPERT (History → TopBar icon) | ✅ Cleaner |
| Right panel content | Dispatchers routing to flat content | 5-accordion hierarchy mapping to JSON model | ✅ More structured |
| Accordion component | In left panel | Moved to right panel only | ✅ Single responsibility |

### 1.2 Scoring Breakdown

| Category | Score | Notes |
|----------|-------|-------|
| UX clarity | 19/20 | Left panel is now scannable in 1 second. The "flat list + pinned bottom" pattern is proven (Slack, Discord, VS Code). |
| Architecture | 18/20 | Clean separation. One minor: the 5 accordions in SIMPLE vs EXPERT share the same structure — could share an accordion config object to reduce duplication. |
| JSON model alignment | 19/20 | The right panel hierarchy (Design → Content → Components → Section Options → Component Options) maps directly to the JSON: `section.layout` → `section.content` → `section.content.components` → `section.style`. Excellent. |
| Swarm executability | 17/20 | 3 agents is correct but tight. The right-agent has the most work (8 rewrites). Consider splitting into right-simple-agent + right-expert-agent. |
| Doc consistency | 18/20 | Same doc updates as 08 needed. The HISTORY → TopBar icon is a new change that needs Doc 4 TopBar update. |
| **TOTAL** | **91/100** | |

### 1.3 What's Strong

**The 5-accordion hierarchy in the right panel is the standout improvement.** It maps directly to the JSON model levels:

```
JSON Model Level          →  Right Panel Accordion
─────────────────────────    ──────────────────────
section.variant/preset    →  DESIGN (preset cards)
section.content           →  CONTENT (copy, images)
section.content.items     →  COMPONENTS (show/hide)
section.layout + style    →  SECTION OPTIONS (width, aspect, bg)
component-level overrides →  COMPONENT OPTIONS (button style, badge)
```

This means a user can intuitively navigate the JSON depth by opening/closing accordions, and an agent reading this structure knows exactly which JSON path each accordion writes to.

**Chat and Listen pinned at the bottom** is the right call. In Plan 08, chat was hidden inside an accordion — users had to click to expand it, which adds friction to the primary input method. Now it's always visible, always ready.

### 1.4 Improvements to Make

**1. Right panel accordion state should be context-aware.** When the user switches from Theme to Hero, the accordion expand/collapse state should reset to sensible defaults per context — not carry over. For Theme: Style open by default. For sections: Content open by default.

**2. EXPERT mode needs a defined accordion-to-control mapping.** The plan says "same structure with more detail" but doesn't specify exactly which controls appear in each expert accordion. I've added this below.

**3. The 3-agent split is tight.** The right-agent is rewriting 8 files. I'd recommend 4 agents: left-agent, right-structure-agent (RightPanel + TabBar + Accordion component), right-content-agent (all 4 Simple/Expert content files), integration-agent.

**4. Add Section row design.** The plan shows section rows with eye icon + reorder arrows, but doesn't specify the selected state visual. Needs: selected row has accent left border or accent background to show which context is driving the right panel.

---

## 2. AISP SPECIFICATION

```aisp
⟦
  Ω := { Redesign Hey Bradley: left=flat navigation list, right=hierarchical accordions with SIMPLE/EXPERT }
  Σ := { LeftPanel:{themeRow:ClickableRow, sectionRows:[SectionRow], bottomBar:{chat:ChatInput, listen:ListenToggle}}, RightPanel:{tabs:["SIMPLE","EXPERT"], header:{contextName:𝕊, enableToggle:𝔹}, accordions:ContextAccordions}, SectionRow:{id:𝕊, icon:𝕊, name:𝕊, visible:𝔹, selected:𝔹}, ContextAccordions:{theme:["style","typography","colors"], section:["design","content","components","sectionOptions","componentOptions"]} }
  Γ := { R1: ∀ left_click(item) → setSelectedContext(item) → right_panel_updates, R2: left_panel contains ¬accordions ∧ ¬detail_controls, R3: chat ∧ listen pinned_at_bottom ∧ always_visible, R4: tab_switch preserves selectedContext, R5: context_switch resets accordion_expand_state to defaults, R6: EXPERT extends SIMPLE accordions with granular controls + RAW_AISP, R7: selected_row shows accent_indicator }
  Λ := { default_context:={type:"theme"}, default_tab:="SIMPLE", theme_default_accordion:="style", section_default_accordion:="content" }
  Ε := { V1: VERIFY left is flat list, V2: VERIFY click theme→right=theme accordions, V3: VERIFY click hero→right=hero accordions, V4: VERIFY chat+listen always visible, V5: VERIFY expert shows AISP viewer, V6: VERIFY tsc+build clean }
⟧
```

---

## 3. REFINED PLAN

### 3.1 Left Panel — Final Design

```
┌──────────────────────────────────┐
│  ✦ Theme                        │  ← Clickable row (accent left border when selected)
│ ─────────────────────────────── │
│  ★ Hero Section          👁     │  ← Section rows: icon + name + eye toggle
│  ⊞ Features              👁     │     Eye = show/hide in preview
│  → CTA                   👁     │     Hover reveals ↑↓ reorder arrows
│ ─────────────────────────────── │
│  + Add Section                  │  ← Dashed border style, muted text
│                                 │
│         (flex spacer)           │  ← Pushes bottom bar down
│                                 │
├──────────────────────────────── │
│  🎤 Tell Bradley what to build… ➤│  ← Chat input, always visible
│  ● Listen                  [○]  │  ← Listen toggle, always visible
└──────────────────────────────────┘
```

**Selected state:** The active row (Theme or a section) has a 3px left border in `--hb-accent` color and a subtle `--hb-accent-light` background tint. This shows which context is driving the right panel.

**Section row interactions:**
- Click name → sets `selectedContext: { type: 'section', sectionId }` → right panel updates
- Click eye (👁) → toggles `section.enabled` in configStore → preview updates
- Hover reveals ↑↓ arrows → click to reorder
- No drag-and-drop in this phase (simpler)

### 3.2 Right Panel — Accordion Structure

**Header (always visible):**
```
┌─────────────────────────────────────┐
│  HERO SECTION                  [●]  │  ← Context name + on/off toggle
│  [SIMPLE]  [EXPERT]                 │  ← Tab bar (no HISTORY)
│─────────────────────────────────────│
```

**SIMPLE Tab — When Theme Selected:**

| Accordion | Content | configStore Path |
|-----------|---------|-----------------|
| **▼ STYLE** (default open) | Preset cards: Modern, SaaS, Portfolio, Personal. Click = apply full preset. | `applyVibe(preset)` |
| **▶ TYPOGRAPHY** | Font family dropdown. Heading weight segmented control. | `settings.fontFamily`, `settings.headingWeight` |
| **▶ COLORS** | Primary, secondary, accent color swatches with edit. | `settings.colors.*` |

**SIMPLE Tab — When Section (Hero) Selected:**

| Accordion | Content | configStore Path |
|-----------|---------|-----------------|
| **▶ DESIGN** | Section preset cards: Modern, Minimalist, Visual, Bold. Click = apply section preset. | `sections[id].variant` |
| **▼ CONTENT** (default open) | Headline text input, Subtitle text input, CTA text input, Image selector. | `sections[id].content.*` |
| **▶ COMPONENTS** | Show/hide toggles: Eyebrow Badge [●], Primary Button [●], Secondary Button [●], Hero Image [○], Trust Badges [●]. | `sections[id].content.*.enabled` |
| **▶ SECTION OPTIONS** | Section width: [Narrow][Medium][Wide][XWide][Full]. Aspect ratio: [2:1][16:9][Full]. Background override. | `sections[id].layout.*`, `sections[id].style.*` |
| **▶ COMPONENT OPTIONS** | Per-component details (button style, badge position). Mostly placeholders for now — grows as components get richer. | `sections[id].content.*.style.*` |

**EXPERT Tab — When Section (Hero) Selected:**

Same 5 accordions, but each expands to show more granular controls:

| Accordion | SIMPLE Shows | EXPERT Adds |
|-----------|-------------|-------------|
| **DESIGN** | Preset cards | Layout variant cards + raw layout JSON snippet |
| **CONTENT** | Text inputs | Textareas with character counts + heading level selector |
| **COMPONENTS** | Show/hide toggles | Per-component property rows (size, variant, color) |
| **SECTION OPTIONS** | Width/aspect segmented controls | Direction arrows, Align buttons, Padding input, Gap input, max-width input |
| **COMPONENT OPTIONS** | Basic style selectors | Button size/style/color, badge position/style |
| **RAW AISP** *(expert only)* | — | Read-only AISP spec block for this section with copy button. Always visible at bottom of expert tab. |

### 3.3 Store Changes — `src/store/uiStore.ts`

```typescript
// REMOVE
expandedAccordions: Record<string, boolean>;  // left panel accordions (gone)
toggleAccordion: (key: string) => void;

// ADD
rightAccordions: Record<string, boolean>;     // right panel accordion state
toggleRightAccordion: (id: string) => void;

// MODIFY setSelectedContext to reset accordion defaults
setSelectedContext: (ctx: SelectedContext) => void;
// Implementation: when context changes, reset rightAccordions to:
//   theme → { style: true }
//   section → { content: true }
```

### 3.4 TopBar Change

Add History icon (lucide `Clock`) to the right section of the TopBar:

```
[HB] Untitled Project   [LISTEN | ● BUILD]   [V1.0.0-RC1]   [📱💻🖥️]   [🕐] [SHARE]
                                                                          ↑
                                                                    NEW: History icon
                                                                    (placeholder for Phase 7.2)
```

- Icon: `Clock` from lucide-react, 18px
- Button: ghost variant, `w-8 h-8`
- Tooltip: "Change History (coming soon)"
- `aria-label="Change history"`
- Disabled state with tooltip explaining it's a future feature

### 3.5 File Operations Summary

| Action | File | Description |
|--------|------|-------------|
| **REWRITE** | `left-panel/LeftPanel.tsx` | Flat clickable list + pinned bottom bar |
| **SIMPLIFY** | `left-panel/SectionsSection.tsx` | Remove accordion, keep section row rendering |
| **DELETE** | `left-panel/Accordion.tsx` | No longer used in left panel |
| **DELETE** | `left-panel/ThemeSection.tsx` | Theme is a simple row |
| **DELETE** | `left-panel/ChatSection.tsx` | Chat moves to LeftPanel bottom bar |
| **DELETE** | `left-panel/ListenSection.tsx` | Listen moves to LeftPanel bottom bar |
| **REWRITE** | `right-panel/RightPanel.tsx` | Accordion-based with context header |
| **REWRITE** | `right-panel/RightPanelTabBar.tsx` | SIMPLE / EXPERT only (no HISTORY) |
| **REWRITE** | `right-panel/SimpleTab.tsx` | Routes to ThemeSimple or SectionSimple |
| **REWRITE** | `right-panel/ExpertTab.tsx` | Routes to ThemeExpert or SectionExpert |
| **DELETE** | `right-panel/HistoryTab.tsx` | History → TopBar icon (future) |
| **REWRITE** | `right-panel/simple/ThemeSimple.tsx` | 3 accordions: Style, Typography, Colors |
| **REWRITE** | `right-panel/simple/SectionSimple.tsx` | 5 accordions: Design, Content, Components, Section Opts, Component Opts |
| **KEEP** | `right-panel/expert/ThemeExpert.tsx` | Minor updates (add granular controls) |
| **REWRITE** | `right-panel/expert/SectionExpert.tsx` | 5 accordions + RAW AISP viewer |
| **CREATE** | `right-panel/RightAccordion.tsx` | Reusable accordion for right panel |
| **MODIFY** | `store/uiStore.ts` | Remove left accordions, add right accordions |
| **MODIFY** | `shell/TopBar.tsx` | Add History icon button |

**Totals:** 8 rewrite, 5 delete, 1 create, 2 modify, 1 simplify, 1 keep = **18 file operations**

### 3.6 Swarm Execution (4 Agents)

| Agent | Tasks | Files |
|-------|-------|-------|
| **left-agent** | Rewrite LeftPanel as flat list + bottom bar. Simplify SectionsSection. Delete Accordion, ThemeSection, ChatSection, ListenSection. | 6 files |
| **right-structure-agent** | Rewrite RightPanel, RightPanelTabBar. Create RightAccordion. Delete HistoryTab. | 4 files |
| **right-content-agent** | Rewrite SimpleTab, ExpertTab, ThemeSimple, SectionSimple, SectionExpert. Keep ThemeExpert with minor updates. | 6 files |
| **integration-agent** | Update uiStore (remove left accordions, add right accordions). Update TopBar (add History icon). Verify build + delete old imports. | 2 files + verification |

**Execution order:**
```
left-agent + right-structure-agent (parallel, independent)
    ↓
right-content-agent (needs RightAccordion from structure-agent)
    ↓
integration-agent (needs all components, wires store + TopBar)
```

---

## 4. DOC UPDATES REQUIRED

| Document | Section | Change |
|----------|---------|--------|
| **Doc 2** | ADR-008 | Rewrite: "Left panel = flat navigation list. Right panel = accordion details with SIMPLE/EXPERT tabs." |
| **Doc 4** | §4.3 Left Panel | Replace with flat list wireframe + pinned bottom bar |
| **Doc 4** | §4.5 Right Panel | Replace with 5-accordion hierarchy spec |
| **Doc 4** | §4.1 TopBar | Add History icon to right section layout |
| **Doc 5** | §2 | Remove all DRAFT/EXPERT references. New rule: "Left panel is navigation only — no detail controls, no accordions." |
| **Doc 6** | §1 File Structure | Update left-panel and right-panel file lists |

---

## 5. VERIFICATION CHECKLIST

| # | Check | Method |
|---|-------|--------|
| 1 | Zero TypeScript errors | `npx tsc --noEmit` |
| 2 | Clean production build | `npx vite build` |
| 3 | Left panel is flat clickable list (no accordions) | Visual |
| 4 | Chat + Listen pinned at bottom, always visible | Visual |
| 5 | Click Theme → right panel shows Style/Typography/Colors accordions | Manual |
| 6 | Click Hero → right panel shows Design/Content/Components/Section/Component accordions | Manual |
| 7 | SIMPLE → EXPERT tab switch preserves selected context | Manual |
| 8 | EXPERT tab shows RAW AISP SPEC viewer for sections | Visual |
| 9 | Selected row in left panel has accent indicator | Visual |
| 10 | Eye toggle hides/shows section in preview | Manual |
| 11 | History icon in TopBar renders (disabled/placeholder) | Visual |
| 12 | No deleted file imports remain | `grep -r "Accordion\|ThemeSection\|ChatSection\|ListenSection\|HistoryTab" src/` |