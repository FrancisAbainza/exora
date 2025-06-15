"use client"
import { useAuth } from "@/context/auth";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function ContinueWithGoogleButton({className = ""}) {
  const auth = useAuth();
  const router = useRouter()

  return (
    <Button
      variant="outline"
      className={`w-full ${className}`}
      onClick={async () => {
        try {
          await auth?.loginWithGoogle();
          router.refresh();
        } catch (error) {
          console.log(error);
        }
      }}
    >
      CONTINUE WITH GOOGLE
    </Button>
  );
}