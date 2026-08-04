/**
 * Minimal client for LeetCode's public GraphQL API (no auth required for
 * free-tier problem metadata and descriptions).
 */

const LEETCODE_GRAPHQL = "https://leetcode.com/graphql";

export interface QuestionSummary {
  frontendQuestionId: string;
  title: string;
  titleSlug: string;
  difficulty: "Easy" | "Medium" | "Hard";
  paidOnly: boolean;
}

export interface QuestionDetail {
  questionFrontendId: string;
  title: string;
  titleSlug: string;
  difficulty: string;
  content: string | null;
  codeSnippets: Array<{ lang: string; langSlug: string; code: string }> | null;
}

async function gql<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const res = await fetch(LEETCODE_GRAPHQL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Referer: "https://leetcode.com",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) {
    throw new Error(`LeetCode request failed: ${res.status} ${res.statusText}`);
  }
  const json = (await res.json()) as { data?: T; errors?: Array<{ message: string }> };
  if (json.errors?.length) {
    throw new Error(`LeetCode GraphQL error: ${json.errors.map((e) => e.message).join("; ")}`);
  }
  if (!json.data) {
    throw new Error("LeetCode returned no data");
  }
  return json.data;
}

export async function searchQuestions(keywords: string, limit = 20): Promise<QuestionSummary[]> {
  const query = `
    query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
      problemsetQuestionList: questionList(
        categorySlug: $categorySlug
        limit: $limit
        skip: $skip
        filters: $filters
      ) {
        questions: data {
          frontendQuestionId: questionFrontendId
          title
          titleSlug
          difficulty
          paidOnly: isPaidOnly
        }
      }
    }`;
  const data = await gql<{ problemsetQuestionList: { questions: QuestionSummary[] } }>(query, {
    categorySlug: "",
    limit,
    skip: 0,
    filters: keywords ? { searchKeywords: keywords } : {},
  });
  return data.problemsetQuestionList.questions;
}

export async function fetchQuestionDetail(titleSlug: string): Promise<QuestionDetail> {
  const query = `
    query questionData($titleSlug: String!) {
      question(titleSlug: $titleSlug) {
        questionFrontendId
        title
        titleSlug
        difficulty
        content
        codeSnippets { lang langSlug code }
      }
    }`;
  const data = await gql<{ question: QuestionDetail | null }>(query, { titleSlug });
  if (!data.question) {
    throw new Error(`Question not found: ${titleSlug}`);
  }
  return data.question;
}

/** Convert LeetCode's HTML problem description into readable plain text. */
export function htmlToText(html: string): string {
  const entities: Record<string, string> = {
    "&nbsp;": " ",
    "&lt;": "<",
    "&gt;": ">",
    "&amp;": "&",
    "&quot;": '"',
    "&#39;": "'",
    "&le;": "<=",
    "&ge;": ">=",
    "&ne;": "!=",
    "&minus;": "-",
    "&times;": "x",
    "&hellip;": "...",
    "&ldquo;": '"',
    "&rdquo;": '"',
    "&lsquo;": "'",
    "&rsquo;": "'",
  };
  let text = html
    .replace(/<sup>(.*?)<\/sup>/gis, "^$1")
    .replace(/<sub>(.*?)<\/sub>/gis, "_$1")
    .replace(/<li>/gi, "- ")
    .replace(/<\/(p|div|li|ul|ol|pre|h[1-6])>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "");
  for (const [entity, replacement] of Object.entries(entities)) {
    text = text.split(entity).join(replacement);
  }
  text = text.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
  return text
    .split("\n")
    .map((line) => line.replace(/\s+$/g, ""))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
