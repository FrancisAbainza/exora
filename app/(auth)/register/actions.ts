"use server";

import { auth } from "@/firebase/server";
import { registerUserSchema } from "@/validation/authSchema";

export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}) => {
  // Check if data is of correct type
  const validation = registerUserSchema.safeParse(data);

  if (!validation.success) {
    return {
      error: true,
      message: validation.error.issues[0]?.message ?? "An error occurred",
    };
  }

  try {
    // Create user
    await auth.createUser({
      displayName: data.name,
      email: data.email,
      password: data.password,
    });
  } catch (error: unknown) {
    return {
      error: true,
      message: error instanceof Error ? error.message : "Could not register user",
    };
  }
}

