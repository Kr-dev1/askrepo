"use client";
import { GitCompare, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterRepoSchema } from "@/app/schema/registerRepo";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSubmitForm } from "@/hooks/submitForm";
import useRefetch from "@/hooks/useRefetch";

const CreatePage = () => {
  const refetch = useRefetch();
  const form = useForm<z.infer<typeof RegisterRepoSchema>>({
    resolver: zodResolver(RegisterRepoSchema),
    defaultValues: {
      githubUrl: "",
      name: "",
      githubToken: "",
    },
  });
  const { isPending, submitForm } = useSubmitForm();

  const onSubmit = async (data: z.infer<typeof RegisterRepoSchema>) => {
    submitForm({
      method: "POST",
      url: "project",
      data,
      redirectUrl: "/dashboard",
      onSuccess: async () => {
        await refetch();
        form.reset();
      },
    });
  };

  return (
    <div className="flex flex-col items-center h-full justify-center w-full">
      <div className="flex justify-center items-center gap-2">
        <GitCompare />
        <span>
          <h1 className="font-semibold text-2xl flex justify-center items-center gap-3">
            Link your Github Repository
          </h1>
          <p>Enter the URL of you repository</p>
        </span>
      </div>
      <div className="h-4"></div>
      <div className="w-full max-w-lg">
        <Form {...form}>
          <form
            className="my-8 flex flex-col gap-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="name">Project Name</Label>
                  <FormControl>
                    <Input
                      id="name"
                      placeholder="ProjectName"
                      type="text"
                      {...field}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="githubUrl"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="githubUrl">Repository URL</Label>
                  <FormControl>
                    <Input
                      id="githubUrl"
                      placeholder="https://github.com/yourname/your-repo"
                      type="text"
                      {...field}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="githubToken"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="githubToken">Github Token</Label>
                  <FormControl>
                    <Input
                      id="githubToken"
                      placeholder="ghp_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <button
              disabled={isPending}
              className="cursor-pointer flex justify-center items-center gap-2 group/btn relative h-10 w-full rounded-md bg-gradient-to-br bg-zinc-800 shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
              type="submit"
            >
              <Plus />
              Create New Project
            </button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreatePage;
