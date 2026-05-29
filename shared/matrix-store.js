/* Editable CPD integration + application matrices — persisted in browser localStorage */

const MATRIX_STORAGE_KEY = "delta-gemini-cpd-integration-matrix";
const APP_MATRIX_STORAGE_KEY = "delta-gemini-application-matrix";
const MATRIX_STATUSES = ["pending", "in-progress", "completed"];

function getIntegrationMatrixStructure() {
  return GEMINI_DATA.integrationCoverageMatrix || { rows: [], cols: [] };
}

function integrationMatrixHeader(colId) {
  const int = typeof integrationById === "function" ? integrationById(colId) : null;
  if (!int) return escapeHtml(colId);
  const from = stepById(int.from);
  const to = stepById(int.to);
  if (!from || !to) return escapeHtml(colId);
  return `${escapeHtml(from.name)} → ${escapeHtml(to.name)}`;
}

function ensureMatrixShape(values, rowCount, colCount, fallbackFn) {
  return Array.from({ length: rowCount }, (_, ri) =>
    Array.from({ length: colCount }, (_, ci) => {
      const cell = values?.[ri]?.[ci];
      if (MATRIX_STATUSES.includes(cell)) return cell;
      const fb = fallbackFn(ri, ci);
      return MATRIX_STATUSES.includes(fb) ? fb : "pending";
    })
  );
}

function defaultIntegrationMatrixValues() {
  return buildIntegrationCoverageMatrix().values;
}

function loadMatrixValues() {
  const m = getIntegrationMatrixStructure();
  const fallback = buildIntegrationCoverageMatrix().values;
  if (!m.rows.length || !m.cols.length) return [];

  try {
    const raw = localStorage.getItem(MATRIX_STORAGE_KEY);
    if (!raw) return ensureMatrixShape(fallback, m.rows.length, m.cols.length, (ri, ci) => fallback[ri][ci]);
    const saved = JSON.parse(raw);
    if (!Array.isArray(saved)) throw new Error("invalid integration matrix");
    return ensureMatrixShape(saved, m.rows.length, m.cols.length, (ri, ci) => fallback[ri][ci]);
  } catch {
    return ensureMatrixShape(fallback, m.rows.length, m.cols.length, (ri, ci) => fallback[ri][ci]);
  }
}

function saveMatrixValues(values) {
  localStorage.setItem(MATRIX_STORAGE_KEY, JSON.stringify(values));
}

function cycleMatrixStatus(current) {
  const idx = MATRIX_STATUSES.indexOf(current);
  return MATRIX_STATUSES[(idx + 1) % MATRIX_STATUSES.length];
}

function defaultApplicationMatrixValues() {
  return buildApplicationCoverageMatrix().values;
}

function loadApplicationMatrixValues() {
  const derived = buildApplicationCoverageMatrix();
  if (!derived.rows.length || !derived.cols.length) return [];

  try {
    const raw = localStorage.getItem(APP_MATRIX_STORAGE_KEY);
    if (!raw) return derived.values;
    const saved = JSON.parse(raw);
    if (!Array.isArray(saved)) throw new Error("invalid application matrix");
    return ensureMatrixShape(saved, derived.rows.length, derived.cols.length, (ri, ci) => derived.values[ri][ci]);
  } catch {
    return derived.values;
  }
}

function saveApplicationMatrixValues(values) {
  localStorage.setItem(APP_MATRIX_STORAGE_KEY, JSON.stringify(values));
}

function integrationSummaryFromMatrix() {
  const values = loadMatrixValues();
  let completed = 0;
  let inProgress = 0;
  let pending = 0;
  values.forEach((row) => {
    row.forEach((cell) => {
      if (cell === "completed") completed += 1;
      else if (cell === "in-progress") inProgress += 1;
      else pending += 1;
    });
  });
  const total = completed + inProgress + pending;
  return {
    total,
    completed,
    inProgress,
    pending,
    overall: total ? Math.round((completed / total) * 100) : 0,
  };
}

function renderIntegrationKpis(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const ik = integrationSummaryFromMatrix();
  el.innerHTML = `
    <div class="cpd-int-kpi"><div class="v">${ik.overall}%</div><div class="l">Integration Coverage</div></div>
    <div class="cpd-int-kpi"><div class="v">${ik.completed}/${ik.total}</div><div class="l">Completed</div></div>
    <div class="cpd-int-kpi"><div class="v">${ik.inProgress}</div><div class="l">In Progress</div></div>
    <div class="cpd-int-kpi"><div class="v">${ik.pending}</div><div class="l">Pending</div></div>`;
}

