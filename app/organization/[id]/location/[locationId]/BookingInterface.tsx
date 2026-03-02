"use client";

import { useState, useEffect } from "react";
import CalendarView from "./CalendarView";
import { setHours, setMinutes, addMinutes, isBefore, format } from "date-fns";
import { createBooking, getLocationBookings } from "@/app/actions/bookings";
import { useAuth } from "@clerk/nextjs";

export default function BookingInterface({
    locationId,
    organizationId,
    slotDurationMinutes
}: {
    locationId: string;
    organizationId: string;
    slotDurationMinutes: number;
}) {
    const { userId: currentUserId } = useAuth();
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [existingBookings, setExistingBookings] = useState<any[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [bookingId, setBookingId] = useState<string | null>(null);

    //getting existing bookings whenever they click a new date
    useEffect(() => {
        if (!selectedDate) return;

        const fetchBookings = async () => {
            setLoadingSlots(true);
            try {
                const bookings = await getLocationBookings(locationId, selectedDate.toISOString());
                setExistingBookings(bookings);
            } catch (error) {
                console.error("Failed to fetch bookings");
            }
            setLoadingSlots(false);
        };

        fetchBookings();
    }, [selectedDate, locationId]);


    const generateTimeSlots = () => {
        if (!selectedDate) return [];

        const slots = [];

        let currentTime = setMinutes(setHours(selectedDate, 8), 0);
        const endTime = setMinutes(setHours(selectedDate, 23), 0);
        const now = new Date();

        while (currentTime < endTime) {
            const slotEnd = addMinutes(currentTime, slotDurationMinutes);
            const isPast = isBefore(currentTime, now);

            const overlappingBooking = existingBookings.find(booking => {
                const bStart = new Date(booking.startTime);
                const bEnd = new Date(booking.endTime);
                return currentTime < bEnd && slotEnd > bStart;
            });

            slots.push({
                startTime: currentTime,
                endTime: slotEnd,
                isPast,
                isBookedByMe: overlappingBooking?.userId === currentUserId,
                isBookedByOther: !!overlappingBooking && overlappingBooking.userId !== currentUserId
            });

            currentTime = slotEnd;
        }

        return slots;
    };


    const handleBookSlot = async (startTime: Date, endTime: Date) => {
        const tempId = startTime.toISOString();
        setBookingId(tempId);

        const result = await createBooking(
            locationId,
            organizationId,
            startTime.toISOString(),
            endTime.toISOString()
        );

        if (result.error) {
            alert(result.error);
        } else {
            const updatedBookings = await getLocationBookings(locationId, selectedDate!.toISOString());
            setExistingBookings(updatedBookings);
        }

        setBookingId(null);
    };

    const slots = generateTimeSlots();

    return (
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">

            {/* The Calendar */}
            <div className="shrink-0">
                <CalendarView onSelectDate={(date) => setSelectedDate(date)} />
            </div>

            {/* Time Slots */}
            <div className="flex-1 w-full border border-zinc-200 bg-white p-6 shadow-sm min-h-[400px]">
                {selectedDate ? (
                    <div>
                        <div className="flex items-center justify-between mb-6 border-b border-zinc-100 pb-4">
                            <h3 className="text-lg font-bold text-zinc-900">
                                {format(selectedDate, "EEEE, MMMM do")}
                            </h3>
                            <span className="text-xs font-medium text-zinc-500 bg-zinc-100 px-2 py-1 rounded">
                                {slotDurationMinutes} min slots
                            </span>
                        </div>

                        {loadingSlots ? (
                            <div className="text-sm text-zinc-500 text-center py-12 animate-pulse">
                                Checking availability...
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                                {slots.map((slot) => {
                                    const isLoading = bookingId === slot.startTime.toISOString();
                                    const isDisabled = slot.isPast || slot.isBookedByMe || slot.isBookedByOther
                                    let buttonStyle = "bg-white border-zinc-300 text-zinc-900 hover:border-orange-500 hover:text-orange-600 shadow-sm";
                                    let statusText = isLoading ? "Booking..." : "Available";

                                    if (slot.isPast) {
                                        buttonStyle = "bg-zinc-50 border-zinc-200 text-zinc-400 cursor-not-allowed";
                                        statusText = "Passed";
                                    } else if (slot.isBookedByMe) {
                                        buttonStyle = "bg-green-50 border-green-600 text-green-700 cursor-not-allowed shadow-sm";
                                        statusText = "Your Booking";
                                    } else if (slot.isBookedByOther) {
                                        buttonStyle = "bg-zinc-50 border-zinc-200 text-zinc-400 cursor-not-allowed";
                                        statusText = "Reserved";
                                    }

                                    return (
                                        <button
                                            key={slot.startTime.toISOString()}
                                            disabled={isDisabled || isLoading}
                                            onClick={() => handleBookSlot(slot.startTime, slot.endTime)}
                                            className={` cursor-pointer flex flex-col items-center justify-center p-3 border rounded-md text-sm font-medium transition-all ${buttonStyle}`}
                                        >
                                            <span>{format(slot.startTime, "h:mm a")}</span>
                                            <span className="text-[10px] uppercase tracking-wider mt-1 opacity-70">
                                                {statusText}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-400 text-sm py-24">
                        <p>Select a date to view available times.</p>
                    </div>
                )}
            </div>
        </div>
    );
}