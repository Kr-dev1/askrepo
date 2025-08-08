"use server";

import { Output, streamText } from "ai";
import { createStreamableValue } from "@ai-sdk/rsc";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateEmbedding } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function askQuestion(question: string, projectId: string) {
  const stream = createStreamableValue();
  try {
    const queryVector = await generateEmbedding(question);
    console.log("Query vector length:", queryVector.length);

    const vectorQuery = `[${queryVector.join(",")}]`;

    // Try without similarity threshold first
    const result = (await prisma.$queryRaw`
      SELECT 
        "fileName",
        "sourceCode",
        "summary",
        1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) AS similarity
      FROM "SourceCodeEmbedding"
      WHERE "projectId" = ${projectId}
      ORDER BY similarity DESC
      LIMIT 10
    `) as {
      fileName: string;
      sourceCode: string;
      summary: string;
      similarity: number;
    }[];

    console.log("Database results count:", result.length);

    if (result.length > 0) {
      console.log(
        "Top similarities:",
        result.slice(0, 3).map((r) => ({
          fileName: r.fileName,
          similarity: r.similarity?.toFixed(3),
        }))
      );
    }

    let context = "";
    for (const doc of result) {
      context += `source: ${doc.fileName}\ncode content: ${doc.sourceCode}\nsummary of file: ${doc.summary}\n\n`;
    }

    console.log("Final context length:", context.length);

    // Move the streaming logic to be awaited properly
    const { textStream } = await streamText({
      model: google("gemini-2.5-flash"),
      prompt: `
You are an AI code assistant who answers questions about the codebase. Your target audience is a technical intern who is looking to understand the codebase.

You are helpful, clever, and articulate. You are eager to provide thoughtful responses to the user.

If the question is asking about code or a specific file, you will provide a detailed answer, giving step-by-step instructions, including code snippets.

START CONTEXT BLOCK  
${context}  
END OF CONTEXT BLOCK

START QUESTION  
${question}  
END QUESTION

You will take into account any CONTEXT BLOCK that is provided in the conversation.  
If the context does not provide the answer to the question, you will say:  
> "I'm sorry, but I don't know the answer to that question."

You will not apologize for previous responses but will instead indicate that new information was gained.  
You will not invent anything that is not drawn directly from the context.

Answer in **Markdown** syntax. Use **code blocks** for code.  
Be as detailed and specific as possible when answering.  
Ensure the final answer is **clear, structured**, and **free of filler content**.
      `,
    });

    // Process the stream in the background but don't block the return
    (async () => {
      try {
        for await (const chunk of textStream) {
          stream.update(chunk);
        }
      } catch (error) {
        console.error("Streaming error:", error);
        stream.error(error);
      } finally {
        stream.done();
      }
    })();

    return {
      output: stream.value,
      filesReferences: result,
    };
  } catch (error) {
    console.error("Error in askQuestion:", error);
    stream.error(error);
    return {
      output: stream.value,
      filesReferences: [],
    };
  }
}
