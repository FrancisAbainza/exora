"use server"

import { auth, firestore, storage } from "@/firebase/server"
import { cookies } from "next/headers";

export const updateBio = async (bio: string) => {
  // Check if user is logged in
  const cookieStore = await cookies();
  const token = cookieStore.get("firebaseAuthToken")?.value || "";

  if (!token) {
    return;
  }

  // Update bio
  const decodedToken = await auth.verifyIdToken(token);
  await firestore.collection("users").doc(decodedToken.uid).update({ bio });
}

export const deleteUserData = async () => {
  // Check if user is logged in
  const cookieStore = await cookies();
  const token = cookieStore.get("firebaseAuthToken")?.value;

  if (!token) {
    return;
  }

  // Delete user profile
  const decodedToken = await auth.verifyIdToken(token);
  await firestore.collection("users").doc(decodedToken.uid).delete();

  // Get query snapshot
  const docsSnapshot = await firestore.collection("posts").where("authorId", "==", decodedToken.uid).get();

  if (docsSnapshot.empty) {
    return;
  }

  // Delete user images from firebase storage
  const bucket = storage.bucket();
  for (const doc of docsSnapshot.docs) {
    const [files] = await bucket.getFiles({ prefix: `posts/${doc.id}` });

    if (files.length === 0) {
      continue;
    }

    const deletePromises = files.map(file => file.delete())
    Promise.all(deletePromises);
  }

  // Delete user posts
  const batch = firestore.batch();
  docsSnapshot.forEach((docSnap) => {
    batch.delete(docSnap.ref);
  });
  await batch.commit();
};