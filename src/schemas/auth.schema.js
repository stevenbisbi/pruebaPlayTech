import { z } from "zod";

export const registerSchema = z.object({
  username: z.string({
    required_error: "Username is required",
  }),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(6, "Password must be at least 6 characters long"),
  role: z.enum(["admin", "cajero"], {
    required_error: "Role is required",
    invalid_type_error: "Role must be either ADMIN or CAJERO",
  }),
});

export const loginSchema = z.object({
  username: z.string({
    required_error: "Username is required",
  }),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(6, "Password must be at least 6 characters long"),
});
