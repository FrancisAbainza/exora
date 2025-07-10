"use client";

export const deleteFolder = async (path: string) => {
  const deleteResponse = await fetch('/api/delete-folder', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ folderPath: path }),
  });

  if (!deleteResponse.ok) {
    const response = await deleteResponse.json();
    return {
      error: true,
      message: response.error,
    }
  }
}