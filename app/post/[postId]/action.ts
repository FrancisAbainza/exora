"use server";

import { firestore } from "@/firebase/server";

export const deletePost = async (postId: string) => {
  try {
    await firestore
      .collection('posts')
      .doc(postId)
      .delete();
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        error: true,
        message: error.message
      };
    }
  }
}