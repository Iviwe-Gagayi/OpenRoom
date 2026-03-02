"use client";

import { useState } from "react";
import { updateOrganizationSettings } from "@/app/actions/actions";

export default function OrganizationSettingsForm({
    organizationId,
    initialSlotDuration,
    initialMaxHours
}: {
    organizationId: string;
    initialSlotDuration: number;
    initialMaxHours: number | null;
}) {
    // Initializing state with the current settings
    const [slotDuration, setSlotDuration] = useState(initialSlotDuration);
    const [maxHours, setMaxHours] = useState(initialMaxHours || "");

    const [status, setStatus] = useState<{ type: "success" | "error" | null, message: string }>({ type: null, message: "" });
    const [isPending, setIsPending] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsPending(true);
        setStatus({ type: null, message: "" });

        // Convertin the string input back to numbers/null
        const parsedMaxHours = maxHours === "" ? null : Number(maxHours);

        const result = await updateOrganizationSettings(organizationId, {
            slotDurationMinutes: Number(slotDuration),
            maxHoursPerUser: parsedMaxHours
        });

        if (result.error) {
            setStatus({ type: "error", message: result.error });
        } else {
            setStatus({ type: "success", message: "Settings saved successfully!" });
        }

        setIsPending(false);
    };

    return (
        <div className="relative z-10 w-full p-8 border border-zinc-200 bg-white shadow-sm">
            <h2 className="text-lg font-bold mb-1">Booking Rules</h2>
            <p className="text-sm text-zinc-500 mb-6">
                Define the global calendar grid and usage limits for this organization.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* SLOT DURATION*/}
                <div>
                    <label className="block text-sm font-medium text-zinc-900 mb-1">
                        Time Slot Duration (Minutes)
                    </label>
                    <select
                        value={slotDuration}
                        onChange={(e) => setSlotDuration(Number(e.target.value))}
                        className="w-full px-4 py-2 border border-zinc-300 focus:border-orange-500 outline-none bg-white"
                        disabled={isPending}
                    >
                        <option value={15}>15 Minutes</option>
                        <option value={30}>30 Minutes</option>
                        <option value={45}>45 Minutes</option>
                        <option value={60}>60 Minutes (1 Hour)</option>
                        <option value={120}>120 Minutes (2 Hours)</option>
                    </select>
                    <p className="text-xs text-zinc-500 mt-2">
                        This determines how the calendar grid is drawn for users.
                    </p>
                </div>

                {/* MAX HOURS */}
                <div>
                    <label className="block text-sm font-medium text-zinc-900 mb-1">
                        Max Booking Hours (Per User / Per Day)
                    </label>
                    <input
                        type="number"
                        min="1"
                        step="1"
                        value={maxHours}
                        onChange={(e) => setMaxHours(e.target.value)}
                        placeholder="e.g. 2"
                        className="w-full px-4 py-2 border border-zinc-300 focus:border-orange-500 outline-none"
                        disabled={isPending}
                    />
                    <p className="text-xs text-zinc-500 mt-2">
                        Leave blank for unlimited booking time.
                    </p>
                </div>


                <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
                    <div>
                        {status.message && (
                            <p className={`text-sm font-medium ${status.type === "error" ? "text-red-600" : "text-green-600"}`}>
                                {status.message}
                            </p>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={isPending}
                        className="cursor-pointer px-6 py-2 bg-zinc-900 text-white font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50"
                    >
                        {isPending ? "Saving..." : "Save Settings"}
                    </button>
                </div>
            </form>
        </div>
    );
}