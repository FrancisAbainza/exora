import Image from "next/image";
import brandLogo from "@/assets/brand.svg";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Link from "next/link";
import RegisterForm from "./register-form";
import ContinueWithGoogleButton from "@/components/continue-with-google-button";

export default function Register() {
  return (
    <>
      <div className="flex flex-col items-center">
        <Image
          src={brandLogo}
          alt="brand image"
        />
        <h3 className="text-primary font-light text-center">Skills worth sharing</h3>
      </div>
      <Card className="w-full max-w-[554px] mx-auto gap-3 text-sm">
        <CardContent>
          <RegisterForm />
        </CardContent>
        <CardFooter className="flex-col items-start gap-3">
          <p className="self-center">or</p>
          <ContinueWithGoogleButton />
          <div>
            Already have an account?<Link href="/login" className="underline pl-2">Log in here</Link>
          </div>
        </CardFooter>
      </Card>
    </>
  );
}