function bindMatrixCellClicks(container, cellSelector, loadFn, saveFn, kpiContainerId, extraClass) {
  if (!container) return;
  container.querySelectorAll(cellSelector).forEach((cell) => {
    cell.addEventListener("click", () => {
      const ri = +cell.dataset.row;
      const ci = +cell.dataset.col;
      const current = loadFn();
      if (!current[ri]) return;
      current[ri][ci] = cycleMatrixStatus(current[ri][ci]);
      saveFn(current);
      MATRIX_STATUSES.forEach((s) => cell.classList.remove(s));
      cell.classList.add(current[ri][ci]);
      cell.textContent = statusLabel(current[ri][ci]);
      if (kpiContainerId) renderIntegrationKpis(kpiContainerId);
    });
  });
}

function renderIntegrationMatrixEditable(containerId, kpiContainerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const m = getIntegrationMatrixStructure();
  if (!m.rows.length || !m.cols.length) {
    el.innerHTML = `<p class="matrix-note">Integration matrix data is not configured.</p>`;
    return;
  }

  const values = loadMatrixValues();
  const headers = m.cols.map((id) => integrationMatrixHeader(id));

  el.innerHTML = `
    <p class="matrix-note">Click any cell to cycle status: Pending → In Progress → Completed. Defaults from Jira; edits saved in this browser only.</p>
    <table class="matrix" id="cpd-int-matrix-table">
      <tr><th>Integration QA</th>${headers.map((h) => `<th>${h}</th>`).join("")}</tr>
      ${m.rows.map((row, ri) => `
        <tr>
          <td>${escapeHtml(row)}</td>
          ${(values[ri] || []).map((status, ci) => `
            <td class="matrix-cell ${status}" data-row="${ri}" data-col="${ci}" title="Click to change">${escapeHtml(statusLabel(status))}</td>
          `).join("")}
        </tr>`).join("")}
    </table>`;

  bindMatrixCellClicks(el, ".matrix-cell", loadMatrixValues, saveMatrixValues, kpiContainerId);
  if (kpiContainerId) renderIntegrationKpis(kpiContainerId);
}

function renderApplicationMatrixEditable(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const derived = buildApplicationCoverageMatrix();
  if (!derived.rows.length || !derived.cols.length) {
    el.innerHTML = `<p class="matrix-note">Application matrix data is not configured.</p>`;
    return;
  }

  const values = loadApplicationMatrixValues();
  const colNames = derived.cols.map((id) => {
    const step = stepById(id);
    return step ? step.name : id;
  });

  el.innerHTML = `
    <p class="matrix-note">Click any cell to cycle status: Pending → In Progress → Completed. Defaults from Jira; edits saved in this browser only.</p>
    <table class="matrix" id="app-matrix-table">
      <tr><th>QA Type</th>${colNames.map((n) => `<th>${escapeHtml(n)}</th>`).join("")}</tr>
      ${derived.rows.map((row, ri) => `
        <tr>
          <td>${escapeHtml(row)}</td>
          ${(values[ri] || []).map((status, ci) => `
            <td class="matrix-cell app-matrix-cell ${status}" data-row="${ri}" data-col="${ci}" title="Click to change">${escapeHtml(statusLabel(status))}</td>
          `).join("")}
        </tr>`).join("")}
    </table>`;

  bindMatrixCellClicks(el, ".app-matrix-cell", loadApplicationMatrixValues, saveApplicationMatrixValues, null);
}

function renderQAMatrices(intContainerId, appContainerId, kpiContainerId) {
  try {
    renderIntegrationMatrixEditable(intContainerId, kpiContainerId);
    renderApplicationMatrixEditable(appContainerId);
  } catch (err) {
    console.error("Matrix render failed:", err);
    [intContainerId, appContainerId].forEach((id) => {
      const node = document.getElementById(id);
      if (node) node.innerHTML = `<p class="matrix-note">Unable to load matrix. Refresh the page or clear site data for this URL.</p>`;
    });
  }
}

function renderIntegrationMatrixHeatmap(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const m = getIntegrationMatrixStructure();
  const values = loadMatrixValues();
  el.innerHTML = `
    <div class="row"><span class="lbl"></span>${m.cols.map((id) => {
      const int = integrationById(id);
      const from = int ? stepById(int.from) : null;
      const to = int ? stepById(int.to) : null;
      const label = from && to ? `${from.name.slice(0, 3)}→${to.name.slice(0, 3)}` : id;
      return `<span class="cell" style="background:transparent;color:var(--disney-muted)">${escapeHtml(label)}</span>`;
    }).join("")}</div>
    ${m.rows.map((row, ri) => `
      <div class="row">
        <span class="lbl">${escapeHtml(row)}</span>
        ${(values[ri] || []).map((status) => `<span class="cell cell-${status === "in-progress" ? "progress" : status}">${escapeHtml(statusLabel(status))}</span>`).join("")}
      </div>`).join("")}`;
}
