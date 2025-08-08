import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { useLocalStorage } from "usehooks-ts";
import { useRouter } from "next/navigation";

// Define TypeScript type for projects
interface Project {
  id: string;
  name: string;
  [key: string]: any;
}

const useProject = () => {
  const router = useRouter();
  
  // Store selected project ID in local storage
  const [projectId, setProjectId] = useLocalStorage<string | null>(
    "askrepo-project",
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
      
      // Check if API returned redirect flag
      if (data.redirect) {
        router.replace(data.redirectUrl);
        return [];
      }
      
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
