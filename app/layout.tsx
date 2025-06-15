import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import Image from "next/image";
import brandLogo from "@/assets/brand.svg";
import whiteBrandLogo from "@/assets/brand-w.svg";
import Link from "next/link";
import { AuthProvider } from "@/context/auth";
import MenuButtons from "@/components/menu-buttons";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Exora",
  description: "A website where users can share their skills and talents to other people.",
  icons: "/favicon.ico",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased h-screen flex flex-col`}
      >
        <AuthProvider>
          <header className="bg-white p-6 md:px-12 shadow-lg">
            <nav className="flex justify-between items-center max-w-[1024px] mx-auto">
              <Link href="/">
                <Image
                  src={brandLogo}
                  alt="brand image"
                  className="w-[158px]"
                />
              </Link>
              <MenuButtons />
            </nav>
          </header>
          <section className="flex-1 flex flex-col items-center justify-center gap-3 w-full px-6 py-12 md:px-12">
            {children}
          </section>
          <footer className="bg-[#27272A] text-white p-6 md:px-12">
            <div className="flex flex-col justify-between gap-3 w-full max-w-[1024px] mx-auto md:flex-row md:items-center">
              <Image
                src={whiteBrandLogo}
                alt="brand image"
              />
              <p className="font-light text-sm">
                ©{new Date().getFullYear()} Exora. All rights reserved.
              </p>
            </div>
          </footer>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
