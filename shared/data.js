/* Delta Gemini QA Console — shared data (auto-generated from data.json) */
window.GEMINI_DATA = {
  "program": "Delta Gemini",
  "epic": "RIGHTS-Gemini",
  "env": "Stage",
  "jira": {
    "baseUrl": "https://jira.disney.com",
    "browsePath": "/browse/",
    "lastSynced": "2026-05-30T02:30:00Z",
    "syncSource": "scripts/sync-from-jira.py",
    "syncRequired": true,
    "syncTestPlans": [
      "RIGHTS-28225",
      "RIGHTS-28094",
      "RIGHTS-28328"
    ],
    "excludedTestPlans": [
      "RIGHTS-27449"
    ],
    "integrationPlans": {
      "rl-md": "RIGHTS-28225",
      "md-fda": "RIGHTS-28225",
      "fda-cpm": "RIGHTS-28225",
      "fda-xavier": "RIGHTS-28225",
      "fda-falcon": "RIGHTS-28225"
    },
    "dataVersion": "20260530023000"
  },
  "flowSteps": [
    {
      "id": "rightsline",
      "name": "Rightsline",
      "short": "Deal Created",
      "isNew": false,
      "requirements": [
        "Business teams create content deal",
        "Defines ownership, territory, and availability window",
        "Licensee = Hulu triggers new Hulu flow"
      ],
      "handoff": "DRO flows to MD"
    },
    {
      "id": "md",
      "name": "MD",
      "short": "Metadata Platform",
      "isNew": true,
      "requirements": [
        "Populate and update MD cache with Hulu CP ID",
        "Create separate Kafka topic for Hulu",
        "DROs for D+ deal with Licensee = Hulu flow to MD"
      ],
      "handoff": "DRO flows to FDA"
    },
    {
      "id": "fda",
      "name": "FDA",
      "short": "Avail & Processing",
      "isNew": true,
      "requirements": [
        "Setup new Fleet called Hulu with required modules",
        "Process DROs with Licensee = Hulu and Hulu CP ID",
        "Picture version call to Xavier with Licensee = Hulu",
        "Maintain same territory-to-language mapping as Disney+ fleet",
        "Send payload to Falcon with Hulu CP ID"
      ],
      "handoff": "Payload to Falcon"
    },
    {
      "id": "cpm",
      "name": "CPM",
      "short": "Title Metadata",
      "isNew": false,
      "branch": "fda",
      "requirements": [
        "Retrieve title metadata from CPM",
        "Title name, season info, description, genres"
      ],
      "handoff": "Metadata to FDA"
    },
    {
      "id": "xavier",
      "name": "Xavier",
      "short": "Picture Versions",
      "isNew": true,
      "branch": "fda",
      "requirements": [
        "Retrieve picture versions from Xavier",
        "Picture version call with Licensee = Hulu"
      ],
      "handoff": "Assets to FDA"
    },
    {
      "id": "falcon",
      "name": "Falcon",
      "short": "Payload & Avails",
      "isNew": true,
      "requirements": [
        "Setup new Fleet called Hulu with tabs and feature controls",
        "Process avails with Licensee = Hulu and Hulu CP ID",
        "Send avails via Kafka",
        "Maintain same holdback explosion logic as Disney+ fleet",
        "Generate ingest avails for Hulu licensee events"
      ],
      "handoff": "Avails via Kafka"
    },
    {
      "id": "streaming",
      "name": "Disney Streaming",
      "short": "Ingestion",
      "isNew": true,
      "requirements": [
        "Deliver to Disney Streaming (possibly new folder)",
        "Obtain ingestion status back",
        "Validate content and surface client-ready status"
      ],
      "handoff": "Client visible"
    }
  ],
  "testPlans": [
    {
      "id": "RIGHTS-28225",
      "name": "FDA - Test Plan - 26-06-24 FDA Delta Gemini Release 8.0.0",
      "url": "https://jira.disney.com/browse/RIGHTS-28225",
      "jiraStatus": "In Progress",
      "status": "completed",
      "coverage": 100,
      "pass": 22,
      "fail": 0,
      "blocked": 0,
      "inProgress": 0,
      "pending": 0,
      "total": 22,
      "lastRun": "2026-05-25",
      "updated": "2026-05-25T21:26:21.426-0700",
      "created": "2026-03-31T03:57:38.180-0700",
      "owner": "Smrithi Ravindranath",
      "assignee": "Smrithi Ravindranath",
      "reporter": "Smrithi Ravindranath",
      "issueType": "Test Plan",
      "steps": [
        "md",
        "fda",
        "cpm",
        "xavier"
      ],
      "dataSource": "jira"
    }
  ],
  "coverageMatrix": {
    "rows": [
      "Functional QA",
      "Contract / API",
      "Gemini Delta",
      "E2E Scenarios"
    ],
    "cols": [
      "rightsline",
      "md",
      "fda",
      "cpm",
      "xavier",
      "falcon",
      "streaming"
    ]
  },
  "geminiVsDisney": [
    {
      "area": "Licensee",
      "disney": "Disney+",
      "gemini": "Hulu"
    },
    {
      "area": "CP ID",
      "disney": "Disney ID",
      "gemini": "Hulu CP ID"
    },
    {
      "area": "Kafka",
      "disney": "Shared topics",
      "gemini": "New Hulu topic"
    },
    {
      "area": "Fleet",
      "disney": "Disney+ fleet",
      "gemini": "New Hulu fleet"
    },
    {
      "area": "Logic",
      "disney": "Existing",
      "gemini": "Mostly reused + tagged"
    }
  ],
  "deltaChecklist": [
    {
      "item": "Hulu CP ID populated in MD cache"
    },
    {
      "item": "Separate Kafka topic for Hulu"
    },
    {
      "item": "FDA Hulu fleet configured"
    },
    {
      "item": "Falcon Hulu fleet configured"
    },
    {
      "item": "Licensee tagging in payloads"
    },
    {
      "item": "Streaming ingestion folder validated"
    }
  ],
  "risks": [
    "Lower-env testing depends on upstream flow enablement",
    "Hulu CP ID mapping must remain consistent across MD → FDA → Falcon",
    "New Kafka topics require cross-team contract validation",
    "Streaming ingestion may require new folder structure"
  ],
  "contacts": [
    {
      "system": "Rightsline",
      "owners": "Business Ops / Deals"
    },
    {
      "system": "MD",
      "owners": "Metadata Platform Team"
    },
    {
      "system": "FDA",
      "owners": "Avail & Processing QA"
    },
    {
      "system": "Falcon",
      "owners": "Falcon Platform Team"
    },
    {
      "system": "Streaming",
      "owners": "Disney Streaming Ingestion"
    }
  ],
  "stepNarratives": [
    {
      "step": 1,
      "title": "Rightsline (Deal Created)",
      "what": "Business teams create content deal defining ownership, territory, and availability.",
      "delta": "Licensee = Hulu triggers new Hulu flow"
    },
    {
      "step": 2,
      "title": "MD",
      "what": "Rightsline generates DRO; MD stores Hulu CP ID and routes via Hulu Kafka topic.",
      "delta": "Separate Kafka topic + Hulu CP ID in cache"
    },
    {
      "step": 3,
      "title": "FDA",
      "what": "DRO processed in Hulu fleet; metadata from CPM, assets from Xavier.",
      "delta": "New Hulu fleet, licensee-tagged calls"
    },
    {
      "step": 4,
      "title": "CPM / Xavier",
      "what": "Title metadata and picture versions retrieved for processing.",
      "delta": "Xavier calls use Licensee = Hulu"
    },
    {
      "step": 5,
      "title": "Falcon",
      "what": "Final payload and avails prepared; holdback logic applied.",
      "delta": "Hulu fleet, avails via Kafka, ingest avails for Hulu events"
    },
    {
      "step": 6,
      "title": "Kafka → Streaming",
      "what": "Data transported via Kafka to ingestion pipeline.",
      "delta": "Separate Hulu Kafka topics"
    },
    {
      "step": 7,
      "title": "Streaming Ingestion",
      "what": "Streaming validates and returns INGESTED or FAILED status.",
      "delta": "Possible new ingestion folder"
    }
  ],
  "statusLabels": {
    "completed": {
      "label": "Completed",
      "class": "status-completed"
    },
    "in-progress": {
      "label": "In Progress",
      "class": "status-progress"
    },
    "pending": {
      "label": "Pending",
      "class": "status-pending"
    },
    "risk": {
      "label": "At Risk",
      "class": "status-risk"
    }
  },
  "cpdApplications": [
    "Rightsline",
    "MD",
    "FDA",
    "CPM",
    "Xavier",
    "Falcon",
    "Disney Streaming"
  ],
  "cpdIntegrations": [
    {
      "id": "rl-md",
      "from": "rightsline",
      "to": "md",
      "label": "DRO Handoff",
      "payload": "DRO for deal with Licensee = Hulu",
      "isNew": false,
      "testPlan": "RIGHTS-28225",
      "owner": "Smrithi Ravindranath",
      "validations": [
        "DRO schema and field validation",
        "Licensee = Hulu triggers Hulu routing",
        "Deal metadata integrity"
      ]
    },
    {
      "id": "md-fda",
      "from": "md",
      "to": "fda",
      "label": "DRO + Hulu CP ID",
      "payload": "DRO with Hulu CP ID via Hulu Kafka topic",
      "isNew": true,
      "testPlan": "RIGHTS-28225",
      "owner": "Smrithi Ravindranath",
      "validations": [
        "Hulu CP ID present in payload",
        "Separate Kafka topic routing",
        "MD cache to FDA contract checks"
      ]
    },
    {
      "id": "fda-cpm",
      "from": "fda",
      "to": "cpm",
      "label": "Title Metadata",
      "payload": "Metadata request for title / season / genres",
      "isNew": false,
      "testPlan": "RIGHTS-28225",
      "owner": "Smrithi Ravindranath",
      "validations": [
        "CPM response schema validation",
        "Title and season mapping",
        "Metadata completeness checks"
      ]
    },
    {
      "id": "fda-xavier",
      "from": "fda",
      "to": "xavier",
      "label": "Picture Versions",
      "payload": "Picture version call with Licensee = Hulu",
      "isNew": true,
      "testPlan": "RIGHTS-28225",
      "owner": "Smrithi Ravindranath",
      "validations": [
        "Licensee = Hulu on Xavier call",
        "Picture version ID mapping",
        "Asset availability validation"
      ]
    },
    {
      "id": "fda-falcon",
      "from": "fda",
      "to": "falcon",
      "label": "Processing Payload",
      "payload": "Final payload with Hulu CP ID, metadata, and assets",
      "isNew": true,
      "testPlan": "RIGHTS-28225",
      "owner": "Smrithi Ravindranath",
      "validations": [
        "Payload includes Hulu CP ID",
        "Metadata and asset references intact",
        "API contract between FDA and Falcon"
      ]
    },
    {
      "id": "falcon-streaming",
      "from": "falcon",
      "to": "streaming",
      "label": "Avails via Kafka",
      "payload": "Avails and ingest events to Disney Streaming",
      "isNew": true,
      "owner": "Disney Streaming Ingestion",
      "validations": [
        "Kafka avails message format",
        "Holdback explosion logic parity",
        "Ingestion status callback (INGESTED / FAILED)"
      ]
    }
  ],
  "integrationCoverageMatrix": {
    "rows": [
      "Handoff Validation",
      "API Contract",
      "Payload Integrity",
      "Gemini Delta",
      "E2E Handshake"
    ],
    "cols": [
      "rl-md",
      "md-fda",
      "fda-cpm",
      "fda-xavier",
      "fda-falcon",
      "falcon-streaming"
    ]
  },
  "kanban": {
    "backlog": [],
    "inTest": [],
    "blocked": [],
    "done": [
      {
        "title": "CPTR-69511",
        "ticket": "CPTR-69511",
        "plan": "FDA",
        "url": "https://jira.disney.com/browse/CPTR-69511",
        "jiraStatus": "PASS"
      },
      {
        "title": "CPTR-50100",
        "ticket": "CPTR-50100",
        "plan": "FDA",
        "url": "https://jira.disney.com/browse/CPTR-50100",
        "jiraStatus": "PASS"
      },
      {
        "title": "CPTR-50112",
        "ticket": "CPTR-50112",
        "plan": "FDA",
        "url": "https://jira.disney.com/browse/CPTR-50112",
        "jiraStatus": "PASS"
      },
      {
        "title": "CPTR-50149",
        "ticket": "CPTR-50149",
        "plan": "FDA",
        "url": "https://jira.disney.com/browse/CPTR-50149",
        "jiraStatus": "PASS"
      },
      {
        "title": "CPTR-50243",
        "ticket": "CPTR-50243",
        "plan": "FDA",
        "url": "https://jira.disney.com/browse/CPTR-50243",
        "jiraStatus": "PASS"
      },
      {
        "title": "CPTR-50266",
        "ticket": "CPTR-50266",
        "plan": "FDA",
        "url": "https://jira.disney.com/browse/CPTR-50266",
        "jiraStatus": "PASS"
      },
      {
        "title": "CPTR-50096",
        "ticket": "CPTR-50096",
        "plan": "FDA",
        "url": "https://jira.disney.com/browse/CPTR-50096",
        "jiraStatus": "PASS"
      },
      {
        "title": "CPTR-69569",
        "ticket": "CPTR-69569",
        "plan": "FDA",
        "url": "https://jira.disney.com/browse/CPTR-69569",
        "jiraStatus": "PASS"
      },
      {
        "title": "CPTR-69553",
        "ticket": "CPTR-69553",
        "plan": "FDA",
        "url": "https://jira.disney.com/browse/CPTR-69553",
        "jiraStatus": "PASS"
      },
      {
        "title": "CPTR-44326",
        "ticket": "CPTR-44326",
        "plan": "FDA",
        "url": "https://jira.disney.com/browse/CPTR-44326",
        "jiraStatus": "PASS"
      },
      {
        "title": "CPTR-44785",
        "ticket": "CPTR-44785",
        "plan": "FDA",
        "url": "https://jira.disney.com/browse/CPTR-44785",
        "jiraStatus": "PASS"
      },
      {
        "title": "CPTR-44962",
        "ticket": "CPTR-44962",
        "plan": "FDA",
        "url": "https://jira.disney.com/browse/CPTR-44962",
        "jiraStatus": "PASS"
      },
      {
        "title": "CPTR-70566",
        "ticket": "CPTR-70566",
        "plan": "FDA",
        "url": "https://jira.disney.com/browse/CPTR-70566",
        "jiraStatus": "PASS"
      },
      {
        "title": "CPTR-70847",
        "ticket": "CPTR-70847",
        "plan": "FDA",
        "url": "https://jira.disney.com/browse/CPTR-70847",
        "jiraStatus": "PASS"
      },
      {
        "title": "CPTR-70848",
        "ticket": "CPTR-70848",
        "plan": "FDA",
        "url": "https://jira.disney.com/browse/CPTR-70848",
        "jiraStatus": "PASS"
      },
      {
        "title": "CPTR-70934",
        "ticket": "CPTR-70934",
        "plan": "FDA",
        "url": "https://jira.disney.com/browse/CPTR-70934",
        "jiraStatus": "PASS"
      },
      {
        "title": "CPTR-70937",
        "ticket": "CPTR-70937",
        "plan": "FDA",
        "url": "https://jira.disney.com/browse/CPTR-70937",
        "jiraStatus": "PASS"
      },
      {
        "title": "CPTR-70971",
        "ticket": "CPTR-70971",
        "plan": "FDA",
        "url": "https://jira.disney.com/browse/CPTR-70971",
        "jiraStatus": "PASS"
      },
      {
        "title": "CPTR-70972",
        "ticket": "CPTR-70972",
        "plan": "FDA",
        "url": "https://jira.disney.com/browse/CPTR-70972",
        "jiraStatus": "PASS"
      },
      {
        "title": "CPTR-70973",
        "ticket": "CPTR-70973",
        "plan": "FDA",
        "url": "https://jira.disney.com/browse/CPTR-70973",
        "jiraStatus": "PASS"
      },
      {
        "title": "CPTR-61917",
        "ticket": "CPTR-61917",
        "plan": "FDA",
        "url": "https://jira.disney.com/browse/CPTR-61917",
        "jiraStatus": "PASS"
      },
      {
        "title": "CPTR-71631",
        "ticket": "CPTR-71631",
        "plan": "FDA",
        "url": "https://jira.disney.com/browse/CPTR-71631",
        "jiraStatus": "PASS"
      }
    ]
  },
  "kanbanSource": "jira"
};
