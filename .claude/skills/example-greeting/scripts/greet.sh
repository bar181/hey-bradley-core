#!/usr/bin/env bash
# greet.sh — Generate a personalized greeting from templates
# Usage: bash greet.sh "Name" [--template casual|formal|custom]

set -euo pipefail

SKILL_DIR="$(cd "$(dirname "$0")/.." && pwd)"
TEMPLATE_DIR="$SKILL_DIR/resources/templates"
NAME="${1:-World}"
TEMPLATE="greeting"
MESSAGE="${GREETING_MESSAGE:-Welcome to Claude Code Skills.}"

# Parse flags
shift || true
while [[ $# -gt 0 ]]; do
  case "$1" in
    --template) TEMPLATE="$2"; shift 2 ;;
    *) echo "Unknown option: $1" >&2; exit 1 ;;
  esac
done

# Resolve template file
TEMPLATE_FILE="$TEMPLATE_DIR/${TEMPLATE}.txt"

if [[ ! -f "$TEMPLATE_FILE" ]]; then
  echo "Error: Template '$TEMPLATE' not found at $TEMPLATE_FILE" >&2
  echo "Available templates:" >&2
  ls "$TEMPLATE_DIR"/*.txt 2>/dev/null | xargs -I{} basename {} .txt >&2
  exit 1
fi

# Read template and substitute placeholders
OUTPUT=$(cat "$TEMPLATE_FILE")
OUTPUT="${OUTPUT//\{\{NAME\}\}/$NAME}"
OUTPUT="${OUTPUT//\{\{MESSAGE\}\}/$MESSAGE}"

echo "$OUTPUT"
