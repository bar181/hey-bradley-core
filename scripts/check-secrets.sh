#!/usr/bin/env bash
# Pre-commit / CI guard. Per ADR-043.
set -euo pipefail
patterns=(
  'sk-ant-[A-Za-z0-9_-]{20,}'
  'sk-proj-[A-Za-z0-9_-]{20,}'
  'AIza[0-9A-Za-z_-]{35}'
  'sk-[A-Za-z0-9]{20,}'
  'hf_[A-Za-z0-9]{30,}'
  'ghp_[A-Za-z0-9]{36}'
  'github_pat_[A-Za-z0-9_]{82}'
  'gsk_[A-Za-z0-9]{32,}'
  'xai-[A-Za-z0-9]{20,}'
)
hits=0
for p in "${patterns[@]}"; do
  # Exclude this script + ADR-043 (which documents the patterns) + tests/
  # (which use synthetic fixtures to verify the redactor / guard works).
  if git diff --cached -U0 -- ':!scripts/check-secrets.sh' ':!docs/adr/ADR-043-api-key-trust-boundaries.md' ':!tests/' | grep -E "$p" >/dev/null; then
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
