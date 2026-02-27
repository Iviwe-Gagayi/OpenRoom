"use client";

import { useTransition } from "react";
import { deleteLocation } from "@/app/actions/locations";

export default function DeleteLocationButton({ locationId, organisationId }: { locationId: string, organisationId: string }) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault(); // Stops "link" from navigating to the location page before deletion

        if (window.confirm("Are you sure you want to delete this location? You cannot undo this action.")) {
            startTransition(async () => {
                try {
                    await deleteLocation(locationId, organisationId);
                } catch (error: any) {
                    alert(error.message || "Failed to delete location.");
                }
            });
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isPending}
            className="cursor-pointer absolute top-4 right-4 text-zinc-400 hover:text-red-600 transition-colors disabled:opacity-50"
            title="Delete Location"
        >
            {isPending ? "..." : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                </svg>
            )}
        </button>
    );
}