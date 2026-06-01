#!/usr/bin/env python3
"""Sync Delta Gemini console data from Jira + Xray test plans."""

from __future__ import annotations

import json
import os
import sys
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

import requests
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[1]
DATA_JSON = ROOT / "shared" / "data.json"
DATA_JS = ROOT / "shared" / "data.js"
ENV_CANDIDATES = [
    ROOT / ".env",
    Path(__file__).resolve().parents[2] / "mcp-servers" / "jira-mcp-server" / ".env",
]

TEST_PLAN_KEYS = ["RIGHTS-28225"]

PLAN_STEPS = {
    "RIGHTS-28225": ["md", "fda", "cpm", "xavier"],
}

STATUS_MAP = {
    "PASS": "completed",
    "PASSED": "completed",
    "DONE": "completed",
    "TODO": "pending",
    "TO DO": "pending",
    "NOT RUN": "pending",
    "NOTRUN": "pending",
    "EXECUTING": "in-progress",
    "IN PROGRESS": "in-progress",
    "FAIL": "fail",
    "FAILED": "fail",
    "BLOCKED": "blocked",
    "ABORTED": "blocked",
}


def map_bucket(name: str | None) -> str:
    if not name:
        return "pending"
    return STATUS_MAP.get(name.strip().upper(), "pending")


def load_credentials() -> tuple[str, str, str | None, str | None, str]:
    """Return server, token, username, password, source_label."""
    token = os.getenv("JIRA_TOKEN")
    username = os.getenv("JIRA_USERNAME")
    password = os.getenv("JIRA_PASSWORD")
    server = os.getenv("JIRA_SERVER")
    source = "environment variable JIRA_TOKEN" if token else "unknown"

    for env_path in ENV_CANDIDATES:
        if not env_path.exists():
            continue
        load_dotenv(env_path, override=not token)
        if not token and os.getenv("JIRA_TOKEN"):
            token = os.getenv("JIRA_TOKEN")
            source = str(env_path)
        if not server:
            server = os.getenv("JIRA_SERVER")
        if not username:
            username = os.getenv("JIRA_USERNAME")
        if not password:
            password = os.getenv("JIRA_PASSWORD")

    server = (server or "https://jira.disney.com").rstrip("/")
    return server, token or "", username, password, source


class JiraClient:
    def __init__(self, server: str, token: str = "", username: str | None = None, password: str | None = None) -> None:
        self.server = server.rstrip("/")
        self.session = requests.Session()
        self.session.headers.update({"Accept": "application/json", "Content-Type": "application/json"})
        if token:
            self.session.headers["Authorization"] = f"Bearer {token}"
        elif username and password:
            self.session.auth = (username, password)
        else:
            raise RuntimeError("No Jira credentials found.")

    def _get(self, path: str, **kwargs):
        url = f"{self.server}{path}"
        resp = self.session.get(url, timeout=60, **kwargs)
        if resp.status_code >= 400:
            raise RuntimeError(f"GET {path} failed ({resp.status_code}): {resp.text[:240]}")
        if "application/json" not in resp.headers.get("Content-Type", ""):
            raise RuntimeError(
                "Jira returned non-JSON (likely SSO redirect). Connect to VPN/corporate network and retry."
            )
        return resp.json()

    def issue(self, key: str) -> dict:
        return self._get(
            f"/rest/api/2/issue/{key}",
            params={"fields": "summary,status,assignee,reporter,updated,created,description,issuetype,labels"},
        )

    def xray_get_paginated(self, path: str, limit: int = 200) -> list:
        page = 1
        results: list = []
        while True:
            data = self._get(
                f"/rest/raven/1.0/api/{path.lstrip('/')}",
                params={"limit": limit, "page": page},
            )
            batch = data if isinstance(data, list) else []
            if not batch:
                break
            results.extend(batch)
            if len(batch) < limit:
                break
            page += 1
        return results

    def testplan_tests(self, plan_key: str) -> list:
        return self.xray_get_paginated(f"testplan/{plan_key}/test")


def test_status_name(raw) -> str | None:
    if isinstance(raw, dict):
        return raw.get("name")
    if isinstance(raw, str):
        return raw
    return None


