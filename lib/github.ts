import { Octokit } from "octokit";
import { prisma } from "./prisma";
import axios from "axios";
import { summariseCommitAI } from "./gemini";

export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export const getCommitHashes = async (githubUrl: string) => {
  const [owner, repo] = githubUrl.split("/").slice(-2);
  if (!owner || !repo) {
    throw new Error("invalid Github URL");
  }
  const { data } = await octokit.rest.repos.listCommits({
    owner,
    repo,
  });

  const sortedCommits = data.sort((a, b) => {
    const dateA = new Date(a.commit.author?.date ?? 0).getTime();
    const dateB = new Date(b.commit.author?.date ?? 0).getTime();
    return dateB - dateA;
  });

  return sortedCommits.slice(0, 15).map((commit: any) => ({
    commitHash: commit.sha,
    commitMessage: commit.commit?.message ?? "",
    commitAuthorName: commit.commit?.author?.name ?? "",
    commitAuthorAvatar: commit.author?.avatar_url ?? "",
    commitDate: commit.commit?.author?.date ?? "",
    commitUrl: commit.html_url,
    commitAuthorLink: commit.author?.html_url ?? "",
  }));
};

const fetchProjectGithubUrl = async (projectId: string) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: {
      githubUrl: true,
    },
  });
  return { project, githubUrl: project?.githubUrl };
};

//commits
export const pollCommits = async (projectId: string) => {
  const { project, githubUrl } = await fetchProjectGithubUrl(projectId);
  if (!githubUrl) {
    console.error(
      `Project with ID ${projectId} not found or has no GitHub URL.`
    );
    return;
  }

  const commitHashes = await getCommitHashes(githubUrl as string);
  const unprocessedCommits = await filterUnrocessedCommits(
    projectId,
    commitHashes
  );

  const summarieReponses = await Promise.allSettled(
    unprocessedCommits.map((commit: any) => {
      return summariseCommits(githubUrl as string, commit.commitHash);
    })
  );

  const summaries = summarieReponses.map((res) => {
    if (res.status === "fulfilled") {
      return res.value as string;
    }
    return "";
  });

  const commit = await prisma.commit.createMany({
    data: summaries.map((summary, index) => {
      return {
        projectId: projectId,
        commitMessage: unprocessedCommits[index].commitMessage,
        commitHash: unprocessedCommits[index].commitHash,
        commitUrl: unprocessedCommits[index].commitUrl,
        commitAuthorName: unprocessedCommits[index].commitAuthorName,
        commitAuthorAvatar: unprocessedCommits[index].commitAuthorAvatar,
        commitAuthorLink: unprocessedCommits[index].commitAuthorLink,
        commitDate: unprocessedCommits[index].commitDate,
        summary,
      };
    }),
  });

  await prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      loading: false,
    },
  });

  return commit;
};

//Filet commits not recorded
const filterUnrocessedCommits = async (
  projectId: string,
  commitHashes: any
) => {
  const processedCommits = await prisma.commit.findMany({
    where: { projectId },
  });
  const unprocessedCommits = commitHashes.filter(
    (commit: any) =>
      !processedCommits.some(
        (processedCommits) => processedCommits.commitHash === commit.commitHash
      )
  );
  return unprocessedCommits;
};

//Summarise Commits with AI
const summariseCommits = async (githubUrl: string, commitHash: string) => {
  const [owner, repo] = githubUrl.split("/").slice(-2);
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/commits/${commitHash}`;
  const { data } = await axios.get(apiUrl, {
    headers: {
      Accept: "application/vnd.github.v3.diff",
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  return (await summariseCommitAI(data)) || "";
};

pollCommits("cme0q4ik10004u70op21rimlb");
