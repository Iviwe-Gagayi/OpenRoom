import { SignInButton } from "@clerk/nextjs"
import { SignUpButton } from "@clerk/nextjs"
import { ChevronRight } from "lucide-react"
import { DoorOpen, ArrowRight } from "lucide-react"
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";


export default async function LandingPage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/booking");
  }
  return (

    <div className="min-h-screen bg-white text-zinc-900 selection:bg-orange-100">
      {/* Subtle Grid Background - Calendar Vibes */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      />

      <nav className="relative z-10 flex items-center justify-between px-6 py-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <DoorOpen className="w-8 h-8 text-orange-600" strokeWidth={2} />
          </div> {/* change this*/}
          <span className="text-lg font-semibold tracking-tight">Open_Room</span>
        </div>
        <div className="flex gap-6 items-center text-sm font-medium">
          <SignInButton mode="modal">
            <button className="text-zinc-500 hover:text-orange-600 transition-colors cursor-pointer">Log in</button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="bg-orange-600 text-white px-4 py-1.5 rounded-md hover:bg-orange-700 transition-colors cursor-pointer">
              Sign up
            </button>
          </SignUpButton>
        </div>
      </nav>

      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-32">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
            Open_ <br />
            <span className="text-orange-600">Room.</span>
          </h1>
          <p className="text-lg text-zinc-500 mb-8 max-w-md leading-relaxed">
            You can book rooms. That's it.
          </p>

          <SignInButton mode="modal">
            <button className="group flex items-center gap-2 bg-zinc-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-zinc-800 transition-all">
              Start booking
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </SignInButton>
        </div>

        <div className="mt-24 pt-8 border-t border-zinc-100 flex gap-12 text-xs font-medium text-zinc-400 uppercase tracking-widest">
          <div>// 09:00 — 17:00</div>
          <div>// 5 Active Rooms</div>
          <div>// 2hr Daily Limit</div>
        </div>
      </main>
    </div>
  )
}