#!/usr/bin/env bash
# Install a macOS launchd job to sync Jira and push every 6 hours (requires VPN).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LABEL="com.deltagemini.jira-sync"
PLIST="$HOME/Library/LaunchAgents/${LABEL}.plist"
LOG_DIR="$HOME/Library/Logs/delta-gemini-console"
SYNC_SCRIPT="$ROOT/scripts/local-auto-sync.sh"

mkdir -p "$LOG_DIR"

cat > "$PLIST" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>${LABEL}</string>
  <key>ProgramArguments</key>
  <array>
    <string>/bin/bash</string>
    <string>-lc</string>
    <string>${SYNC_SCRIPT}</string>
  </array>
  <key>StartInterval</key>
  <integer>21600</integer>
  <key>RunAtLoad</key>
  <true/>
  <key>StandardOutPath</key>
  <string>${LOG_DIR}/jira-sync.log</string>
  <key>StandardErrorPath</key>
  <string>${LOG_DIR}/jira-sync.err.log</string>
  <key>WorkingDirectory</key>
  <string>${ROOT}</string>
</dict>
</plist>
EOF

launchctl bootout "gui/$(id -u)/${LABEL}" 2>/dev/null || true
launchctl bootstrap "gui/$(id -u)" "$PLIST"
launchctl enable "gui/$(id -u)/${LABEL}"

echo "Installed launchd agent: ${LABEL}"
echo "Runs every 6 hours and at login (connect to VPN first)."
echo "Logs: ${LOG_DIR}/jira-sync.log"
echo "Test now: ${SYNC_SCRIPT}"
