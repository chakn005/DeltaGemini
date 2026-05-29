/* Executive workflow diagram — business-facing Delta Gemini pipeline view */

const WF_MAIN_LANE = ["rightsline", "md", "fda", "falcon", "streaming"];
const WF_BRANCH_STEPS = ["cpm", "xavier"];
const WF_BRANCH_FROM = "fda";

const WF_CONNECTOR_LABELS = {
  "rightsline|md": "Deal order (DRO) flows to metadata platform",
  "md|fda": "Hulu CP ID routed via dedicated Kafka topic",
  "fda|falcon": "Processing payload with Hulu licensee context",
  "falcon|streaming": "Avails delivered · ingestion status returned",
};

const WF_BRANCH_LABELS = {
  cpm: "Title metadata enrichment",
  xavier: "Picture versions (Licensee = Hulu)",
};

const WF_BUSINESS_OUTCOME = {
  rightsline: "Business defines the Hulu content deal",
  md: "Deal metadata and Hulu CP ID are registered",
  fda: "Avail processing runs in the new Hulu fleet",
  cpm: "Title, season, and genre metadata retrieved",
  xavier: "Picture versions retrieved for the title",
  falcon: "Final payload and avails prepared for delivery",
  streaming: "Content ingested and client-ready status confirmed",
};

function narrativeForStep(stepId) {
  const map = { rightsline: 1, md: 2, fda: 3, cpm: 4, xavier: 4, falcon: 5, streaming: 7 };
  const n = (GEMINI_DATA.stepNarratives || []).find((row) => row.step === map[stepId]);
  return n || null;
}

function connectorLabel(fromId, toId) {
  const key = `${fromId}|${toId}`;
  if (WF_CONNECTOR_LABELS[key]) return WF_CONNECTOR_LABELS[key];
  const int = (GEMINI_DATA.cpdIntegrations || []).find((i) => i.from === fromId && i.to === toId);
  return int?.label || stepById(fromId)?.handoff || "";
}

function stepCoveragePct(stepId) {
  const plans = (GEMINI_DATA.testPlans || []).filter((p) => (p.steps || []).includes(stepId));
  if (!plans.length) return 0;
  return Math.round(plans.reduce((sum, p) => sum + (p.coverage || 0), 0) / plans.length);
}

function workflowStageTitle(stepId) {
  const s = stepById(stepId);
  if (!s) return stepId;
  if (stepId === "streaming") return "Disney Streaming";
  return s.name;
}

function renderWorkflowExecHero() {
  const cov = overallCoverage();
  const readiness = cov >= 70 ? "On Track" : cov >= 40 ? "In Progress" : "Early Stage";
  const readinessCls = cov >= 70 ? "ready" : cov >= 40 ? "progress" : "early";
  return `
    <header class="wf-exec-hero">
      <div class="wf-exec-hero-copy">
        <p class="wf-exec-eyebrow">${escapeHtml(GEMINI_DATA.program)} · ${escapeHtml(GEMINI_DATA.env)} Environment</p>
        <h2>Hulu Content Pipeline — End-to-End Workflow</h2>
        <p class="wf-exec-lead">
          How a Hulu licensee deal moves from Rightsline through metadata, processing, and avails to Disney Streaming —
          reusing the Disney+ pipeline with targeted Gemini deltas for Hulu CP ID, fleet, and Kafka routing.
        </p>
      </div>
      <div class="wf-exec-kpis">
        <div class="wf-exec-kpi ${readinessCls}">
          <span class="wf-exec-kpi-val">${escapeHtml(readiness)}</span>
          <span class="wf-exec-kpi-lbl">Program Readiness</span>
        </div>
        <div class="wf-exec-kpi">
          <span class="wf-exec-kpi-val">${cov}%</span>
          <span class="wf-exec-kpi-lbl">QA Coverage</span>
        </div>
        <div class="wf-exec-kpi pass">
          <span class="wf-exec-kpi-val">${totalPass()}</span>
          <span class="wf-exec-kpi-lbl">Passed</span>
        </div>
        <div class="wf-exec-kpi fail">
          <span class="wf-exec-kpi-val">${totalFailed()}</span>
          <span class="wf-exec-kpi-lbl">Failed</span>
        </div>
      </div>
    </header>`;
}

