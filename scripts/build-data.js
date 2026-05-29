#!/usr/bin/env node
/** Regenerate shared/data.js from shared/data.json (no Jira call). */
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const jsonPath = path.join(root, "shared", "data.json");
const jsPath = path.join(root, "shared", "data.js");
const data = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
fs.writeFileSync(
  jsPath,
  `/* auto-generated from data.json */\nwindow.GEMINI_DATA = ${JSON.stringify(data, null, 2)};\n`,
  "utf8"
);
console.log(`Wrote ${jsPath}`);
