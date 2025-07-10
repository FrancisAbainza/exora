"use client"

import { ImageUpload } from "@/components/multi-image-uploader";

export const deleteImages = async (postId: string, images: ImageUpload[]) => {
  // Create form data object
  const formData = new FormData();

  // Add post id to form data
  formData.append('postId', postId);

  // Add images url to form data
  images.forEach((image) => {
    formData.append('images', image.url);
  });

  // Fetch the delete route then send form data
  const deleteResponse = await fetch('/api/delete-images', {
    method: 'DELETE',
    body: formData,
  });

  if (!deleteResponse.ok) {
    const response = await deleteResponse.json();
    return {
      error: true,
      message: response.error,
    }
  }
}