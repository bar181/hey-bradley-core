**That original Phase 5 directive is mostly done but partially outdated.** Here's the status:

| Item from Original Phase 5 | Status | Notes |
|----------------------------|--------|-------|
| `cannedChat.ts` command parser | ✅ Done | Already built and working |
| Chat input wired with Enter key | ✅ Done | Working |
| 6+ canned commands | ✅ Done | dark/light/add/remove/headline/theme all work |
| Chat message UI (user + Bradley) | ✅ Done | Chat tab with message history |
| 3-tab left panel (Builder/Chat/Listen) | ✅ Done | Added in Phase 4 |
| Right panel hides on Chat/Listen | ✅ Done | Added in Phase 4 |
| Typewriter responses | ✅ Done | Working |
| Playwright chat tests | ✅ Done | 29/29 passing |
| **Jargon removal** | ❌ Not done | From Doc 23 — still shows Hero, CTA, Navbar |
| **Splash page CTA always enabled** | ❌ Not done | Still forces 30s wait |
| **Mobile splash fix** | ❌ Not done | Still broken on mobile |
| **Light mode polish** | ❌ Not done | Still has border issues |
| **Section ID removal** | ❌ Not done | Still shows hero-01, features-01 |
| **Canned demo simulation** | ❌ Not done | Example JSONs exist but no "watch it build" sequence |
| **Site Details section** | ❌ Not done | No site name/author/description editing |

see /workspaces/hey-bradley-core/plans/implementation/phase-5/human-2.md for an updated list of to do.  

Great question. Claude Code is fundamentally a text-based agent — it can write code and run commands, but it **cannot see what it built**. This is why you've had 8 theme iterations, persistent light mode issues, and a 52/100 UI score. The swarm writes CSS confidently but has no visual feedback loop.

Here are the practical solutions, ordered by impact:

## The Core Problem

Claude Code agents can:
- ✅ Write TypeScript/React/CSS
- ✅ Run `npx tsc` and `npx vite build`
- ✅ Run Playwright tests with assertions
- ✅ Read screenshots as base64 images

Claude Code agents cannot:
- ❌ Open a browser and look at what they built
- ❌ Judge visual quality ("does this look good?")
- ❌ Compare two screenshots and identify which is better
- ❌ Detect "feels amateur" vs "feels professional"

## Solution 1: Screenshot-Driven Feedback Loop (Best — Use Now)

**Have the swarm take Playwright screenshots after every visual change, then analyze them in the same session.**

```typescript
// Add to the swarm's workflow:
// 1. Make the CSS/component change
// 2. Take a screenshot
// 3. Read the screenshot back
// 4. Self-assess against criteria
// 5. Iterate if needed

test('visual check', async ({ page }) => {
  await page.goto('http://localhost:5173/builder');
  await page.waitForTimeout(2000);
  
  // Screenshot specific areas, not full page
  const leftPanel = page.locator('[data-panel="left"]');
  await leftPanel.screenshot({ path: 'screenshots/left-panel-light.png' });
  
  const preview = page.locator('[data-panel="center"]');
  await preview.screenshot({ path: 'screenshots/preview.png' });
});
```

**Then tell the swarm:** "After making visual changes, run the screenshot script and use `view` to look at the screenshot. Check: Is text readable? Do buttons have contrast? Does the layout look intentional or broken? If you can't tell text from background, the contrast is wrong."

The key is making the swarm **look at its own work** rather than trusting that correct CSS = correct visuals.

## Solution 2: Design Token Specification (Prevents Problems)

Instead of letting the swarm choose colors, give it a locked design token file that it must reference. No freestyle CSS allowed.

```typescript
// src/lib/designTokens.ts — THE AUTHORITY for all colors
export const tokens = {
  light: {
    panelBg: '#F7F5F2',
    surfaceBg: '#FFFFFF', 
    textPrimary: '#1E1E1E',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    border: '#D1CBC3',
    borderHover: '#A51C30',
    accent: '#A51C30',
    accentText: '#FFFFFF',
    selectedBg: '#A51C30',
    selectedText: '#FFFFFF',
    inputBg: '#F7F5F2',
    inputBorder: '#D1CBC3',
  },
  dark: {
    panelBg: '#2C2C2C',
    surfaceBg: '#363636',
    textPrimary: '#F5F5F5',
    textSecondary: '#B0B0B0',
    textMuted: '#808080',
    border: '#4A4A4A',
    borderHover: '#A51C30',
    accent: '#A51C30',
    accentText: '#FFFFFF',
    selectedBg: '#A51C30',
    selectedText: '#FFFFFF',
    inputBg: '#363636',
    inputBorder: '#4A4A4A',
  }
} as const;

// RULE: No hex codes anywhere in components.
// Every color references tokens.light.X or tokens.dark.X
// via CSS variables set in index.css
```

**Tell the swarm:** "Never write a hex color in a component file. Always reference a design token. If you need a new color, add it to designTokens.ts first and justify why."

## Solution 3: Contrast Assertion Tests (Automated Safety Net)

Add Playwright tests that **measure actual contrast ratios** instead of trusting the CSS:

```typescript
test('light mode contrast check', async ({ page }) => {
  await page.goto('http://localhost:5173/builder');
  // Toggle to light mode
  
  // Check that left panel text is readable
  const sectionText = page.locator('[data-testid="section-hero"] span').first();
  const textColor = await sectionText.evaluate(el => getComputedStyle(el).color);
  const bgColor = await sectionText.evaluate(el => {
    let parent = el.parentElement;
    while (parent) {
      const bg = getComputedStyle(parent).backgroundColor;
      if (bg !== 'rgba(0, 0, 0, 0)') return bg;
      parent = parent.parentElement;
    }
    return 'rgb(255,255,255)';
  });
  
  // Calculate contrast ratio (simplified)
  const ratio = calculateContrastRatio(textColor, bgColor);
  expect(ratio).toBeGreaterThan(4.5); // WCAG AA
});
```

This catches "white text on white background" automatically.

## Solution 4: Reference Screenshot Comparison

Take a screenshot of a design you LIKE (from Stripe, Linear, etc.), save it as a reference, and tell the swarm to match it:

**Tell the swarm:** "Here is a reference screenshot of how the left panel should look in light mode: `reference/left-panel-light.png`. Your implementation must match this visual style: warm off-white background, near-black text, crimson selected state, gray borders. Take a screenshot of your implementation and compare side-by-side."

## Recommended Swarm Instruction

**Paste this to Claude Code:**

```
VISUAL QUALITY PROTOCOL — Apply to all UI changes:

1. BEFORE making visual changes: Read src/lib/designTokens.ts. Use ONLY these colors.
2. AFTER making visual changes: Run `npx playwright test tests/screenshots.spec.ts`
3. AFTER screenshots: Use `view` tool to examine each screenshot
4. CHECK: Can you read all text? Are buttons visible? Does selected state stand out?
5. If ANY element has < 4.5:1 contrast ratio, fix before committing

NEVER commit visual changes without first taking and examining a screenshot.
This is Cardinal Sin #13 — no shipping UI without visual verification.
```

The fundamental fix is making the swarm's workflow include **looking at screenshots** as a mandatory step, not just running `tsc` and `vite build`. The code compiling doesn't mean the UI looks right — the Data Tab raw-HTML disaster from Phase 1 proved that.