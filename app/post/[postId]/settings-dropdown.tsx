"use client";

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/auth";
import { Ellipsis } from "lucide-react";
import Link from "next/link";
import { deletePost } from "./action";
import { deleteFolder } from "@/actions/delete-folder";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SettingsDropdown({ authorId, postId }: { authorId: string; postId: string }) {
  const auth = useAuth();
  const router = useRouter();

  // Render nothing if the post author id doesn't match the current user id.
  if (auth?.currentUser?.uid !== authorId) {
    return;
  }

  const handleDeletePost = async () => {
    // Check if the user is logged in
    const token = await auth?.currentUser?.getIdToken();

    if (!token) {
      return;
    }

    // Delete post from database
    const deletePostResponse = await deletePost(postId);
    if (!!deletePostResponse?.error) {
      toast.error("Error!", {
        description: deletePostResponse.message,
      });
      return;
    }

    // Delete post images from storage
    const deleteFolderResponse = await deleteFolder(`posts/${postId}/`);
    if (!!deleteFolderResponse?.error) {
      toast.error("Error!", {
        description: deleteFolderResponse.message,
      });
      return;
    }

    // Display success toast then refresh
    toast.success("Success!", {
      description: "Post deleted",
    });

    // Refresh algolia post hits using a flag
    localStorage.setItem('shouldRefreshPostHits', 'true');

    // Redirect to home page
    router.push("/home");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="hover:bg-accent rounded-md cursor-pointer p-1">
          <Ellipsis />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <Link href={`/post/edit/${postId}`} className="cursor-pointer">Edit Post</Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={handleDeletePost}>Delete Post</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}