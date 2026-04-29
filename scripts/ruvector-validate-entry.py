#!/usr/bin/env python3
"""ruvector-validate-entry: schema validator for ruvector entries.

Reads a JSON file (single object or array of objects) and asserts each
entry conforms to plans/strategic-reviews/ruvector-entry-schema-2026-04-29.md.

  python3 scripts/ruvector-validate-entry.py <path-to-json>

Exit 0 on all-pass; exit 1 with errors listed on any-fail.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

NAMESPACES = {
    "hey-bradley-phases", "hey-bradley-adrs", "hey-bradley-decisions",
    "hey-bradley-learnings", "hey-bradley-tasks", "hey-bradley-strategic",
}
TYPES = {"semantic", "pattern", "procedural", "episodic", "working"}
ID_RE = re.compile(r"^entry_\d+_[a-z0-9]{6,}$")
REQUIRED_FIELDS = ("id", "namespace", "key", "type", "content", "tags", "metadata")


def validate_entry(entry: dict, idx: int) -> list[str]:
    errs: list[str] = []
    p = f"entry[{idx}]"
    if not isinstance(entry, dict):
        return [f"{p}: not an object"]
    for f in REQUIRED_FIELDS:
        if f not in entry:
            errs.append(f"{p}: missing required field '{f}'")
    if errs:
        return errs
    if not isinstance(entry["id"], str) or not ID_RE.match(entry["id"]):
        errs.append(f"{p}.id: must match entry_<ms>_<rand6+> (got {entry['id']!r})")
    if entry["namespace"] not in NAMESPACES:
        errs.append(f"{p}.namespace: {entry['namespace']!r} not in {sorted(NAMESPACES)}")
    if not isinstance(entry["key"], str) or not entry["key"]:
        errs.append(f"{p}.key: must be non-empty string")
    if entry["type"] not in TYPES:
        errs.append(f"{p}.type: {entry['type']!r} not in {sorted(TYPES)}")
    if not isinstance(entry["content"], str) or len(entry["content"]) < 200:
        n = len(entry["content"]) if isinstance(entry["content"], str) else "n/a"
        errs.append(f"{p}.content: length {n} < 200 chars")
    if not isinstance(entry["tags"], list) or len(entry["tags"]) < 3:
        n = len(entry["tags"]) if isinstance(entry["tags"], list) else "n/a"
        errs.append(f"{p}.tags: length {n} < 3")
    elif not all(isinstance(t, str) and t for t in entry["tags"]):
        errs.append(f"{p}.tags: all tags must be non-empty strings")
    if not isinstance(entry["metadata"], dict) or len(entry["metadata"]) < 1:
        errs.append(f"{p}.metadata: must be object with ≥ 1 key")
    emb = entry.get("embedding", None)
    if emb is not None:
        errs.append(f"{p}.embedding: must be null at write-time (got {type(emb).__name__})")
    return errs


def main() -> int:
    if len(sys.argv) != 2:
        print("usage: ruvector-validate-entry.py <path-to-json>", file=sys.stderr)
        return 2
    path = Path(sys.argv[1])
    if not path.exists():
        print(f"ERR: file not found: {path}", file=sys.stderr)
        return 2
    try:
        data = json.loads(path.read_text())
    except json.JSONDecodeError as e:
        print(f"ERR: invalid JSON: {e}", file=sys.stderr)
        return 1
    entries = data if isinstance(data, list) else [data]
    all_errs: list[str] = []
    for i, entry in enumerate(entries):
        all_errs.extend(validate_entry(entry, i))
    if all_errs:
        print(f"FAIL: {len(all_errs)} error(s) across {len(entries)} entries (file: {path})")
        for e in all_errs:
            print(f"  - {e}")
        return 1
    print(f"PASS: {len(entries)}/{len(entries)} entries valid (file: {path})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
