"use server";

import { auth } from "@/firebase/server";
import { registerUserSchema } from "@/validation/authSchema";
import { FirebaseError } from "firebase/app";

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
  } catch (error) {
    const firebaseError = error as FirebaseError;
    return {
      error: true,
      message: firebaseError.message ?? "Could not register user",
    };
  }
}

