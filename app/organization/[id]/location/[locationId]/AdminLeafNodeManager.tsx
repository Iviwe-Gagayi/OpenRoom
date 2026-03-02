"use client";

import { useState } from "react";
import AddLocationButton from "../../AddLocationButton";

type AdminLeafNodeProps = {
    organisationId: string;
    locationId: string;
    locationName: string;
    locationType: string;
};

export default function AdminLeafNodeManager({ organisationId, locationId, locationName, locationType }: AdminLeafNodeProps) {
    const [viewMode, setViewMode] = useState<"admin" | "user">("admin");

    return (
        <div className="space-y-6">
            {/* Toggle */}
            <div className="flex bg-zinc-100 p-1 rounded-lg w-fit border border-zinc-200">
                <button
                    onClick={() => setViewMode("admin")}
                    className={`z-10 cursor-pointer px-4 py-2 text-sm font-bold rounded-md transition-colors ${viewMode === "admin" ? "bg-white shadow-sm text-zinc-900" : "text-zinc-500 hover:text-zinc-700"
                        }`}
                >
                    Admin View
                </button>
                <button
                    onClick={() => setViewMode("user")}
                    className={`z-10 cursor-pointer px-4 py-2 text-sm font-bold rounded-md transition-colors ${viewMode === "user" ? "bg-white shadow-sm text-zinc-900" : "text-zinc-500 hover:text-zinc-700"
                        }`}
                >
                    User View
                </button>
            </div>


            {viewMode === "admin" ? (
                <div className="p-12 border border-dashed border-zinc-300 flex flex-col items-center justify-center bg-zinc-50/50">
                    <p className="text-zinc-500 mb-4 text-center">
                        This {locationType.toLowerCase()} has no sub-locations.<br />
                        Add containers to partition this space.
                    </p>
                    <AddLocationButton organisationId={organisationId} parentId={locationId} />
                </div>
            ) : (
                <div className="p-12 border border-zinc-200 bg-white rounded-xl text-center shadow-sm">
                    <h2 className="text-xl font-bold mb-2">Booking Calendar</h2>
                    <p className="text-zinc-500">




                        (Calendar UI goes here for {locationName})
                    </p>
                </div>
            )}
        </div>
    );
}