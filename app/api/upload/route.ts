import { storage } from "@/firebase/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const formData = await request.formData();
    const postId = formData.get('postId') as string;
    const files = formData.getAll('images') as File[];
    const bucket = storage.bucket();

    const uploadedImagesPaths = await Promise.all(
      files.map(async (file, index) => {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const destination = `posts/${postId}/${Date.now()}-${index}-${file.name}`;
        const fileRef = bucket.file(destination);

        await fileRef.save(buffer, {
          metadata: {
            contentType: file.type,
          },
        });

        return destination;
      })
    );

    return NextResponse.json(uploadedImagesPaths);
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Failed to upload files' },
      { status: 500 }
    );
  }
}