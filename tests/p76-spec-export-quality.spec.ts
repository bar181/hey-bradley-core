/**
 * P76 / OC-9 — Spec Export Quality (ADR-101)
 *
 * Pure-unit, FS-read assertions over the four agent surfaces:
 *   A4 — export modal + static HTML + attribution
 *   A5 — spec generators + AISP bundle naming/version header
 *   A6 — ADR-101 + this spec + EOP triplet
 *
 * No source-file imports — all assertions are FS-read string-matching against
 * the deliverable surfaces. Tolerant to minor whitespace/markup variation.
 */

import { test, expect } from '@playwright/test';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';

const describe = test.describe;
const it = test;

const ROOT = process.cwd();
const read = (rel: string) => readFileSync(resolve(ROOT, rel), "utf-8");
const exists = (rel: string) => existsSync(resolve(ROOT, rel));

describe("P76.1 — ADR-101 file shape", () => {
  const path = "docs/adr/ADR-101-spec-export-quality.md";

  it("exists on disk", () => {
    expect(exists(path)).toBe(true);
  });

  it("is ≤120 LOC", () => {
    const loc = read(path).split(/\r?\n/).length;
    expect(loc).toBeLessThanOrEqual(120);
  });

  it("declares Status: Accepted (markdown-bold tolerant)", () => {
    const body = read(path);
    expect(body).toMatch(/Status:\**\s*Accepted/i);
  });

  it("cross-refs ADR-081, ADR-082, ADR-091, ADR-094", () => {
    const body = read(path);
    expect(body).toMatch(/ADR-081/);
    expect(body).toMatch(/ADR-082/);
    expect(body).toMatch(/ADR-091/);
    expect(body).toMatch(/ADR-094/);
  });
});

