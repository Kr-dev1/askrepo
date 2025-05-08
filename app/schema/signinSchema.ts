import { z } from "zod";

export const signInSchema = z.object({
  identifier: z
    .string()
    .min(3, { message: "Identifier must be at least 3 characters long." })
    .max(30, { message: "Identifier cannot exceed 30 characters." })
    .refine(
      (val) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        return emailRegex.test(val) || usernameRegex.test(val);
      },
      {
        message: "Identifier must be a valid email or username.",
      }
    ),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/[A-Z]/, {
      message: "Password must include at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must include at least one lowercase letter.",
    })
    .regex(/\d/, {
      message: "Password must include at least one number.",
    })
    .regex(/[@$!%*?&]/, {
      message:
        "Password must include at least one special character (@, $, !, %, *, ?, &).",
    })
    .regex(/^\S*$/, {
      message: "Password must not contain spaces.",
    }),
});
