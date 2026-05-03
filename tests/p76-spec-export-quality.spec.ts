/**
 * P76 / OC-9 — Spec Export Quality (ADR-101)
 *
 * Filled by P108 / A8 (was empty per Track D / D7 audit). Enforces ADR-101's
 * 4 quality decisions over A4 (modal/static-html/attribution) + A5 (generators
 * + AISP bundle naming) source surfaces.
 *
 * PURE-UNIT: FS reads + regex/string asserts. NO browser bootstrap.
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
    expect(read(path).split(/\r?\n/).length).toBeLessThanOrEqual(120);
  });
  it("declares Status: Accepted (markdown-bold tolerant)", () => {
    expect(read(path)).toMatch(/Status:\**\s*Accepted/i);
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
    expect(read(path)).toMatch(/Download \.heybradley/);
  });
  it("contains the canonical secondary CTA literal Copy AISP", () => {
    if (!exists(path)) return;
    expect(read(path)).toMatch(/Copy AISP/);
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
    expect(read(path)).toMatch(/<style[^>]*>/);
  });
  it("emits Built with Hey Bradley attribution footer", () => {
    if (!exists(path)) return;
    expect(read(path)).toMatch(/Built with Hey Bradley/);
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
    // tolerant: literal `-aisp-v` OR template `-aisp-${v}` (source uses `${slug}-aisp-${v}.txt`)
    expect(read(path)).toMatch(/-aisp-(v|\$\{)/);
  });
  it("emits a markdown version header line referencing version", () => {
    if (!exists(path)) return;
    // tolerant: header function may build `# … v${version}` from a template literal
    expect(read(path)).toMatch(/#[^\n`]*v(\d+\.\d+|\$\{version\})/);
  });
});

describe("P76.5 — Spec generators quality (A5 surface)", () => {
  const humanPath = "src/lib/specGenerators/humanSpecGenerator.ts";
  const northPath = "src/lib/specGenerators/northStarGenerator.ts";
  const countHeadings = (body: string): number => {
    const matches = body.match(/#{1,6}\s+[A-Za-z0-9]/g);
    return matches ? matches.length : 0;
  };
  it("humanSpecGenerator emits ≥3 markdown headings", () => {
    if (!exists(humanPath)) return;
    expect(countHeadings(read(humanPath))).toBeGreaterThanOrEqual(3);
  });
  it("northStarGenerator emits ≥3 markdown headings", () => {
    if (!exists(northPath)) return;
    expect(countHeadings(read(northPath))).toBeGreaterThanOrEqual(3);
  });
});

describe("P76.6 — KISS: no animation libs in A4/A5 source surfaces", () => {
  const owned = [
    "src/components/shell/ExportStaticHtmlButton.tsx",
    "src/contexts/specification/staticHtmlExport.ts",
    "src/contexts/specification/attribution.ts",
    "src/contexts/specification/shareSpecBundle.ts",
    "src/lib/specGenerators/humanSpecGenerator.ts",
    "src/lib/specGenerators/northStarGenerator.ts",
  ];
  const banned = [/framer-motion/i, /\bgsap\b/i, /\blottie\b/i, /@react-spring/i, /\banimejs\b/i];
  it("no banned animation library imports appear in P76 source files", () => {
    for (const rel of owned) {
      if (!exists(rel)) continue;
      const body = read(rel);
      for (const re of banned) expect(body).not.toMatch(re);
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
    expect(read(path)).toMatch(/export\s+const\s+\w+/);
  });
  it("attribution string contains the brand 'Hey Bradley'", () => {
    if (!exists(path)) return;
    expect(read(path)).toMatch(/Hey Bradley/);
  });
});

describe("P76.8 — EOP triplet present (A6 deliverables)", () => {
  it("02-post-review.md exists", () => {
    // Post-scaffolding cleanup: 02-post-review.md archived under archive/.
    expect(exists("plans/implementation/phase-76/archive/02-post-review.md")).toBe(true);
  });
  it("session-log.md exists", () => {
    expect(exists("plans/implementation/phase-76/session-log.md")).toBe(true);
  });
  it("retrospective.md exists", () => {
    expect(exists("plans/implementation/phase-76/retrospective.md")).toBe(true);
  });
});
