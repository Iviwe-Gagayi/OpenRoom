"use client";

import { useState } from "react";
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    isToday,
    startOfToday
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CalendarView({
    onSelectDate
}: {
    onSelectDate: (date: Date) => void
}) {

    const today = startOfToday();
    const [currentMonth, setCurrentMonth] = useState(today);
    const [selectedDate, setSelectedDate] = useState<Date>(today);

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const firstDayOfMonth = startOfMonth(currentMonth);
    const lastDayOfMonth = endOfMonth(currentMonth);

    const startDate = startOfWeek(firstDayOfMonth, { weekStartsOn: 0 }); // 0 = Sunday
    const endDate = endOfWeek(lastDayOfMonth, { weekStartsOn: 0 });


    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const handleDateClick = (day: Date) => {
        setSelectedDate(day);
        onSelectDate(day);
    };

    return (
        <div className="w-full max-w-md border border-zinc-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-zinc-900">
                    {format(currentMonth, "MMMM yyyy")}
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={prevMonth}
                        className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5 text-zinc-600" />
                    </button>
                    <button
                        onClick={nextMonth}
                        className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
                    >
                        <ChevronRight className="w-5 h-5 text-zinc-600" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                    <div key={day} className="text-center text-xs font-semibold text-zinc-400 pb-2">
                        {day}
                    </div>
                ))}
            </div>

            {/* DAY GRID */}
            <div className="grid grid-cols-7 gap-1">
                {days.map((day, dayIdx) => {
                    const isSelected = isSameDay(day, selectedDate);
                    const isCurrentMonth = isSameMonth(day, currentMonth);
                    const isPast = day < today;

                    return (
                        <button
                            key={day.toString()}
                            onClick={() => !isPast && handleDateClick(day)}
                            disabled={isPast}
                            className={`
                                aspect-square flex items-center justify-center text-sm font-medium transition-all
                                ${!isCurrentMonth ? 'text-zinc-300' : 'text-zinc-700'}
                                ${isPast ? 'opacity-30 cursor-not-allowed' : 'hover:bg-zinc-100'}
                                ${isSelected && !isPast ? 'bg-orange-500 text-white hover:bg-zinc-800' : ''}
                                ${isToday(day) && !isSelected ? 'border border-orange-500 text-orange-600' : ''}
                                ${isSelected && isToday(day) ? 'bg-orange-500 text-white hover:bg-orange-600 border-none' : ''}
                            `}
                        >
                            {format(day, "d")}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}