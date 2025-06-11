"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth";
import { passwordValidation } from "@/validation/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FirebaseError } from "firebase/app";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password must contain a value"),
  newPassword: passwordValidation,
  confirmNewPassword: passwordValidation,
}).superRefine((data, ctx) => {
  if (data.newPassword !== data.confirmNewPassword) {
    ctx.addIssue({
      message: "Passwords do not match",
      path: ["confirmNewPassword"],
      code: "custom",
    });
  }
});

export default function UpdatePasswordForm() {
  const auth = useAuth();

  const form = useForm<z.infer<typeof updatePasswordSchema>>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    }
  });

  const handleSubmit = async (data: z.infer<typeof updatePasswordSchema>) => {
    // Check if there's a current user, redirect if none
    const user = auth?.currentUser;
    if (!user?.email) {
      return;
    }

    try {
      //  Reauthenticate then update password
      await reauthenticateWithCredential(
        user,
        EmailAuthProvider.credential(user.email, data.currentPassword)
      );
      await updatePassword(user, data.newPassword);

      // Show success toast
      toast.success("Success!", {
        description: "Password updated successfully"
      });

      // Clear form
      form.reset();
    } catch (error) {
      // Show error toast
      if (error instanceof FirebaseError) {
        toast.error("Error!", {
          description: error.code === "auth/invalid-credential"
            ? "Your current password is incorrect"
            : "An error occurred",
        });
      } else {
        toast.error("Error!", {
          description: "An error occurred",
        });
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} >
        <fieldset
          disabled={form.formState.isSubmitting}
          className="flex flex-col gap-3 pb-3 border-b-1"
        >
          <FormLabel className="text-xl font-bold">Update Password</FormLabel>
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Current Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="New Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmNewPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Confirm New Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">UPDATE PASSWORD</Button>
        </fieldset>
      </form>
    </Form>
  );
}