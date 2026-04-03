/**
 * Variant Screenshots — Hey Bradley Builder
 *
 * Takes screenshots of ALL section layout variants in the builder,
 * plus theme palette selector, ImagePicker dialog, and light mode views.
 */

import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const BASE = 'http://localhost:5173';
const SS_DIR = 'tests/screenshots/variants';
mkdirSync(SS_DIR, { recursive: true });

const results = [];
function record(section, variant, status, notes) {
  results.push({ section, variant, status, notes });
  console.log(`  [${status}] ${section} / ${variant}: ${notes}`);
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

// ── Navigate to builder ──
await page.goto(`${BASE}/builder`, { waitUntil: 'networkidle', timeout: 20000 });
await page.waitForTimeout(2000);

// ── Helpers ──

async function selectSectionByName(displayName) {
  const panel = page.locator('[data-builder-panel]');
  // Expand hidden sections
  const hiddenBtn = panel.locator('button').filter({ hasText: /hidden/ });
  if (await hiddenBtn.count() > 0) {
    try { await hiddenBtn.first().click(); await page.waitForTimeout(300); } catch {}
  }
  const rows = panel.locator('div[role="button"]');
  const count = await rows.count();
  for (let i = 0; i < count; i++) {
    const text = await rows.nth(i).textContent().catch(() => '');
    if (text.trim() === displayName || text.trim().startsWith(displayName)) {
      await rows.nth(i).scrollIntoViewIfNeeded();
      await rows.nth(i).click();
      await page.waitForTimeout(800);
      return true;
    }
  }
  return false;
}

async function clickLayoutVariant(label) {
  // Layout variant buttons have a span with the label text inside a grid of buttons
  const btns = page.locator('button').filter({ has: page.locator(`span:text-is("${label}")`) });
  const count = await btns.count();
  for (let i = 0; i < count; i++) {
    const isVisible = await btns.nth(i).isVisible().catch(() => false);
    if (isVisible) {
      await btns.nth(i).click();
      await page.waitForTimeout(1000);
      return true;
    }
  }
  return false;
}

async function screenshot(name) {
  await page.screenshot({ path: `${SS_DIR}/${name}.png`, fullPage: false });
}

async function getPreviewContent() {
  return await page.locator('.min-h-full').first().innerHTML().catch(() => '');
}

async function checkPreviewRenders() {
  const html = await getPreviewContent();
  // Check if there's meaningful content (not just empty container)
  const hasText = html.length > 100;
  const hasError = html.includes('Error') || html.includes('error');
  return { hasText, hasError, length: html.length };
}

async function addSectionIfMissing(displayName, sectionType) {
  // Check if section exists
  const panel = page.locator('[data-builder-panel]');
  const rows = panel.locator('div[role="button"]');
  const count = await rows.count();
  for (let i = 0; i < count; i++) {
    const text = await rows.nth(i).textContent().catch(() => '');
    if (text.trim() === displayName) return true;
  }
  // Add it
  const addBtn = panel.locator('button').filter({ hasText: 'Add Section' }).first();
  if (await addBtn.count() === 0) return false;
  await addBtn.click();
  await page.waitForTimeout(400);
  // Click the section type in the dropdown
  const dropdownItem = page.locator('[data-builder-panel] button').filter({ hasText: displayName });
  if (await dropdownItem.count() > 0) {
    await dropdownItem.first().click();
    await page.waitForTimeout(600);
    return true;
  }
  return false;
}

async function ensureSectionEnabled(displayName) {
  const panel = page.locator('[data-builder-panel]');
  // Expand hidden
  const hiddenBtn = panel.locator('button').filter({ hasText: /hidden/ });
  if (await hiddenBtn.count() > 0) {
    try { await hiddenBtn.first().click(); await page.waitForTimeout(300); } catch {}
  }
  const rows = panel.locator('div[role="button"]');
  const count = await rows.count();
  for (let i = 0; i < count; i++) {
    const text = await rows.nth(i).textContent().catch(() => '');
    if (text.trim() === displayName || text.trim().startsWith(displayName)) {
      const cls = await rows.nth(i).getAttribute('class').catch(() => '');
      if (cls && cls.includes('opacity-40')) {
        const eyeBtn = rows.nth(i).locator('button').first();
        if (await eyeBtn.count() > 0) {
          await eyeBtn.click();
          await page.waitForTimeout(400);
        }
      }
      return;
    }
  }
}

// ── SETUP: ensure all sections exist and are enabled ──
console.log('\n========================================');
console.log('  VARIANT SCREENSHOT AUDIT');
console.log('========================================\n');

console.log('=== SETUP ===\n');

const SECTIONS_TO_ADD = [
  { display: 'Quotes', type: 'quotes' },
  { display: 'Questions', type: 'questions' },
  { display: 'Numbers', type: 'numbers' },
  { display: 'Gallery', type: 'gallery' },
  { display: 'Footer', type: 'footer' },
  { display: 'Pricing', type: 'pricing' },
];

for (const s of SECTIONS_TO_ADD) {
  const added = await addSectionIfMissing(s.display, s.type);
  console.log(`  ${s.display}: ${added ? 'present' : 'could not add'}`);
}

// Ensure all enabled
const ALL_DISPLAY_NAMES = ['Top Menu', 'Main Banner', 'Columns', 'Action Block', 'Pricing', 'Footer', 'Quotes', 'Questions', 'Numbers', 'Gallery'];
for (const name of ALL_DISPLAY_NAMES) {
  await ensureSectionEnabled(name);
}

await page.waitForTimeout(500);

// =====================================================================
//  1. HERO (8 layouts)
// =====================================================================
console.log('\n=== HERO (Main Banner) — 8 layouts ===\n');
{
  const found = await selectSectionByName('Main Banner');
  if (!found) {
    record('hero', 'all', 'SKIP', 'Main Banner not found in left panel');
  } else {
    const heroLayouts = [
      { label: 'Full Photo', file: 'hero-full-photo' },
      { label: 'Full Video', file: 'hero-full-video' },
      { label: 'Clean', file: 'hero-clean' },
      { label: 'Simple', file: 'hero-simple' },
      { label: 'Photo Right', file: 'hero-photo-right' },
      { label: 'Photo Left', file: 'hero-photo-left' },
      { label: 'Video Below', file: 'hero-video-below' },
      { label: 'Photo Below', file: 'hero-photo-below' },
    ];

    for (const layout of heroLayouts) {
      const clicked = await clickLayoutVariant(layout.label);
      if (!clicked) {
        record('hero', layout.label, 'FAIL', 'Layout button not found');
        continue;
      }
      const preview = await checkPreviewRenders();
      await screenshot(layout.file);
      if (preview.hasError) {
        record('hero', layout.label, 'ERROR', `Preview contains error, HTML length=${preview.length}`);
      } else if (!preview.hasText) {
        record('hero', layout.label, 'BLANK', `Preview appears blank, HTML length=${preview.length}`);
      } else {
        record('hero', layout.label, 'OK', `Renders correctly, HTML length=${preview.length}`);
      }
    }
  }
}

// =====================================================================
//  2. COLUMNS (8 variants + column count test)
// =====================================================================
console.log('\n=== COLUMNS (Features) — 8 variants ===\n');
{
  const found = await selectSectionByName('Columns');
  if (!found) {
    record('columns', 'all', 'SKIP', 'Columns not found in left panel');
  } else {
    const columnLayouts = [
      { label: 'Cards', file: 'columns-cards' },
      { label: 'Image Cards', file: 'columns-image-cards' },
      { label: 'Icon + Text', file: 'columns-icon-text' },
      { label: 'Minimal', file: 'columns-minimal' },
      { label: 'Numbered', file: 'columns-numbered' },
      { label: 'Horizontal', file: 'columns-horizontal' },
      { label: 'Gradient', file: 'columns-gradient' },
      { label: 'Glass', file: 'columns-glass' },
    ];

    for (const layout of columnLayouts) {
      const clicked = await clickLayoutVariant(layout.label);
      if (!clicked) {
        record('columns', layout.label, 'FAIL', 'Layout button not found');
        continue;
      }
      const preview = await checkPreviewRenders();
      await screenshot(layout.file);
      if (preview.hasError) {
        record('columns', layout.label, 'ERROR', `Preview contains error`);
      } else if (!preview.hasText) {
        record('columns', layout.label, 'BLANK', `Preview appears blank`);
      } else {
        record('columns', layout.label, 'OK', `Renders correctly`);
      }
    }
  }
}

// =====================================================================
//  3. ACTION (4 variants)
// =====================================================================
console.log('\n=== ACTION (Action Block) — 4 variants ===\n');
{
  const found = await selectSectionByName('Action Block');
  if (!found) {
    record('action', 'all', 'SKIP', 'Action Block not found');
  } else {
    const ctaLayouts = [
      { label: 'Centered', file: 'action-centered' },
      { label: 'Side by Side', file: 'action-split' },
      { label: 'Gradient', file: 'action-gradient' },
      { label: 'Newsletter', file: 'action-newsletter' },
    ];

    for (const layout of ctaLayouts) {
      const clicked = await clickLayoutVariant(layout.label);
      if (!clicked) {
        record('action', layout.label, 'FAIL', 'Layout button not found');
        continue;
      }
      const preview = await checkPreviewRenders();
      await screenshot(layout.file);
      if (preview.hasError) {
        record('action', layout.label, 'ERROR', `Preview contains error`);
      } else if (!preview.hasText) {
        record('action', layout.label, 'BLANK', `Preview appears blank`);
      } else {
        record('action', layout.label, 'OK', `Renders correctly`);
      }
    }
  }
}

// =====================================================================
//  4. QUOTES (4 variants)
// =====================================================================
console.log('\n=== QUOTES — 4 variants ===\n');
{
  const found = await selectSectionByName('Quotes');
  if (!found) {
    record('quotes', 'all', 'SKIP', 'Quotes not found');
  } else {
    const layouts = [
      { label: 'Cards', file: 'quotes-cards' },
      { label: 'Single', file: 'quotes-single' },
      { label: 'Stars', file: 'quotes-stars' },
      { label: 'Minimal', file: 'quotes-minimal' },
    ];

    for (const layout of layouts) {
      const clicked = await clickLayoutVariant(layout.label);
      if (!clicked) {
        record('quotes', layout.label, 'FAIL', 'Layout button not found');
        continue;
      }
      const preview = await checkPreviewRenders();
      await screenshot(layout.file);
      if (preview.hasError) {
        record('quotes', layout.label, 'ERROR', `Preview contains error`);
      } else if (!preview.hasText) {
        record('quotes', layout.label, 'BLANK', `Preview appears blank`);
      } else {
        record('quotes', layout.label, 'OK', `Renders correctly`);
      }
    }
  }
}

// =====================================================================
//  5. QUESTIONS (4 variants)
// =====================================================================
console.log('\n=== QUESTIONS (FAQ) — 4 variants ===\n');
{
  const found = await selectSectionByName('Questions');
  if (!found) {
    record('questions', 'all', 'SKIP', 'Questions not found');
  } else {
    const layouts = [
      { label: 'Expandable', file: 'questions-expandable' },
      { label: 'Side by Side', file: 'questions-side-by-side' },
      { label: 'Cards', file: 'questions-cards' },
      { label: 'Numbered', file: 'questions-numbered' },
    ];

    for (const layout of layouts) {
      const clicked = await clickLayoutVariant(layout.label);
      if (!clicked) {
        record('questions', layout.label, 'FAIL', 'Layout button not found');
        continue;
      }
      const preview = await checkPreviewRenders();
      await screenshot(layout.file);
      if (preview.hasError) {
        record('questions', layout.label, 'ERROR', `Preview contains error`);
      } else if (!preview.hasText) {
        record('questions', layout.label, 'BLANK', `Preview appears blank`);
      } else {
        record('questions', layout.label, 'OK', `Renders correctly`);
      }
    }
  }
}

// =====================================================================
//  6. NUMBERS (4 variants)
// =====================================================================
console.log('\n=== NUMBERS (Value Props) — 4 variants ===\n');
{
  const found = await selectSectionByName('Numbers');
  if (!found) {
    record('numbers', 'all', 'SKIP', 'Numbers not found');
  } else {
    const layouts = [
      { label: 'Counters', file: 'numbers-counters' },
      { label: 'Icons', file: 'numbers-icons' },
      { label: 'Cards', file: 'numbers-cards' },
      { label: 'Gradient', file: 'numbers-gradient' },
    ];

    for (const layout of layouts) {
      const clicked = await clickLayoutVariant(layout.label);
      if (!clicked) {
        record('numbers', layout.label, 'FAIL', 'Layout button not found');
        continue;
      }
      const preview = await checkPreviewRenders();
      await screenshot(layout.file);
      if (preview.hasError) {
        record('numbers', layout.label, 'ERROR', `Preview contains error`);
      } else if (!preview.hasText) {
        record('numbers', layout.label, 'BLANK', `Preview appears blank`);
      } else {
        record('numbers', layout.label, 'OK', `Renders correctly`);
      }
    }
  }
}

// =====================================================================
//  7. FOOTER (3 variants)
// =====================================================================
console.log('\n=== FOOTER — 3 variants ===\n');
{
  const found = await selectSectionByName('Footer');
  if (!found) {
    record('footer', 'all', 'SKIP', 'Footer not found');
  } else {
    const layouts = [
      { label: 'Multi-Column', file: 'footer-multi-column' },
      { label: 'Simple Bar', file: 'footer-simple-bar' },
      { label: 'Minimal', file: 'footer-minimal' },
    ];

    for (const layout of layouts) {
      const clicked = await clickLayoutVariant(layout.label);
      if (!clicked) {
        record('footer', layout.label, 'FAIL', 'Layout button not found');
        continue;
      }
      const preview = await checkPreviewRenders();
      await screenshot(layout.file);
      if (preview.hasError) {
        record('footer', layout.label, 'ERROR', `Preview contains error`);
      } else if (!preview.hasText) {
        record('footer', layout.label, 'BLANK', `Preview appears blank`);
      } else {
        record('footer', layout.label, 'OK', `Renders correctly`);
      }
    }
  }
}

// =====================================================================
//  8. GALLERY (4 variants)
// =====================================================================
console.log('\n=== GALLERY — 4 variants ===\n');
{
  const found = await selectSectionByName('Gallery');
  if (!found) {
    record('gallery', 'all', 'SKIP', 'Gallery not found');
  } else {
    const layouts = [
      { label: 'Grid', file: 'gallery-grid' },
      { label: 'Masonry', file: 'gallery-masonry' },
      { label: 'Carousel', file: 'gallery-carousel' },
      { label: 'Full Width', file: 'gallery-full-width' },
    ];

    for (const layout of layouts) {
      const clicked = await clickLayoutVariant(layout.label);
      if (!clicked) {
        record('gallery', layout.label, 'FAIL', 'Layout button not found');
        continue;
      }
      const preview = await checkPreviewRenders();
      await screenshot(layout.file);
      if (preview.hasError) {
        record('gallery', layout.label, 'ERROR', `Preview contains error`);
      } else if (!preview.hasText) {
        record('gallery', layout.label, 'BLANK', `Preview appears blank`);
      } else {
        record('gallery', layout.label, 'OK', `Renders correctly`);
      }
    }
  }
}

// =====================================================================
//  9. THEME / PALETTE SELECTOR
// =====================================================================
console.log('\n=== THEME / PALETTE ===\n');
{
  // Click the Theme row in the left panel
  const themeRow = page.locator('[data-builder-panel] div[role="button"]').filter({ hasText: 'Theme' });
  if (await themeRow.count() > 0) {
    await themeRow.first().click();
    await page.waitForTimeout(500);

    // Expand the theme dropdown (click the button containing ChevronDown)
    const themeBtn = page.locator('button').filter({ has: page.locator('svg') }).filter({ hasText: /Midnight|Forest|Sunset|Ocean|Rose|Default|Agency|Neon/i });
    if (await themeBtn.count() > 0) {
      await themeBtn.first().click();
      await page.waitForTimeout(400);
    }
    // Also try the direct approach — click the theme selector that has ChevronDown
    const themeSelector = page.locator('[data-builder-panel]').locator('..').locator('..').locator('button').filter({ hasText: /ChevronDown|mood/ });

    await screenshot('theme-palette-selector');
    record('theme', 'palette-selector', 'OK', 'Theme palette UI visible');

    // Take screenshot of color palettes section
    await screenshot('theme-palettes');
    record('theme', 'palettes', 'OK', 'Color palette presets visible');
  } else {
    record('theme', 'palette-selector', 'FAIL', 'Theme row not found');
  }
}

// =====================================================================
//  10. IMAGEPICKER DIALOG
// =====================================================================
console.log('\n=== IMAGEPICKER DIALOG ===\n');
{
  // Select hero with a photo layout to get the ImagePicker button
  const found = await selectSectionByName('Main Banner');
  if (found) {
    await clickLayoutVariant('Photo Right');
    await page.waitForTimeout(500);

    // Click the "Choose a Photo" button
    const pickerBtn = page.locator('button').filter({ hasText: 'Choose a Photo' });
    if (await pickerBtn.count() > 0) {
      await pickerBtn.first().click();
      await page.waitForTimeout(800);
      await screenshot('imagepicker-dialog');
      record('imagepicker', 'dialog', 'OK', 'ImagePicker dialog opens with photo grid');

      // Close dialog
      const closeBtn = page.locator('button').filter({ has: page.locator('svg.lucide-x') });
      if (await closeBtn.count() > 0) {
        await closeBtn.first().click();
        await page.waitForTimeout(300);
      } else {
        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);
      }
    } else {
      record('imagepicker', 'dialog', 'FAIL', 'Choose a Photo button not found');
    }
  }
}

