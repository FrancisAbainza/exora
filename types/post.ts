export type Post = {
  id: string;
  author: string;
  authorId: string;
  caption: string;
  created: FirebaseFirestore.Timestamp;
  updated: FirebaseFirestore.Timestamp;
  description: string;
  images: {
    id: string,
    name: string,
    url: string,
  }[];
  link?: string;
  title: string;
  type: PostType;
}

type PostType = "General" | "Art" | "Coding" | "Photography" | "Science" | "Cooking";