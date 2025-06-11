"use client";

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginUserSchema } from "@/validation/authSchema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth";
import { toast } from "sonner";
import { FirebaseError } from "firebase/app";

export default function LoginForm() {
  const auth = useAuth()
  const router = useRouter();
  const form = useForm<z.infer<typeof loginUserSchema>>({
    resolver: zodResolver(loginUserSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const handleSubmit = async (data: z.infer<typeof loginUserSchema>) => {
    // login in with email
    // refresh router
    // run middleware

    try {
      await auth?.loginWithEmail(data.email, data.password);
      router.refresh();
    } catch (error) {
      const firebaseError = error as FirebaseError;
      toast.error("Error!", {
        description: firebaseError.code === "auth/invalid-credential"
          ? "Incorrect credentials"
          : "An error occurred",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <fieldset
          disabled={form.formState.isSubmitting}
          className="flex flex-col w-full gap-3"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormControl>
                    <Input {...field} placeholder="Email" type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormControl>
                    <Input {...field} placeholder="Password" type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <Button type="submit">LOGIN</Button>
        </fieldset>
      </form>
    </Form>
  );
}