import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
import { Document } from "@langchain/core/documents";
import { generateEmbedding, summariseCode } from "./gemini";
import { prisma } from "./prisma";

export const loadGithubRepo = async (
  githubUrl: string,
  branchName: string,
  githubToken?: string
) => {
  console.log(
    `Loading GitHub repository from ${githubUrl} on branch ${branchName}`
  );

  const loader = new GithubRepoLoader(githubUrl, {
    accessToken: githubToken || process.env.GITHUB_TOKEN,
    branch: branchName,
    recursive: true,
    ignoreFiles: [
      "package-lock.json",
      "yarn.lock",
      "pnpm-lock.yaml",
      "bun.lockb",
      "deno.lock",
    ],
    unknown: "warn",
    maxConcurrency: 5,
  });

  const docs = await loader.load();
  console.log(`Loaded ${docs.length} documents from repository`);
  return docs;
};

export const indexGithubRepo = async (
  projectId: string,
  githubUrl: string,
  branchName: string,
  githubToken?: string
) => {
  try {
    console.log(`Starting to index repository for project: ${projectId}`);

    const docs = await loadGithubRepo(githubUrl, branchName, githubToken);

    if (docs.length === 0) {
      console.warn("No documents found in repository");
      return;
    }

    console.log("Generating embeddings...");
    const getAllEmbeddings = await generateEmbeddings(docs);
    console.log(`Generated ${getAllEmbeddings.length} embeddings`);

    const results = await Promise.allSettled(
      getAllEmbeddings.map(async (embedding, index) => {
        try {
          console.log(
            `Processing ${index + 1} of ${getAllEmbeddings.length}: ${
              embedding?.fileName
            }`
          );
          if (!embedding || !embedding.summary || !embedding.embedding) {
            console.warn(`Skipping invalid embedding at index ${index}`);
            return null;
          }
          console.log(
            `Embedding dimensions for ${embedding.fileName}: ${embedding.embedding.length}`
          );
          if (embedding.embedding.length !== 3072) {
            console.error(
              `Wrong embedding dimension: expected 3072, got ${embedding.embedding.length}`
            );
            return null;
          }

          const sourceCodeEmbedding = await prisma.sourceCodeEmbedding.create({
            data: {
              summary: embedding.summary,
              sourceCode: embedding.sourceCode,
              fileName: embedding.fileName,
              projectId,
            },
          });

          console.log(`Created record with ID: ${sourceCodeEmbedding.id}`);
          const result = await prisma.$executeRaw`
            UPDATE "SourceCodeEmbedding"
            SET "summaryEmbedding" = ${JSON.stringify(
              embedding.embedding
            )}::vector
            WHERE "id" = ${sourceCodeEmbedding.id}
          `;

          console.log(`Updated vector for ${embedding.fileName}:`, result);
          return sourceCodeEmbedding;
        } catch (error) {
          console.error(
            `Error processing embedding ${index} (${embedding?.fileName}):`,
            error
          );
          throw error;
        }
      })
    );

    const successful = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected");

    console.log(
      `Processing complete: ${successful} successful, ${failed.length} failed`
    );

    if (failed.length > 0) {
      console.error("Failed operations:");
      failed.forEach((failure, index) => {
        if (failure.status === "rejected") {
          console.error(`  ${index}: ${failure.reason}`);
        }
      });
    }
  } catch (error) {
    console.error("Error in indexGithubRepo:", error);
    throw error;
  }
};

const generateEmbeddings = async (docs: Document[]) => {
  console.log(`Generating embeddings for ${docs.length} documents`);

  const results = await Promise.allSettled(
    docs.map(async (doc, index) => {
      try {
        console.log(
          `Generating embedding ${index + 1}/${docs.length} for: ${
            doc.metadata.source
          }`
        );

        const summary = await summariseCode(doc);
        if (!summary || typeof summary !== "string") {
          console.warn(`No summary generated for ${doc.metadata.source}`);
          return null;
        }

        const embedding = await generateEmbedding(summary);
        if (!embedding || !Array.isArray(embedding) || embedding.length === 0) {
          console.warn(`No embedding generated for ${doc.metadata.source}`);
          return null;
        }

        return {
          summary,
          embedding,
          sourceCode: doc.pageContent, // No need for JSON.parse(JSON.stringify())
          fileName: doc.metadata.source,
        };
      } catch (error) {
        console.error(
          `Error generating embedding for ${doc.metadata.source}:`,
          error
        );
        return null;
      }
    })
  );
  const validEmbeddings = results
    .filter((r) => r.status === "fulfilled" && r.value !== null)
    .map((r) => (r.status === "fulfilled" ? r.value : null))
    .filter(Boolean);

  console.log(
    `Generated ${validEmbeddings.length} valid embeddings out of ${docs.length} documents`
  );

  return validEmbeddings;
};
