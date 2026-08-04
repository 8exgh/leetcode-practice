# LeetCode Practice

[![Tests](https://github.com/8exgh/leetcode-practice/actions/workflows/tests.yml/badge.svg)](https://github.com/8exgh/leetcode-practice/actions/workflows/tests.yml)

## Test Results

<!-- TEST-RESULTS:START -->
**0/1** exercises passing (0/2 tests).

| Exercise | Status | Tests |
| --- | --- | --- |
| easy-two-sum-typescript | ❌ Fail | 0/2 |
<!-- TEST-RESULTS:END -->

## Setup

```sh
npm install
```

## Start a new exercise

```sh
npm run new
```

The CLI connects to LeetCode, lets you search and pick a question, choose a
language (TypeScript for now), and scaffolds a new folder from
`templates/typescript/` into:

```
exercises/<difficulty>-<question-slug>-<language>/
# e.g. exercises/easy-two-sum-typescript/
```

The generated `exercise.ts` has the full problem description (and LeetCode's
official starter signature) as a comment block at the top, plus a
not-implemented placeholder to replace with your solution. Write tests in
`exercise.test.ts` from the problem's examples.

If you already know the question's slug you can skip the prompts:

```sh
npm run new -- --slug two-sum
```

## Run tests

```sh
npm test                              # all exercises
npx jest exercises/easy-two-sum-typescript   # a single exercise
```

CI runs every exercise's tests on each push/PR and writes the per-exercise
results into the [Test Results](#test-results) section above.
