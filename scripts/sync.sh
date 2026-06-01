#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MCP_DIR="$(cd "$ROOT/../../mcp-servers/jira-mcp-server/jira-mcp-server" && pwd)"
ENV_FILE="$ROOT/.env"

if [[ -f "$ENV_FILE" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
fi

cd "$MCP_DIR"
uv run python "$ROOT/scripts/sync-from-jira.py"
