import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchQuestions = async (projectId: string) => {
    let { data } = await axios.get(`api/question?projectId=${projectId}`);
    return data.questions
};

export const useGetQuestions = (projectId: string) => {
    return useQuery({
        queryKey: ["questions", projectId],
        queryFn: () => fetchQuestions(projectId),
        enabled: !!projectId,
    });
};