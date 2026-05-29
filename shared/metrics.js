/* Metrics derived from Jira-synced testPlans only */

function planByKey(id) {
  return GEMINI_DATA.testPlans.find((p) => p.id === id);
}

function overallCoverage() {
  const plans = GEMINI_DATA.testPlans || [];
  if (!plans.length) return 0;
  const totalTests = plans.reduce((a, p) => a + (p.total || 0), 0);
  const totalPass = plans.reduce((a, p) => a + (p.pass || 0), 0);
  return totalTests ? Math.min(100, Math.round((totalPass / totalTests) * 100)) : 0;
}

function totalBlockers() {
  return (GEMINI_DATA.testPlans || []).reduce((a, p) => a + (p.fail || 0) + (p.blocked || 0), 0);
}

function totalPendingTests() {
  return (GEMINI_DATA.testPlans || []).reduce((a, p) => a + (p.pending || 0), 0);
}

function stepStatusFromPlans(stepId) {
  const plans = GEMINI_DATA.testPlans || [];
  const covering = plans.filter((p) => (p.steps || []).includes(stepId));
  if (!covering.length) return "pending";
  if (covering.every((p) => p.coverage === 100)) return "completed";
  if (covering.some((p) => (p.pass || 0) > 0 || (p.fail || 0) > 0)) return "in-progress";
  return "pending";
}

function applyDerivedStepStatuses() {
  (GEMINI_DATA.flowSteps || []).forEach((step) => {
    step.status = stepStatusFromPlans(step.id);
  });
}

function buildApplicationCoverageMatrix() {
  const cols = GEMINI_DATA.flowSteps.map((s) => s.id);
  const rows = GEMINI_DATA.coverageMatrix?.rows || [
    "Functional QA", "Contract / API", "Gemini Delta", "E2E Scenarios"
  ];
  const values = rows.map(() =>
    cols.map((stepId) => stepStatusFromPlans(stepId))
  );
  return { rows, cols, values };
}

function overallIntegrationCoverage() {
  const plans = GEMINI_DATA.testPlans || [];
  if (!plans.length) return 0;
  return Math.round(plans.reduce((a, p) => a + (p.coverage || 0), 0) / plans.length);
}

function planQaStatus(plan) {
  if (plan?.total && plan.coverage === 100) return "completed";
  if ((plan?.pass || 0) > 0 || (plan?.fail || 0) > 0) return "in-progress";
  return "pending";
}

function planBarStatus(plan) {
  return planQaStatus(plan);
}

function planDonutStyle(plan) {
  const st = planBarStatus(plan);
  const accent = st === "completed"
    ? "var(--disney-completed)"
    : st === "in-progress"
      ? "var(--disney-progress)"
      : "var(--disney-pending)";
  return `--pct:${plan.coverage || 0}; --donut-accent:${accent}`;
}

function applyDerivedIntegrationMetrics() {
  (GEMINI_DATA.cpdIntegrations || []).forEach((integration) => {
    const plan = planByKey(integration.testPlan);
    if (!plan) return;
    integration.url = plan.url;
    integration.jiraStatus = plan.jiraStatus;
    integration.assignee = plan.assignee;
    integration.owner = plan.owner || integration.owner;
    integration.coverage = plan.coverage || 0;
    integration.status = planQaStatus(plan);
    integration.tests = {
      pass: plan.pass || 0,
      fail: plan.fail || 0,
      blocked: plan.blocked || 0,
    };
  });
}

function integrationSummaryFromPlans() {
  const ints = GEMINI_DATA.cpdIntegrations || [];
  return {
    total: ints.length,
    completed: ints.filter((i) => i.status === "completed").length,
    inProgress: ints.filter((i) => i.status === "in-progress").length,
    pending: ints.filter((i) => i.status === "pending").length,
    overall: overallIntegrationCoverage(),
  };
}

function initJiraMetrics() {
  applyDerivedStepStatuses();
  applyDerivedIntegrationMetrics();
  GEMINI_DATA._applicationMatrix = buildApplicationCoverageMatrix();
}
