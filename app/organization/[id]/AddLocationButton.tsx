"use client";
import { useState } from "react";
import BulkCreateModal from "@/components/BulkCreateModal";

export default function AddLocationButton({ organisationId, parentId }: { organisationId: string, parentId: string | null }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="bg-orange-600 text-white px-4 py-2 font-bold hover:bg-orange-700 text-sm"
            >
                + Add Location
            </button>

            {isModalOpen && (
                <BulkCreateModal
                    organisationId={organisationId}
                    parentId={parentId}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </>
    );
}