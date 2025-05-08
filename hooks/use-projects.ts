import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { useLocalStorage } from "usehooks-ts";

// Define TypeScript type for projects
interface Project {
  id: string;
  name: string;
  [key: string]: any;
}

const useProject = () => {
  // Store selected project ID in local storage
  const [projectId, setProjectId] = useLocalStorage<string | null>(
    "dionysus-project",
    null
  );

  // Query to fetch all projects
  const {
    data: projects = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data } = await axios.get("project");
      return data.data;
    },
  });

  // Get current project based on selected projectId
  const project = projects?.find(
    (project: Project) => project.id === projectId
  );

  return {
    projects,
    project,
    projectId,
    setProjectId,
    isLoading,
    error,
  };
};

export default useProject;
