import { z } from "zod";

export const RegisterRepoSchema = z.object({
  githubUrl: z
    .string()
    .url({ message: "Enter a valid URL" })
    .min(1, { message: "Repository URL is required" }),

  name: z
    .string()
    .min(3, { message: "Project name must be at least 3 characters" })
    .max(50, { message: "Project name must be less than 50 characters" }),

  githubToken: z
    .string()
    .min(40, { message: "GitHub token must be at least 40 characters" }) // typical token length
    .max(100, { message: "GitHub token is too long" })
    .optional()
    .or(z.literal("")),
});
