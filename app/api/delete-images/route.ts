import { storage } from '@/firebase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(request: NextRequest) {
  try {
    const formData = await request.formData();
    const paths = formData.getAll('images') as string[];
    const bucket = storage.bucket();

    // Delete all files
    const deletePromises = paths.map((path) => bucket.file(path).delete());
    await Promise.all(deletePromises);

    return NextResponse.json({ message: 'Image deleted successfully' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
      { error: error.message || 'Failed to delete files' },
      { status: 500 }
    );
    }
    
  }
}