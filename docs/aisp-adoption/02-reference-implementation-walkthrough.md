# Reference Implementation Walkthrough

A line-by-line tour of
[`examples/3rd-party-consumer/parse-aisp-typescript.ts`](../../examples/3rd-party-consumer/parse-aisp-typescript.ts).
The Python file
[`parse-aisp-python.py`](../../examples/3rd-party-consumer/parse-aisp-python.py)
is a 1:1 port — see the closing note.

## 1. Header + imports

```ts
// Reference impl: parse an AISP bundle. No external deps. License: MIT.
import { readFileSync } from 'node:fs';
import { resolve }      from 'node:path';
import { argv, exit }   from 'node:process';
```

Three Node 20 stdlib imports, all explicitly prefixed with `node:` to make the
zero-dep guarantee visible at a glance. **No `@hey-bradley` imports, no npm
packages.**

## 2. Type sketches

The parser declares `AispAtoms` and `AispBundle` as local TypeScript interfaces.
These are intentionally **partial** (every field is optional) so the parser
degrades gracefully on an older or trimmed bundle. They mirror the canonical
shapes from
[`docs/aisp-adoption/01-bundle-schema.md`](./01-bundle-schema.md) but do not
have to stay in sync byte-for-byte — adopters typically copy only the fields
they consume.

## 3. Open the file

```ts
const path = argv[2];
if (!path) { console.error('Usage: ...'); exit(1); }
const abs = resolve(path);
const raw = readFileSync(abs, 'utf-8');
const bundle = JSON.parse(raw) as AispBundle;
```

`process.argv[2]` is the user-supplied path. `resolve()` turns it absolute so
the error messages cite the real path. `readFileSync` + `JSON.parse` is the
entire I/O — no streaming, no schema lib, no Zod. The cast to `AispBundle` is
type-only at compile time; the runtime bytes pass through unmodified.

## 4. Print the top-level summary

```ts
console.log(`Spec:     ${bundle.version ?? '(unknown)'}`);
console.log(`Slug:     ${bundle.slug ?? '(unknown)'}`);
console.log(`Title:    ${bundle.site?.title ?? '(untitled)'}`);
```

Every access uses `?.` + `??` so a missing field never throws. This matters:
older bundles (pre-`aisp-1.2`) may not have `slug` or `filenames`; the parser
must keep going.

## 5. Theme block

```ts
if (bundle.theme) {
  const palette = bundle.theme.palette ?? {};
  console.log(`Theme:    preset=${bundle.theme.preset}, mode=${bundle.theme.mode}, palette-keys=${Object.keys(palette).length}`);
}
```

Reports a count of palette keys instead of dumping all six color values — the
goal is a one-line summary suitable for CI logs.

## 6. Sections table

```ts
const sections = bundle.sections ?? [];
console.log(`\nSections: ${sections.length}`);
sections.forEach((s, i) => { console.log(`  [${i}] type=${s.type}, id=${s.id}, ...`); });
```

Iterates the section array in order. The bundle preserves `order` as an
explicit numeric field; `sections.forEach` walks them in array order which is
identical to `order` ascending in every Hey Bradley export.

## 7. AISP atom traces

```ts
const atoms = bundle.atoms;
if (atoms) {
  if (atoms.intent)      console.log(`  INTENT       verb=..., confidence=...`);
  if (atoms.assumptions) console.log(`  ASSUMPTIONS  count=...`);
  if (atoms.selection)   console.log(`  SELECTION    templateId=..., confidence=...`);
  if (atoms.content)     console.log(`  CONTENT      tone=..., length=..., confidence=...`);
  if (atoms.patch)       console.log(`  PATCH        ops=..., confidence=...`);
}
```

Each branch is independent. A bundle that ran a `change-hero-title` patch will
have INTENT + SELECTION + PATCH but no CONTENT. A low-confidence run will have
INTENT + ASSUMPTIONS but no SELECTION. The parser surfaces whatever is there.

## 8. Multi-page handling

```ts
const pages = bundle.pages;
if (pages && pages.length > 1) {
  pages.forEach((p, i) => { console.log(`  [${i}] pageId=${p.pageId}, title=${p.title}`); });
} else {
  console.log('Single-page bundle (no bundle.pages array).');
}
```

The contract from ADR-103 is: `bundle.pages` is **only** present when the
master config has more than one page. Single-page bundles omit the array
entirely so consumers can branch on existence, not length.

## 9. Output format

Plain text written to stdout, one fact per line. No JSON, no colors, no spinner.
This format is grep-able, diff-able, and CI-friendly. If you want JSON output,
swap `console.log` for `process.stdout.write(JSON.stringify(...))` and you have
a one-line transformer.

## Python port

[`parse-aisp-python.py`](../../examples/3rd-party-consumer/parse-aisp-python.py)
mirrors this file 1:1: same imports surface (Python's `json` + `pathlib` + `sys`
replace `node:fs` + `node:path` + `node:process`), same control flow, same
output format. There is no algorithm difference between the two — see the TS
file above for the canonical walkthrough.

## What this file does *not* do

- No schema validation (use [Zod](https://zod.dev) or
  [Pydantic](https://docs.pydantic.dev) for that — both are one-import drops)
- No JSON-Patch application (use [`fast-json-patch`](https://github.com/Starcounter-Jack/JSON-Patch) on Node, [`jsonpatch`](https://pypi.org/project/jsonpatch/) on Python)
- No HTML rendering (the bundle ships pure data; rendering is the adopter's job)

The parser is a **read-and-summarize** reference. Branch from here for your
own consumer.