def aggregate_plan_stats(client: JiraClient, plan_key: str) -> dict:
    counters = Counter()
    tests = client.testplan_tests(plan_key)
    total = len(tests)

    for test in tests:
        status_name = test_status_name(test.get("latestStatus"))
        counters[map_bucket(status_name)] += 1

    if not counters and total:
        counters["pending"] = total

    pass_count = counters.get("completed", 0)
    fail_count = counters.get("fail", 0)
    blocked_count = counters.get("blocked", 0)
    in_progress = counters.get("in-progress", 0)
    pending = counters.get("pending", 0)

    coverage = min(100, round((pass_count / total) * 100)) if total else 0

    if total and pass_count == total:
        plan_status = "completed"
    elif pass_count or fail_count or blocked_count or in_progress:
        plan_status = "in-progress"
    else:
        plan_status = "pending"

    return {
        "total": total,
        "pass": pass_count,
        "fail": fail_count,
        "blocked": blocked_count,
        "inProgress": in_progress,
        "pending": pending,
        "coverage": coverage,
        "status": plan_status,
    }


def issue_to_plan(issue: dict, stats: dict, server: str) -> dict:
    fields = issue["fields"]
    assignee = (fields.get("assignee") or {}).get("displayName")
    reporter = (fields.get("reporter") or {}).get("displayName")
    key = issue["key"]
    return {
        "id": key,
        "name": fields.get("summary") or key,
        "url": f"{server}/browse/{key}",
        "jiraStatus": fields.get("status", {}).get("name", "Unknown"),
        "status": stats["status"],
        "coverage": stats["coverage"],
        "pass": stats["pass"],
        "fail": stats["fail"],
        "blocked": stats["blocked"],
        "inProgress": stats["inProgress"],
        "pending": stats["pending"],
        "total": stats["total"],
        "lastRun": (fields.get("updated") or "")[:10],
        "updated": fields.get("updated"),
        "created": fields.get("created"),
        "owner": assignee or reporter or "Unassigned",
        "assignee": assignee,
        "reporter": reporter,
        "issueType": (fields.get("issuetype") or {}).get("name"),
        "steps": PLAN_STEPS.get(key, []),
    }


def write_data_files(data: dict) -> None:
    payload = json.dumps(data, indent=2, ensure_ascii=False)
    DATA_JSON.write_text(payload + "\n", encoding="utf-8")
    DATA_JS.write_text(
        f"/* Delta Gemini QA Console — shared data (auto-generated from data.json) */\nwindow.GEMINI_DATA = {payload};\n",
        encoding="utf-8",
    )


def plan_qa_status(plan: dict) -> str:
    if plan.get("total") and plan.get("coverage") == 100:
        return "completed"
    if (plan.get("pass") or 0) > 0 or (plan.get("fail") or 0) > 0:
        return "in-progress"
    return "pending"


def build_kanban_from_plan(client: JiraClient, plan_key: str, plan_label: str, server: str, limit: int = 40) -> dict:
    buckets = {"backlog": [], "inTest": [], "blocked": [], "done": []}
    tests = client.testplan_tests(plan_key)
    for test in tests[:limit * 4]:
        key = test.get("key")
        if not key:
            continue
        raw = test.get("latestStatus")
        status_name = raw.get("name") if isinstance(raw, dict) else raw
        bucket_key = map_bucket(status_name)
        item = {
            "title": key,
            "ticket": key,
            "plan": plan_label,
            "url": f"{server}/browse/{key}",
            "jiraStatus": (status_name or "TODO").upper(),
        }
        if bucket_key == "completed":
            buckets["done"].append(item)
        elif bucket_key in ("fail", "blocked"):
            buckets["blocked"].append(item)
        elif bucket_key == "in-progress":
            buckets["inTest"].append(item)
        else:
            buckets["backlog"].append(item)
    for col in buckets:
        buckets[col] = buckets[col][:limit]
    return buckets


def merge_kanban(plans_kanban: list[dict]) -> dict:
    merged = {"backlog": [], "inTest": [], "blocked": [], "done": []}
    for kb in plans_kanban:
        for col in merged:
            merged[col].extend(kb.get(col, []))
    return merged


