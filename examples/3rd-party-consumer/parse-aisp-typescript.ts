// Reference impl: parse an AISP bundle. No external deps. License: MIT.
//
// Run: npx tsx parse-aisp-typescript.ts sample-bundle.json
//
// Demonstrates how a 3rd-party tool consumes an AISP bundle exported from
// Hey Bradley (or any AISP-1.x compliant emitter). Uses Node 20 stdlib only —
// no Hey Bradley imports, no npm deps. Mirrors `parse-aisp-python.py` 1:1.

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { argv, exit } from 'node:process';

interface AispAtoms {
  intent?: { verb?: string; target?: { type?: string; index?: number | null }; confidence?: number; rationale?: string };
  assumptions?: { items?: unknown[]; count?: number };
  selection?: { templateId?: string; confidence?: number; rationale?: string };
  content?: { text?: string; tone?: string; length?: string; confidence?: number };
  patch?: { operations?: unknown[]; confidence?: number };
}

interface AispBundle {
  version?: string;
  slug?: string;
  filenames?: Record<string, string>;
  site?: { title?: string; tone?: string; tagline?: string };
  theme?: { preset?: string; mode?: string; palette?: Record<string, string> };
  sections?: Array<{ type?: string; id?: string; enabled?: boolean; order?: number }>;
  pages?: Array<{ pageId?: string; title?: string; filenames?: Record<string, string> }>;
  atoms?: AispAtoms;
}

function main(): void {
  const path = argv[2];
  if (!path) {
    console.error('Usage: npx tsx parse-aisp-typescript.ts <bundle.json>');
    exit(1);
  }
  const abs = resolve(path);
  const raw = readFileSync(abs, 'utf-8');
  const bundle = JSON.parse(raw) as AispBundle;

  console.log('=== AISP Bundle Summary ===');
  console.log(`File:     ${abs}`);
  console.log(`Spec:     ${bundle.version ?? '(unknown)'}`);
  console.log(`Slug:     ${bundle.slug ?? '(unknown)'}`);
  console.log(`Title:    ${bundle.site?.title ?? '(untitled)'}`);
  console.log(`Tone:     ${bundle.site?.tone ?? '(none)'}`);

  if (bundle.theme) {
    const palette = bundle.theme.palette ?? {};
    console.log(`Theme:    preset=${bundle.theme.preset ?? '?'}, mode=${bundle.theme.mode ?? '?'}, palette-keys=${Object.keys(palette).length}`);
  }

  const sections = bundle.sections ?? [];
  console.log(`\nSections: ${sections.length}`);
  sections.forEach((s, i) => {
    console.log(`  [${i}] type=${s.type ?? '?'}, id=${s.id ?? '?'}, enabled=${s.enabled ?? false}, order=${s.order ?? 0}`);
  });

  const atoms = bundle.atoms;
  if (atoms) {
    console.log('\nAISP Atoms:');
    if (atoms.intent) console.log(`  INTENT       verb=${atoms.intent.verb ?? '?'}, target.type=${atoms.intent.target?.type ?? '?'}, confidence=${atoms.intent.confidence ?? 0}`);
    if (atoms.assumptions) console.log(`  ASSUMPTIONS  count=${atoms.assumptions.count ?? 0}`);
    if (atoms.selection) console.log(`  SELECTION    templateId=${atoms.selection.templateId ?? '?'}, confidence=${atoms.selection.confidence ?? 0}`);
    if (atoms.content) console.log(`  CONTENT      tone=${atoms.content.tone ?? '?'}, length=${atoms.content.length ?? '?'}, confidence=${atoms.content.confidence ?? 0}`);
    if (atoms.patch) console.log(`  PATCH        ops=${atoms.patch.operations?.length ?? 0}, confidence=${atoms.patch.confidence ?? 0}`);
  } else {
    console.log('\nAISP Atoms: (none — bundle omitted atom traces)');
  }

  const pages = bundle.pages;
  if (pages && pages.length > 1) {
    console.log(`\nMulti-page bundle: ${pages.length} pages`);
    pages.forEach((p, i) => {
      console.log(`  [${i}] pageId=${p.pageId ?? '?'}, title=${p.title ?? '?'}`);
    });
  } else {
    console.log('\nSingle-page bundle (no bundle.pages array).');
  }

  console.log('\nDone.');
}

main();
