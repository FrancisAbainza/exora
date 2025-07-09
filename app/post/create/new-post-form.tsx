"use client";

import { useAuth } from "@/context/auth";
import { postSchema } from "@/validation/postSchema";
import { z } from "zod";
import { createPost } from "./actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import PostForm from "@/components/post-form";
import { savePostImages, uploadImages } from "../action";

export default function NewPostForm() {
  const auth = useAuth();
  const router = useRouter();

  const handleSubmit = async (data: z.infer<typeof postSchema>) => {
    // Check if the user is logged in
    const token = await auth?.currentUser?.getIdToken();

    if (!token) {
      return;
    }

    // Save form data (except images) to the database
    const { images, ...rest } = data;
    const createPostResponse = await createPost(rest);
    if (!!createPostResponse.error || !createPostResponse.postId) {
      toast.error("Error!", {
        description: createPostResponse.message,
      });
      return;
    }

    // Upload images to storage
    const uploadResponse = await uploadImages(createPostResponse.postId, images);
    if ('error' in uploadResponse) {
      toast.error("Error!", {
        description: uploadResponse.message,
      });
      return;
    }

    // Save image paths to the database
    const imagePaths = [...uploadResponse];
    const postImages = imagePaths.map((imagePath, index) => ({
      id: images[index].id,
      name: images[index].name,
      url: imagePath,
    }));

    const saveImageResponse = await savePostImages(
      { postId: createPostResponse.postId, postImages }
    );
    if (!!saveImageResponse?.error) {
      toast.error("Error!", {
        description: saveImageResponse.message,
      });
      return;
    }

    // Display success toast then refresh
    toast.success("Success!", {
      description: "Post created",
    });

    // Refresh algolia post hits using a flag
    localStorage.setItem('shouldRefreshPostHits', 'true');

    // Redirect to home page
    router.push("/home");
  }

  return (
    <PostForm
      handleSubmit={handleSubmit}
      submitButtonLabel="POST"
    />
  );
}