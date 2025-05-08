import { GoogleGenAI } from "@google/genai";

const genAi = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY as string });

export const summarizeCommitAI = async (diff: string) => {
  const prompt = `
  You are an expert programmer and technical writer tasked with summarizing a git diff into a clear and concise changelog.
  
  Instructions:
  - Summarize **what changed** in the code and **why** (if the reason is inferable from the code or context).
  - Group related changes together into a single bullet when appropriate.
  - Use high-level descriptions that would be meaningful to a developer reviewing the changelog.
  - For each bullet point:
    - Focus on purpose and impact, not line-by-line specifics.
    - Include the filename(s) in square brackets **only** if one or two files are affected. If more than two, omit filenames entirely.
  - Use proper bullet formatting (e.g. "- ").
  - Do **not** copy from or refer to any example summaries.
  - Avoid vague language like “updated code” or “minor changes”.
  
  Git Diff Reference:
  - Each file's changes begin with a line: \`diff --git a/<path> b/<path>\`
  - Lines beginning with \`+\` are additions.
  - Lines beginning with \`-\` are deletions.
  - Lines with no prefix are unchanged context lines.
  
  Please analyze and summarize the following git diff:
  
  ${diff}
  `;

  const result = await genAi.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
  });
  return result.text;
};
