# LeetCode Practice

[![Tests](https://github.com/8exgh/leetcode-practice/actions/workflows/tests.yml/badge.svg)](https://github.com/8exgh/leetcode-practice/actions/workflows/tests.yml)

## Test Results

<!-- TEST-RESULTS:START -->
**3/3** exercises passing (41/42 tests).

| Exercise | Status | Tests |
| --- | --- | --- |
| easy-roman-to-integer-typescript | ✅ Pass | 34/34 |
| easy-two-sum-csharp | ✅ Pass | 6/6 |
| easy-two-sum-typescript | ✅ Pass | 1/2 |
<!-- TEST-RESULTS:END -->

## Setup

```sh
npm install
```

This also activates the versioned git hooks in `.githooks/` (via the `prepare`
script, which sets `core.hooksPath`). The pre-commit hook runs `npm test`
(TypeScript + C#) before every commit; bypass it in a pinch with
`git commit --no-verify`.

## Start a new exercise

```sh
npm run new
```

The CLI connects to LeetCode, lets you search and pick a question, choose a
language (TypeScript with jest, or C# with xUnit + FluentAssertions on
.NET 10), and scaffolds a new folder from `templates/<language>/` into:

```
exercises/<difficulty>-<question-slug>-<language>/
# e.g. exercises/easy-two-sum-typescript/
#      exercises/easy-two-sum-csharp/
```

The generated exercise file (`exercise.ts` / `Exercise.cs`) has the full
problem description (and LeetCode's official starter signature) as a comment
block at the top, plus a not-implemented placeholder to replace with your
solution. Write tests from the problem's examples in the test file next to it.

If you already know the question's slug you can skip the prompts:

```sh
npm run new -- --slug two-sum                # defaults to typescript
npm run new -- --slug two-sum --lang csharp
```

## Run tests

```sh
npm test                                     # everything (TypeScript + C#)
npm run test:ts                              # all TypeScript exercises
npm run test:cs                              # all C# exercises
npx jest exercises/easy-two-sum-typescript   # a single TypeScript exercise
dotnet test exercises/easy-two-sum-csharp    # a single C# exercise
```

CI runs every exercise's tests on each push/PR and writes the per-exercise
results into the [Test Results](#test-results) section above.
