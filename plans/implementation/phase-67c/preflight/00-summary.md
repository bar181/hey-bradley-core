# P67c — Library-Wide Polish (Close 8.3 → 8.5)

> **Phase:** P67c · **Date:** 2026-04-30
> **Predecessor:** P67b sealed at `37933e8` (604/604 GREEN; library 8.3 / touched 8.7)
> **Mandate:** close library mean to ≥8.5 by touching the 3 legacy below-standard surfaces

---

## Recon-grounded targets

### Settings drawer surfaces (7 files, ~1500 LOC total)
- `SettingsDrawer.tsx` (151) — orchestrator
- `BrandContextUpload.tsx` (267)
- `CodebaseContextUpload.tsx` (463)
- `LLMSettings.tsx` (218)
- `ReferenceManagement.tsx` (215)
- `PersonalityPicker.tsx` (138)
- `AttributionToggle.tsx` (52)

### Legacy section editors (Expert side, 3 files)
- `SectionExpert.tsx` (495) — the big one; canonical Hero EXPERT editor
- `NavbarSectionExpert.tsx` (71)
- `ThemeExpert.tsx` (57)

### ChatInput.tsx thread render block
- **Lines 584-712** (~128 LOC) — `messages.map((msg) => ( ... ))`
- Extracting → ChatInput at ~722 LOC. **≤500 target requires also extracting useCallback bodies (executeAction / runLLMPipeline / runCannedFallback ~250 LOC) into a `useChatPipeline` hook** — out of scope this sprint; honest target ≤750 LOC.

---

## 3 parallel sub-modules + A4 closer

### A1 — Settings drawer audit + fix
**Owns:** `src/components/settings/*.tsx` (7 files; surgical)

Audit each file 1-10 against ADR-094:
- token compliance (no hardcoded `'24px'`/`'48px'`/`'96px'` literals)
- consistent label + description + clear action per setting
- no orphaned UI / misaligned controls
- Tailwind hover transitions on interactive elements

Fix any file <8.5. Skip files already ≥8.5. Document scores in agent output.

### A2 — Legacy section editors sweep (Expert side)
**Owns:** `src/components/right-panel/expert/*.tsx` (3 files)

Apply the same collapse-by-default + design-token discipline as P67/A2 swept across the SectionSimple side. SectionExpert.tsx (495 LOC) is the priority. NavbarSectionExpert + ThemeExpert are smaller.

Per file:
- import from `@/styles/design-tokens` if not already
- consistent header (section name + chevron)
- `aria-expanded` + `transition-all duration-200`
- `data-testid="section-editor-collapse-toggle"`

### A3 — ChatThread extraction
**Owns:** `src/components/shell/ChatInput.tsx` (EDIT) + NEW `src/components/shell/ChatThread.tsx`

Extract the message-rendering loop (lines 584-712, ~128 LOC) to a new `ChatThread` component. Honest target: ChatInput.tsx ≤750 LOC (≤500 needs the useChatPipeline hook extraction — deferred to P67d if owner wants).

ChatThread component signature:
```tsx
export interface ChatThreadProps {
  messages: ChatMessage[]
  onScrollToBottom?: () => void
  scrollAnchorRef?: React.RefObject<HTMLDivElement>
  // pass any handlers used inside the loop (suggestion-chip pre-fill, etc.)
}
export function ChatThread(props: ChatThreadProps) { ... }
```

PRESERVE the `INTENT_ATOM` + `Try:` literals inside the new file (move them with the loop).

### A4 — Score + ADR-095 + EOP closer
**Owns:**
- `docs/adr/ADR-095-library-wide-polish-standard.md` (≤120 LOC)
- `tests/p67c-library-polish.spec.ts` (≥10 cases)
- `plans/implementation/phase-67c/{02-post-review.md, session-log.md, retrospective.md}`

ADR-095: what must be true for EVERY surface (not just touched). Quantitative gate per ADR-094 carries forward; ADR-095 adds the legacy-coverage requirement.

---

## Hard rules
1. NO new dependencies
2. NO Framer Motion / GSAP / Lottie / React Spring / animejs
3. NO new CSS files; Tailwind only
4. NO breaking JSON config / section-renderer behavior
5. NO copy changes
6. NO touching files outside owned list per agent
7. NO shell commands inside agents
8. TypeScript-strict

---

## Acceptance gates
- A1: every settings file scores ≥8.5 OR is documented as "already ≥8.5, no edit"
- A2: SectionExpert + NavbarSectionExpert + ThemeExpert have collapse pattern + token import
- A3: ChatInput.tsx ≤750 LOC; ChatThread.tsx exists; INTENT_ATOM + Try: literals preserved (in either file — test will check both)
- A4: ADR-095 Accepted; ≥10 tests passing; cumulative 620+ GREEN
- tsc clean; full-session regression GREEN

---

## Successor
OC-4 Templates Round 2 (if library ≥8.5) OR P67d (useChatPipeline hook extraction → ChatInput ≤500) OR Polish Wave 4 (any remaining sub-8.5 surface).
