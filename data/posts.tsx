import { firestore } from "@/firebase/server";
import { Post } from "@/types/post";

export const getPostsByAuthorId = async (authorId: String) => {
  const docsSnapshot = await firestore
    .collection("posts")
    .orderBy("updated", "desc")
    .where("authorId", "==", authorId)
    .get();

  const posts: Post[] = docsSnapshot.docs.map((doc) => (
    {
      id: doc.id,
      ...doc.data(),
    } as Post
  ));

  return posts;
}

export const getPostById = async (id: string) => {
  const postSnapshot = await firestore.collection("posts").doc(id).get();
  
  if (!postSnapshot.data()) {
    return null;
  }

  const postData = {
    id: postSnapshot.id,
    ...postSnapshot.data(),
  } as Post;

  return postData;
}