#!/bin/sh
# P111 — Dogfood gates runner
# Run via: bash scripts/run-gates.sh
# OR via:  npm run check:gates
# Owner-wire to .husky/pre-commit by appending:
#   bash scripts/run-gates.sh || exit 1
set -e

echo "[gates] 1/3 — secret scan (existing)"
bash scripts/check-secrets.sh || { echo "[gates] FAIL — secret scan"; exit 1; }

echo "[gates] 2/3 — architecture invariants (Playwright fitness functions)"
npx playwright test tests/architecture-invariants.spec.ts --reporter=line || { echo "[gates] FAIL — invariants"; exit 1; }

echo "[gates] 3/3 — ADR-lint (file → ADR rule table)"
node --experimental-strip-types --no-warnings scripts/adr-lint.ts --staged || { echo "[gates] FAIL — adr-lint"; exit 1; }

echo "[gates] PASS — all 3 gates green"
exit 0
