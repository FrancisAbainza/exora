"use client";

import PostForm from "@/components/post-form";
import { useAuth } from "@/context/auth";
import { Post } from "@/types/post";
import { postSchema } from "@/validation/postSchema";
import { z } from "zod";
import { updatePost } from "./action";
import { toast } from "sonner";
import { savePostImages } from "../../action";
import { useRouter } from "next/navigation";
import { deleteImages } from "@/actions/delete-images";
import { uploadImages } from "@/actions/upload-images";

export default function EditPostForm({
  id,
  title,
  caption,
  description,
  type,
  link,
  images,
}: Omit<Post, 'created' | 'updated' | 'author' | 'authorId'>) {
  const auth = useAuth();
  const router = useRouter();

  const handleSubmit = async (data: z.infer<typeof postSchema>) => {
    // Check if the user is logged in
    const token = await auth?.currentUser?.getIdToken();

    if (!token) {
      return;
    }

    // Update data in the database
    const { images: newImages, ...rest } = data;
    const updatePostResponse = await updatePost(rest, id);

    if (!!updatePostResponse?.error) {
      toast.error("Error!", {
        description: updatePostResponse.message,
      });
      return;
    }

    // Delete deleted images in the storage
    const imagesToDelete = images.filter(
      (image) => !newImages.find((newImage) => image.url === newImage.url)
    );

    const deleteImagesResponse = await deleteImages(id, imagesToDelete);
    if (!!deleteImagesResponse?.error) {
      toast.error("Error!", {
        description: deleteImagesResponse.message,
      });
      return;
    }

    // Save images to storage
    const uploadResponse = await uploadImages(id, newImages);
    if ('error' in uploadResponse) {
      toast.error("Error!", {
        description: uploadResponse.message,
      });
      return;
    }

    // Save image paths to the database
    const imagePaths: string[] = []
    newImages.forEach((newImage, index) => {
      if (newImage.file) {
        imagePaths.push(uploadResponse[index]) // new image path
      } else {
        imagePaths.push(newImage.url); // old image path
      }
    });

    const postImages = imagePaths.map((imagePath, index) => ({
      id: newImages[index].id,
      name: newImages[index].name,
      url: imagePath,
    }));

    const saveImageResponse = await savePostImages(
      { postId: id, postImages }
    );
    if (!!saveImageResponse?.error) {
      toast.error("Error!", {
        description: saveImageResponse.message,
      });
      return;
    }

    // Display success toast then refresh
    toast.success("Success!", {
      description: "Post updated",
    });

    // Refresh algolia post hits using a flag
    localStorage.setItem('shouldRefreshPostHits', 'true');

    // Redirect to home page
    router.push("/home");
  }

  return (
    <PostForm
      handleSubmit={handleSubmit}
      submitButtonLabel="EDIT POST"
      defaultValues={{
        title,
        caption,
        description,
        type,
        link,
        images,
      }}
    />
  );
}