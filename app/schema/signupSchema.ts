import { z } from "zod";

export const signUpSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long." })
    .max(30, { message: "Username cannot exceed 30 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
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
