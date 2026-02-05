"use client"
import { UserButton } from "@clerk/nextjs";
import { Logo } from "@/components/Logo";

const rooms = ["Room 1", "Room 2", "Room 3", "Room 4", "Room 5"];
const slots = ["09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00", "12:00 - 13:00", "13:00 - 14:00", "14:00 - 15:00", "15:00 - 16:00", "16:00 - 17:00"];

export default function BookingPage() {
    return (
        <div className="min-h-screen bg-white text-zinc-900">
            <nav className="flex items-center justify-between px-8 py-4 border-b border-zinc-100">
                <div className="flex items-center gap-2">
                    <Logo className="w-6 h-6 text-orange-600" />
                    <span className="font-bold tracking-tighter text-sm uppercase">open_room</span>
                </div>
                <UserButton afterSignOutUrl="/" />
            </nav>

            <main className="p-8 max-w-[1400px] mx-auto">
                <header className="mb-8">
                    <h1 className="text-2xl font-black tracking-tighter uppercase">Bookings_</h1>
                </header>

                {/* Horizontal Timeline Grid */}
                <div className="overflow-x-auto border border-zinc-100 rounded-lg">
                    <div className="grid grid-cols-[150px_repeat(8,1fr)] min-w-[1000px]">
                        {/* Header: First cell empty, then Time Slots */}
                        <div className="bg-zinc-50 border-b border-r border-zinc-100 p-4 font-mono text-[10px] text-zinc-400 uppercase tracking-widest">
                            Rooms ↓
                        </div>
                        {slots.map((time) => (
                            <div key={time} className="bg-zinc-50 border-b border-r border-zinc-100 p-4 text-center font-mono text-[12px] text-zinc-800 font-bold">
                                {time}
                            </div>
                        ))}

                        {/* Rows: Room Name followed by clickable Slots */}
                        {rooms.map((room) => (
                            <>
                                <div key={room} className="border-b border-r border-zinc-100 p-6 flex items-center font-bold text-xs uppercase tracking-tight text-zinc-600 bg-white">
                                    {room}
                                </div>
                                {slots.map((time) => (
                                    <div key={`${room}-${time}`} className="border-b border-r border-zinc-100 p-2 group hover:bg-zinc-50 transition-colors">
                                        {/*action here for this button*/}
                                        <button className="w-full h-16 rounded border border-dashed border-zinc-200 group-hover:border-orange-400 group-hover:bg-orange-50/30 transition-all cursor-pointer" />
                                    </div>
                                ))}
                            </>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}