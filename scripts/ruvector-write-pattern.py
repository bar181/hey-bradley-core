#!/usr/bin/env python3
"""ruvector-write-pattern: minimal upsert helper for .swarm/memory.db.

Writes/updates a row in `memory_entries` (UNIQUE namespace,key) using sqlite3
stdlib only. Embedding column left NULL — HNSW re-index is out of scope.

  python3 scripts/ruvector-write-pattern.py --namespace NS --key KEY \\
      --content "..." [--type semantic] [--tags a,b,c]
"""
from __future__ import annotations

import argparse
import json
import secrets
import sqlite3
import sys
import time
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent.parent / ".swarm" / "memory.db"
ALLOWED_TYPES = {"semantic", "episodic", "procedural", "working", "pattern"}


def upsert(args: argparse.Namespace) -> int:
    if args.type not in ALLOWED_TYPES:
        print(f"ERR: --type must be one of {sorted(ALLOWED_TYPES)}", file=sys.stderr)
        return 2
    if not DB_PATH.exists():
        print(f"ERR: db not found at {DB_PATH}", file=sys.stderr)
        return 2

    ts = int(time.time() * 1000)
    row_id = f"entry_{ts}_{secrets.token_hex(3)}"
    tags_json = (
        json.dumps([t.strip() for t in args.tags.split(",") if t.strip()])
        if args.tags else None
    )

    conn = sqlite3.connect(str(DB_PATH))
    try:
        before = conn.execute("SELECT COUNT(*) FROM memory_entries").fetchone()[0]
        conn.execute(
            """
            INSERT INTO memory_entries
              (id, key, namespace, content, type, tags, created_at, updated_at, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')
            ON CONFLICT(namespace, key) DO UPDATE SET
              content=excluded.content, type=excluded.type,
              tags=excluded.tags, updated_at=excluded.updated_at
            """,
            (row_id, args.key, args.namespace, args.content, args.type, tags_json, ts, ts),
        )
        conn.commit()
        after = conn.execute("SELECT COUNT(*) FROM memory_entries").fetchone()[0]
        check = conn.execute(
            "SELECT id, namespace, key, type, length(content) FROM memory_entries "
            "WHERE namespace=? AND key=?",
            (args.namespace, args.key),
        ).fetchone()
    finally:
        conn.close()

    print(f"rows: {before} -> {after}")
    print(f"row : id={check[0]} ns={check[1]} key={check[2]} type={check[3]} content_len={check[4]}")
    return 0


def main() -> int:
    p = argparse.ArgumentParser(description="Upsert a ruvector memory_entries row.")
    p.add_argument("--namespace", required=True)
    p.add_argument("--key", required=True)
    p.add_argument("--content", required=True)
    p.add_argument("--type", default="semantic")
    p.add_argument("--tags", default="")
    return upsert(p.parse_args())


if __name__ == "__main__":
    sys.exit(main())
