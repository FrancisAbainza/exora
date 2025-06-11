import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import UpdateBioForm from "./update-bio-form";
import UpdatePasswordForm from "./update-password-form";
import { cookies } from "next/headers";
import { auth } from "@/firebase/server";
import { redirect } from "next/navigation";
import DeleteAccount from "./delete-account";

export default async function Account() {
  // Get firebase auth token from cookies
  const cookieStore = await cookies();
  const token = cookieStore.get("firebaseAuthToken")?.value;

  // If there's no token, redirect to login page
  if (!token) {
    redirect("/login");
  }

  // Check if the user's account uses password provider
  const decodedToken = await auth.verifyIdToken(token);
  const user = await auth.getUser(decodedToken.uid);
  const isPasswordProvider = !!user.providerData.find(
    (provider) => provider.providerId === "password"
  );

  return (
    <Card className="w-full max-w-[554px] mx-auto gap-3 text-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">My Account</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <UpdateBioForm />
        {!!isPasswordProvider && <UpdatePasswordForm />}
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-3">
        <h1 className="text-xl font-bold text-[var(--color-destructive)]">Danger Zone</h1>
        <DeleteAccount isPasswordProvider={isPasswordProvider} />
      </CardFooter>
    </Card>
  );
}