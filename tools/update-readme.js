/**
 * Injects a jest results summary into README.md between the
 * TEST-RESULTS markers. Used by the CI workflow.
 *
 * Usage: node tools/update-readme.js <jest-json-results-file>
 */
const fs = require("node:fs");
const path = require("node:path");

const resultsFile = process.argv[2] || "results.json";
const readmeFile = path.join(__dirname, "..", "README.md");

const results = JSON.parse(fs.readFileSync(resultsFile, "utf8"));
const readme = fs.readFileSync(readmeFile, "utf8");

const START = "<!-- TEST-RESULTS:START -->";
const END = "<!-- TEST-RESULTS:END -->";

const rows = results.testResults
  .map((suite) => {
    const exercise = path.basename(path.dirname(suite.name));
    const passed = suite.assertionResults.filter((a) => a.status === "passed").length;
    const total = suite.assertionResults.filter((a) => a.status !== "pending").length;
    const ok = suite.status === "passed";
    return {
      exercise,
      line: `| ${exercise} | ${ok ? "✅ Pass" : "❌ Fail"} | ${passed}/${total} |`,
    };
  })
  .sort((a, b) => a.exercise.localeCompare(b.exercise))
  .map((r) => r.line);

const summary =
  results.numTotalTestSuites === 0
    ? "_No exercises yet — scaffold one with `npm run new`._"
    : [
        `**${results.numPassedTestSuites}/${results.numTotalTestSuites}** exercises passing` +
          ` (${results.numPassedTests}/${results.numTotalTests} tests).`,
        "",
        "| Exercise | Status | Tests |",
        "| --- | --- | --- |",
        ...rows,
      ].join("\n");

const startIdx = readme.indexOf(START);
const endIdx = readme.indexOf(END);
if (startIdx === -1 || endIdx === -1) {
  console.error("README.md is missing the TEST-RESULTS markers.");
  process.exit(1);
}

const updated =
  readme.slice(0, startIdx + START.length) + "\n" + summary + "\n" + readme.slice(endIdx);
fs.writeFileSync(readmeFile, updated);
console.log("README.md test results section updated.");
