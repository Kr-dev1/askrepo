"use client";

import useProject from "@/hooks/use-projects";
import React from "react";
import { useGetCommits } from "./api/api";

const Commits = () => {
  const { projectId } = useProject();
  const { data, isLoading, error } = useGetCommits(projectId!);
  console.log(data);

  return <div> {data && JSON.stringify(data.data)}</div>;
};

export default Commits;