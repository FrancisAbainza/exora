import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import Image from "next/image";
import { useAuth } from "@/context/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AvatarButton() {
  const auth = useAuth();
  const router = useRouter();

  return (
    !!auth?.currentUser && (
      <DropdownMenu>
        <DropdownMenuTrigger className="block">
          <Avatar className="w-10 h-10">
            {!!auth.currentUser.photoURL && (
              <Image
                src={auth.currentUser.photoURL}
                alt={`${auth.currentUser.displayName} avatar`}
                width={40}
                height={40}
              />
            )}
            <AvatarFallback>{auth.currentUser.displayName?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>
            <div>
              <Link href={`/user/${auth.currentUser.uid}`} className="hover:underline">
                {auth.currentUser.displayName}
              </Link>
              <p className="font-normal text-xs">{auth.currentUser.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer" asChild>
            <Link href="/account">My Account</Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={async () => {
            await auth.logout();
            router.refresh();
          }}>
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  );
}