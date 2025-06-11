"use client";

import MultiImageUploader, { ImageUpload } from "@/components/multi-image-uploader";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/auth";
import { postSchema } from "@/validation/postSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createPost, savePostImages } from "./actions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const uploadImages = async (postId: string, images: ImageUpload[]) => {
  // Create form data object
  const formData = new FormData();

  // Add post id to form data
  formData.append('postId', postId);

  // Add image files to form data
  images.forEach((image) => {
    formData.append('images', image.file);
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

  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      caption: "",
      description: "",
      type: "General",
      link: "",
      images: [],
    }
  });

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
    const uploadResponse = await uploadImages(createPostResponse.postId, images)
    if (!!uploadResponse.error) {
      toast.error("Error!", {
        description: uploadResponse.message,
      });
      return;
    }

    // Save image paths to the database
    const paths = await uploadResponse;
    await savePostImages(
      { postId: createPostResponse.postId, imagePaths: paths }
    );

    // Display success toast then refresh
    toast.success("Success!", {
      description: "Post created",
    });

    // Redirect to home page
    router.push("/home");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <fieldset
          disabled={form.formState.isSubmitting}
          className="flex flex-col w-full gap-3"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Title" type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="caption"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Caption</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Caption" type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={5} placeholder="What your project is all about" className="resize-none" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>

                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="General">General</SelectItem>
                    <SelectItem value="Art">Art</SelectItem>
                    <SelectItem value="Coding">Coding</SelectItem>
                    <SelectItem value="Photography">Photography</SelectItem>
                    <SelectItem value="Science">Science</SelectItem>
                    <SelectItem value="Cooking">Cooking</SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Link to resource (Optional)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="URL" type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <MultiImageUploader
                    onImagesChange={(images: ImageUpload[]) => {
                      form.setValue("images", images);
                    }}
                    images={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Post</Button>
        </fieldset>
      </form>
    </Form>
  );
}