"use server";

import { firestore } from "@/firebase/server";

export const deletePost = async (postId: string) => {
  try {
    await firestore
      .collection('posts')
      .doc(postId)
      .delete();
  } catch (error: unknown) {
    return {
      error: true,
      message:  error instanceof Error ? error.message : 'Failed to delete files',
    };
  }
}