#!/usr/bin/env bash
# Pre-commit / CI guard. Per ADR-043.
set -euo pipefail
patterns=(
  'sk-ant-[A-Za-z0-9_-]{20,}'
  'sk-proj-[A-Za-z0-9_-]{20,}'
  'AIza[0-9A-Za-z_-]{35}'
)
hits=0
for p in "${patterns[@]}"; do
  if git diff --cached -U0 | grep -E "$p" >/dev/null; then
    echo "[secrets-guard] BLOCKED: pattern '$p' detected in staged diff" >&2
    hits=1
  fi
done
if [ "$hits" -ne 0 ]; then
  echo "[secrets-guard] Per ADR-043, secrets must not be committed." >&2
  exit 1
fi
echo "[secrets-guard] no key-shape patterns found"
exit 0
