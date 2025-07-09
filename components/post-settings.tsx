"use client";

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/auth";
import { Ellipsis } from "lucide-react";
import Link from "next/link";

export default function PostSettings({authorId, postId}: {authorId: string; postId: string}) {
  const auth = useAuth();
  
  // Render nothing if the post author id doesn't match the current user id.
  if (auth?.currentUser?.uid !== authorId) {
    return;
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
        <DropdownMenuItem className="cursor-pointer">Delete Post</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}