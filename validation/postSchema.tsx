import { z } from "zod";

export const postDataSchema = z.object({
  title: z.string().min(1, "Title must contain a value").max(60, "Title cannot exceed 60 characters"),
  caption: z.string().min(1, "Caption must contain a value").max(300, "Caption cannot exceed 300 characters"),
  description: z.string().min(1, "Description must contain a value"),
  type: z.enum(["General", "Art", "Coding", "Photography", "Science", "Cooking"]),
  link: z.string().optional(),
});

export const postImagesSchema = z.object({
  images: z.array(
    z.object({
      id: z.string(),
      url: z.string(),
      file: z.instanceof(File),
    })
  ).min(1, "A minimum of one image is required"),
});

export const postSchema = postDataSchema.and(postImagesSchema);