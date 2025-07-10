// app/api/delete-folder/route.ts
import { storage } from '@/firebase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(request: NextRequest) {
  const { folderPath } = await request.json();

  if (!folderPath) {
    return NextResponse.json(
      { error: 'Missing folderPath' },
      { status: 400 }
    );
  }

  try {
    const [files] = await storage.bucket().getFiles({ prefix: folderPath });

    if (files.length === 0) {
      return NextResponse.json({ message: 'No files found in folder.' });
    }

    await Promise.all(files.map((file) => file.delete()));

    return NextResponse.json({
      message: `Deleted ${files.length} file(s) in "${folderPath}"`,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Failed to delete files' },
      { status: 500 }
    );
  }
}
