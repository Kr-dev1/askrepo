import useProject from "@/hooks/use-projects";
import React from "react";
import { useGetCommits } from "./api/api";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

const Commits = () => {
  const { projectId, project } = useProject();
  const { data, isLoading, error } = useGetCommits(projectId!);

  return (
    <ul>
      {data?.map((commit: any, commitIndx: number) => {
        return (
          <li key={commit.id} className="relative flex gap-4">
            <div
              className={cn(
                commitIndx === commit.length - 1 ? "h-6" : "-bottom-6",
                "absolute left-0 top-0 flex w-6 justify-center"
              )}
            >
              <div className="w-px trsnlate-x-1 bg-gray-200"></div>
            </div>
            <>
              <img
                src={commit.commitAuthorAvatar}
                alt="commit author avatar"
                className="relative mt-4 size-8 flex-none rounded-full bg-gray-50"
              />
              <div className="flex-auto rounded-md bg-black p-3 ring-1 ring-inset m-2">
                <div className="flex gap-x-4 justify-between">
                  <span className="flex flex-col">
                    <Link
                      target="_blank"
                      href={commit.commitAuthorLink}
                      className="py-0.5 rounded-full text-sm leading-5 text-gray-300 font-bold flex items-center"
                    >
                      {commit.commitAuthorName}
                      <ExternalLink className="ml-1 size-4" />
                    </Link>
                    <Link
                      target="_blank"
                      href={commit.commitUrl}
                      className="py-0.5 rounded-full text-sm leading-5 text-gray-400 "
                    >
                      {commit.commitMessage}
                      <div>
                        {commit.summary.map((line: string, index: number) => (
                          <p
                            key={index}
                            className="mt-2 whitespace-pre-wrap text-xs leading-5"
                          >
                            {line}
                          </p>
                        ))}
                      </div>
                    </Link>
                  </span>
                </div>
              </div>
            </>
          </li>
        );
      })}
    </ul>
  );
};

export default Commits;