def strip_hardcoded_metrics(data: dict) -> None:
    if "coverageMatrix" in data:
        data["coverageMatrix"].pop("values", None)
    if "integrationCoverageMatrix" in data:
        data["integrationCoverageMatrix"].pop("values", None)
    for step in data.get("flowSteps", []):
        step.pop("status", None)
    for item in data.get("deltaChecklist", []):
        item.pop("done", None)
    for integration in data.get("cpdIntegrations", []):
        for key in ("status", "coverage", "tests", "url", "jiraStatus", "assignee"):
            integration.pop(key, None)
    data.pop("kanban", None)


def derive_integration_coverage(data: dict) -> None:
    plans = {p["id"]: p for p in data.get("testPlans", [])}
    for integration in data.get("cpdIntegrations", []):
        plan_key = integration.get("testPlan", "")
        if plan_key and plan_key not in plans:
            integration.pop("testPlan", None)
        plan = plans.get(integration.get("testPlan", ""))
        if not plan:
            continue
        integration["url"] = plan["url"]
        integration["jiraStatus"] = plan.get("jiraStatus")
        integration["assignee"] = plan.get("assignee")
        integration["owner"] = plan.get("owner") or integration.get("owner")
        integration["coverage"] = plan.get("coverage", 0)
        integration["status"] = plan_qa_status(plan)
        integration["tests"] = {
            "pass": plan.get("pass", 0),
            "fail": plan.get("fail", 0),
            "blocked": plan.get("blocked", 0),
        }


def verify_auth(client: JiraClient, source: str) -> None:
    try:
        client._get("/rest/api/2/myself")
    except RuntimeError as exc:
        raise RuntimeError(
            f"Jira authentication failed using {source}. "
            "Update JIRA_TOKEN in POC/delta-gemini-console/.env or "
            "mcp-servers/jira-mcp-server/.env, or export JIRA_TOKEN in your shell. "
            f"Original error: {exc}"
        ) from exc


def main() -> int:
    server, token, username, password, source = load_credentials()
    if not token and not (username and password):
        print(
            "Missing Jira credentials. Set JIRA_TOKEN in one of:\n"
            f"  - {ENV_CANDIDATES[0]}\n"
            f"  - {ENV_CANDIDATES[1]}\n"
            "Or export JIRA_TOKEN before running this script.",
            file=sys.stderr,
        )
        return 1

    data = json.loads(DATA_JSON.read_text(encoding="utf-8"))
    client = JiraClient(server, token, username, password)
    print(f"Using credentials from: {source}")
    verify_auth(client, source)

    plans = []
    for key in TEST_PLAN_KEYS:
        issue = client.issue(key)
        stats = aggregate_plan_stats(client, key)
        plan = issue_to_plan(issue, stats, server)
        plans.append(plan)
        print(
            f"{key}: {plan['name']} | Jira={plan['jiraStatus']} | "
            f"coverage={plan['coverage']}% | tests={plan['total']} | "
            f"pass/fail/blocked={plan['pass']}/{plan['fail']}/{plan['blocked']}"
        )

    data["testPlans"] = plans
    data["jira"] = {
        "baseUrl": server,
        "browsePath": "/browse/",
        "lastSynced": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "syncSource": "scripts/sync-from-jira.py",
        "syncRequired": False,
    }
    for plan in data["testPlans"]:
        plan["dataSource"] = "jira"

    derive_integration_coverage(data)
    strip_hardcoded_metrics(data)

    kanban_parts = []
    plan_labels = {"RIGHTS-28225": "FDA"}
    for plan in data["testPlans"]:
        kanban_parts.append(
            build_kanban_from_plan(client, plan["id"], plan_labels.get(plan["id"], plan["id"]), server)
        )
    data["kanban"] = merge_kanban(kanban_parts)
    data["kanbanSource"] = "jira"
    write_data_files(data)
    print(f"\nUpdated {DATA_JSON} and {DATA_JS}")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(f"Sync failed: {exc}", file=sys.stderr)
        raise SystemExit(1)
