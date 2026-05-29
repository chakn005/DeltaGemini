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
