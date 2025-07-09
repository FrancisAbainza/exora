import { getPostById } from "@/data/posts";
import { auth } from "@/firebase/server";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import EditPostForm from "./edit-post-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default async function EditPost({ params }: { params: Promise<{ postId: string }> }) {
  // Get firebase auth token from cookies
  const cookieStore = await cookies();
  const token = cookieStore.get("firebaseAuthToken")?.value;

  // If there's no token, redirect to login page
  if (!token) {
    redirect("/login");
  }

  const decodedToken = await auth.verifyIdToken(token);
  const paramsValue = await params;
  const post = await getPostById(paramsValue?.postId);

  // Check if the post exists
  if (!post) {
    notFound();
  }

  // Check if the post id matches the current user's id
  if (post.authorId !== decodedToken.uid) {
    redirect(`/post/${post.id}`);
  }

  return (
    <Card className="w-full max-w-[554px] mx-auto gap-3 text-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Edit Post</CardTitle>
      </CardHeader>
      <CardContent>
        <EditPostForm
          id={post.id}
          title={post.title}
          caption={post.caption}
          description={post.description}
          type={post.type}
          link={post.link}
          images={post.images}
        />
      </CardContent>
    </Card>
  )
}