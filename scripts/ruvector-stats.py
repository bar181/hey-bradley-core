#!/usr/bin/env python3
"""ruvector-stats: report current state of .swarm/memory.db (stdlib only)."""
from __future__ import annotations

import sqlite3
import statistics
import sys
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent.parent / ".swarm" / "memory.db"


def main() -> int:
    if not DB_PATH.exists():
        print(f"ERR: db not found at {DB_PATH}", file=sys.stderr)
        return 2
    conn = sqlite3.connect(str(DB_PATH))
    try:
        print(f"db: {DB_PATH}  size={DB_PATH.stat().st_size} bytes\n")

        print("== Tables (row counts) ==")
        tables = [r[0] for r in conn.execute(
            "SELECT name FROM sqlite_master WHERE type='table' "
            "AND name NOT LIKE 'sqlite_%' ORDER BY name"
        ).fetchall()]
        for t in tables:
            n = conn.execute(f"SELECT COUNT(*) FROM {t}").fetchone()[0]
            print(f"  {t:24s} {n}")

        print("\n== memory_entries by namespace ==")
        for ns, n in conn.execute(
            "SELECT namespace, COUNT(*) FROM memory_entries GROUP BY namespace ORDER BY namespace"
        ):
            print(f"  {ns:24s} {n}")

        print("\n== memory_entries by type ==")
        for ty, n in conn.execute(
            "SELECT type, COUNT(*) FROM memory_entries GROUP BY type ORDER BY type"
        ):
            print(f"  {ty:24s} {n}")

        oldest = conn.execute(
            "SELECT MIN(created_at), MAX(updated_at) FROM memory_entries"
        ).fetchone()
        print(f"\n== timestamps (ms epoch) ==")
        print(f"  oldest created_at  {oldest[0]}")
        print(f"  newest updated_at  {oldest[1]}")

        lengths = [r[0] for r in conn.execute(
            "SELECT length(content) FROM memory_entries"
        ).fetchall()]
        if lengths:
            print(f"\n== content length ==")
            print(f"  median  {int(statistics.median(lengths))}")
            print(f"  max     {max(lengths)}")

        print("\n== vector_indexes ==")
        for r in conn.execute(
            "SELECT id, dimensions, metric, total_vectors FROM vector_indexes ORDER BY id"
        ):
            print(f"  id={r[0]} dim={r[1]} metric={r[2]} vectors={r[3]}")

        sv = conn.execute(
            "SELECT value FROM metadata WHERE key='schema_version'"
        ).fetchone()
        print(f"\n== schema_version ==\n  {sv[0] if sv else '(unknown)'}")
    finally:
        conn.close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
