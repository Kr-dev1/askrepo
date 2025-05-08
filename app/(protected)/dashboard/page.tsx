"use client";

import useProject from "@/hooks/use-projects";
import { IconBrandGithub } from "@tabler/icons-react";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import React from "react";
const Dashboard = () => {
  const { project } = useProject();

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-y-4">
        <div className="w-fit rounded-md bg-background px-4 py-3">
          <div className="flex items-center">
            <IconBrandGithub className="size-5 text-white" />
            <div className="ml-2">
              <p className="text-sm font-medium text-white flex items-center">
                This Project is linked to{" "}
                <Link
                  className="flex items-center ml-1"
                  href={project?.githubUrl ?? ""}
                  target="_blank"
                >
                  {project?.githubUrl}
                  <ExternalLink className="ml-1 size-4" />
                </Link>
              </p>
            </div>
          </div>
        </div>
        <div className="h-4"></div>
        <div className="flex items-center gap-4">
          Team Membars InviteButton Archive Button
        </div>
      </div>
      <div className="mt-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
          AskQuestions Meeting Card
        </div>
      </div>
      <div className="mt-8"></div>
      Commit Log
    </div>
  );
};

export default Dashboard;
