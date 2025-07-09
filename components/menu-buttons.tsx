"use client"

import { Plus } from "lucide-react";
import OutlineBorder from "./outline-border";
import Link from "next/link";
import { useAuth } from "@/context/auth";
import { Button } from "./ui/button";
import AvatarButton from "./avatar-button";
import SearchButton from "./search-button";

export default function MenuButtons() {
  const auth = useAuth();

  return (
    <ul className="flex items-center gap-2">
      <li>
        <SearchButton />
      </li>
      {!!auth?.currentUser && (
        <>
          <li>
            <OutlineBorder>
              <Link href="/post/create" className="flex w-full h-full justify-center items-center">
                <Plus size={20} />
              </Link>
            </OutlineBorder>
          </li>
          <li>
            <AvatarButton />
          </li>
        </>
      )}
      {!auth?.currentUser && (
        <li>
          <Button variant="outline" className="rounded-full h-10" asChild>
            <Link href="/login">
              Join
            </Link>
          </Button>
        </li>
      )}
    </ul>
  );
}