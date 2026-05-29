/* CPD application integration coverage — shared render helpers */

function integrationById(id) {
  return GEMINI_DATA.cpdIntegrations.find((i) => i.id === id);
}

function integrationLabel(int) {
  return `${stepById(int.from).name} → ${stepById(int.to).name}`;
}

function integrationCellClass(status) {
  if (status === "in-progress") return "cell-progress";
  if (status === "risk") return "cell-risk";
  return `cell-${status}`;
}

function renderIntegrationCards(selectedId) {
  return GEMINI_DATA.cpdIntegrations.map((int) => {
    const st = GEMINI_DATA.statusLabels[int.status];
    const sel = selectedId === int.id ? " cpd-int-card-selected" : "";
    return `<div class="cpd-int-card${sel}" data-int-id="${escapeHtml(int.id)}">
      <div class="cpd-int-route">${escapeHtml(stepById(int.from).name)} → ${escapeHtml(stepById(int.to).name)}</div>
      <div class="cpd-int-label">${escapeHtml(int.label)}</div>
      <div class="cpd-int-meta">
        <span class="${st.class}">${escapeHtml(statusLabel(int.status))}</span>
        <span class="cpd-int-cov">${int.coverage}%</span>
      </div>
      <div class="cpd-int-plan">${jiraLink(int.testPlan, int.testPlan)}</div>
    </div>`;
  }).join("");
}

function renderIntegrationDetail(intId) {
  const int = integrationById(intId);
  if (!int) return "<p>Select an integration handoff.</p>";
  const st = GEMINI_DATA.statusLabels[int.status];
  const plan = planByKey(int.testPlan);
  return `<h3>${escapeHtml(integrationLabel(int))} — ${escapeHtml(int.label)}</h3>
    <p class="cpd-int-payload"><strong>Payload:</strong> ${escapeHtml(int.payload)}</p>
    <p class="cpd-int-owner"><strong>Owner:</strong> ${escapeHtml(plan?.owner || int.owner || "—")} · <strong>Plan:</strong> ${jiraLink(int.testPlan, int.testPlan)}</p>
    <p class="cpd-int-status"><strong>Status:</strong> <span class="${st.class}">${escapeHtml(statusLabel(int.status))}</span> · <strong>Coverage:</strong> ${int.coverage}%</p>
    <p class="cpd-int-tests"><strong>Jira tests:</strong> Pass ${int.tests.pass} / Fail ${int.tests.fail} / Pending ${plan?.pending ?? 0} / Total ${plan?.total ?? 0}</p>
    <h4>Validations</h4>
    <ul>${int.validations.map((v) => `<li>${escapeHtml(v)}</li>`).join("")}</ul>`;
}

function renderIntegrationSummaryKpis() {
  return integrationSummaryFromPlans();
}

function renderIntegrationOpsList() {
  return GEMINI_DATA.cpdIntegrations.map((int) => {
    const st = GEMINI_DATA.statusLabels[int.status];
    const plan = planByKey(int.testPlan);
    return `<div class="cpd-int-ops-row">
      <strong>${escapeHtml(integrationLabel(int))}</strong> — ${escapeHtml(int.label)}
      <span class="${st.class}">${escapeHtml(statusLabel(int.status))} · ${int.coverage}%</span>
      <div class="cpd-int-ops-sub">${escapeHtml(plan?.owner || "—")} · ${jiraLink(int.testPlan, int.testPlan)}</div>
    </div>`;
  }).join("");
}

function bindIntegrationCards(container, detailEl) {
  if (!container) return;
  container.querySelectorAll(".cpd-int-card").forEach((el) => {
    el.addEventListener("click", () => {
      container.querySelectorAll(".cpd-int-card").forEach((c) => c.classList.remove("cpd-int-card-selected"));
      el.classList.add("cpd-int-card-selected");
      if (detailEl) detailEl.innerHTML = renderIntegrationDetail(el.dataset.intId);
    });
  });
  const first = container.querySelector(".cpd-int-card");
  if (first && detailEl) {
    first.classList.add("cpd-int-card-selected");
    detailEl.innerHTML = renderIntegrationDetail(first.dataset.intId);
  }
}

function renderIntegrationFlowStrip() {
  return GEMINI_DATA.cpdIntegrations.map((int) => {
    const st = GEMINI_DATA.statusLabels[int.status];
    return `<div class="cpd-int-strip-item" data-int-id="${escapeHtml(int.id)}">
      <span class="cpd-int-strip-route">${escapeHtml(stepById(int.from).name)} → ${escapeHtml(stepById(int.to).name)}</span>
      <span class="cpd-int-strip-label">${escapeHtml(int.label)}</span>
      <span class="${st.class}">${escapeHtml(statusLabel(int.status))} · ${int.coverage}%</span>
    </div>`;
  }).join("");
}

function renderApplicationMatrixTable() {
  const derived = buildApplicationCoverageMatrix();
  const values = typeof loadApplicationMatrixValues === "function"
    ? loadApplicationMatrixValues()
    : derived.values;
  const colNames = derived.cols.map((id) => {
    const step = stepById(id);
    return step ? step.name : id;
  });
  return `<tr><th>QA Type</th>${colNames.map((n) => `<th>${escapeHtml(n)}</th>`).join("")}</tr>
    ${derived.rows.map((row, ri) => `<tr><td>${escapeHtml(row)}</td>${(values[ri] || []).map((v) => `<td class="${integrationCellClass(v)}">${escapeHtml(statusLabel(v))}</td>`).join("")}</tr>`).join("")}`;
}

function bootConsole(renderAll) {
  initJiraMetrics();
  if (typeof renderAll === "function") renderAll();
}
