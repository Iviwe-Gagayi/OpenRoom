"use client";

import { useState } from "react";
import CalendarView from "./CalendarView";

export default function BookingInterface({
    locationId,
    organizationId,
    slotDurationMinutes
}: {
    locationId: string;
    organizationId: string;
    slotDurationMinutes: number;
}) {

    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    return (
        <div className="flex flex-col md:flex-row gap-8 items-start">

            {/* The Calendar */}
            <div className="shrink-0">
                <CalendarView onSelectDate={(date) => setSelectedDate(date)} />
            </div>

            {/*The Time Slots) */}
            <div className="flex-1 w-full border border-zinc-200 bg-white p-6 shadow-sm min-h-[400px]">
                {selectedDate ? (
                    <div>
                        <h3 className="text-lg font-bold mb-4">
                            Available Slots for {selectedDate.toLocaleDateString()}
                        </h3>
                        <p className="text-zinc-500 text-sm">
                            (Time slot generator will go here using {slotDurationMinutes} min intervals)
                        </p>
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center text-zinc-400 text-sm">
                        Please select a date from the calendar to view available times.
                    </div>
                )}
            </div>

        </div>
    );
}