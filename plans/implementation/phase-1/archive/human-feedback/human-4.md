# Hey Bradley — Swarm Directive: Data Tab Overhaul + Quality Self-Check Protocol

**Priority:** P0 — BLOCKING  
**Phase:** 1.2b (hotfix before continuing Phase 1.2)  
**Issue:** Data Tab syntax highlighting is rendering raw HTML class names as visible text. This is a ship-stopping bug.

---

## 1. THE BUG (Image 1 — Current State)

The Data Tab is dumping raw CSS class strings into the output:

```
400">"text-blue-400">400">"spec": 400">"text-blue-400">400">"aisp-1.2",
```

**Root cause:** The swarm wrote a custom regex-based syntax highlighter that injects HTML `<span>` tags as raw strings instead of rendering them as React nodes. The `dangerouslySetInnerHTML` or string interpolation approach is outputting the markup as text.

**Impact:** The Data Tab — which is the "engineering credibility" centerpiece of Hey Bradley — looks completely broken. This is visible to anyone who clicks the DATA tab. It must be fixed before any other Phase 1.2 work proceeds.

---

## 2. THE FIX: CodeMirror Implementation

### 2.1 Dependency (Requires Human Approval per Doc 5 §5.3)

```bash
npm install @uiw/react-codemirror @codemirror/lang-json @codemirror/theme-one-dark
```

**Justification:** `@uiw/react-codemirror` is a thin React wrapper around CodeMirror 6 — the same editor engine used by Chrome DevTools, Firefox DevTools, and Replit. It provides syntax highlighting, code folding, JSON linting, and edit handling out of the box. Custom regex highlighters are fragile and will break again. This is the correct tool.

**Note:** Doc 5 §5.3 previously listed `monaco-editor` as forbidden (too heavy at ~4MB). CodeMirror 6 is ~150KB and purpose-built for embedded editors. This is a different class of tool. Add `@uiw/react-codemirror`, `@codemirror/lang-json`, and `@codemirror/theme-one-dark` to the approved dependency list.

### 2.2 Data Tab Rebuild — `src/components/center-canvas/DataTab.tsx`

**Match Image 2 (the target mockup).** The Data Tab has three layers:

**Layer 1: Header**
```
┌──────────────────────────────────────────────────────────────┐
│  Project Data Schema                              ● LIVE    │
│  Synchronized Single Source of Truth (SSOT)                  │
│  [📋 Copy All]  [↓ Export JSON]                              │
├──────────────────────────────────────────────────────────────┤
│  VERSION 1.0.0   SECTIONS 3   TOTAL 1,360   LINES 62       │
└──────────────────────────────────────────────────────────────┘
```

- Title: "Project Data Schema" — DM Sans 16px 600
- Subtitle: "Synchronized Single Source of Truth (SSOT)" — DM Sans 12px, text-muted
- LIVE indicator: green pulsing dot + "LIVE" text — indicates real-time sync with configStore
- Metadata bar: version, section count, total chars, line count — Mono 11px uppercase

**Layer 2: Collapsible Section Blocks**

Instead of one giant JSON editor, split the JSON into semantic sections that users can expand/collapse:

```
┌──────────────────────────────────────────────────────────────┐
│ ∨ ✦ THEME                                8 lines · 107 chars 📋│
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ {                                                        │ │
│ │   "mode": "dark",                                        │ │
│ │   "colors": { "from": "#0f172a", ... }                   │ │
│ │ }                                                        │ │
│ └──────────────────────────────────────────────────────────┘ │
│                                                              │
│ ∨ ★ HERO SECTION                        28 lines · 547 chars 📋│
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ {                                                        │ │
│ │   "id": "hero-01",                                       │ │
│ │   "type": "hero",                                        │ │
│ │   ...                                                    │ │
│ │ }                                                        │ │
│ └──────────────────────────────────────────────────────────┘ │
│                                                              │
│ › → CALL TO ACTION                      16 lines · 341 chars 📋│
└──────────────────────────────────────────────────────────────┘
```

