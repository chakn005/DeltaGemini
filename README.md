# Delta Gemini QA Leadership Console

Five UI options sharing one data source (`shared/data.json`).

## Jira test plans

| Plan | Jira |
|------|------|
| FDA Test Plan | [RIGHTS-28225](https://jira.disney.com/browse/RIGHTS-28225) |
| Falcon Test Plan | [RIGHTS-27449](https://jira.disney.com/browse/RIGHTS-27449) |

## Refresh data from Jira (recommended)

1. Connect to VPN / corporate network.
2. Create or refresh a Jira Personal Access Token at [jira.disney.com](https://jira.disney.com) → Profile → Personal Access Tokens.
3. Set `JIRA_TOKEN` in **`POC/delta-gemini-console/.env`** (recommended) or `mcp-servers/jira-mcp-server/.env`:

```bash
cp POC/delta-gemini-console/.env.example POC/delta-gemini-console/.env
# edit .env and paste your token
```

4. Run:

```bash
cd mcp-servers/jira-mcp-server/jira-mcp-server
uv run python ../../POC/delta-gemini-console/scripts/sync-from-jira.py
```

This updates `shared/data.json` and regenerates `shared/data.js` with live issue summary, Jira status, and Xray pass/fail/blocked counts.

## Local preview

```bash
cd POC/delta-gemini-console
python3 -m http.server 8899
```

Open http://127.0.0.1:8899/index.html

## GitHub Pages

Live site: **https://chakn005.github.io/DeltaGemini/**

Pushes to the `main` branch deploy automatically via GitHub Actions. After the first push, enable **Settings → Pages → Build and deployment → GitHub Actions** if prompted.

## Data model

- **Single source of truth:** `shared/data.json`
- **Runtime load:** `shared/data.js` (auto-generated)
- **All 5 options** read the same `GEMINI_DATA` object for consistent coverage, integrations, and Jira links.
