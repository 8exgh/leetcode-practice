/**
 * Runs `dotnet test` for every exercises/*-csharp folder and writes a
 * summary to csharp-results.json (same spirit as jest's --json output).
 *
 * Always exits 0 — CI reads the `success` flag from the output file so the
 * README can be updated with failures before the job is marked failed.
 *
 * Usage: node tools/run-csharp-tests.js [output-file]
 */
const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const outputFile = process.argv[2] || "csharp-results.json";
const exercisesDir = path.join(ROOT, "exercises");

const folders = fs.existsSync(exercisesDir)
  ? fs
      .readdirSync(exercisesDir)
      .filter(
        (name) =>
          name.endsWith("-csharp") &&
          fs.statSync(path.join(exercisesDir, name)).isDirectory(),
      )
      .sort()
  : [];

const suites = [];
for (const folder of folders) {
  const dir = path.join(exercisesDir, folder);
  const testResultsDir = path.join(dir, "TestResults");
  fs.rmSync(testResultsDir, { recursive: true, force: true });

  console.log(`\n=== ${folder} ===`);
  const run = spawnSync(
    "dotnet",
    ["test", "--nologo", "--logger", "trx;LogFileName=results.trx"],
    { cwd: dir, stdio: "inherit" },
  );

  let passed = 0;
  let total = 0;
  const trxPath = path.join(testResultsDir, "results.trx");
  if (fs.existsSync(trxPath)) {
    const trx = fs.readFileSync(trxPath, "utf8");
    const counters = trx.match(/<Counters\b[^>]*>/)?.[0] ?? "";
    const attr = (name) => Number(counters.match(new RegExp(`\\b${name}="(\\d+)"`))?.[1] ?? 0);
    passed = attr("passed");
    // Count skipped tests like jest's "todo": excluded from the total.
    total = attr("executed");
  }

  suites.push({
    exercise: folder,
    status: run.status === 0 ? "passed" : "failed",
    passed,
    total,
  });
}

const summary = {
  success: suites.every((suite) => suite.status === "passed"),
  suites,
};
fs.writeFileSync(path.join(ROOT, outputFile), JSON.stringify(summary, null, 2));
console.log(`\nC# results written to ${outputFile} (${suites.length} exercise(s)).`);
