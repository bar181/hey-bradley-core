"""Reference impl: parse an AISP bundle. Python 3.10+ stdlib only. License: MIT.

Run: python parse-aisp-python.py sample-bundle.json

Demonstrates how a 3rd-party tool consumes an AISP bundle exported from
Hey Bradley (or any AISP-1.x compliant emitter). Uses Python stdlib only —
no Hey Bradley imports, no pip deps. Mirrors `parse-aisp-typescript.ts` 1:1.
"""

import json
import sys
from pathlib import Path


def main() -> None:
    if len(sys.argv) < 2:
        print("Usage: python parse-aisp-python.py <bundle.json>", file=sys.stderr)
        sys.exit(1)

    path = Path(sys.argv[1]).resolve()
    raw = path.read_text(encoding="utf-8")
    bundle = json.loads(raw)

    print("=== AISP Bundle Summary ===")
    print(f"File:     {path}")
    print(f"Spec:     {bundle.get('version', '(unknown)')}")
    print(f"Slug:     {bundle.get('slug', '(unknown)')}")

    site = bundle.get("site") or {}
    print(f"Title:    {site.get('title', '(untitled)')}")
    print(f"Tone:     {site.get('tone', '(none)')}")

    theme = bundle.get("theme")
    if theme:
        palette = theme.get("palette") or {}
        print(
            f"Theme:    preset={theme.get('preset', '?')}, "
            f"mode={theme.get('mode', '?')}, "
            f"palette-keys={len(palette)}"
        )

    sections = bundle.get("sections") or []
    print(f"\nSections: {len(sections)}")
    for i, s in enumerate(sections):
        print(
            f"  [{i}] type={s.get('type', '?')}, "
            f"id={s.get('id', '?')}, "
            f"enabled={s.get('enabled', False)}, "
            f"order={s.get('order', 0)}"
        )

    atoms = bundle.get("atoms")
    if atoms:
        print("\nAISP Atoms:")
        intent = atoms.get("intent")
        if intent:
            target = intent.get("target") or {}
            print(
                f"  INTENT       verb={intent.get('verb', '?')}, "
                f"target.type={target.get('type', '?')}, "
                f"confidence={intent.get('confidence', 0)}"
            )
        assumptions = atoms.get("assumptions")
        if assumptions:
            print(f"  ASSUMPTIONS  count={assumptions.get('count', 0)}")
        selection = atoms.get("selection")
        if selection:
            print(
                f"  SELECTION    templateId={selection.get('templateId', '?')}, "
                f"confidence={selection.get('confidence', 0)}"
            )
        content = atoms.get("content")
        if content:
            print(
                f"  CONTENT      tone={content.get('tone', '?')}, "
                f"length={content.get('length', '?')}, "
                f"confidence={content.get('confidence', 0)}"
            )
        patch = atoms.get("patch")
        if patch:
            ops = patch.get("operations") or []
            print(f"  PATCH        ops={len(ops)}, confidence={patch.get('confidence', 0)}")
    else:
        print("\nAISP Atoms: (none — bundle omitted atom traces)")

    pages = bundle.get("pages")
    if pages and len(pages) > 1:
        print(f"\nMulti-page bundle: {len(pages)} pages")
        for i, p in enumerate(pages):
            print(f"  [{i}] pageId={p.get('pageId', '?')}, title={p.get('title', '?')}")
    else:
        print("\nSingle-page bundle (no bundle.pages array).")

    print("\nDone.")


if __name__ == "__main__":
    main()
