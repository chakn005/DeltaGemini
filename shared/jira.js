/* Jira link helpers */
function jiraBrowseUrl(issueKey) {
  const base = GEMINI_DATA?.jira?.baseUrl || "https://jira.disney.com";
  const path = GEMINI_DATA?.jira?.browsePath || "/browse/";
  return `${base.replace(/\/$/, "")}${path}${encodeURIComponent(issueKey)}`;
}

function jiraLink(issueKey, label, className) {
  const text = label || issueKey;
  const cls = className ? ` class="${className}"` : ' class="jira-link"';
  return `<a href="${escapeHtml(jiraBrowseUrl(issueKey))}"${cls} target="_blank" rel="noopener noreferrer">${escapeHtml(text)}</a>`;
}

function planById(id) {
  return GEMINI_DATA.testPlans.find((p) => p.id === id);
}

function formatSyncTime() {
  const ts = GEMINI_DATA?.jira?.lastSynced;
  if (!ts) return "Not synced from Jira yet";
  try {
    return new Date(ts).toLocaleString();
  } catch {
    return ts;
  }
}

function renderPlanLink(plan, showName) {
  const label = showName ? `${plan.name} (${plan.id})` : plan.id;
  return jiraLink(plan.id, label);
}

function renderJiraMetaFooter() {
  return `<div class="jira-meta">Jira synced: ${escapeHtml(formatSyncTime())} · ${GEMINI_DATA.testPlans.map((p) => jiraLink(p.id, p.id)).join(" · ")}</div>`;
}
