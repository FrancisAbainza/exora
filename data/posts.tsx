import { firestore } from "@/firebase/server";

export type Post = {
  id: string;
  author: string;
  authorId: string;
  caption: string;
  created: FirebaseFirestore.Timestamp; 
  updated: FirebaseFirestore.Timestamp;
  description: string;
  images: string[];
  link?: string;
  title: string;
  type: string;
}

export const getPostsByAuthorId = async (authorId: String) => {
  const docsSnapshot = await firestore
    .collection("posts")
    .orderBy("updated", "desc")
    .where("authorId", "==", authorId)
    .get();

  const userPosts: Post[] = docsSnapshot.docs.map((doc) => (
    {
      id: doc.id,
      ...doc.data() as Omit<Post, 'id'>,
    }
  ));
  
  return userPosts;
}

export const getPostById = async (id: string) => {
  const post = await firestore.collection("posts").doc(id).get();
   const userPost: Post =  {
      id: post.id,
      ...post.data() as Omit<Post, 'id'>,
    }

  return userPost;
}