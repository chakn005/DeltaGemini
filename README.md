# Delta Gemini QA Leadership Console

**GitHub Pages publishes the console at the site root.** Options 2–5 remain available locally for comparison (not tracked in git).

## Jira test plans

| Plan | Jira |
|------|------|
| FDA Test Plan | [RIGHTS-28225](https://jira.disney.com/browse/RIGHTS-28225) |
| Falcon Test Plan | [RIGHTS-28094](https://jira.disney.com/browse/RIGHTS-28094) |
| Streaming Test Plan | [RIGHTS-28328](https://jira.disney.com/browse/RIGHTS-28328) |

**RIGHTS-28225** (FDA), **RIGHTS-28094** (Falcon), and **RIGHTS-28328** (Streaming) are synced to the console. The legacy Falcon plan (RIGHTS-27449) remains excluded.

## Auto-sync from Jira

The console refreshes test plan metrics automatically via GitHub Actions and can also sync from your Mac when on VPN.

### GitHub Actions (self-hosted runner required)

Disney Jira **does not work** from GitHub’s cloud runners (SSO/VPN), even with a valid `JIRA_TOKEN`. Your token is fine — the network path is not.

1. Add secrets: [Settings → Secrets → Actions](https://github.com/chakn005/DeltaGemini/settings/secrets/actions) — **`JIRA_TOKEN`** (required), **`JIRA_SERVER`** (optional).
2. Install a **self-hosted runner** on your Mac (VPN): [docs/SELF-HOSTED-RUNNER.md](docs/SELF-HOSTED-RUNNER.md)
3. Workflow [`.github/workflows/jira-sync.yml`](.github/workflows/jira-sync.yml) runs **every 6 hours** on that runner, or via **Run workflow** in Actions.

If the job fails with “SSO redirect” on `ubuntu-latest`, that is expected — switch to self-hosted (step 2).

### Manual / local sync

```bash
cd POC/delta-gemini-console
./scripts/sync.sh
```

### Local auto-sync (VPN + push to GitHub)

When connected to VPN, run this script on a schedule (e.g. every 6 hours via cron or launchd):

```bash
cd POC/delta-gemini-console
./scripts/local-auto-sync.sh
```

Example cron (every 6 hours):

```cron
0 */6 * * * /Users/YOU/Hello-World/POC/delta-gemini-console/scripts/local-auto-sync.sh >> /tmp/delta-gemini-sync.log 2>&1
```

## Refresh data from Jira (manual)

1. Connect to VPN / corporate network.
2. Create or refresh a Jira Personal Access Token at [jira.disney.com](https://jira.disney.com) → Profile → Personal Access Tokens.
3. Set `JIRA_TOKEN` in **`POC/delta-gemini-console/.env`** (recommended) or `mcp-servers/jira-mcp-server/.env`:

```bash
cp POC/delta-gemini-console/.env.example POC/delta-gemini-console/.env
# edit .env and paste your token
```

4. Run:

```bash
cd POC/delta-gemini-console
./scripts/sync.sh
```

Or with uv from the MCP server directory:

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

| URL | Purpose |
|-----|---------|
| http://127.0.0.1:8899/index.html | Main console |
| http://127.0.0.1:8899/index-local.html | **Local only** — all five UI prototypes |

Options 2–5 live under `option-2/` … `option-5/` and are listed in `.gitignore` so they stay on your machine but are not pushed to GitHub.

## GitHub Pages

Live site: **https://chakn005.github.io/DeltaGemini/**

Pushes to `main` publish the site to the `gh-pages` branch. One-time setup in the repo:

1. Open [DeltaGemini → Settings → Pages](https://github.com/chakn005/DeltaGemini/settings/pages)
2. **Build and deployment → Source:** Deploy from a branch
3. **Branch:** `gh-pages` / `/ (root)` → Save

After the workflow completes (Actions tab), the site is live at the URL above.

## Data model

- **Single source of truth:** `shared/data.json`
- **Runtime load:** `shared/data.js` (auto-generated)
- **Option 1** (root `index.html`) and local options 2–5 read the same `GEMINI_DATA` object for consistent coverage, integrations, and Jira links.
