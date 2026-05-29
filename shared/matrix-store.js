/* Editable CPD integration matrix — persisted in browser localStorage */

const MATRIX_STORAGE_KEY = "delta-gemini-cpd-integration-matrix";
const MATRIX_STATUSES = ["pending", "in-progress", "completed"];

function getIntegrationMatrixStructure() {
  return GEMINI_DATA.integrationCoverageMatrix;
}

function defaultMatrixValues() {
  const m = getIntegrationMatrixStructure();
  return m.rows.map(() => m.cols.map(() => "pending"));
}

function loadMatrixValues() {
  const m = getIntegrationMatrixStructure();
  try {
    const raw = localStorage.getItem(MATRIX_STORAGE_KEY);
    if (!raw) return defaultMatrixValues();
    const saved = JSON.parse(raw);
    if (!Array.isArray(saved) || saved.length !== m.rows.length) return defaultMatrixValues();
    return saved.map((row, ri) => {
      if (!Array.isArray(row) || row.length !== m.cols.length) return m.cols.map(() => "pending");
      return row.map((cell) => (MATRIX_STATUSES.includes(cell) ? cell : "pending"));
    });
  } catch {
    return defaultMatrixValues();
  }
}

function saveMatrixValues(values) {
  localStorage.setItem(MATRIX_STORAGE_KEY, JSON.stringify(values));
}

function cycleMatrixStatus(current) {
  const idx = MATRIX_STATUSES.indexOf(current);
  return MATRIX_STATUSES[(idx + 1) % MATRIX_STATUSES.length];
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

function renderIntegrationMatrixEditable(containerId, kpiContainerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const m = getIntegrationMatrixStructure();
  const values = loadMatrixValues();

  const headers = m.cols.map((id) => {
    const int = integrationById(id);
    return `${stepById(int.from).name} → ${stepById(int.to).name}`;
  });

  el.innerHTML = `
    <p class="matrix-note">Click any cell to cycle status: Pending → In Progress → Completed. Choices are saved in this browser only.</p>
    <table class="matrix" id="cpd-int-matrix-table">
      <tr><th>Integration QA</th>${headers.map((h) => `<th>${escapeHtml(h)}</th>`).join("")}</tr>
      ${m.rows.map((row, ri) => `
        <tr>
          <td>${escapeHtml(row)}</td>
          ${values[ri].map((status, ci) => `
            <td class="matrix-cell ${status}" data-row="${ri}" data-col="${ci}" title="Click to change">${escapeHtml(statusLabel(status))}</td>
          `).join("")}
        </tr>`).join("")}
    </table>`;

  el.querySelectorAll(".matrix-cell").forEach((cell) => {
    cell.addEventListener("click", () => {
      const ri = +cell.dataset.row;
      const ci = +cell.dataset.col;
      const current = loadMatrixValues();
      current[ri][ci] = cycleMatrixStatus(current[ri][ci]);
      saveMatrixValues(current);
      cell.className = `matrix-cell ${current[ri][ci]}`;
      cell.textContent = statusLabel(current[ri][ci]);
      if (kpiContainerId) renderIntegrationKpis(kpiContainerId);
    });
  });

  if (kpiContainerId) renderIntegrationKpis(kpiContainerId);
}

function renderIntegrationMatrixHeatmap(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const m = getIntegrationMatrixStructure();
  const values = loadMatrixValues();
  el.innerHTML = `
    <div class="row"><span class="lbl"></span>${m.cols.map((id) => {
      const int = integrationById(id);
      return `<span class="cell" style="background:transparent;color:var(--disney-muted)">${escapeHtml(stepById(int.from).name.slice(0, 3))}→${escapeHtml(stepById(int.to).name.slice(0, 3))}</span>`;
    }).join("")}</div>
    ${m.rows.map((row, ri) => `
      <div class="row">
        <span class="lbl">${escapeHtml(row)}</span>
        ${values[ri].map((status) => `<span class="cell cell-${status === "in-progress" ? "progress" : status}">${escapeHtml(statusLabel(status))}</span>`).join("")}
      </div>`).join("")}`;
}