Each section block:
- Header: section icon + name (uppercase, monospace) + line/char count + copy button
- Body: CodeMirror instance (or formatted JSON) with dark background
- Collapsible: click header to expand/collapse
- Copy button: copies that section's JSON to clipboard

**Layer 3: Full Edit Mode**

An "EDIT" button in the header toggles the entire Data Tab into a single full-height CodeMirror editor showing the complete JSON. This is the bidirectional editing mode.

### 2.3 Bidirectional Sync (THE CRITICAL LOOP)

```typescript
// READ: Editor displays current configStore state
const jsonString = JSON.stringify(configStore.getState().config, null, 2);

// WRITE: On change, validate before updating
const handleChange = (newValue: string) => {
  try {
    const parsed = JSON.parse(newValue);
    const result = masterConfigSchema.safeParse(parsed);
    if (result.success) {
      configStore.getState().loadConfig(result.data);
      setValidationError(null);
    } else {
      setValidationError(result.error.format());
      // Do NOT update configStore — show error indicator instead
    }
  } catch (e) {
    setValidationError('Invalid JSON syntax');
    // Do NOT update configStore — user is still typing
  }
};
```

**Key rules:**
- Never update configStore with invalid JSON (prevents Reality tab crash mid-edit)
- Show validation status: green "Valid" or red error message with Zod details
- Debounce onChange by 500ms (user is typing, don't parse every keystroke)
- When configStore updates from OTHER sources (right panel controls), the editor reflects it instantly

### 2.4 Implementation Steps

| # | Task | File |
|---|------|------|
| 1 | Install `@uiw/react-codemirror`, `@codemirror/lang-json`, `@codemirror/theme-one-dark` | `package.json` |
| 2 | Delete the broken custom syntax highlighter | `DataTab.tsx` |
| 3 | Build header with title, LIVE indicator, Copy All, Export JSON, metadata bar | `DataTab.tsx` |
| 4 | Build collapsible section blocks (read-only view mode) | `DataTab.tsx` |
| 5 | Build full edit mode with CodeMirror (toggled by EDIT button) | `DataTab.tsx` |
| 6 | Wire bidirectional sync with Zod validation + debounce | `DataTab.tsx` |
| 7 | Run Playwright screenshot of Data Tab — verify NO raw HTML strings visible | Verification |

---

## 3. QUALITY SELF-CHECK PROTOCOL (New Swarm Requirement)

**This bug should never have shipped.** An agent that runs `npx vite build` and gets zero errors still shipped a Data Tab that renders garbage. Build passing ≠ UI working. The swarm needs a visual quality gate.

### 3.1 The Problem

Agents currently verify:
- `npx tsc --noEmit` — zero TypeScript errors ✅
- `npx vite build` — clean production build ✅
- But they **never look at what they built** ❌

A syntax highlighter that dumps raw class names is technically valid TypeScript and builds fine. The bug is purely visual — and no agent caught it because no agent checked the visual output.

### 3.2 The Fix: Playwright Visual Smoke Tests

After every phase completion, the integration-agent must run Playwright screenshots and do a basic sanity check. Add this to the verification step:

**File:** `tests/visual-smoke.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test('Data Tab renders valid JSON without raw HTML', async ({ page }) => {
  await page.goto('http://localhost:5173');
  
  // Navigate to Data Tab
  await page.click('text=DATA');
  await page.waitForTimeout(1000);
  
  // Screenshot
  await page.screenshot({ path: 'screenshots/data-tab.png', fullPage: true });
  
  // CRITICAL: Check that no raw HTML class names are visible
  const bodyText = await page.textContent('body');
  expect(bodyText).not.toContain('text-blue-400');
  expect(bodyText).not.toContain('class=');
  expect(bodyText).not.toContain('400">');
  
  // Check that actual JSON content IS visible
  expect(bodyText).toContain('"spec"');
  expect(bodyText).toContain('"aisp-1.2"');
  expect(bodyText).toContain('"sections"');
});

test('Reality Tab renders hero section', async ({ page }) => {
  await page.goto('http://localhost:5173');
  
  // Should see the hero headline
  const heroText = await page.textContent('body');
  expect(heroText).toContain('Ship Code at the Speed of Thought');
  
  // Screenshot
  await page.screenshot({ path: 'screenshots/reality-tab.png', fullPage: true });
});

test('Right panel controls update preview', async ({ page }) => {
  await page.goto('http://localhost:5173');
  
  // Click Hero in left panel
  await page.click('text=Hero');
  
  // Find headline input and change it
  const headlineInput = page.locator('input[value*="Ship Code"]').first();
  if (await headlineInput.isVisible()) {
    await headlineInput.fill('New Test Headline');
    await page.waitForTimeout(500);
    
    // Verify preview updated
    const previewText = await page.textContent('[data-testid="reality-tab"]');
    expect(previewText).toContain('New Test Headline');
  }
  
  await page.screenshot({ path: 'screenshots/hero-edit.png', fullPage: true });
});

test('No broken UI elements visible', async ({ page }) => {
  await page.goto('http://localhost:5173');
  
  // Check all 4 tabs render without errors
  for (const tab of ['REALITY', 'DATA', 'XAI DOCS', 'WORKFLOW']) {
    await page.click(`text=${tab}`);
    await page.waitForTimeout(500);
    
    // No error boundaries should be showing
    const errorText = await page.textContent('body');
    expect(errorText).not.toContain('Something went wrong');
    expect(errorText).not.toContain('Error');
    
    await page.screenshot({ path: `screenshots/tab-${tab.toLowerCase().replace(' ', '-')}.png` });
  }
});
```

### 3.3 Self-Enhancement Checklist

After every phase, before requesting human review, the swarm must:

| # | Check | Method | Catches |
|---|-------|--------|---------|
| 1 | TypeScript compiles | `npx tsc --noEmit` | Type errors |
| 2 | Production builds | `npx vite build` | Bundle errors |
| 3 | Visual smoke tests pass | `npx playwright test` | Raw HTML in output, broken renders, missing content |
| 4 | Screenshot review | Agent examines screenshots in `screenshots/` | Layout breaks, empty states, visual garbage |
| 5 | No placeholder/lorem text in production views | Grep for "lorem", "placeholder", "TODO" in rendered output | Forgotten dev artifacts |
| 6 | All tabs navigable | Playwright clicks each tab, verifies content | Dead tabs, crash on navigate |
| 7 | Bidirectional sync test | Change a control → verify DATA tab JSON updates. Edit JSON → verify preview updates. | Broken sync loop |

### 3.4 The Rule (Add to Doc 5 Cardinal Sins)

> **Cardinal Sin #13: Shipping visible UI without running a Playwright visual check.** If an agent completes a UI task and does not capture and examine a screenshot, the PR is rejected. Build passing is necessary but not sufficient. The agent must verify the rendered output looks correct.

---

## 4. SUMMARY FOR SWARM

```
IMMEDIATE (before any Phase 1.2 work):
1. Get human approval for @uiw/react-codemirror dependency
2. Rip out broken custom syntax highlighter
3. Rebuild DataTab.tsx matching Image 2 mockup:
   - Header with "Project Data Schema" + LIVE indicator
   - Collapsible section blocks with metadata
   - Full edit mode with CodeMirror
   - Bidirectional sync with Zod validation
4. Run Playwright smoke test — verify zero raw HTML in output
5. Add visual-smoke.spec.ts to test suite

THEN continue Phase 1.2 (Listen mode, XAI Docs, Workflow pipeline)
```

This is a blocking fix. Do not proceed to Phase 1.2 features until the Data Tab renders clean JSON without any raw HTML artifacts.