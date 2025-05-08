import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useProject from "./use-projects";

type SubmitProps = {
  method?: string;
  url: string;
  redirectUrl?: string;
  data: any;
  refetch?: any;
  onSuccess?: (data: any) => void;
};

const submitRequest = async ({ method = "POST", url, data }: SubmitProps) => {
  const response = await axios({ method, url, data });
  return response.data;
};

export const useSubmitForm = () => {
  const [response, setResponse] = useState<any>(null);
  const router = useRouter();
  const { setProjectId } = useProject();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: submitRequest,
    onSuccess: (data) => {
      setResponse(data);
      if (data.status === 201) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "An error occurred");
    },
  });

  const submitForm = async ({
    method = "POST",
    url,
    data,
    redirectUrl,
    onSuccess,
  }: SubmitProps) => {
    try {
      const res = await mutateAsync({ method, url, data });
      if (onSuccess) {
        onSuccess(res);
        setProjectId(res.projectId);
      }
      if (redirectUrl) {
        router.replace(redirectUrl);
      }
      return res;
    } catch (error) {
      console.error("Form submission failed:", error);
    }
  };

  return { submitForm, isPending, response };
};
