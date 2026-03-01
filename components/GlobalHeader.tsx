"use client";

import { SignedIn, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { usePathname } from 'next/navigation';

export default function GlobalHeader() {
    const pathname = usePathname();


    if (pathname === "/") {
        return null;
    }

    return (
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
    );
}