const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 30000 });

  // Wait for app to render
  await page.waitForTimeout(3000);

  const results = {};

  // 1. COLOR CONTRAST AUDIT
  // Collect text elements and their computed styles
  results.contrast = await page.evaluate(() => {
    function getLuminance(r, g, b) {
      const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    }

    function parseColor(color) {
      const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (!match) return null;
      return { r: parseInt(match[1]), g: parseInt(match[2]), b: parseInt(match[3]) };
    }

    function getContrastRatio(fg, bg) {
      const l1 = getLuminance(fg.r, fg.g, fg.b);
      const l2 = getLuminance(bg.r, bg.g, bg.b);
      const lighter = Math.max(l1, l2);
      const darker = Math.min(l1, l2);
      return (lighter + 0.05) / (darker + 0.05);
    }

    function getEffectiveBg(el) {
      let current = el;
      while (current) {
        const style = getComputedStyle(current);
        const bg = style.backgroundColor;
        const parsed = parseColor(bg);
        if (parsed && (parsed.r !== 0 || parsed.g !== 0 || parsed.b !== 0 || bg.indexOf('rgba(0, 0, 0, 0)') === -1)) {
          // Not fully transparent
          const match = bg.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
          if (match && parseFloat(match[4]) === 0) {
            current = current.parentElement;
            continue;
          }
          return parsed;
        }
        current = current.parentElement;
      }
      return { r: 255, g: 255, b: 255 }; // default white
    }

    const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a, button, label, li, td, th, div');
    const issues = [];
    const passes = [];
    const checked = new Set();

    textElements.forEach(el => {
      const text = el.textContent?.trim();
      if (!text || text.length > 200 || checked.has(text)) return;

      // Only check leaf text nodes or elements with direct text
      if (el.children.length > 3 && el.tagName !== 'BUTTON' && el.tagName !== 'A') return;

      const style = getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return;

      const fg = parseColor(style.color);
      if (!fg) return;
      const bg = getEffectiveBg(el);
      const ratio = getContrastRatio(fg, bg);
      const fontSize = parseFloat(style.fontSize);
      const fontWeight = parseInt(style.fontWeight) || 400;
      const isLargeText = fontSize >= 18 || (fontSize >= 14 && fontWeight >= 700);
      const requiredRatio = isLargeText ? 3 : 4.5;

      const entry = {
        tag: el.tagName.toLowerCase(),
        text: text.substring(0, 60),
        fgColor: style.color,
        bgColor: `rgb(${bg.r}, ${bg.g}, ${bg.b})`,
        ratio: Math.round(ratio * 100) / 100,
        fontSize: fontSize,
        fontWeight: fontWeight,
        isLargeText,
        requiredRatio,
        passes: ratio >= requiredRatio,
      };

      if (!entry.passes) {
        issues.push(entry);
      } else {
        passes.push(entry);
      }
      checked.add(text);
    });

    return { issues, passCount: passes.length, samplePasses: passes.slice(0, 5) };
  });

  // 2. FONT SIZE AUDIT
  results.fontSizes = await page.evaluate(() => {
    const allElements = document.querySelectorAll('*');
    const issues = [];
    const sizes = {};

    allElements.forEach(el => {
      const style = getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden') return;
      const text = el.textContent?.trim();
      if (!text) return;

      const fontSize = parseFloat(style.fontSize);
      const key = `${fontSize}px`;
      sizes[key] = (sizes[key] || 0) + 1;

      if (fontSize < 12 && el.children.length === 0 && text.length > 0) {
        issues.push({
          tag: el.tagName.toLowerCase(),
          text: text.substring(0, 60),
          fontSize: fontSize,
          className: el.className?.substring?.(0, 80) || '',
        });
      }
    });

    return { issues, distribution: sizes };
  });

  // 3. KEYBOARD NAVIGATION / FOCUS INDICATORS
  results.focus = await page.evaluate(() => {
    const focusable = document.querySelectorAll('a, button, input, select, textarea, [tabindex]');
    const items = [];

    focusable.forEach(el => {
      const style = getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden') return;

      const tabindex = el.getAttribute('tabindex');
      const outlineStyle = style.outlineStyle;
      const outlineWidth = style.outlineWidth;
      const outlineColor = style.outlineColor;

      items.push({
        tag: el.tagName.toLowerCase(),
        type: el.getAttribute('type') || '',
        text: (el.textContent?.trim() || el.getAttribute('aria-label') || '').substring(0, 60),
        tabindex,
        role: el.getAttribute('role') || '',
        hasOutline: outlineStyle !== 'none' && parseFloat(outlineWidth) > 0,
        outlineDetail: `${outlineWidth} ${outlineStyle} ${outlineColor}`,
      });
    });

    return items;
  });

  // Tab through and check focus visibility
  results.tabOrder = [];
  for (let i = 0; i < 20; i++) {
    await page.keyboard.press('Tab');
    const focusInfo = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const style = getComputedStyle(el);
      const outline = style.outline;
      const boxShadow = style.boxShadow;
      return {
        tag: el.tagName.toLowerCase(),
        text: (el.textContent?.trim() || el.getAttribute('aria-label') || '').substring(0, 60),
        role: el.getAttribute('role') || '',
        hasVisibleFocus: (style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) > 0) ||
                         (boxShadow !== 'none' && boxShadow !== ''),
        outline,
        boxShadow: boxShadow?.substring(0, 80) || 'none',
      };
    });
    if (focusInfo) {
      results.tabOrder.push(focusInfo);
    }
  }

  // 4. ARIA LABELS
  results.aria = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button')).map(btn => ({
      text: btn.textContent?.trim().substring(0, 60) || '',
      ariaLabel: btn.getAttribute('aria-label') || '',
      ariaLabelledBy: btn.getAttribute('aria-labelledby') || '',
      title: btn.getAttribute('title') || '',
      hasAccessibleName: !!(btn.textContent?.trim() || btn.getAttribute('aria-label') || btn.getAttribute('aria-labelledby') || btn.getAttribute('title')),
      role: btn.getAttribute('role') || 'button',
    }));

    const inputs = Array.from(document.querySelectorAll('input, textarea, select')).map(inp => {
      const id = inp.id;
      const label = id ? document.querySelector(`label[for="${id}"]`) : null;
      const ariaLabel = inp.getAttribute('aria-label');
      const ariaLabelledBy = inp.getAttribute('aria-labelledby');
      const placeholder = inp.getAttribute('placeholder');
      return {
        tag: inp.tagName.toLowerCase(),
        type: inp.getAttribute('type') || 'text',
        id: id || '',
        hasLabel: !!label,
        ariaLabel: ariaLabel || '',
        ariaLabelledBy: ariaLabelledBy || '',
        placeholder: placeholder || '',
        hasAccessibleName: !!(label || ariaLabel || ariaLabelledBy),
      };
    });

    const ariaRoles = Array.from(document.querySelectorAll('[role]')).map(el => ({
      tag: el.tagName.toLowerCase(),
      role: el.getAttribute('role'),
      text: el.textContent?.trim().substring(0, 40) || '',
    }));

    return { buttons, inputs, ariaRoles };
  });

  // 5. ALT TEXT
  results.images = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('img')).map(img => ({
      src: img.src?.substring(0, 80) || '',
      alt: img.getAttribute('alt'),
      hasAlt: img.hasAttribute('alt'),
      width: img.naturalWidth,
      height: img.naturalHeight,
      role: img.getAttribute('role') || '',
    }));
  });

  // Also check SVGs and icons
  results.svgs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('svg')).map(svg => ({
      ariaLabel: svg.getAttribute('aria-label') || '',
      ariaHidden: svg.getAttribute('aria-hidden') || '',
      role: svg.getAttribute('role') || '',
      title: svg.querySelector('title')?.textContent || '',
      parentTag: svg.parentElement?.tagName?.toLowerCase() || '',
      parentAriaLabel: svg.parentElement?.getAttribute('aria-label') || '',
    })).slice(0, 30);
  });

  // 6. HEADING HIERARCHY
  results.headings = await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    const hierarchy = headings.map(h => ({
      level: parseInt(h.tagName[1]),
      text: h.textContent?.trim().substring(0, 80) || '',
      visible: getComputedStyle(h).display !== 'none',
    }));

    // Check for skipped levels
    const issues = [];
    for (let i = 1; i < hierarchy.length; i++) {
      if (hierarchy[i].level > hierarchy[i - 1].level + 1) {
        issues.push({
          message: `Skipped from h${hierarchy[i - 1].level} to h${hierarchy[i].level}`,
          after: hierarchy[i - 1].text,
          skippedTo: hierarchy[i].text,
        });
      }
    }

    const hasH1 = hierarchy.some(h => h.level === 1);
    const h1Count = hierarchy.filter(h => h.level === 1).length;

    return { hierarchy, issues, hasH1, h1Count };
  });

  // 7. GENERAL HTML VALIDITY CHECKS
  results.htmlChecks = await page.evaluate(() => {
    const checks = {};

    // lang attribute
    checks.htmlLang = document.documentElement.getAttribute('lang') || 'MISSING';

    // Page title
    checks.pageTitle = document.title || 'MISSING';

    // Skip links
    checks.skipLink = !!document.querySelector('a[href="#main"], a[href="#content"], [class*="skip"]');

    // Landmark regions
    checks.landmarks = {
      main: document.querySelectorAll('main, [role="main"]').length,
      nav: document.querySelectorAll('nav, [role="navigation"]').length,
      banner: document.querySelectorAll('header, [role="banner"]').length,
      contentinfo: document.querySelectorAll('footer, [role="contentinfo"]').length,
    };

    // Duplicate IDs
    const allIds = Array.from(document.querySelectorAll('[id]')).map(el => el.id);
    const duplicates = allIds.filter((id, i) => allIds.indexOf(id) !== i);
    checks.duplicateIds = [...new Set(duplicates)];

    // Auto-playing media
    checks.autoPlayMedia = document.querySelectorAll('video[autoplay], audio[autoplay]').length;

    return checks;
  });

  // Output as JSON
  console.log(JSON.stringify(results, null, 2));

  await browser.close();
})();
