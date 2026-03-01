import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider, SignedIn, UserButton } from '@clerk/nextjs'
import Link from "next/link";
import { Logo } from "@/components/Logo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Open Room",
  description: "Room Configuration and Booking System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#f97316",
        }
      }}
      localization={{
        signIn: {
          start: {
            title: "Login",
            subtitle: "Welcome back!",
          },
        },
        signUp: {
          start: {
            title: "Signup",
            subtitle: "Hello! Glad to meet you.",
          },
        },
      }}
    >


      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <header className="absolute top-0 left-0 right-0 flex justify-between items-center p-6 z-50">

            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="flex items-center gap-2">
                <Logo className="w-12 h-12 text-orange-600" />
              </div>
              <span className="text-lg font-semibold tracking-tight text-zinc-900">Open_Room</span>
            </Link>

            <div>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>

          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
