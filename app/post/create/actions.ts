"use server"

import { auth, firestore } from "@/firebase/server";
import { postDataSchema } from "@/validation/postSchema";
import { cookies } from "next/headers";
import { z } from "zod";

export const createPost = async (data: z.infer<typeof postDataSchema>) => {
  // Check if data is of correct type
  const validation = postDataSchema.safeParse(data);

  if (!validation.success) {
    return {
      error: true,
      message: validation.error.issues[0].message ?? "An error has occured",
    }
  }

  // Check if the user is authenticated
  const cookieStore = await cookies();
  const token = cookieStore.get("firebaseAuthToken")?.value || "";
  if (!token) {
    return {
      error: true,
      message: "User is not authenticated",
    }
  }

  // Add data to firestore database
  const decodedToken = await auth.verifyIdToken(token);
  const post = await firestore.collection("posts").add({
    ...data,
    author: decodedToken.name,
    authorId: decodedToken.uid,
    created: new Date(),
    updated: new Date(),
  });

  return {
    postId: post.id,
  }
}