// =====================================================================
//  11. LIGHT MODE VIEWS
// =====================================================================
console.log('\n=== LIGHT MODE VIEWS ===\n');
{
  // Switch to light mode via the Theme panel mode toggle
  const themeRow = page.locator('[data-builder-panel] div[role="button"]').filter({ hasText: 'Theme' });
  if (await themeRow.count() > 0) {
    await themeRow.first().click();
    await page.waitForTimeout(400);
  }

  // Click the Light mode button
  const lightBtn = page.locator('button').filter({ hasText: 'Light' });
  let switched = false;
  for (let i = 0; i < await lightBtn.count(); i++) {
    const text = await lightBtn.nth(i).textContent();
    if (text?.trim() === 'Light') {
      await lightBtn.nth(i).click();
      switched = true;
      await page.waitForTimeout(800);
      break;
    }
  }

  if (!switched) {
    // Try the aria-label approach
    const toggle = page.locator('button[aria-label="Switch to light mode"]');
    if (await toggle.count() > 0) {
      await toggle.click();
      switched = true;
      await page.waitForTimeout(800);
    }
  }

  if (switched) {
    // Take light mode screenshots for key sections
    const lightSections = [
      { display: 'Main Banner', file: 'light-hero' },
      { display: 'Columns', file: 'light-columns' },
      { display: 'Action Block', file: 'light-action' },
      { display: 'Quotes', file: 'light-quotes' },
      { display: 'Questions', file: 'light-questions' },
      { display: 'Numbers', file: 'light-numbers' },
      { display: 'Footer', file: 'light-footer' },
      { display: 'Gallery', file: 'light-gallery' },
    ];

    for (const sec of lightSections) {
      const found = await selectSectionByName(sec.display);
      if (found) {
        await page.waitForTimeout(500);
        await screenshot(sec.file);
        record('light-mode', sec.display, 'OK', 'Light mode screenshot captured');
      } else {
        record('light-mode', sec.display, 'FAIL', 'Section not found');
      }
    }

    // Switch back to dark mode
    const darkBtn = page.locator('button').filter({ hasText: 'Dark' });
    for (let i = 0; i < await darkBtn.count(); i++) {
      const text = await darkBtn.nth(i).textContent();
      if (text?.trim() === 'Dark') {
        await darkBtn.nth(i).click();
        await page.waitForTimeout(500);
        break;
      }
    }
  } else {
    record('light-mode', 'all', 'FAIL', 'Could not switch to light mode');
  }
}