function renderWorkflowArrow(fromId, toId) {
  const label = connectorLabel(fromId, toId);
  return `
    <div class="wf-arrow-block" aria-hidden="true">
      <div class="wf-arrow-line"><span class="wf-arrow-head"></span></div>
      ${label ? `<p class="wf-arrow-label">${escapeHtml(label)}</p>` : ""}
    </div>`;
}

function renderWorkflowStageCard(stepId, stepNum) {
  const s = stepById(stepId);
  if (!s) return "";
  const st = GEMINI_DATA.statusLabels[s.status] || GEMINI_DATA.statusLabels.pending;
  const narrative = narrativeForStep(stepId);
  const outcome = WF_BUSINESS_OUTCOME[stepId] || s.short;
  const deltaCls = s.isNew ? " is-delta" : "";
  const coverage = stepCoveragePct(stepId);

  return `
    <article class="wf-stage-card${deltaCls}" data-step="${escapeHtml(stepId)}">
      <div class="wf-stage-card-head">
        <span class="wf-stage-badge">${stepNum}</span>
        ${s.isNew ? '<span class="wf-delta-chip">Hulu Delta</span>' : ""}
      </div>
      <h3>${escapeHtml(workflowStageTitle(stepId))}</h3>
      <p class="wf-stage-role">${escapeHtml(s.short)}</p>
      <p class="wf-stage-outcome">${escapeHtml(outcome)}</p>
      ${narrative?.delta ? `<p class="wf-stage-delta">${escapeHtml(narrative.delta)}</p>` : ""}
      <footer class="wf-stage-footer">
        <span class="wf-qa-pill ${st.class}">${escapeHtml(statusLabel(s.status))}</span>
        <span class="wf-coverage-pill">${coverage}% QA</span>
      </footer>
    </article>`;
}

function renderWorkflowBranchCard(stepId) {
  const s = stepById(stepId);
  if (!s) return "";
  const narrative = narrativeForStep(stepId);
  const deltaCls = s.isNew ? " is-delta" : "";
  return `
    <article class="wf-branch-card${deltaCls}" data-step="${escapeHtml(stepId)}">
      <h4>${escapeHtml(s.name)}</h4>
      <p>${escapeHtml(WF_BRANCH_LABELS[stepId] || s.short)}</p>
      ${narrative?.delta ? `<p class="wf-branch-delta">${escapeHtml(narrative.delta)}</p>` : ""}
    </article>`;
}

function renderWorkflowPipeline() {
  let html = "";
  let stepNum = 1;

  WF_MAIN_LANE.forEach((id, i) => {
    if (i > 0) html += renderWorkflowArrow(WF_MAIN_LANE[i - 1], id);

    if (id === WF_BRANCH_FROM) {
      html += `
        <div class="wf-fda-group">
          ${renderWorkflowStageCard(id, stepNum++)}
          <div class="wf-enrichment-zone">
            <p class="wf-enrichment-title">Parallel enrichment during FDA processing</p>
            <div class="wf-enrichment-rail" aria-hidden="true"></div>
            <div class="wf-enrichment-cards">
              ${WF_BRANCH_STEPS.map((bid) => renderWorkflowBranchCard(bid)).join("")}
            </div>
          </div>
        </div>`;
    } else {
      html += renderWorkflowStageCard(id, stepNum++);
    }
  });

  return `
    <section class="wf-pipeline-board" aria-label="Delta Gemini pipeline">
      <p class="wf-pipeline-intro">Deal setup through metadata, processing, payload delivery, and streaming ingestion — with CPM and Xavier enrichment from FDA.</p>
      <div class="wf-pipeline-scroll">
        <div class="wf-pipeline-track">${html}</div>
      </div>
    </section>`;
}

function renderWorkflowStory() {
  return (GEMINI_DATA.stepNarratives || []).map((n) => `
    <div class="wf-story-item">
      <div class="wf-story-num">${n.step}</div>
      <div class="wf-story-body">
        <h4>${escapeHtml(n.title)}</h4>
        <p>${escapeHtml(n.what)}</p>
        <p class="wf-story-delta"><strong>Gemini change:</strong> ${escapeHtml(n.delta)}</p>
      </div>
    </div>`).join("");
}

function renderWorkflowDeltaCompare() {
  return `
    <table class="wf-delta-table">
      <thead><tr><th>Area</th><th>Disney+ Today</th><th>Delta Gemini (Hulu)</th></tr></thead>
      <tbody>
        ${(GEMINI_DATA.geminiVsDisney || []).map((row) => `
          <tr>
            <td>${escapeHtml(row.area)}</td>
            <td>${escapeHtml(row.disney)}</td>
            <td class="wf-delta-highlight">${escapeHtml(row.gemini)}</td>
          </tr>`).join("")}
      </tbody>
    </table>`;
}

