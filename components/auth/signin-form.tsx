"use client";
import React from "react";
import { Label } from "@/components/ui/label";
import { AceternityInput } from "@/components/ui/AceternityInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { signInSchema } from "@/app/schema/signinSchema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import GoogleButton from "./googleButton";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SignupForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    try {
      const result = await signIn("credentials", {
        identifier: data.identifier,
        password: data.password,
        redirect: false,
      });
      if (result?.error) {
        toast.error("Invalid Email / Username or Password");
        return;
      }
      form.reset();
      toast.success("Logged In successfully");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (error) {
      console.error("Sign in error:", error);
    }
  };

  return (
    <div className="shadow-input mx-auto w-full max-w-md rounded-md p-4 md:rounded-2xl md:p-8 bg-black">
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
            name="identifier"
            render={({ field }) => (
              <FormItem>
                <LabelInputContainer>
                  <Label htmlFor="identifier">Email / Username</Label>
                  <FormControl>
                    <AceternityInput
                      id="identifier"
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
            Sign In &rarr;
            <BottomGradient />
          </button>
          <div className="text-right">
            <Link href="/signup" className=" text-xs">
              Don&apos;t have an account?
              <span className="underline decoration-blue-500 decoration-2 pb-1">
                SignUp
              </span>
            </Link>
          </div>
          <div className="mt-4 h-[1px] w-full bg-gradient-to-r from-transparent to-transparent via-neutral-700" />
        </form>
        <GoogleButton />
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