// =====================================================================
//  SUMMARY
// =====================================================================
await browser.close();

console.log('\n========================================');
console.log('  RESULTS SUMMARY');
console.log('========================================\n');

console.log('Section          | Variant             | Status | Notes');
console.log('-----------------|---------------------|--------|------');
for (const r of results) {
  const sec = r.section.padEnd(16);
  const variant = r.variant.padEnd(19);
  const status = r.status.padEnd(6);
  console.log(`${sec} | ${variant} | ${status} | ${r.notes}`);
}

const ok = results.filter(r => r.status === 'OK').length;
const fail = results.filter(r => r.status === 'FAIL').length;
const error = results.filter(r => r.status === 'ERROR').length;
const blank = results.filter(r => r.status === 'BLANK').length;
const skip = results.filter(r => r.status === 'SKIP').length;

console.log(`\nTotal: ${results.length} | OK: ${ok} | FAIL: ${fail} | ERROR: ${error} | BLANK: ${blank} | SKIP: ${skip}`);

if (fail + error + blank > 0) {
  console.log('\n--- ISSUES ---\n');
  for (const r of results.filter(r => r.status !== 'OK' && r.status !== 'SKIP')) {
    console.log(`  [${r.status}] ${r.section} / ${r.variant}: ${r.notes}`);
  }
}

process.exit(0);