function renderWorkflowPlanSummary() {
  return (GEMINI_DATA.testPlans || []).map((plan) => `
    <div class="wf-plan-chip">
      <div class="wf-plan-chip-head">
        <strong>${jiraLink(plan.id, plan.id)}</strong>
        <span class="${statusClass(planBarStatus(plan))}">${escapeHtml(statusLabel(planBarStatus(plan)))}</span>
      </div>
      <p>${escapeHtml(plan.name)}</p>
      ${renderPlanExecutionBar(plan)}
      <div class="wf-plan-chip-stats">
        <span class="exec-stat pass">${plan.pass} passed</span>
        <span class="exec-stat fail">${plan.fail} failed</span>
        <span class="exec-stat blocked">${plan.blocked} blocked</span>
      </div>
    </div>`).join("");
}

function renderWorkflowHandoffsExecutive() {
  const rows = (GEMINI_DATA.cpdIntegrations || []).map((int) => {
    const st = GEMINI_DATA.statusLabels[int.status] || GEMINI_DATA.statusLabels.pending;
    const from = stepById(int.from);
    const to = stepById(int.to);
    return `<tr>
      <td><strong>${escapeHtml(from.name)}</strong> → <strong>${escapeHtml(to.name)}</strong></td>
      <td>${escapeHtml(int.label)}</td>
      <td>${escapeHtml(int.payload)}</td>
      <td><span class="${st.class}">${escapeHtml(statusLabel(int.status))}</span></td>
      <td>${int.coverage}%</td>
      <td>${escapeHtml(int.owner)}</td>
    </tr>`;
  }).join("");

  return `
    <table class="wf-handoffs-exec">
      <thead>
        <tr>
          <th>Systems</th>
          <th>Business Handoff</th>
          <th>Payload</th>
          <th>QA Status</th>
          <th>Coverage</th>
          <th>Owner</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`;
}

function bindWorkflowStageFocus(root) {
  const cards = root.querySelectorAll("[data-step]");
  const storyItems = root.querySelectorAll(".wf-story-item");
  const stepToNarrative = { rightsline: 1, md: 2, fda: 3, cpm: 4, xavier: 4, falcon: 5, streaming: 7 };
  if (!cards.length) return;

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const stepId = card.dataset.step;
      const narrativeStep = stepToNarrative[stepId];
      cards.forEach((c) => c.classList.toggle("is-focused", c === card));
      storyItems.forEach((item) => {
        const itemStep = Number(item.querySelector(".wf-story-num")?.textContent);
        item.classList.toggle("is-focused", itemStep === narrativeStep);
      });
      const focused = root.querySelector(".wf-story-item.is-focused");
      if (focused) focused.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  });
}

function renderWorkflowDiagram(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;

  el.innerHTML = `
    <div class="wf-exec">
      ${renderWorkflowExecHero()}
      ${renderWorkflowPipeline()}
      <div class="wf-exec-grid">
        <section class="wf-panel wf-story-panel">
          <h3>Business Flow — Step by Step</h3>
          <p class="wf-panel-sub">Click a pipeline stage above to highlight the matching business step.</p>
          <div class="wf-story">${renderWorkflowStory()}</div>
        </section>
        <aside class="wf-panel wf-side-panel">
          <section class="wf-side-block">
            <h3>What's New for Hulu</h3>
            <p class="wf-panel-sub">How Delta Gemini differs from the existing Disney+ pipeline.</p>
            ${renderWorkflowDeltaCompare()}
          </section>
          <section class="wf-side-block">
            <h3>Test Plan Health</h3>
            <p class="wf-panel-sub">Live execution status from Jira Xray test plans.</p>
            <div class="wf-plan-chips">${renderWorkflowPlanSummary()}</div>
          </section>
        </aside>
      </div>
      <section class="wf-panel wf-handoffs-panel">
        <h3>CPD Integration Handoffs</h3>
        <p class="wf-panel-sub">Cross-system handoffs validated through linked Jira test plans.</p>
        ${renderWorkflowHandoffsExecutive()}
      </section>
    </div>`;

  bindWorkflowStageFocus(el);
}
