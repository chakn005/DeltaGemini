#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$ROOT/.env"

if [[ -f "$ENV_FILE" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
fi

if command -v uv >/dev/null 2>&1; then
  MCP_DIR="$(cd "$ROOT/../../mcp-servers/jira-mcp-server/jira-mcp-server" 2>/dev/null && pwd || true)"
  if [[ -n "${MCP_DIR:-}" && -f "$MCP_DIR/pyproject.toml" ]]; then
    cd "$MCP_DIR"
    uv run python "$ROOT/scripts/sync-from-jira.py"
    exit $?
  fi
fi

python3 -m pip install -q -r "$ROOT/requirements-sync.txt"
python3 "$ROOT/scripts/sync-from-jira.py"
