import Image from "next/image";
import brandLogo from "@/assets/brand.svg";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Link from "next/link";
import LoginForm from "./login-form";
import ContinueWithGoogleButton from "@/components/continue-with-google-button";

export default function Login() {
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
          <LoginForm />
        </CardContent>
        <CardFooter className="flex-col items-start gap-3">
          <div>
            Forgotten your password? <Link href="/reset" className="underline">Reset it here</Link>
          </div>
          <p className="self-center">or</p>
          <ContinueWithGoogleButton />
          <div>
            Don&apos;t have an account?<Link href="/register" className="underline pl-2">Register here</Link>
          </div>
        </CardFooter>
      </Card>
    </>
  );
}