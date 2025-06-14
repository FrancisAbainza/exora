import { z } from "zod";

export const passwordValidation = z.string().refine(
  (value) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return regex.test(value);
  },
  {
    message:
      "Password must contain at least 6 characters, at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character",
  }
);

export const loginUserSchema = z
  .object({
    email: z.string().email(),
    password: passwordValidation,
  });


export const registerUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email(),
  password: passwordValidation,
  passwordConfirm: z.string(),
}).superRefine((data, ctx) => {
  if (data.password !== data.passwordConfirm) {
    ctx.addIssue({
      message: "Passwords do not match",
      path: ["passwordConfirm"],
      code: "custom",
    });
  }
});