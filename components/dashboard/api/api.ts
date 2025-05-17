import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";

const fetchCommits = async (projectId: string) => {
  const { data } = await axios.get(`/commits?projectId=${projectId}`);
  return data;
};

export const useGetCommits = (projectId: string) => {
  console.log(projectId);
  return useQuery({
    queryKey: ["commits", projectId],
    queryFn: () => fetchCommits(projectId),
    enabled: !!projectId,
  });
};
