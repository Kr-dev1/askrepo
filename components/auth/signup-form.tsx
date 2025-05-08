"use client";
import React, { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { AceternityInput } from "@/components/ui/AceternityInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { signUpSchema } from "@/app/schema/signupSchema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useSubmitForm } from "@/hooks/submitForm";
import GoogleButton from "./googleButton";
import Link from "next/link";
import useProject from "@/hooks/use-projects";
// import { signIn } from "@/app/api/auth/[...nextauth]/options";

export default function SignupForm() {
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const { projectId } = useProject();
  const { isPending, submitForm } = useSubmitForm();

  const onSubmit = (data: z.infer<typeof signUpSchema>) => {
    submitForm({
      method: "POST",
      url: "auth/signup",
      data,
    });
  };

  return (
    <div className="shadow-input mx-auto w-full max-w-md rounded-non p-4 md:rounded-2xl md:p-8 bg-black">
      <h2 className="text-xl font-bold text-neutral-200">
        Welcome to Aceternity
      </h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-300">
        Login to aceternity if you can because we don&apos;t have a login flow
        yet
      </p>
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
                <LabelInputContainer>
                  <Label htmlFor="name">User Name</Label>
                  <FormControl>
                    <AceternityInput
                      id="name"
                      placeholder="Jhon Doe"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </LabelInputContainer>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <LabelInputContainer>
                  <Label htmlFor="email">Email</Label>
                  <FormControl>
                    <AceternityInput
                      id="email"
                      placeholder="jhondoe@jd.com"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </LabelInputContainer>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <LabelInputContainer>
                  <Label htmlFor="password">Password</Label>
                  <FormControl>
                    <AceternityInput
                      id="password"
                      placeholder="••••••••"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </LabelInputContainer>
              </FormItem>
            )}
          />

          <button
            className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br bg-zinc-800 from-zinc-900 to-zinc-900 shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
            type="submit"
          >
            Sign up &rarr;
            <BottomGradient />
          </button>
          <div className="text-right">
            <Link href="/signin" className=" text-xs">
              Already have an account?{" "}
              <span className="underline decoration-blue-500 decoration-2 pb-1">
                SignIn
              </span>
            </Link>
          </div>
          <div className="mt-4 h-[1px] w-full bg-gradient-to-r from-transparent to-transparent via-neutral-700" />
        </form>
        <GoogleButton projectId={projectId} />
      </Form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};
