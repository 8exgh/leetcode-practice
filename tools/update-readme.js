/**
 * Injects a combined test results summary into README.md between the
 * TEST-RESULTS markers. Used by the CI workflow.
 *
 * Usage: node tools/update-readme.js <jest-json-results> [csharp-json-results]
 */
const fs = require("node:fs");
const path = require("node:path");

const jestFile = process.argv[2] || "results.json";
const csharpFile = process.argv[3];
const readmeFile = path.join(__dirname, "..", "README.md");

const readme = fs.readFileSync(readmeFile, "utf8");

const START = "<!-- TEST-RESULTS:START -->";
const END = "<!-- TEST-RESULTS:END -->";

// { exercise, ok, passed, total }
const suites = [];

const jest = JSON.parse(fs.readFileSync(jestFile, "utf8"));
for (const suite of jest.testResults) {
  suites.push({
    exercise: path.basename(path.dirname(suite.name)),
    ok: suite.status === "passed",
    passed: suite.assertionResults.filter((a) => a.status === "passed").length,
    total: suite.assertionResults.filter((a) => a.status !== "pending").length,
  });
}

if (csharpFile && fs.existsSync(csharpFile)) {
  const csharp = JSON.parse(fs.readFileSync(csharpFile, "utf8"));
  for (const suite of csharp.suites) {
    suites.push({
      exercise: suite.exercise,
      ok: suite.status === "passed",
      passed: suite.passed,
      total: suite.total,
    });
  }
}

suites.sort((a, b) => a.exercise.localeCompare(b.exercise));

const passingSuites = suites.filter((s) => s.ok).length;
const passedTests = suites.reduce((sum, s) => sum + s.passed, 0);
const totalTests = suites.reduce((sum, s) => sum + s.total, 0);

const summary =
  suites.length === 0
    ? "_No exercises yet — scaffold one with `npm run new`._"
    : [
        `**${passingSuites}/${suites.length}** exercises passing (${passedTests}/${totalTests} tests).`,
        "",
        "| Exercise | Status | Tests |",
        "| --- | --- | --- |",
        ...suites.map((s) => `| ${s.exercise} | ${s.ok ? "✅ Pass" : "❌ Fail"} | ${s.passed}/${s.total} |`),
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
