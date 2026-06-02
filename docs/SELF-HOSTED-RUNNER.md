# Self-hosted runner for Jira auto-sync

Disney Jira (`https://jira.disney.com`) blocks GitHub **cloud** runners (you get SSO redirect / auth errors even with a valid `JIRA_TOKEN`).

Your token works on your Mac with VPN — use a **self-hosted runner** on that Mac so scheduled sync can reach Jira.

## One-time setup

1. Connect to **corporate VPN**.
2. Open: https://github.com/chakn005/DeltaGemini/settings/actions/runners/new
3. Choose **macOS** → copy the config commands GitHub shows.
4. In Terminal on your Mac:

```bash
mkdir -p ~/actions-runner && cd ~/actions-runner
# Paste the curl + tar commands from GitHub, then:
./config.sh --url https://github.com/chakn005/DeltaGemini --token YOUR_RUNNER_TOKEN
./run.sh
```

5. Keep the runner process running (or install as a service per GitHub’s instructions).

## Secrets (already required)

Repository secrets at https://github.com/chakn005/DeltaGemini/settings/secrets/actions :

| Secret | Required |
|--------|----------|
| `JIRA_TOKEN` | Yes |
| `JIRA_SERVER` | Optional (`https://jira.disney.com`) |

## Run manually

Actions → **Jira Auto Sync** → **Run workflow** → branch `main`.

## Without a self-hosted runner

Use local sync while on VPN:

```bash
cd POC/delta-gemini-console
./scripts/local-auto-sync.sh
```

That updates data and pushes to `main` (which redeploys the site).
