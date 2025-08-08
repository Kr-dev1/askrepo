import { Document } from "@langchain/core/documents";
import { HumanMessage } from "@langchain/core/messages";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

const llm = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  model: "gemini-2.5-flash",
  temperature: 0.5,
  verbose: true,
  streaming: true,
});

export const summariseCommitAI = async (diff: string) => {
  const response = await llm.invoke([
    new HumanMessage(
      `
You are an expert programmer and technical writer tasked with summarizing a git diff into a clear and concise changelog.

Instructions:
- Summarize **what changed** in the code and **why** (if the reason is inferable from the code or context).
- Group related changes together into a single bullet when appropriate.
- Use high-level descriptions that would be meaningful to a developer reviewing the changelog.
- For each bullet point:
  - Try to provide context for each file that was updated unless all of theme are similar changes.
  - Focus on purpose and impact, not line-by-line specifics.
  - Include the filename(s) in square brackets **only** if one or two files are affected. If more than two, omit filenames entirely.
- Use proper bullet formatting (e.g. "- ").
- Do **not** copy from or refer to any example summaries.
- Avoid vague language like “updated code” or “minor changes”.
- Add \n to the end of each bullet point and donot include \n anywhere else.
- Donot mention anything else apart from the summary.

Git Diff Reference:
- Each file's changes begin with a line: \`diff --git a/<path> b/<path>\`
- Lines beginning with \`+\` are additions.
- Lines beginning with \`-\` are deletions.
- Lines with no prefix are unchanged context lines.

Please analyze and summarize the following git diff:

${diff}
`
    ),
  ]);
  return response?.content;
};

export const summariseCode = async (doc: Document) => {
  console.log("getting summary for", doc.metadata.source);
  const code = doc.pageContent.slice(0, 10000);
  const response = await llm.invoke([
    new HumanMessage(
      `You are ann intelligent senior software engineer who specialises in onboarding junior software engineers onto projects.
      You are onboadrding a junior software engineer and explaining to them the purpose of the ${doc.metadata.source} file,
      Dont not add greeting to the summary just return with the summary for the file.
      Here is the code: 
      -------
      ${code}
      -------
      Give summary no more than 200 words of the code above`
    ),
  ]);
  return response?.content;
};

export const generateEmbedding = async (summary: string) => {
  const embedder = new GoogleGenerativeAIEmbeddings({
    model: "gemini-embedding-001",
    apiKey: process.env.GEMINI_API_KEY,
    
  });
  const result = await embedder.embedQuery(summary);
  return result;
};
