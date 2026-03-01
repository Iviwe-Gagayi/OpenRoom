import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider, SignedIn, UserButton } from '@clerk/nextjs'

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
          <header className="absolute top-0 right-0 p-6 z-50">
            <SignedIn>
              {/* Redirect to landing page after signout */}
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
