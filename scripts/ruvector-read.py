#!/usr/bin/env python3
"""ruvector-read: read helper for .swarm/memory.db (sqlite3 stdlib only).

Filters: --key, --namespace, --tag, --type, --text-search.
At least one of those is required. Supports --limit (default 10) and
--format json|table (default table).

  python3 scripts/ruvector-read.py --namespace verify
  python3 scripts/ruvector-read.py --tag sprint-m --format json
  python3 scripts/ruvector-read.py --text-search "ruvector" --limit 5
"""
from __future__ import annotations

import argparse
import json
import sqlite3
import sys
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent.parent / ".swarm" / "memory.db"
COLS = (
    "id", "namespace", "key", "type", "tags", "metadata",
    "embedding_dimensions", "created_at", "updated_at", "status", "content",
)


def build_query(args: argparse.Namespace) -> tuple[str, list]:
    where: list[str] = []
    params: list = []
    if args.key:
        where.append("key = ?")
        params.append(args.key)
    if args.namespace:
        where.append("namespace = ?")
        params.append(args.namespace)
    if args.type:
        where.append("type = ?")
        params.append(args.type)
    if args.tag:
        # tags column is JSON array text; LIKE with quoted token is sufficient
        where.append("tags LIKE ?")
        params.append(f'%"{args.tag}"%')
    if args.text_search:
        where.append("content LIKE ?")
        params.append(f"%{args.text_search}%")
    if not where:
        raise SystemExit(
            "ERR: at least one of --key, --namespace, --tag, --type, --text-search required"
        )
    sql = (
        f"SELECT {', '.join(COLS)} FROM memory_entries "
        f"WHERE {' AND '.join(where)} "
        f"ORDER BY updated_at DESC LIMIT ?"
    )
    params.append(args.limit)
    return sql, params


def render_table(rows: list[tuple]) -> str:
    if not rows:
        return "(no rows)"
    out: list[str] = []
    for r in rows:
        d = dict(zip(COLS, r))
        content = (d["content"] or "")
        preview = content[:80].replace("\n", " ")
        if len(content) > 80:
            preview += "..."
        out.append(
            f"id={d['id']}\n"
            f"  ns={d['namespace']} key={d['key']} type={d['type']} "
            f"status={d['status']} dim={d['embedding_dimensions']}\n"
            f"  tags={d['tags']} updated_at={d['updated_at']}\n"
            f"  content[{len(content)}]={preview}"
        )
    return "\n".join(out)


def render_json(rows: list[tuple]) -> str:
    return json.dumps(
        [dict(zip(COLS, r)) for r in rows],
        indent=2, ensure_ascii=False, sort_keys=True,
    )


def run(args: argparse.Namespace) -> int:
    if not DB_PATH.exists():
        print(f"ERR: db not found at {DB_PATH}", file=sys.stderr)
        return 2
    sql, params = build_query(args)
    conn = sqlite3.connect(str(DB_PATH))
    try:
        rows = conn.execute(sql, params).fetchall()
    finally:
        conn.close()
    print(render_json(rows) if args.format == "json" else render_table(rows))
    print(f"\n[{len(rows)} row(s)]", file=sys.stderr)
    return 0


def main() -> int:
    p = argparse.ArgumentParser(description="Read rows from ruvector memory_entries.")
    p.add_argument("--key")
    p.add_argument("--namespace")
    p.add_argument("--tag")
    p.add_argument("--type")
    p.add_argument("--text-search", dest="text_search")
    p.add_argument("--limit", type=int, default=10)
    p.add_argument("--format", choices=("json", "table"), default="table")
    return run(p.parse_args())


if __name__ == "__main__":
    sys.exit(main())
