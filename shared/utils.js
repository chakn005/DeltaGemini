/* Shared tab + status helpers */
function initTabs(root) {
  const tabs = root.querySelectorAll("[data-tab]");
  const panels = root.querySelectorAll("[data-panel]");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const id = tab.dataset.tab;
      tabs.forEach((t) => t.classList.toggle("active", t === tab));
      panels.forEach((p) => p.classList.toggle("active", p.dataset.panel === id));
    });
  });
}

function statusIcon(status) {
  return statusLabel(status);
}

function statusLabel(status) {
  return GEMINI_DATA.statusLabels[status]?.label || "Pending";
}

function statusClass(status) {
  return GEMINI_DATA.statusLabels[status]?.class || "status-pending";
}

function renderPlanProgressBar(plan) {
  const st = planBarStatus(plan);
  const width = Math.min(100, Math.max(0, plan.coverage || 0));
  return `<div class="plan-progress ${st}"><div class="plan-progress-fill" style="width:${width}%"></div></div>`;
}

function renderPlanExecutionBar(plan) {
  const total = plan.total || 0;
  if (!total) {
    return `<div class="exec-bar exec-bar-empty" aria-hidden="true"><div class="exec-bar-pending" style="width:100%"></div></div>`;
  }
  const pass = plan.pass || 0;
  const fail = plan.fail || 0;
  const blocked = plan.blocked || 0;
  const pending = Math.max(0, total - pass - fail - blocked);
  const pct = (n) => ((n / total) * 100).toFixed(2);
  return `<div class="exec-bar" role="img" aria-label="Passed ${pass}, Failed ${fail}, Blocked ${blocked}, Pending ${pending}">
    ${pass ? `<div class="exec-bar-pass" style="width:${pct(pass)}%"></div>` : ""}
    ${fail ? `<div class="exec-bar-fail" style="width:${pct(fail)}%"></div>` : ""}
    ${blocked ? `<div class="exec-bar-blocked" style="width:${pct(blocked)}%"></div>` : ""}
    ${pending ? `<div class="exec-bar-pending" style="width:${pct(pending)}%"></div>` : ""}
  </div>`;
}

function renderPlanExecutionStats(plan) {
  const pass = plan.pass || 0;
  const fail = plan.fail || 0;
  const blocked = plan.blocked || 0;
  return `<div class="exec-stats">
    <span class="exec-stat pass"><strong>${pass}</strong> Passed</span>
    <span class="exec-stat fail"><strong>${fail}</strong> Failed</span>
    <span class="exec-stat blocked"><strong>${blocked}</strong> Blocked</span>
  </div>`;
}

function stepById(id) {
  return GEMINI_DATA.flowSteps.find((s) => s.id === id);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
