import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { toast } from "sonner";

const fetchCommits = async (projectId: string) => {
  let { data } = await axios.get(`/commits?projectId=${projectId}`);
  return data.data.map((commit: any) => ({
    ...commit,
    summary: commit.summary
      ? commit.summary
          .split("\n")
          .map((line: string) => line.trim())
          .filter(Boolean)
      : [],
  }));
};

export const useGetCommits = (projectId: string) => {
  return useQuery({
    queryKey: ["commits", projectId],
    queryFn: () => fetchCommits(projectId),
    enabled: !!projectId,
    refetchInterval: 20000,
  });
};

export const saveQuestion = async (
  projectId: string,
  question: string,
  answer: string,
  fileReferences: any
) => {
  const { data } = await axios.post("/question", {
    projectId,
    question,
    answer,
    fileReferences,
  });
  return data;
};

export const useSaveQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      projectId,
      question,
      answer,
      fileReferences,
    }: {
      projectId: string;
      question: string;
      answer: string;
      fileReferences: any;
    }) => saveQuestion(projectId, question, answer, fileReferences),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
  });
};

const archiveProjects = async (projectId: string) => {
  let { data } = await axios.put(`/project?projectId=${projectId}`);
  return data;
};

export const useArchiveProjects = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => archiveProjects(projectId),
    onSuccess: () => {
      localStorage.removeItem("askrepo-project");
      toast.success("Project Archived");
      queryClient.invalidateQueries({ queryKey: ["archiveProjects"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["commits", projectId] });
    },
  });
};
