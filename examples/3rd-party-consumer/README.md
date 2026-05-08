# 3rd-Party AISP Bundle Consumer

This directory shows how to consume an AISP bundle (exported from Hey Bradley,
or any AISP-1.x compliant emitter) in **TypeScript** and **Python**, with **zero
external dependencies** — stdlib only on both runtimes.

## Files

- `sample-bundle.json` — minimal AISP-1.2 bundle (single-page, 5 atom traces)
- `parse-aisp-typescript.ts` — Node 20+ reference parser (uses `node:fs` only)
- `parse-aisp-python.py` — Python 3.10+ reference parser (uses `json` + `pathlib`)

## Run

```bash
# TypeScript (requires Node 20+ and tsx)
npx tsx parse-aisp-typescript.ts sample-bundle.json

# Python (requires Python 3.10+)
python parse-aisp-python.py sample-bundle.json
```

Both parsers print the same structured summary: spec version, slug, site title,
theme info, section list, AISP atom traces, and (when present) the multi-page
table.

## Zero-dep guarantee

This directory intentionally contains **NO `package.json`** and **NO
`requirements.txt`**. That's the proof: an AISP bundle is consumable by any
runtime that can read JSON. If you want to wire this into your own project,
copy a single file and go.

## Learn more

- [Adoption guide — getting started](../../docs/aisp-adoption/00-getting-started.md)
- [Bundle schema reference](../../docs/aisp-adoption/01-bundle-schema.md)
- [Reference implementation walkthrough](../../docs/aisp-adoption/02-reference-implementation-walkthrough.md)
