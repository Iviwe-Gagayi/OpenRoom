"use client"
import React, { Fragment, useEffect, useState } from "react";
import { useAuth, UserButton } from "@clerk/nextjs";
import { Logo } from "@/components/Logo";
import { createBooking, getBookings, cancelBooking } from "@/app/actions/bookings";


{/* Lazy so Imma just hardcode these for now*/ }
const rooms = [
    { id: "R01", name: "Room 1" },
    { id: "R02", name: "Room 2" },
    { id: "R03", name: "Room 3" },
    { id: "R04", name: "Room 4" },
    { id: "R05", name: "Room 5" },
];
const slots = ["09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00", "12:00 - 13:00", "13:00 - 14:00", "14:00 - 15:00", "15:00 - 16:00", "16:00 - 17:00"];

export default function BookingPage() {


    const handleSlotClick = async (roomId: string, time: string, bookingId?: string, isMine?: boolean) => {
        if (isMine && bookingId) {
            // If it's user's, cancel it
            const result = await cancelBooking(bookingId);
            if (result.success) {
                const data = await getBookings();
                setBookings(data);
            } else {
                alert(result.error);
            }
        } else {
            //If empty, book 
            const date = new Date().toISOString().split('T')[0];
            const slotTime = `${date}-${time}`;
            const result = await createBooking(roomId, slotTime);

            if (result.success) {
                const data = await getBookings();
                setBookings(data);
            } else {
                alert(result.error);
            }
        }
    };

    const { userId } = useAuth();
    const [bookings, setBookings] = useState<any[]>([]);

    // Fetch current bookings on mount
    useEffect(() => {
        const load = async () => {
            const data = await getBookings();
            setBookings(data);
        };

        load();


        const interval = setInterval(load, 1000);

        return () => clearInterval(interval);
    }, []);


    const handleBooking = async (roomId: string, time: string) => {
        const date = new Date().toISOString().split('T')[0];
        const slotTime = `${date}-${time}`;

        const result = await createBooking(roomId, slotTime);

        if (result.success) {
            // Re-fetch to update colors
            const data = await getBookings();
            setBookings(data);
        } else {
            alert(result.error);
        }
    };

    return (
        <div className="min-h-screen bg-white text-zinc-900 font-sans">
            <nav className="flex items-center justify-between px-8 py-4 border-b border-zinc-100">
                <div className="flex items-center gap-2">
                    <Logo className="w-6 h-6 text-orange-600" />
                    <span className="font-bold tracking-tighter text-sm uppercase">open_room</span>
                </div>
                <UserButton afterSignOutUrl="/" />
            </nav>

            <main className="p-8 max-w-[1400px] mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-black tracking-tighter uppercase">Bookings_</h1>
                </header>

                <div className="overflow-x-auto border border-zinc-100 rounded-lg shadow-sm">
                    <div className="grid grid-cols-[150px_repeat(8,1fr)] min-w-[1000px]">
                        {/* Header */}
                        <div className="bg-zinc-50 border-b border-r border-zinc-100 p-4 font-mono text-[10px] text-zinc-400 uppercase tracking-widest">
                            Rooms ↓
                        </div>
                        {slots.map((time) => (
                            <div key={time} className="bg-zinc-50 border-b border-r border-zinc-100 p-4 text-center font-mono text-[12px] text-zinc-800 font-bold">
                                {time}
                            </div>
                        ))}

                        {/* Grid */}
                        {rooms.map((room) => (
                            <Fragment key={room.id}>
                                <div className="border-b border-r border-zinc-100 p-6 flex items-center font-bold text-xs uppercase tracking-tight text-zinc-600 bg-white">
                                    {room.name}
                                </div>
                                {slots.map((time) => {
                                    const date = new Date().toISOString().split('T')[0];
                                    const slotId = `${date}-${time}`;
                                    const booking = bookings.find(b => b.roomId === room.id && b.slotTime === slotId);

                                    const isMine = booking?.userId === userId;
                                    const isTaken = !!booking && !isMine;

                                    return (
                                        <div key={`${room.id}-${time}`} className="border-b border-r border-zinc-100 p-2 group">
                                            <button
                                                disabled={isTaken}
                                                onClick={() => handleSlotClick(room.id, time, booking?.id, isMine)}
                                                className={`w-full h-16 rounded border transition-all duration-200 flex items-center justify-center ${isMine
                                                    ? "bg-emerald-500 border-emerald-600 shadow-inner cursor-pointer"
                                                    : isTaken
                                                        ? "bg-red-600 border-red-600 opacity-80 cursor-not-allowed"
                                                        : "border-dashed border-zinc-200 hover:border-orange-400 hover:bg-orange-50/50 cursor-pointer"
                                                    }`}
                                            >
                                                {(isMine || isTaken) && (
                                                    <span className="text-[10px] font-bold text-white uppercase tracking-tighter">
                                                        {isMine ? "You" : "Booked"}
                                                    </span>
                                                )}
                                            </button>
                                        </div>
                                    );
                                })}
                            </Fragment>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}