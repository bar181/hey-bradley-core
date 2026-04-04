# SWARM: Theme Architecture Fix — Execute Now

**Answer: YES. Proceed exactly as described. Here is the execution order.**

---

## Step 1: Fix applyTheme() Architecture (DO THIS FIRST — before anything else)

The current `applyTheme()` merges theme colors into the existing config. This is wrong.

**New behavior:**

```typescript
function applyTheme(themeName: string) {
  const template = loadThemeJSON(themeName);  // Full JSON template
  const currentConfig = configStore.getState().config;
  
  // EXTRACT copy from current config (preserve ALL text + urls)
  const preservedCopy = {};
  currentConfig.sections.forEach(section => {
    preservedCopy[section.type] = {};
    section.components?.forEach(comp => {
      if (comp.props?.text) preservedCopy[section.type][comp.type] = { text: comp.props.text };
      if (comp.props?.url) preservedCopy[section.type][comp.type] = { 
        ...preservedCopy[section.type][comp.type], url: comp.props.url 
      };
    });
  });
  
  // REPLACE everything from template
  const newConfig = {
    ...currentConfig,
    theme: template.theme,
    sections: template.sections.map(templateSection => ({
      ...templateSection,
      // Inject preserved copy back into matching components
      components: templateSection.components.map(comp => ({
        ...comp,
        props: {
          ...comp.props,
          ...(preservedCopy[templateSection.type]?.[comp.type] || {})
        }
      }))
    }))
  };
  
  configStore.getState().loadConfig(newConfig);
}
```

**What this changes:**
- `sections[]` array is REPLACED (different sections enabled, different order)
- `sections[].variant` is REPLACED (centered → overlay → split → minimal)
- `sections[].components[].enabled` is REPLACED (different components visible)
- `sections[].style` is REPLACED (different backgrounds, images, videos)
- `sections[].layout` is REPLACED (different padding, direction, align)
- `theme.*` is REPLACED (palette, font, mode)

**What is PRESERVED:**
- `site.*` (title, author, description — untouched)
- All `.props.text` values (headline text, CTA text, subtitle text)
- All `.props.url` values (link targets)

## Step 2: Test with 2 Dramatically Different Themes

Build exactly 2 themes to prove the architecture works:

**Test Theme A: "Nature Calm" (Overlay)**
- Hero layout: `overlay` (full background image with dark overlay)
- Components ON: headline, subtitle, primaryCTA, trustLine
- Components OFF: badge, secondaryCTA, heroImage
- Background: Unsplash ocean photo, dark semi-transparent overlay
- Sections: hero, features, testimonials, footer (NO pricing, NO cta)
- Font: Quicksand
- Palette: ocean greens

**Test Theme B: "Neon Terminal" (Minimal)**
- Hero layout: `minimal` (text only, no image whatsoever)
- Components ON: headline, subtitle, primaryCTA
- Components OFF: badge, secondaryCTA, heroImage, trustLine
- Background: near-black solid (#0d1117), no image
- Sections: hero, features, cta, footer (NO testimonials)
- Font: JetBrains Mono
- Palette: neon green (#00ff88) on black

**The test:** Switch between Nature Calm and Neon Terminal. They must look like two completely different websites. If the layout doesn't change, the architecture is still broken.

**Playwright assertion:**
```typescript
// Switch to Nature Calm
await page.click('[data-theme="nature-calm"]');
// Verify overlay layout exists (background image present)
await expect(page.locator('[data-variant="overlay"]')).toBeVisible();

// Switch to Neon Terminal  
await page.click('[data-theme="neon-terminal"]');
// Verify minimal layout (no background image, no overlay)
await expect(page.locator('[data-variant="minimal"]')).toBeVisible();
// Verify heroImage component is NOT visible
await expect(page.locator('[data-component="heroImage"]')).not.toBeVisible();
```

## Step 3: Once Architecture Works → Build All 10

Only after Step 2 passes — Nature Calm and Neon Terminal look like two different websites and the Playwright test confirms layout/component changes — then expand to all 10 themes using the specifications in the `14-theme-system-redesign.md` directive.

Also build the palette selector (5 options × 6 color slots) and font selector (5 font options) in the SIMPLE tab below the theme preset cards.

## Step 4: Playwright All 10

Screenshot all 10 themes. Visual diversity check. If any two look alike, fix before requesting human review.

---

**Go. Step 1 first. Report when Nature Calm vs Neon Terminal looks like two different websites.**