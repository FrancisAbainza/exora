import { ImageUpload } from "@/components/multi-image-uploader";

export const uploadImages = async (postId: string, images: ImageUpload[]) => {
  // Create form data object
  const formData = new FormData();
  const paths: string[] = [];

  // Add post id to form data
  formData.append('postId', postId);

  // Add image files to form data
  images.forEach((image) => {
    if (image.file) {
      formData.append('images', image.file);
    }
  });

  // Fetch the upload route then send form data
  const uploadResponse = await fetch('/api/upload', {
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

  // Combine old image paths with new image paths
  const uploadedPaths: string[] = await uploadResponse.json();

  // Return the respose of the fetch
  return [...paths, ...uploadedPaths];
}


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
  const deleteResponse = await fetch('/api/delete', {
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