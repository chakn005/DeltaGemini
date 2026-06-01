#!/usr/bin/env bash
# Sync Jira data and push to GitHub when on corporate VPN.
# Install as a recurring job: see README "Local auto-sync".
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ -f "$ROOT/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "$ROOT/.env"
  set +a
fi

if [[ -x "$ROOT/scripts/sync.sh" ]]; then
  "$ROOT/scripts/sync.sh"
elif command -v python3 >/dev/null 2>&1; then
  python3 -m pip install -q -r "$ROOT/requirements-sync.txt"
  python3 "$ROOT/scripts/sync-from-jira.py"
else
  echo "Python 3 is required for Jira sync." >&2
  exit 1
fi

git add shared/data.json shared/data.js index.html
if git diff --staged --quiet; then
  echo "No Jira data changes to publish."
  exit 0
fi

git commit -m "Auto-sync Jira test plan data ($(date -u +%Y-%m-%dT%H:%MZ))"
git push origin HEAD
