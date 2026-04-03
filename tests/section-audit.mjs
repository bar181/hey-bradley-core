/**
 * Section Audit Test — Hey Bradley
 *
 * Comprehensive audit of all section renderers and editors:
 *   1. Ensures all 9 section types exist in the builder
 *   2. Clicks each section in the left panel
 *   3. Verifies right panel shows editing controls
 *   4. Tests variant switching (where available)
 *   5. Checks column count behavior
 *   6. Takes screenshots
 *   7. Reports working vs broken section/variant combos
 */

import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const SCREENSHOT_DIR = 'tests/screenshots/section-audit';
mkdirSync(SCREENSHOT_DIR, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const results = [];

function record(section, variant, works, notes) {
  results.push({ section, variant, works, notes });
  const status = works ? 'OK' : 'ISSUE';
  console.log(`  [${status}] ${section} / ${variant}: ${notes}`);
}

// ── Navigate to builder ──────────────────────────────────────────────
await page.goto('http://localhost:5173/builder', { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);

// ── Helper: select a section in the left panel by scrolling and finding text ──
async function selectSectionInPanel(sectionName) {
  const panel = page.locator('[data-builder-panel]');

  // Expand hidden sections if any
  const hiddenBtn = panel.locator('button').filter({ hasText: 'hidden' });
  if (await hiddenBtn.count() > 0) {
    await hiddenBtn.first().click();
    await page.waitForTimeout(300);
  }

  // Find the section row (role=button with the section name, exclude Theme row)
  const rows = panel.locator('div[role="button"]');
  const count = await rows.count();
  for (let i = 0; i < count; i++) {
    const rowText = await rows.nth(i).textContent().catch(() => '');
    // Match exact section name (handle cases like "Features" matching "FeaturesShowcase...")
    if (rowText.trim() === sectionName || rowText.startsWith(sectionName)) {
      await rows.nth(i).scrollIntoViewIfNeeded();
      await rows.nth(i).click();
      await page.waitForTimeout(600);
      return true;
    }
  }
  return false;
}

// ── Helper: enable a section if disabled (click the eye icon) ────────
async function ensureSectionEnabled(sectionName) {
  const panel = page.locator('[data-builder-panel]');

  // Expand hidden sections
  const hiddenBtn = panel.locator('button').filter({ hasText: 'hidden' });
  if (await hiddenBtn.count() > 0) {
    await hiddenBtn.first().click();
    await page.waitForTimeout(300);
  }

  const rows = panel.locator('div[role="button"]');
  const count = await rows.count();
  for (let i = 0; i < count; i++) {
    const rowText = await rows.nth(i).textContent().catch(() => '');
    if (rowText.trim() === sectionName || rowText.startsWith(sectionName)) {
      // Check opacity to determine if disabled
      const cls = await rows.nth(i).getAttribute('class').catch(() => '');
      if (cls && cls.includes('opacity-40')) {
        // Click the eye button to enable
        const eyeBtn = rows.nth(i).locator('button').first();
        if (await eyeBtn.count() > 0) {
          await eyeBtn.click();
          await page.waitForTimeout(400);
          return 'enabled';
        }
      }
      return 'already-enabled';
    }
  }
  return 'not-found';
}

// ── Helper: add a section via the Add Section button ─────────────────
async function addSectionType(typeName) {
  const panel = page.locator('[data-builder-panel]');
  const addBtn = panel.locator('button').filter({ hasText: 'Add Section' }).first();
  if (await addBtn.count() === 0) return false;
  await addBtn.scrollIntoViewIfNeeded();
  await addBtn.click();
  await page.waitForTimeout(400);

  // Find the type in the dropdown
  // The dropdown buttons have the section name + description
  const dropdownBtns = panel.locator('button').filter({ has: page.locator(`span:text-is("${typeName}")`) });
  if (await dropdownBtns.count() > 0) {
    await dropdownBtns.first().click();
    await page.waitForTimeout(600);
    return true;
  }
  return false;
}

// ── Helper: check right panel has controls ───────────────────────────
async function rightPanelHasControls() {
  await page.waitForTimeout(300);
  const btns = await page.locator('button').filter({ hasText: /^(Layout|Elements|Content|Media)$/ }).count();
  return btns > 0;
}

// ── Helper: click layout button in right panel ──────────────────────
async function clickLayoutBtn(label) {
  // Layout buttons have icon + span with the label, inside the right panel
  const btns = page.locator('button').filter({ has: page.locator(`span:text-is("${label}")`) });
  if (await btns.count() > 0) {
    await btns.first().click();
    await page.waitForTimeout(800);
    return true;
  }
  return false;
}

// ── Helper: expand accordion in right panel ─────────────────────────
async function expandAccordion(label) {
  const btn = page.locator('button').filter({ hasText: label }).first();
  if (await btn.count() > 0) {
    await btn.click();
    await page.waitForTimeout(300);
    return true;
  }
  return false;
}

// ── Helper: get preview HTML ─────────────────────────────────────────
async function getPreviewHtml() {
  return await page.innerHTML('.min-h-full').catch(() => '');
}

// ── Helper: screenshot ───────────────────────────────────────────────
async function screenshot(name) {
  await page.screenshot({ path: `${SCREENSHOT_DIR}/${name}.png`, fullPage: true });
}

// ── Helper: check data-testid input exists (expanding Content first) ──
async function checkTestId(testIdPrefix) {
  // Try expanding Content accordion
  await expandAccordion('Content');
  await page.waitForTimeout(300);
  return await page.locator(`[data-testid^="${testIdPrefix}"]`).count() > 0;
}

// =====================================================================
//  SETUP: Ensure all 9 section types exist and are enabled
// =====================================================================

console.log('\n========================================');
console.log('  SECTION FUNCTIONALITY AUDIT');
console.log('========================================\n');

console.log('=== SETUP ===\n');

// Enable any disabled sections
const defaultSections = ['Top Menu', 'Main Banner', 'Features', 'Action Block'];
for (const name of defaultSections) {
  const status = await ensureSectionEnabled(name);
  console.log(`  ${name}: ${status}`);
}

// Add missing section types
const sectionDisplayNames = {
  Reviews: 'Reviews',
  Pricing: 'Pricing',
  FAQ: 'FAQ',
  Highlights: 'Highlights',
  Footer: 'Footer',
};

// Check which sections are already in the panel
const panelText = await page.locator('[data-builder-panel]').textContent();
for (const [displayName] of Object.entries(sectionDisplayNames)) {
  // Check if it already exists as a section row (not in the add menu)
  const rows = page.locator('[data-builder-panel] div[role="button"]');
  const rowCount = await rows.count();
  let exists = false;
  for (let i = 0; i < rowCount; i++) {
    const rt = await rows.nth(i).textContent().catch(() => '');
    if (rt.trim() === displayName) {
      exists = true;
      break;
    }
  }
  if (!exists) {
    const added = await addSectionType(displayName);
    console.log(`  Added ${displayName}: ${added}`);
  } else {
    console.log(`  ${displayName}: already exists`);
  }
}

await page.waitForTimeout(500);

// List what we have now
console.log('\n  Current sections in panel:');
const allRows = page.locator('[data-builder-panel] div[role="button"]');
const allCount = await allRows.count();
for (let i = 0; i < allCount; i++) {
  const t = await allRows.nth(i).textContent().catch(() => '');
  console.log(`    ${i}: "${t.trim()}"`);
}

// =====================================================================
//  SECTION AUDITS
// =====================================================================
console.log('\n=== AUDITING SECTIONS ===\n');

// ── 1. NAVBAR ────────────────────────────────────────────────────────
{
  console.log('--- Navbar ---');
  const found = await selectSectionInPanel('Top Menu');
  if (!found) {
    record('navbar', 'editor-loads', false, 'Section not found in left panel');
  } else {
    const hasControls = await rightPanelHasControls();
    record('navbar', 'editor-loads', hasControls, hasControls ? 'Elements + Content accordions present' : 'No controls');

    const logoInput = await checkTestId('navbar-logo-input');
    record('navbar', 'logo-edit', logoInput, logoInput ? 'Logo text editable' : 'Logo input not found');

    const ctaInput = await page.locator('[data-testid="navbar-cta-input"]').count() > 0;
    record('navbar', 'cta-edit', ctaInput, ctaInput ? 'CTA text editable' : 'CTA input not found');

    record('navbar', 'variants', true, 'Single variant (NavbarSimple) — no variant switcher');
    record('navbar', 'image-support', false, 'No logo image — text-only brand name');

    await screenshot('navbar-simple');
  }
}

// ── 2. HERO ──────────────────────────────────────────────────────────
{
  console.log('\n--- Hero ---');
  const found = await selectSectionInPanel('Main Banner');
  if (!found) {
    record('hero', 'editor-loads', false, 'Section not found in left panel');
  } else {
    const hasControls = await rightPanelHasControls();
    record('hero', 'editor-loads', hasControls, hasControls ? 'Layout/Elements/Media/Content present' : 'No controls');

    const heroLayouts = [
      { label: 'Full Photo', renderer: 'HeroOverlay', check: 'from-black/80' },
      { label: 'Full Video', renderer: 'HeroCentered', check: 'text-center' },
      { label: 'Clean', renderer: 'HeroMinimal', check: 'min-h-[600px]' },
      { label: 'Simple', renderer: 'HeroCentered', check: 'items-center justify-center text-center' },
      { label: 'Photo Right', renderer: 'HeroSplit', check: 'gap-12' },
      { label: 'Photo Left', renderer: 'HeroSplit', check: 'order-2' },
      { label: 'Video Below', renderer: 'HeroCentered', check: 'text-center' },
      { label: 'Photo Below', renderer: 'HeroCentered', check: 'text-center' },
    ];

    for (const layout of heroLayouts) {
      const clicked = await clickLayoutBtn(layout.label);
      if (!clicked) {
        record('hero', layout.label, false, 'Layout button not found');
        continue;
      }
      const html = await getPreviewHtml();
      const hasCheck = html.includes(layout.check);
      const hasContent = html.includes('tracking-tight') || html.includes('font-extrabold');
      record('hero', layout.label, hasCheck && hasContent,
        `Renderer: ${layout.renderer}, ` +
        (hasContent ? 'Content renders' : 'NO CONTENT') + ', ' +
        (hasCheck ? 'Variant-specific markup present' : 'Variant markup missing'));

      await screenshot(`hero-${layout.label.toLowerCase().replace(/\s+/g, '-')}`);
    }

    // Check image support
    await clickLayoutBtn('Photo Right');
    await page.waitForTimeout(400);
    const hasImgPicker = await page.locator('text=Choose a Photo').count() > 0;
    record('hero', 'image-support', hasImgPicker, hasImgPicker ? 'ImagePicker available for photo layouts' : 'No ImagePicker');
  }
}

// ── 3. FEATURES ──────────────────────────────────────────────────────
{
  console.log('\n--- Features ---');
  const found = await selectSectionInPanel('Features');
  if (!found) {
    record('features', 'editor-loads', false, 'Section not found in left panel');
  } else {
    const hasControls = await rightPanelHasControls();
    record('features', 'editor-loads', hasControls, hasControls ? 'Layout + Content present' : 'No controls');

    // Test all 4 layout variants
    const layouts = [
      { label: '2 Columns', variant: 'grid-2col', expectCols: '2' },
      { label: '3 Columns', variant: 'grid-3col', expectCols: '3' },
      { label: '4 Columns', variant: 'grid-4col', expectCols: '4' },
      { label: 'Card Style', variant: 'cards', expectCols: null },
    ];

    for (const layout of layouts) {
      const clicked = await clickLayoutBtn(layout.label);
      if (!clicked) {
        record('features', layout.label, false, 'Layout button not found');
        continue;
      }
      const html = await getPreviewHtml();

      if (layout.variant === 'cards') {
        // FeaturesCards uses rgba background
        const isCards = html.includes('rgba(255,255,255,0.03)');
        record('features', layout.label, isCards,
          isCards ? 'FeaturesCards renders with card-style boxes' : 'Card template not detected');
      } else {
        // Check actual column count in the features section grid
        // FeaturesGrid HARDCODES md:grid-cols-3, ignoring layout.columns
        const has2 = html.includes('md:grid-cols-2');
        const has3 = html.includes('md:grid-cols-3');
        const has4 = html.includes('md:grid-cols-4');
        let actual = has4 ? '4' : has2 ? '2' : has3 ? '3' : '?';

        // For features specifically, look at just the feature section
        // There may be other grids (footer, etc.)
        const match = actual === layout.expectCols;
        record('features', layout.label, match,
          match ? `Column count ${actual} matches expected`
                : `BROKEN: Editor sets columns=${layout.expectCols} but FeaturesGrid hardcodes md:grid-cols-3. Actual in DOM: ${actual}`);
      }
      await screenshot(`features-${layout.variant}`);
    }

    // Add card functionality
    const addExists = await page.locator('button').filter({ hasText: 'Add Another' }).count() > 0;
    record('features', 'add-card', addExists, addExists ? 'Add Another card button works' : 'No add button (may need Content accordion open)');

    record('features', 'image-support', false, 'No image support — icon + title + description only');
  }
}

// ── 4. CTA ───────────────────────────────────────────────────────────
{
  console.log('\n--- CTA ---');
  const found = await selectSectionInPanel('Action Block');
  if (!found) {
    record('cta', 'editor-loads', false, 'Section not found in left panel');
  } else {
    const hasControls = await rightPanelHasControls();
    record('cta', 'editor-loads', hasControls, hasControls ? 'Layout/Elements/Content present' : 'No controls');

    const ctaLayouts = [
      { label: 'Centered', variant: 'simple', check: 'text-center' },
      { label: 'Side by Side', variant: 'split', check: 'md:flex-row' },
    ];

    for (const layout of ctaLayouts) {
      const clicked = await clickLayoutBtn(layout.label);
      if (!clicked) {
        record('cta', layout.label, false, 'Layout button not found');
        continue;
      }
      const html = await getPreviewHtml();
      const works = html.includes(layout.check);
      record('cta', layout.label, works,
        works ? `${layout.variant === 'simple' ? 'CTASimple' : 'CTASplit'} renders correctly`
              : `Expected ${layout.check} in DOM but not found`);
      await screenshot(`cta-${layout.variant}`);
    }

    record('cta', 'image-support', false, 'No image support — CTASplit has gradient placeholder, not user image');
  }
}

// ── 5. PRICING ───────────────────────────────────────────────────────
{
  console.log('\n--- Pricing ---');
  const found = await selectSectionInPanel('Pricing');
  if (!found) {
    record('pricing', 'editor-loads', false, 'Section not found in left panel');
  } else {
    const hasControls = await rightPanelHasControls();
    record('pricing', 'editor-loads', hasControls, hasControls ? 'Elements + Content present' : 'No controls');

    record('pricing', 'variants', true, 'Single variant (PricingTiers) — auto-adapts 2-col or 3-col based on tier count');

    const hasNameInput = await checkTestId('pricing-name-input');
    record('pricing', 'content-editing', hasNameInput, hasNameInput ? 'Name/price/features editable' : 'Inputs not found');

    record('pricing', 'image-support', false, 'No image support');
    await screenshot('pricing-tiers');
  }
}

// ── 6. TESTIMONIALS ──────────────────────────────────────────────────
{
  console.log('\n--- Testimonials ---');
  const found = await selectSectionInPanel('Reviews');
  if (!found) {
    record('testimonials', 'editor-loads', false, 'Section not found in left panel');
  } else {
    const hasControls = await rightPanelHasControls();
    record('testimonials', 'editor-loads', hasControls, hasControls ? 'Elements + Content present' : 'No controls');

    record('testimonials', 'variants', true, 'Single variant (TestimonialsCards) — no layout switcher');

    const hasInput = await checkTestId('testimonial-quote-input');
    record('testimonials', 'content-editing', hasInput, hasInput ? 'Quote/author/role editable' : 'Inputs not found');

    record('testimonials', 'image-support', false, 'No avatar image — uses initial letter only');
    await screenshot('testimonials-cards');
  }
}

// ── 7. FAQ ───────────────────────────────────────────────────────────
{
  console.log('\n--- FAQ ---');
  const found = await selectSectionInPanel('FAQ');
  if (!found) {
    record('faq', 'editor-loads', false, 'Section not found in left panel');
  } else {
    const hasControls = await rightPanelHasControls();
    record('faq', 'editor-loads', hasControls, hasControls ? 'Layout + Content present' : 'No controls');

    const faqLayouts = [
      { label: 'Expandable', variant: 'accordion', check: 'max-w-3xl' },
      { label: 'Side by Side', variant: 'two-column', check: 'md:grid-cols-2' },
    ];

    for (const layout of faqLayouts) {
      const clicked = await clickLayoutBtn(layout.label);
      if (!clicked) {
        record('faq', layout.label, false, 'Layout button not found');
        continue;
      }
      const html = await getPreviewHtml();
      const works = html.includes(layout.check);
      record('faq', layout.label, works,
        works ? `${layout.variant === 'accordion' ? 'FAQAccordion' : 'FAQTwoCol'} renders`
              : `Expected ${layout.check} not found`);
      await screenshot(`faq-${layout.variant}`);
    }

    record('faq', 'image-support', false, 'No image support — Q&A text only');
  }
}

// ── 8. VALUE PROPS ───────────────────────────────────────────────────
{
  console.log('\n--- Value Props ---');
  const found = await selectSectionInPanel('Highlights');
  if (!found) {
    record('value_props', 'editor-loads', false, 'Section not found in left panel');
  } else {
    const hasControls = await rightPanelHasControls();
    record('value_props', 'editor-loads', hasControls, hasControls ? 'Elements + Content present' : 'No controls');

    record('value_props', 'variants', true, 'Single variant (ValuePropsGrid) — hardcoded 2-col mobile / 4-col desktop');

    const hasInput = await checkTestId('valueprop-value-input');
    record('value_props', 'content-editing', hasInput, hasInput ? 'Value/label/description editable' : 'Inputs not found');

    record('value_props', 'image-support', false, 'No image support — numbers/text only');
    await screenshot('value-props-grid');
  }
}

// ── 9. FOOTER ────────────────────────────────────────────────────────
{
  console.log('\n--- Footer ---');
  const found = await selectSectionInPanel('Footer');
  if (!found) {
    record('footer', 'editor-loads', false, 'Section not found in left panel');
  } else {
    const hasControls = await rightPanelHasControls();
    record('footer', 'editor-loads', hasControls, hasControls ? 'Elements + Content present' : 'No controls');

    record('footer', 'variants', true, 'Single variant (FooterSimple) — no layout switcher');

    const hasBrand = await checkTestId('footer-brand-input');
    record('footer', 'content-editing', hasBrand, hasBrand ? 'Brand/links/copyright editable' : 'Inputs not found');

    record('footer', 'image-support', false, 'No logo image — text brand only');
    await screenshot('footer-simple');
  }
}

// =====================================================================
//  SUMMARY
// =====================================================================
await browser.close();

console.log('\n========================================');
console.log('  AUDIT RESULTS TABLE');
console.log('========================================\n');

console.log('Section          | Variant/Check       | Status | Notes');
console.log('─────────────────|─────────────────────|────────|──────────────────────────────────');
for (const r of results) {
  const status = r.works ? 'OK    ' : 'BROKEN';
  const sec = r.section.padEnd(16);
  const variant = r.variant.padEnd(19);
  console.log(`${sec} | ${variant} | ${status} | ${r.notes}`);
}

const passed = results.filter((r) => r.works);
const failed = results.filter((r) => !r.works);

console.log(`\nTotal: ${results.length} | Passed: ${passed.length} | Issues: ${failed.length}`);

if (failed.length > 0) {
  console.log('\n--- ISSUES ---\n');
  for (const r of failed) {
    console.log(`  [BROKEN] ${r.section} / ${r.variant}: ${r.notes}`);
  }
}

console.log('\n--- IMAGE SUPPORT SUMMARY ---\n');
for (const r of results.filter((r) => r.variant === 'image-support')) {
  console.log(`  ${r.section}: ${r.works ? 'YES' : 'NO'} — ${r.notes}`);
}

process.exit(0);
