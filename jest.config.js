/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  // Only exercises are tested; the template folder is just a scaffold source.
  testMatch: ["<rootDir>/exercises/**/*.test.ts"],
  passWithNoTests: true,
};
