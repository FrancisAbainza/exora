"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { updateBio } from "./action";
import { toast } from "sonner";

const bioSchema = z.object({
  bio: z.string().min(1, "Bio must contain a value"),
});

export default function UpdateBioForm() {
  const auth = useAuth();

  const form = useForm<z.infer<typeof bioSchema>>({
    resolver: zodResolver(bioSchema),
    defaultValues: {
      bio: "",
    }
  });

  const handleSubmit = async (data: z.infer<typeof bioSchema>) => {
    const token = await auth?.currentUser?.getIdToken();

    // Check if the user is logged in using token
    if (!token) {
      return;
    }

    // Update bio
    await updateBio(data.bio);

    // Display success toast then reset the form
    toast.success("Success!", {
      description: "Bio updated",
    });

    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <fieldset
          disabled={form.formState.isSubmitting}
          className="flex flex-col gap-3 pb-3 border-b-1"
        >
          <FormLabel className="text-xl font-bold">Update Bio</FormLabel>
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea {...field} rows={5} placeholder="Tell something about yourself" className="resize-none" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">UPDATE BIO</Button>
        </fieldset>
      </form>
    </Form>
  );
}