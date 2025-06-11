"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/auth";
import { deleteUser, EmailAuthProvider, GoogleAuthProvider, reauthenticateWithCredential, reauthenticateWithPopup } from "firebase/auth";
import { useState } from "react";
import { deleteUserData } from "./action";
import { removeToken } from "@/context/actions";
import { toast } from "sonner";
import { FirebaseError } from "firebase/app";

export default function DeleteAccount({ isPasswordProvider }: { isPasswordProvider: boolean }) {
  const auth = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [password, setPassword] = useState("");

  const handleDeleteClick = async () => {
    if (auth?.currentUser?.email) {
      setIsDeleting(true);
      try {
        // Reauthenticate the user
        if (isPasswordProvider) {
          await reauthenticateWithCredential(
            auth.currentUser,
            EmailAuthProvider.credential(auth.currentUser.email, password)
          );
        } else {
          const provider = new GoogleAuthProvider();
          await reauthenticateWithPopup(auth.currentUser, provider);
        }

        // Delete user profile and posts from firestore database and images from firebase storage
        await deleteUserData();

        // Delete user from firebase authentication
        await deleteUser(auth.currentUser);

        // Remove token from cookies
        await removeToken();
        toast.success("Success!", {
          description: "Your account was deleted successfully",
        });
      } catch (error: unknown) {
        if (error instanceof FirebaseError) {
          toast.error("Error!", {
            description: error.code === "auth/invalid-credential"
              ? "Incorrect credentials"
              : "An error occurred",
          });
        } else {
          toast.error("Error!", {
            description: "An error occurred",
          });
        }
      }
      setIsDeleting(false);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-full">
          DELETE ACCOUNT
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="flex flex-col gap-3">
            This action cannot be undone. This will permanently delete your
            account and remove all your data from our servers.
            {isPasswordProvider && (
              <>
                <Label>Enter current password to continue</Label>
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  className="bg-accent"
                />
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteClick} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete Account"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}