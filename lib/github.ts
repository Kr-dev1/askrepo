import { Octokit } from "octokit";
import { prisma } from "./prisma";
import axios from "./axios";
import { summarizeCommitAI } from "./gemini";

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
};

export const getCommitHashes = async (
  githubUrl: string
): Promise<Response[]> => {
  const [owner, repo] = githubUrl.replace("https://github.com/", "").split("/");
  if (!owner || !repo) throw new Error("Invalid GitHub URL");
  const { data } = await octokit.rest.repos.listCommits({
    owner,
    repo,
  });

  const sortedCommits = data.sort(
    (a, b) =>
      new Date(b.commit.author?.date || "").getTime() -
      new Date(a.commit.author?.date || "").getTime()
  );

  return sortedCommits.slice(0, sortedCommits.length - 1).map((commit) => ({
    commitAuthorName: commit.commit.author?.name || "Unknown",
    commitAuthorAvatar: commit.author?.avatar_url || "",
    commitAuthorProfile: commit.author?.html_url || "",
    commitHash: commit.sha,
    commitMessage: commit.commit.message,
    commitDate: commit.commit.author?.date || "",
  }));
};

const summariseCommits = async (githubUrl: string, commitHash: string) => {
  const { data } = await axios.get(`${githubUrl}/commit/${commitHash}.diff`, {
    headers: {
      Accept: "application/vnd.github.v3.diff",
    },
  });
  return (await summarizeCommitAI(data)) || "No summary available";
};

export const pollCommits = async (projectId: string) => {
  const { project, githubUrl } = await fetchProjectGithubUrl(projectId);
  const commitHashes = await getCommitHashes(githubUrl);
  const unProcesssedCommits = await filterUnprocessedCommits(
    projectId,
    commitHashes
  );
  const summaryResponses = await Promise.allSettled(
    unProcesssedCommits.map((commit) =>
      summariseCommits(githubUrl, commit.commitHash)
    )
  );

  const summaries = summaryResponses.map((response, index) => {
    if (response.status === "fulfilled") {
      return {
        commitHash: unProcesssedCommits[index].commitHash,
        summary: response.value,
      };
    }
  });

  const commit = await prisma.commit.createMany({
    data: summaries.map((summary, index) => {
      return {
        projectId: projectId,
        commitHash: unProcesssedCommits[index].commitHash,
        commitMessage: unProcesssedCommits[index].commitMessage,
        commitAuthorName: unProcesssedCommits[index].commitAuthorName,
        commitAuthorAvatar: unProcesssedCommits[index].commitAuthorAvatar,
        commitDate: unProcesssedCommits[index].commitDate,
        commitAuthorLink: unProcesssedCommits[index].commitAuthorProfile,
        summary: (summary?.summary as string) || "No Data found",
      };
    }),
  });
  return commit;
};

const fetchProjectGithubUrl = async (projectId: string) => {
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
    select: {
      githubUrl: true,
    },
  });
  if (!project) {
    throw new Error("Project not found or GitHub URL is missing.");
  }

  return { project, githubUrl: project?.githubUrl || "" };
};

const filterUnprocessedCommits = async (
  projectId: string,
  commitHashes: Response[]
) => {
  const processedCommits = await prisma.commit.findMany({
    where: {
      projectId,
    },
  });

  const unProcesssedCommits = commitHashes.filter((commit) => {
    return !processedCommits.some(
      (processedCommit) => processedCommit.commitHash === commit.commitHash
    );
  });

  return unProcesssedCommits;
};

const result = await pollCommits("cmafi120q0000t2lwinzep92e");
console.log(result);
