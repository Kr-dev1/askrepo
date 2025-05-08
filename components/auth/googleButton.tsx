import { IconBrandGoogle } from "@tabler/icons-react";
import React from "react";
import { signIn } from "next-auth/react";

const GoogleButton = () => {
  const handleGoogleSignIn = async () => {
    try {
      await signIn("google", {
        callbackUrl: "/dashboard",
      });
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      className="group/btn relative flex h-10 w-full items-center justify-start space-x-2 rounded-md px-4 font-medium text-black bg-zinc-900 shadow-[0px_0px_1px_1px_#262626]"
    >
      <IconBrandGoogle className="h-4 w-4 text-neutral-300" />
      <span className="text-sm text-neutral-300">Continue with Google</span>
      <BottomGradient />
    </button>
  );
};

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};
export default GoogleButton;
