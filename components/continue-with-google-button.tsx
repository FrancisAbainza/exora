"use client"
import { useAuth } from "@/context/auth";
import { Button } from "./ui/button";

export default function ContinueWithGoogleButton({className = ""}) {
  const auth = useAuth();

  return (
    <Button
      variant="outline"
      className={`w-full ${className}`}
      onClick={async () => {
        try {
          await auth?.loginWithGoogle();
        } catch (error) {
          console.log(error);
        }
      }}
    >
      CONTINUE WITH GOOGLE
    </Button>
  );
}