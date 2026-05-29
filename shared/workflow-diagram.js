/* Structured workflow diagram — mirrors Delta Gemini Workflow PDF */

const WF_MAIN_LANE = ["rightsline", "md", "fda", "falcon", "streaming"];
const WF_BRANCH_STEPS = ["cpm", "xavier"];
const WF_BRANCH_FROM = "fda";

const WF_CONNECTOR_LABELS = {
  "rightsline|md": "DROs for D+ Deal with Licensee = Hulu flow to MD",
  "md|fda": "DRO flows to FDA · Hulu CP ID via Hulu Kafka topic",
  "fda|falcon": "Processing payload with Hulu CP ID",
  "falcon|streaming": "Avails via Kafka · ingestion status callback",
};

const WF_BRANCH_LABELS = {
  cpm: "Retrieve title metadata from CPM",
  xavier: "Retrieve picture versions from Xavier (Licensee = Hulu)",
};

const WF_NARRATIVE_BY_STEP = {
  rightsline: 1,
  md: 2,
  fda: 3,
  cpm: 4,
  xavier: 4,
  falcon: 5,
  streaming: 7,
};

function integrationHandoffLabel(fromId, toId) {
  const int = (GEMINI_DATA.cpdIntegrations || []).find((i) => i.from === fromId && i.to === toId);
  return int ? int.label : "";
}

function connectorLabel(fromId, toId) {
  const key = `${fromId}|${toId}`;
  if (WF_CONNECTOR_LABELS[key]) return WF_CONNECTOR_LABELS[key];
  const intLabel = integrationHandoffLabel(fromId, toId);
  if (intLabel) return intLabel;
  const from = stepById(fromId);
  return from?.handoff || "";
}

function workflowStageTitle(stepId) {
  const s = stepById(stepId);
  if (!s) return stepId;
  if (stepId === "streaming") return "Streaming";
  return s.name;
}

function renderWorkflowStage(stepId, stepNum) {
  const s = stepById(stepId);
  if (!s) return "";
  const st = GEMINI_DATA.statusLabels[s.status] || GEMINI_DATA.statusLabels.pending;
  const deltaCls = s.isNew ? " gemini-delta" : "";
  const titleAttr = stepId === "streaming" ? ' title="Disney Streaming"' : "";
  return `<div class="wf-stage${deltaCls}" data-step="${escapeHtml(stepId)}"${titleAttr}>
    <span class="wf-stage-num">${stepNum}</span>
    <h3>${escapeHtml(workflowStageTitle(stepId))}</h3>
    <p>${escapeHtml(s.short)}</p>
    <span class="wf-qa-status ${st.class}">${escapeHtml(statusLabel(s.status))}</span>
  </div>`;
}

function renderWorkflowConnector(fromId, toId) {
  const label = connectorLabel(fromId, toId);
  return `<div class="wf-connector" aria-hidden="true">
    <div class="wf-connector-line"></div>
    ${label ? `<div class="wf-connector-label">${escapeHtml(label)}</div>` : ""}
  </div>`;
}

function renderWorkflowMainLane() {
  let html = "";
  let stepNum = 1;
  WF_MAIN_LANE.forEach((id, i) => {
    if (i > 0) html += renderWorkflowConnector(WF_MAIN_LANE[i - 1], id);
    if (id === WF_BRANCH_FROM) {
      html += `<div class="wf-fda-cluster">
        ${renderWorkflowStage(id, stepNum++)}
        <div class="wf-branch-rail">
          <div class="wf-branch-connector" aria-hidden="true"></div>
          <div class="wf-branch-lane">${renderWorkflowBranches()}</div>
        </div>
      </div>`;
    } else {
      html += renderWorkflowStage(id, stepNum++);
    }
  });
  return html;
}

function renderWorkflowBranches() {
  return WF_BRANCH_STEPS.map((id) => {
    const s = stepById(id);
    if (!s) return "";
    const deltaCls = s.isNew ? " gemini-delta" : "";
    const int = (GEMINI_DATA.cpdIntegrations || []).find((i) => i.to === id && i.from === WF_BRANCH_FROM);
    const branchLabel = WF_BRANCH_LABELS[id] || int?.label || s.short;
    return `<div class="wf-branch${deltaCls}">
      <h4>${escapeHtml(s.name)}</h4>
      <p>${escapeHtml(branchLabel)}</p>
    </div>`;
  }).join("");
}

function renderWorkflowDetailCards() {
  const ordered = [...WF_MAIN_LANE.slice(0, 3), ...WF_BRANCH_STEPS, ...WF_MAIN_LANE.slice(3)];
  return ordered.map((id) => {
    const s = stepById(id);
    if (!s) return "";
    const deltaCls = s.isNew ? " gemini-delta" : "";
    const narrativeStep = WF_NARRATIVE_BY_STEP[id];
    const narrative = narrativeStep
      ? (GEMINI_DATA.stepNarratives || []).find((n) => n.step === narrativeStep)
      : null;
    const reqs = s.requirements || [];
    return `<article class="wf-detail-card${deltaCls}">
      <h3>${escapeHtml(s.name)} — ${escapeHtml(s.short)}</h3>
      ${narrative ? `<p class="wf-detail-sub">${escapeHtml(narrative.what)}</p>` : ""}
      <ol>${reqs.map((r) => `<li>${escapeHtml(r)}</li>`).join("")}</ol>
      ${s.handoff ? `<p class="wf-handoff-out"><strong>Handoff:</strong> ${escapeHtml(s.handoff)}</p>` : ""}
    </article>`;
  }).join("");
}

function renderWorkflowHandoffsTable() {
  const rows = (GEMINI_DATA.cpdIntegrations || []).map((int) => {
    const st = GEMINI_DATA.statusLabels[int.status] || GEMINI_DATA.statusLabels.pending;
    return `<tr>
      <td>${escapeHtml(stepById(int.from).name)} → ${escapeHtml(stepById(int.to).name)}</td>
      <td>${escapeHtml(int.label)}</td>
      <td>${escapeHtml(int.payload)}</td>
      <td><span class="${st.class}">${escapeHtml(statusLabel(int.status))}</span></td>
      <td>${int.coverage}%</td>
    </tr>`;
  }).join("");
  return `<table class="wf-handoffs-table">
    <thead><tr><th>Integration</th><th>Handoff</th><th>Payload</th><th>QA Status</th><th>Coverage</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>`;
}

function renderWorkflowDiagram(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;

  el.innerHTML = `
    <div class="wf-diagram">
      <div class="wf-diagram-header">
        <div>
          <h2>Delta Gemini End-to-End Workflow</h2>
          <p>Structured view of the Rightsline → MD → FDA → Falcon → Disney Streaming pipeline, with CPM and Xavier branches from FDA. QA status reflects live Jira test plan coverage.</p>
        </div>
        <div class="wf-legend">
          <span class="wf-legend-swatch" aria-hidden="true"></span>
          <span>Gemini delta functionality (per workflow diagram)</span>
        </div>
      </div>
      <div class="wf-lane-wrap">
        <div class="wf-main-lane">${renderWorkflowMainLane()}</div>
      </div>
    </div>
    <h3 class="section-title">Stage Requirements</h3>
    <div class="wf-details">${renderWorkflowDetailCards()}</div>
    <h3 class="section-title">CPD Integration Handoffs</h3>
    ${renderWorkflowHandoffsTable()}`;
}
