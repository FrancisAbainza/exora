"use server";

import { firestore } from "@/firebase/server";
import { z } from "zod";

export const savePostImages = async ({
  postId,
  postImages,
}: {
  postId: string;
  postImages: {
    id: string,
    name: string,
    url: string,
  }[]
}) => {
  // Check if data is of correct type
  const schema = z.object({
    postId: z.string(),
    postImages: z.array(z.object({
      id: z.string(),
      url: z.string(),
    })),
  });

  const validation = schema.safeParse({ postId, postImages, });
  if (!validation.success) {
    return {
      error: true,
      message: validation.error.issues[0].message || "An error has occured",
    }
  };

  // Save images urls to the database
  await firestore
    .collection("posts")
    .doc(postId)
    .update({
      images: postImages,
    });
}