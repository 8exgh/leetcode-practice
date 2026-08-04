/**
 * Interactive CLI for scaffolding a new LeetCode exercise.
 *
 * Usage:
 *   npm run new                    # interactive: search, pick question, pick language
 *   npm run new -- --slug two-sum  # non-interactive: scaffold a known question slug
 *
 * It copies templates/<language>/ into exercises/<difficulty>-<slug>-<language>/
 * and prepends the problem description (fetched from LeetCode) as a comment
 * block at the top of the exercise file.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import prompts from "prompts";
import {
  fetchQuestionDetail,
  htmlToText,
  searchQuestions,
  type QuestionDetail,
} from "./leetcode";

const ROOT = path.resolve(__dirname, "..", "..");
const LANGUAGES = ["typescript"] as const;
type Language = (typeof LANGUAGES)[number];

function wrapLines(text: string, width: number): string[] {
  const lines: string[] = [];
  for (const raw of text.split("\n")) {
    if (raw.length <= width) {
      lines.push(raw);
      continue;
    }
    let line = raw;
    while (line.length > width) {
      let breakAt = line.lastIndexOf(" ", width);
      if (breakAt <= 0) breakAt = width;
      lines.push(line.slice(0, breakAt));
      line = line.slice(breakAt).trimStart();
    }
    if (line) lines.push(line);
  }
  return lines;
}

function buildHeaderComment(question: QuestionDetail, language: Language): string {
  const url = `https://leetcode.com/problems/${question.titleSlug}/`;
  const description = question.content
    ? htmlToText(question.content)
    : "(No description available — see the problem page.)";
  const snippet = question.codeSnippets?.find((s) => s.langSlug === language);

  const body: string[] = [
    `${question.questionFrontendId}. ${question.title}`,
    `Difficulty: ${question.difficulty}`,
    url,
    "",
    ...wrapLines(description, 96),
  ];
  if (snippet) {
    body.push("", "Starter signature from LeetCode:", "", ...snippet.code.trimEnd().split("\n"));
  }

  // "*/" inside the description or snippet would terminate the comment block early.
  const commentLines = body
    .map((line) => line.replace(/\*\//g, "*\\/"))
    .map((line) => (line ? ` * ${line}` : " *"));
  return ["/**", ...commentLines, " */"].join("\n");
}

function scaffoldExercise(question: QuestionDetail, language: Language): string {
  const folderName = `${question.difficulty.toLowerCase()}-${question.titleSlug}-${language}`;
  const templateDir = path.join(ROOT, "templates", language);
  const targetDir = path.join(ROOT, "exercises", folderName);

  if (fs.existsSync(targetDir)) {
    throw new Error(`Exercise folder already exists: exercises/${folderName}`);
  }
  fs.cpSync(templateDir, targetDir, { recursive: true });

  const exerciseFile = path.join(targetDir, "exercise.ts");
  const existing = fs.readFileSync(exerciseFile, "utf8");
  fs.writeFileSync(exerciseFile, `${buildHeaderComment(question, language)}\n\n${existing}`);
  return targetDir;
}

async function pickQuestionInteractively(): Promise<string | null> {
  const { keywords } = await prompts({
    type: "text",
    name: "keywords",
    message: "Search LeetCode questions (empty lists the first 20):",
  });
  if (keywords === undefined) return null;

  const questions = await searchQuestions(keywords ?? "");
  const available = questions.filter((q) => !q.paidOnly);
  if (available.length === 0) {
    console.log("No (free) questions matched that search. Try different keywords.");
    return pickQuestionInteractively();
  }

  const { slug } = await prompts({
    type: "select",
    name: "slug",
    message: "Pick a question:",
    choices: available.map((q) => ({
      title: `#${q.frontendQuestionId} ${q.title} [${q.difficulty}]`,
      value: q.titleSlug,
    })),
  });
  return slug ?? null;
}

async function main(): Promise<void> {
  const slugFlag = process.argv.indexOf("--slug");
  let slug: string | null =
    slugFlag !== -1 && process.argv[slugFlag + 1] ? process.argv[slugFlag + 1] : null;

  if (!slug) {
    slug = await pickQuestionInteractively();
    if (!slug) {
      console.log("Cancelled.");
      return;
    }
  }

  let language: Language = "typescript";
  if (slugFlag === -1) {
    const { picked } = await prompts({
      type: "select",
      name: "picked",
      message: "Pick a language:",
      choices: LANGUAGES.map((lang) => ({ title: lang, value: lang })),
    });
    if (!picked) {
      console.log("Cancelled.");
      return;
    }
    language = picked;
  }

  console.log(`Fetching "${slug}" from LeetCode...`);
  const question = await fetchQuestionDetail(slug);
  const targetDir = scaffoldExercise(question, language);
  const relative = path.relative(ROOT, targetDir);

  console.log(`\nCreated ${relative}/`);
  console.log(`  - ${relative}/exercise.ts       (implement your solution here)`);
  console.log(`  - ${relative}/exercise.test.ts  (write tests from the examples)`);
  console.log(`\nRun its tests with: npx jest ${relative}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
