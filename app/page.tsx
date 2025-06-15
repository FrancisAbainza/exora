import Image from "next/image";
import brandLogo from '../assets/brand.svg';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ContinueWithGoogleButton from "@/components/continue-with-google-button";

export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center">
        <Image
          src={brandLogo}
          alt="brand image"
        />
        <h3 className="text-primary font-light text-center">Skills worth sharing</h3>
      </div>
      <Button className="w-full max-w-[250px]" asChild>
        <Link href='/register'>CREATE ACCOUNT</Link>
      </Button>
      <Button className="w-full max-w-[250px]" asChild>
        <Link href='/login'>SIGN IN</Link>
      </Button>
      <p>or</p>
      <ContinueWithGoogleButton className="max-w-[250px]"/>
    </>
  );
}
