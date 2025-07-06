"use client";

import { useAuth } from "@/context/auth";
import { postSchema } from "@/validation/postSchema";
import { z } from "zod";
import { createPost, savePostImages } from "./actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import PostForm from "@/components/post-form";
import { ImageUpload } from "@/components/multi-image-uploader";

const uploadImages = async (postId: string, images: ImageUpload[]) => {
  // Create form data object
  const formData = new FormData();

  // Add post id to form data
  formData.append('postId', postId);

  // Add image files to form data
  images.forEach((image) => {
    if (image.file) {
      formData.append('images', image.file);
    }
  });

  // Fetch the upload route then send form data
  const uploadResponse = await fetch('api/upload', {
    method: 'POST',
    body: formData,
  });

  // If the status code is not with 200 - 299, retrun an error object
  if (!uploadResponse.ok) {
    const response = await uploadResponse.json();
    return {
      error: true,
      message: response.error,
    }
  }

  // Return the respose of the fetch
  return uploadResponse.json();
}

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
    if (!!uploadResponse.error) {
      toast.error("Error!", {
        description: uploadResponse.message,
      });
      return;
    }

    // Save image paths to the database
    const paths = uploadResponse;
    await savePostImages(
      { postId: createPostResponse.postId, imagePaths: paths }
    );

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