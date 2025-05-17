import { Octokit } from "octokit";
import { prisma } from "./prisma";
import axios from "./axios";
import { summarizeCommitAI } from "./gemini";
import { summarizeWithFallback } from "./llama";

export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

type Response = {
  commitHash: string;
  commitMessage: string;
  commitAuthorName: string;
  commitAuthorAvatar: string;
  commitAuthorProfile: string;
  commitDate: string;
  commitUrl: string;
};

type FailedCommit = {
  projectId?: string;
  commitHash: string;
  commitMessage: string;
  reason: string;
  diffSize?: number;
  diff?: string;
};

export type PollCommitsResult = {
  dbResult: any;
  failedCommits: FailedCommit[];
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getCommitHashes = async (
  githubUrl: string
): Promise<Response[]> => {
  const [owner, repo] = githubUrl.replace("https://github.com/", "").split("/");
  const { data } = await octokit.rest.repos.listCommits({
    owner,
    repo,
  });

  const sortedCommits = data.sort(
    (a, b) =>
      new Date(b.commit.author?.date || "").getTime() -
      new Date(a.commit.author?.date || "").getTime()
  );
  return sortedCommits.slice(0, 10).map((commit) => ({
    commitAuthorName: commit.commit.author?.name || "Unknown",
    commitAuthorAvatar: commit.author?.avatar_url || "",
    commitAuthorProfile: commit.author?.html_url || "",
    commitHash: commit.sha,
    commitMessage: commit.commit.message,
    commitDate: commit.commit.author?.date || "",
    commitUrl: commit.html_url,
  }));
};

const summariseCommitsWithRetry = async (
  githubUrl: string,
  commitHash: string,
  index: number,
  maxRetries = 3
) => {
  let retries = 0;
  while (retries <= maxRetries) {
    try {
      console.log(
        `Processing commit #${index + 1}: ${commitHash.substring(
          0,
          7
        )} (attempt ${retries + 1})`
      );

      const { data } = await axios.get(
        `${githubUrl}/commit/${commitHash}.diff`,
        {
          headers: { Accept: "application/vnd.github.v3.diff" },
          responseType: "text",
        }
      );

      const cleanDiffForPrompt = (diff: string): string => {
        return diff.replace(/\r\n/g, "\n").replace(/`/g, "'").trim();
      };

      const diffSize = data.length;
      const cleanedDiff = cleanDiffForPrompt(data);
      const result = await summarizeCommitAI(cleanedDiff);

      if (!result || result.trim().length === 0) {
        return {
          summary:
            "The AI couldn't generate a meaningful summary for this commit",
          diffSize,
          diff: cleanedDiff,
          success: false,
          reason: "Empty AI response",
        };
      }

      return { summary: result, diffSize, diff: cleanedDiff, success: true };
    } catch (error: any) {
      if (error.response?.status === 429) {
        retries++;
        const backoffTime = Math.pow(2, retries) * 2000;
        console.warn(
          `Rate limit hit. Retrying in ${backoffTime}ms... (${retries}/${maxRetries})`
        );
        if (retries <= maxRetries) {
          await sleep(backoffTime);
          continue;
        }
      }

      return {
        summary: `Failed to summarize commit: ${
          error.response?.status
            ? `Request failed with status code ${error.response.status}`
            : error.message
        }`,
        success: false,
        reason: error.response?.status
          ? `HTTP ${error.response.status}`
          : error.message,
      };
    }
  }
  return {
    summary: "Failed to summarize after multiple rate limit retries",
    success: false,
    reason: "Rate limit exceeded",
  };
};

export const pollCommits = async (
  projectId: string
): Promise<PollCommitsResult> => {
  const { project, githubUrl } = await fetchProjectGithubUrl(projectId);
  const commitHashes = await getCommitHashes(githubUrl);
  const unProcesssedCommits = await filterUnprocessedCommits(
    projectId,
    commitHashes
  );

  const summaries = [];
  const failedCommits: FailedCommit[] = [];

  for (let i = 0; i < unProcesssedCommits.length; i++) {
    const commit = unProcesssedCommits[i];
    try {
      const result = await summariseCommitsWithRetry(
        githubUrl,
        commit.commitHash,
        i
      );

      if (!result.success) {
        failedCommits.push({
          projectId: projectId,
          commitHash: commit.commitHash,
          commitMessage: commit.commitMessage,
          reason: result.reason || "Unknown error",
          diffSize: result.diffSize,
          diff: result.diff,
        });
        console.warn(
          `Failed: ${commit.commitHash.substring(0, 7)} — ${result.reason}`
        );
      }

      summaries.push({
        commitHash: commit.commitHash,
        summary: result.summary,
      });

      if (i < unProcesssedCommits.length - 1) await sleep(1000);
    } catch (error: any) {
      summaries.push({
        commitHash: commit.commitHash,
        summary: `Failed to generate summary: ${error.message}`,
      });
      failedCommits.push({
        commitHash: commit.commitHash,
        commitMessage: commit.commitMessage,
        reason: error.message,
      });
    }
  }

  const result = await prisma.commit.createMany({
    data: summaries.map((summary, index) => ({
      projectId,
      commitHash: unProcesssedCommits[index].commitHash,
      commitMessage: unProcesssedCommits[index].commitMessage,
      commitAuthorName: unProcesssedCommits[index].commitAuthorName,
      commitAuthorAvatar: unProcesssedCommits[index].commitAuthorAvatar,
      commitDate: unProcesssedCommits[index].commitDate,
      commitAuthorLink: unProcesssedCommits[index].commitAuthorProfile,
      summary: summary.summary as string,
      commitUrl: unProcesssedCommits[index].commitUrl,
    })),
  });

  if (failedCommits.length > 0) {
    console.log(`\n===== FAILED COMMITS SUMMARY =====`);
    console.log(
      `Total failed: ${failedCommits.length}/${unProcesssedCommits.length}`
    );

    const reasonCounts: Record<string, number> = {};
    failedCommits.forEach((commit) => {
      reasonCounts[commit.reason] = (reasonCounts[commit.reason] || 0) + 1;
    });

    console.log("Failed commit hashes:");
    failedCommits.forEach((commit) => {
      summarizeWithFallback(commit.diff!, commit.commitHash, projectId!);
    });
  } else {
    console.log("All commits were successfully processed.");
  }

  return { dbResult: result, failedCommits };
};

const fetchProjectGithubUrl = async (projectId: string) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { githubUrl: true },
  });
  if (!project) throw new Error("Project not found or GitHub URL is missing.");
  return { project, githubUrl: project.githubUrl || "" };
};

const filterUnprocessedCommits = async (
  projectId: string,
  commitHashes: Response[]
) => {
  const processedCommits = await prisma.commit.findMany({
    where: { projectId },
  });

  return commitHashes.filter(
    (commit) =>
      !processedCommits.some((pc) => pc.commitHash === commit.commitHash)
  );
};

if (require.main === module) {
  const projectId = process.argv[2];
  if (!projectId) {
    console.error("Please provide a project ID as a command line argument");
    process.exit(1);
  }

  pollCommits(projectId)
    .then((result) => {
      console.log(
        `Process completed with ${result.failedCommits.length} failed commits`
      );
      process.exit(0);
    })
    .catch((err) => {
      console.error("Error polling commits:", err);
      process.exit(1);
    });
}