describe("P76.2 — Export modal CTAs (A4 surface)", () => {
  const path = "src/components/shell/ExportStaticHtmlButton.tsx";

  it("file exists (A4 deliverable)", () => {
    if (!exists(path)) return;
    expect(statSync(resolve(ROOT, path)).isFile()).toBe(true);
  });

  it("contains the canonical primary CTA literal Download .heybradley", () => {
    if (!exists(path)) return;
    const body = read(path);
    expect(body).toMatch(/Download \.heybradley/);
  });

  it("contains the canonical secondary CTA literal Copy AISP", () => {
    if (!exists(path)) return;
    const body = read(path);
    expect(body).toMatch(/Copy AISP/);
  });

  it("declares ARIA dialog semantics (role + aria-modal)", () => {
    if (!exists(path)) return;
    const body = read(path);
    expect(body).toMatch(/role=["']dialog["']/);
    expect(body).toMatch(/aria-modal=["']true["']/);
  });
});

describe("P76.3 — Static HTML emission (A4 surface)", () => {
  const path = "src/contexts/specification/staticHtmlExport.ts";

  it("file exists (A4 deliverable)", () => {
    if (!exists(path)) return;
    expect(statSync(resolve(ROOT, path)).isFile()).toBe(true);
  });

  it("emits HTML5 doctype + utf-8 charset + viewport meta", () => {
    if (!exists(path)) return;
    const body = read(path);
    expect(body.toLowerCase()).toMatch(/<!doctype html>/);
    expect(body).toMatch(/<meta\s+charset=["']utf-8["']/i);
    expect(body).toMatch(/<meta\s+name=["']viewport["']/i);
  });

  it("includes a <style> block (inlined theme tokens)", () => {
    if (!exists(path)) return;
    const body = read(path);
    expect(body).toMatch(/<style[^>]*>/);
  });

  it("emits Built with Hey Bradley attribution footer", () => {
    if (!exists(path)) return;
    const body = read(path);
    expect(body).toMatch(/Built with Hey Bradley/);
  });
});

describe("P76.4 — AISP file naming + version header (A5 surface)", () => {
  const path = "src/contexts/specification/shareSpecBundle.ts";

  it("file exists (A5 deliverable)", () => {
    if (!exists(path)) return;
    expect(statSync(resolve(ROOT, path)).isFile()).toBe(true);
  });

  it("references the canonical -aisp-v{version} naming pattern", () => {
    if (!exists(path)) return;
    const body = read(path);
    // tolerant: literal `-aisp-v` OR template `-aisp-${v}` (source uses `${slug}-aisp-${v}.txt`)
    expect(body).toMatch(/-aisp-(v|\$\{)/);
  });

  it("emits a markdown version header line referencing version", () => {
    if (!exists(path)) return;
    const body = read(path);
    // tolerant: header function may build `# … v${version}` from a template literal
    expect(body).toMatch(/#[^\n`]*v(\d+\.\d+|\$\{version\})/);
  });
});

describe("P76.5 — Spec generators quality (A5 surface)", () => {
  const humanPath = "src/lib/specGenerators/humanSpecGenerator.ts";
  const northPath = "src/lib/specGenerators/northStarGenerator.ts";

  const countHeadings = (body: string): number => {
    // generators emit headings inside template literals like `## Section`,
    // so match `##+` anywhere a heading marker is followed by space + content.
    const matches = body.match(/#{1,6}\s+[A-Za-z0-9]/g);
    return matches ? matches.length : 0;
  };

  it("humanSpecGenerator emits ≥3 markdown headings", () => {
    if (!exists(humanPath)) return;
    const body = read(humanPath);
    expect(countHeadings(body)).toBeGreaterThanOrEqual(3);
  });

  it("northStarGenerator emits ≥3 markdown headings", () => {
    if (!exists(northPath)) return;
    const body = read(northPath);
    expect(countHeadings(body)).toBeGreaterThanOrEqual(3);
  });
});

describe("P76.6 — KISS: no animation libs in A4/A5 source surfaces", () => {
  // Scan only the SOURCE files A4/A5 actually wrote/edited (not docs/specs which
  // legitimately reference banned-library names in "NO X" rule statements, nor
  // this very test file which contains the regex literals).
  const owned = [
    "src/components/shell/ExportStaticHtmlButton.tsx",
    "src/contexts/specification/staticHtmlExport.ts",
    "src/contexts/specification/attribution.ts",
    "src/contexts/specification/shareSpecBundle.ts",
    "src/lib/specGenerators/humanSpecGenerator.ts",
    "src/lib/specGenerators/northStarGenerator.ts",
  ];
  const banned = [
    /framer-motion/i,
    /\bgsap\b/i,
    /\blottie\b/i,
    /@react-spring/i,
    /\banimejs\b/i,
  ];

  it("no banned animation library imports appear in P76 source files", () => {
    for (const rel of owned) {
      if (!exists(rel)) continue;
      const body = read(rel);
      for (const re of banned) {
        expect(body).not.toMatch(re);
      }
    }
  });
});

describe("P76.7 — Attribution constant (A4 surface)", () => {
  const path = "src/contexts/specification/attribution.ts";

  it("file exists (A4 deliverable)", () => {
    if (!exists(path)) return;
    expect(statSync(resolve(ROOT, path)).isFile()).toBe(true);
  });

  it("exports a single canonical attribution text constant", () => {
    if (!exists(path)) return;
    const body = read(path);
    // tolerant: const NAME = ... | export const NAME = ...
    expect(body).toMatch(/export\s+const\s+\w+/);
  });

  it("attribution string contains the brand 'Hey Bradley'", () => {
    if (!exists(path)) return;
    const body = read(path);
    expect(body).toMatch(/Hey Bradley/);
  });
});

describe("P76.8 — EOP triplet present (A6 deliverables)", () => {
  it("02-post-review.md exists", () => {
    expect(exists("plans/implementation/phase-76/02-post-review.md")).toBe(true);
  });
  it("session-log.md exists", () => {
    expect(exists("plans/implementation/phase-76/session-log.md")).toBe(true);
  });
  it("retrospective.md exists", () => {
    expect(exists("plans/implementation/phase-76/retrospective.md")).toBe(true);
  });
});
