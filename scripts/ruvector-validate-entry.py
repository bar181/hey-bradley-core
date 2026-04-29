#!/usr/bin/env python3
"""ruvector-validate-entry: schema validator for ruvector entries.

Asserts each entry in a JSON file (object or array) conforms to
plans/strategic-reviews/ruvector-entry-schema-2026-04-29.md.
Exit 0 on all-pass; exit 1 on any-fail.

  python3 scripts/ruvector-validate-entry.py <path-to-json>
"""
from __future__ import annotations
import json, re, sys
from pathlib import Path

NAMESPACES = {"hey-bradley-phases", "hey-bradley-adrs", "hey-bradley-decisions",
              "hey-bradley-learnings", "hey-bradley-tasks", "hey-bradley-strategic"}
TYPES = {"semantic", "pattern", "procedural", "episodic", "working"}
ID_RE = re.compile(r"^entry_\d+_[a-z0-9]{6,}$")
REQUIRED = ("id", "namespace", "key", "type", "content", "tags", "metadata")


def validate(e: dict, idx: int) -> list[str]:
    p, errs = f"entry[{idx}]", []
    if not isinstance(e, dict):
        return [f"{p}: not an object"]
    for f in REQUIRED:
        if f not in e:
            errs.append(f"{p}: missing field '{f}'")
    if errs:
        return errs
    if not isinstance(e["id"], str) or not ID_RE.match(e["id"]):
        errs.append(f"{p}.id: must match entry_<ms>_<rand6+> (got {e['id']!r})")
    if e["namespace"] not in NAMESPACES:
        errs.append(f"{p}.namespace: {e['namespace']!r} not in closed list")
    if not isinstance(e["key"], str) or not e["key"]:
        errs.append(f"{p}.key: must be non-empty string")
    if e["type"] not in TYPES:
        errs.append(f"{p}.type: {e['type']!r} not in {sorted(TYPES)}")
    if not isinstance(e["content"], str) or len(e["content"]) < 200:
        n = len(e["content"]) if isinstance(e["content"], str) else "n/a"
        errs.append(f"{p}.content: length {n} < 200 chars")
    if not isinstance(e["tags"], list) or len(e["tags"]) < 3 \
            or not all(isinstance(t, str) and t for t in e["tags"]):
        errs.append(f"{p}.tags: must be array of ≥ 3 non-empty strings")
    if not isinstance(e["metadata"], dict) or len(e["metadata"]) < 1:
        errs.append(f"{p}.metadata: must be object with ≥ 1 key")
    if e.get("embedding") is not None:
        errs.append(f"{p}.embedding: must be null at write-time")
    return errs


def main() -> int:
    if len(sys.argv) != 2:
        print("usage: ruvector-validate-entry.py <path-to-json>", file=sys.stderr)
        return 2
    path = Path(sys.argv[1])
    if not path.exists():
        print(f"ERR: file not found: {path}", file=sys.stderr); return 2
    try:
        data = json.loads(path.read_text())
    except json.JSONDecodeError as ex:
        print(f"ERR: invalid JSON: {ex}", file=sys.stderr); return 1
    entries = data if isinstance(data, list) else [data]
    errs = [m for i, e in enumerate(entries) for m in validate(e, i)]
    if errs:
        print(f"FAIL: {len(errs)} error(s) across {len(entries)} entries (file: {path})")
        for m in errs:
            print(f"  - {m}")
        return 1
    print(f"PASS: {len(entries)}/{len(entries)} entries valid (file: {path})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
