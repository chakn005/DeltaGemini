/* Delta Gemini QA Console — shared data (auto-generated from data.json) */
window.GEMINI_DATA = {
  "program": "Delta Gemini",
  "epic": "RIGHTS-Gemini",
  "env": "Stage",
  "jira": {
    "baseUrl": "https://jira.disney.com",
    "browsePath": "/browse/",
    "lastSynced": "2026-05-29T07:22:47Z",
    "syncSource": "scripts/sync-from-jira.py",
    "syncRequired": false
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
    },
    {
      "id": "RIGHTS-27449",
      "name": "DTCFalcon-Capex-Version 26-05-13: Falcon Vibranium Release",
      "url": "https://jira.disney.com/browse/RIGHTS-27449",
      "jiraStatus": "Done",
      "status": "in-progress",
      "coverage": 64,
      "pass": 172,
      "fail": 90,
      "blocked": 0,
      "inProgress": 0,
      "pending": 6,
      "total": 268,
      "lastRun": "2026-05-25",
      "updated": "2026-05-25T06:59:15.376-0700",
      "created": "2026-02-11T06:14:42.752-0800",
      "owner": "Vijay Gajendra",
      "assignee": "Vijay Gajendra",
      "reporter": "Vijay Gajendra",
      "issueType": "Test Plan",
      "steps": [
        "falcon",
        "streaming"
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
      "testPlan": "RIGHTS-27449",
      "owner": "Vijay Gajendra",
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
    "blocked": [
      {
        "title": "CPTR-34551",
        "ticket": "CPTR-34551",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-34551",
        "jiraStatus": "FAIL"
      },
      {
        "title": "CPTR-34550",
        "ticket": "CPTR-34550",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-34550",
        "jiraStatus": "FAIL"
      },
      {
        "title": "CPTR-34957",
        "ticket": "CPTR-34957",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-34957",
        "jiraStatus": "FAIL"
      },
      {
        "title": "CPTR-35523",
        "ticket": "CPTR-35523",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-35523",
        "jiraStatus": "FAIL"
      },
      {
        "title": "CPTR-33174",
        "ticket": "CPTR-33174",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-33174",
        "jiraStatus": "FAIL"
      },
      {
        "title": "CPTR-33172",
        "ticket": "CPTR-33172",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-33172",
        "jiraStatus": "FAIL"
      },
      {
        "title": "CPTR-61549",
        "ticket": "CPTR-61549",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-61549",
        "jiraStatus": "FAIL"
      },
      {
        "title": "CPTR-35070",
        "ticket": "CPTR-35070",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-35070",
        "jiraStatus": "FAIL"
      },
      {
        "title": "CPTR-35191",
        "ticket": "CPTR-35191",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-35191",
        "jiraStatus": "FAIL"
      },
      {
        "title": "CPTR-42963",
        "ticket": "CPTR-42963",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-42963",
        "jiraStatus": "FAIL"
      },
      {
        "title": "CPTR-34548",
        "ticket": "CPTR-34548",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-34548",
        "jiraStatus": "FAIL"
      },
      {
        "title": "CPTR-34546",
        "ticket": "CPTR-34546",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-34546",
        "jiraStatus": "FAIL"
      },
      {
        "title": "CPTR-35875",
        "ticket": "CPTR-35875",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-35875",
        "jiraStatus": "FAIL"
      },
      {
        "title": "CPTR-59469",
        "ticket": "CPTR-59469",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-59469",
        "jiraStatus": "FAIL"
      },
      {
        "title": "CPTR-35873",
        "ticket": "CPTR-35873",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-35873",
        "jiraStatus": "FAIL"
      },
      {
        "title": "CPTR-35068",
        "ticket": "CPTR-35068",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-35068",
        "jiraStatus": "FAIL"
      },
      {
        "title": "CPTR-35061",
        "ticket": "CPTR-35061",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-35061",
        "jiraStatus": "FAIL"
      },
      {
        "title": "CPTR-35291",
        "ticket": "CPTR-35291",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-35291",
        "jiraStatus": "FAIL"
      },
      {
        "title": "CPTR-35292",
        "ticket": "CPTR-35292",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-35292",
        "jiraStatus": "FAIL"
      },
      {
        "title": "CPTR-59481",
        "ticket": "CPTR-59481",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-59481",
        "jiraStatus": "FAIL"
      },
      {
        "title": "CPTR-61600",
        "ticket": "CPTR-61600",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-61600",
        "jiraStatus": "FAIL"
      },
      {
        "title": "CPTR-50154",
        "ticket": "CPTR-50154",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-50154",
        "jiraStatus": "FAIL"
      },
      {
        "title": "CPTR-34489",
        "ticket": "CPTR-34489",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-34489",
        "jiraStatus": "FAIL"
      },
      {
        "title": "CPTR-34522",
        "ticket": "CPTR-34522",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-34522",
        "jiraStatus": "FAIL"
      },
      {
        "title": "CPTR-35045",
        "ticket": "CPTR-35045",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-35045",
        "jiraStatus": "FAIL"
      },
      {
        "title": "CPTR-35040",
        "ticket": "CPTR-35040",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-35040",
        "jiraStatus": "FAIL"
      },
      {
        "title": "CPTR-35722",
        "ticket": "CPTR-35722",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-35722",
        "jiraStatus": "FAIL"
      },
      {
        "title": "CPTR-36002",
        "ticket": "CPTR-36002",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-36002",
        "jiraStatus": "FAIL"
      },
      {
        "title": "CPTR-61585",
        "ticket": "CPTR-61585",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-61585",
        "jiraStatus": "FAIL"
      },
      {
        "title": "CPTR-36000",
        "ticket": "CPTR-36000",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-36000",
        "jiraStatus": "FAIL"
      },
      {
        "title": "CPTR-61582",
        "ticket": "CPTR-61582",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-61582",
        "jiraStatus": "FAIL"
      },
      {
        "title": "CPTR-61517",
        "ticket": "CPTR-61517",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-61517",
        "jiraStatus": "FAIL"
      },
      {
        "title": "CPTR-50107",
        "ticket": "CPTR-50107",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-50107",
        "jiraStatus": "FAIL"
      },
      {
        "title": "CPTR-61509",
        "ticket": "CPTR-61509",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-61509",
        "jiraStatus": "FAIL"
      },
      {
        "title": "CPTR-61508",
        "ticket": "CPTR-61508",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-61508",
        "jiraStatus": "FAIL"
      },
      {
        "title": "CPTR-34852",
        "ticket": "CPTR-34852",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-34852",
        "jiraStatus": "FAIL"
      },
      {
        "title": "CPTR-61529",
        "ticket": "CPTR-61529",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-61529",
        "jiraStatus": "FAIL"
      },
      {
        "title": "CPTR-34446",
        "ticket": "CPTR-34446",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-34446",
        "jiraStatus": "FAIL"
      },
      {
        "title": "CPTR-34963",
        "ticket": "CPTR-34963",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-34963",
        "jiraStatus": "FAIL"
      },
      {
        "title": "CPTR-55403",
        "ticket": "CPTR-55403",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-55403",
        "jiraStatus": "FAIL"
      }
    ],
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
      },
      {
        "title": "CPTR-34034",
        "ticket": "CPTR-34034",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-34034",
        "jiraStatus": "PASS"
      },
      {
        "title": "CPTR-44913",
        "ticket": "CPTR-44913",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-44913",
        "jiraStatus": "PASS"
      },
      {
        "title": "CPTR-44233",
        "ticket": "CPTR-44233",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-44233",
        "jiraStatus": "PASS"
      },
      {
        "title": "CPTR-61412",
        "ticket": "CPTR-61412",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-61412",
        "jiraStatus": "PASS"
      },
      {
        "title": "CPTR-33900",
        "ticket": "CPTR-33900",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-33900",
        "jiraStatus": "PASS"
      },
      {
        "title": "CPTR-35248",
        "ticket": "CPTR-35248",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-35248",
        "jiraStatus": "PASS"
      },
      {
        "title": "CPTR-34023",
        "ticket": "CPTR-34023",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-34023",
        "jiraStatus": "PASS"
      },
      {
        "title": "CPTR-36045",
        "ticket": "CPTR-36045",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-36045",
        "jiraStatus": "PASS"
      },
      {
        "title": "CPTR-35991",
        "ticket": "CPTR-35991",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-35991",
        "jiraStatus": "PASS"
      },
      {
        "title": "CPTR-34383",
        "ticket": "CPTR-34383",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-34383",
        "jiraStatus": "PASS"
      },
      {
        "title": "CPTR-66953",
        "ticket": "CPTR-66953",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-66953",
        "jiraStatus": "PASS"
      },
      {
        "title": "CPTR-49877",
        "ticket": "CPTR-49877",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-49877",
        "jiraStatus": "PASS"
      },
      {
        "title": "CPTR-47212",
        "ticket": "CPTR-47212",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-47212",
        "jiraStatus": "PASS"
      },
      {
        "title": "CPTR-67000",
        "ticket": "CPTR-67000",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-67000",
        "jiraStatus": "PASS"
      },
      {
        "title": "CPTR-32921",
        "ticket": "CPTR-32921",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-32921",
        "jiraStatus": "PASS"
      },
      {
        "title": "CPTR-32800",
        "ticket": "CPTR-32800",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-32800",
        "jiraStatus": "PASS"
      },
      {
        "title": "CPTR-35999",
        "ticket": "CPTR-35999",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-35999",
        "jiraStatus": "PASS"
      },
      {
        "title": "CPTR-35479",
        "ticket": "CPTR-35479",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-35479",
        "jiraStatus": "PASS"
      },
      {
        "title": "CPTR-33852",
        "ticket": "CPTR-33852",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-33852",
        "jiraStatus": "PASS"
      },
      {
        "title": "CPTR-35752",
        "ticket": "CPTR-35752",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-35752",
        "jiraStatus": "PASS"
      },
      {
        "title": "CPTR-35995",
        "ticket": "CPTR-35995",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-35995",
        "jiraStatus": "PASS"
      },
      {
        "title": "CPTR-35632",
        "ticket": "CPTR-35632",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-35632",
        "jiraStatus": "PASS"
      },
      {
        "title": "CPTR-35753",
        "ticket": "CPTR-35753",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-35753",
        "jiraStatus": "PASS"
      },
      {
        "title": "CPTR-35980",
        "ticket": "CPTR-35980",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-35980",
        "jiraStatus": "PASS"
      },
      {
        "title": "CPTR-61396",
        "ticket": "CPTR-61396",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-61396",
        "jiraStatus": "PASS"
      },
      {
        "title": "CPTR-35461",
        "ticket": "CPTR-35461",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-35461",
        "jiraStatus": "PASS"
      },
      {
        "title": "CPTR-61559",
        "ticket": "CPTR-61559",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-61559",
        "jiraStatus": "PASS"
      },
      {
        "title": "CPTR-51237",
        "ticket": "CPTR-51237",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-51237",
        "jiraStatus": "PASS"
      },
      {
        "title": "CPTR-34539",
        "ticket": "CPTR-34539",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-34539",
        "jiraStatus": "PASS"
      },
      {
        "title": "CPTR-35629",
        "ticket": "CPTR-35629",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-35629",
        "jiraStatus": "PASS"
      },
      {
        "title": "CPTR-33843",
        "ticket": "CPTR-33843",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-33843",
        "jiraStatus": "PASS"
      },
      {
        "title": "CPTR-34656",
        "ticket": "CPTR-34656",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-34656",
        "jiraStatus": "PASS"
      },
      {
        "title": "CPTR-33844",
        "ticket": "CPTR-33844",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-33844",
        "jiraStatus": "PASS"
      },
      {
        "title": "CPTR-37888",
        "ticket": "CPTR-37888",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-37888",
        "jiraStatus": "PASS"
      },
      {
        "title": "CPTR-34655",
        "ticket": "CPTR-34655",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-34655",
        "jiraStatus": "PASS"
      },
      {
        "title": "CPTR-33167",
        "ticket": "CPTR-33167",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-33167",
        "jiraStatus": "PASS"
      },
      {
        "title": "CPTR-34364",
        "ticket": "CPTR-34364",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-34364",
        "jiraStatus": "PASS"
      },
      {
        "title": "CPTR-61442",
        "ticket": "CPTR-61442",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-61442",
        "jiraStatus": "PASS"
      },
      {
        "title": "CPTR-36023",
        "ticket": "CPTR-36023",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-36023",
        "jiraStatus": "PASS"
      },
      {
        "title": "CPTR-35450",
        "ticket": "CPTR-35450",
        "plan": "Falcon",
        "url": "https://jira.disney.com/browse/CPTR-35450",
        "jiraStatus": "PASS"
      }
    ]
  },
  "kanbanSource": "jira"
};
