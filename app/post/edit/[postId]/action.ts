"use server";

import { firestore } from "@/firebase/server";
import { postDataSchema } from "@/validation/postSchema";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const updatePost = async (data: z.infer<typeof postDataSchema>, id: string) => {
  const validation = postDataSchema.safeParse(data);
  if (!validation.success) {
    return {
      error: true,
      message: validation.error.issues[0]?.message ?? "An error occurred",
    }
  }

  await firestore
    .collection("posts")
    .doc(id)
    .update({
      ...data,
      updated: new Date(),
    });

  revalidatePath(`/post/${id}`);
}
