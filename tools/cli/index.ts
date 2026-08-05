/**
 * Interactive CLI for scaffolding a new LeetCode exercise.
 *
 * Usage:
 *   npm run new                                  # interactive: search, pick question, pick language
 *   npm run new -- --slug two-sum                # non-interactive (defaults to typescript)
 *   npm run new -- --slug two-sum --lang csharp  # non-interactive with explicit language
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
const LANGUAGES = ["typescript", "csharp"] as const;
type Language = (typeof LANGUAGES)[number];

interface LanguageConfig {
  /** File in the template that gets the problem description prepended. */
  exerciseFile: string;
  /** LeetCode's langSlug, used to look up the official starter snippet. */
  snippetSlug: string;
  /** How to run the tests for a scaffolded exercise, shown after scaffolding. */
  testCommand: (relativeDir: string) => string;
}

const LANGUAGE_CONFIG: Record<Language, LanguageConfig> = {
  typescript: {
    exerciseFile: "exercise.ts",
    snippetSlug: "typescript",
    testCommand: (dir) => `npx jest ${dir}`,
  },
  csharp: {
    exerciseFile: "Exercise.cs",
    snippetSlug: "csharp",
    testCommand: (dir) => `dotnet test ${dir}`,
  },
};

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
  const snippet = question.codeSnippets?.find(
    (s) => s.langSlug === LANGUAGE_CONFIG[language].snippetSlug,
  );

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

  const exerciseFile = path.join(targetDir, LANGUAGE_CONFIG[language].exerciseFile);
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

function readFlag(name: string): string | null {
  const index = process.argv.indexOf(name);
  return index !== -1 && process.argv[index + 1] ? process.argv[index + 1] : null;
}

async function main(): Promise<void> {
  let slug = readFlag("--slug");
  const langFlag = readFlag("--lang");

  if (langFlag && !(LANGUAGES as readonly string[]).includes(langFlag)) {
    throw new Error(`Unknown language "${langFlag}". Supported: ${LANGUAGES.join(", ")}`);
  }
  let language = langFlag as Language | null;

  if (!slug) {
    slug = await pickQuestionInteractively();
    if (!slug) {
      console.log("Cancelled.");
      return;
    }
  }

  if (!language) {
    if (readFlag("--slug")) {
      // Non-interactive invocation without --lang: default to typescript.
      language = "typescript";
    } else {
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
      language = picked as Language;
    }
  }

  console.log(`Fetching "${slug}" from LeetCode...`);
  const question = await fetchQuestionDetail(slug);
  const targetDir = scaffoldExercise(question, language);
  const relative = path.relative(ROOT, targetDir);

  console.log(`\nCreated ${relative}/`);
  console.log(`  - implement your solution in ${LANGUAGE_CONFIG[language].exerciseFile}`);
  console.log(`  - write tests from the problem's examples in the test file next to it`);
  console.log(`\nRun its tests with: ${LANGUAGE_CONFIG[language].testCommand(relative)}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
