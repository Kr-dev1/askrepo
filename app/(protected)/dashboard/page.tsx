"use client";

import Commits from "@/components/dashboard/Commits";
import useProject from "@/hooks/use-projects";
import { IconBrandGithub } from "@tabler/icons-react";
import { ExternalLink, PlusCircle } from "lucide-react";
import Link from "next/link";
import React from "react";
import { LoaderThree } from "@/components/ui/loader";
import AskQuestion from "@/components/dashboard/ask-question";
import Archive from "@/components/dashboard/archive";
import { Button } from "@/components/ui/button";
import { useGetCommits } from "@/components/dashboard/api/api";

const Dashboard = () => {
  const { project, projectId } = useProject();
  const { isPending } = useGetCommits(projectId!)

  if (project?.loading) {
    return (
      <div className="flex flex-col justify-center items-center h-full gap-4">
        <LoaderThree />
        <div className="text-center">
          <p>Fetching data from your project</p>
          <p>This page will display your project details once ready.</p>
        </div>
      </div>
    );
  }
  console.log(isPending, project);

  if (isPending && projectId === undefined) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold">No Project Found</h2>
          <p className="text-muted-foreground">
            Create a new project to get started
          </p>
        </div>
        <Link href="/create">
          <Button className="flex items-center gap-2">
            <PlusCircle className="size-4" />
            Create New Project
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-y-4">
        <div className="w-fit rounded-md bg-background px-4 py-3">
          <div className="flex items-center">
            <IconBrandGithub className="size-5 text-white" />
            <div className="ml-2">
              <p className="text-sm font-medium text-white flex items-center">
                This Project is linked to
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
          {/* Render InviteButton and Archive Button here */}
          Team Members InviteButton
          <Archive />
        </div>
      </div>

      <div className="mt-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
          <AskQuestion />
        </div>
      </div>

      <div className="mt-8"></div>
      <Commits />
    </div>
  );
};

export default Dashboard;
