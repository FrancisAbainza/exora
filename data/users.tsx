"use server";

import { firestore } from "@/firebase/server";

export const getUserById = async (userId: string) => {
  const userSnapshot = await firestore.collection("users").doc(userId).get();

  return userSnapshot.data();
}