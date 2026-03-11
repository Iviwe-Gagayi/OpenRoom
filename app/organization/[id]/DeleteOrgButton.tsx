"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteOrganization } from "@/app/actions/organisation";

export default function DeleteOrgButton({
    organizationId,
    organizationName
}: {
    organizationId: string;
    organizationName: string;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [confirmText, setConfirmText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    const isMatch = confirmText === organizationName;

    const handleDelete = async () => {
        if (!isMatch) return;
        setIsDeleting(true);

        const result = await deleteOrganization(organizationId);

        if (result.error) {
            alert(result.error);
            setIsDeleting(false);
        }

    };

    return (
        <div className="relative">
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="cursor-pointer p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                title="Delete Organization"
            >
                <Trash2 className="w-4 h-4" />
            </button>

            {/* Dropdown Warning */}
            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-72 p-4 bg-white border border-red-200 shadow-lg rounded-md z-50">
                    <h4 className="text-sm font-bold text-red-600 mb-2">Delete Organization</h4>
                    <p className="text-xs text-zinc-600 mb-4">
                        This action cannot be undone. All locations, members, and bookings will be permanently deleted.
                    </p>

                    <div className="mb-4">
                        <label className="block text-[10px] font-bold text-zinc-500 mb-1">
                            <span className="uppercase">Type </span>
                            <span className="text-zinc-900 bg-zinc-100 px-1 rounded text-xs">{organizationName}</span>
                            <span className="uppercase"> to confirm:</span>
                        </label>
                        <input
                            type="text"
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            className="w-full border border-zinc-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-red-500"
                            placeholder={organizationName}
                        />
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                setConfirmText("");
                            }}
                            className="px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-100 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={!isMatch || isDeleting}
                            className={`px-3 py-1.5 text-xs font-medium text-white rounded transition-colors ${isMatch && !isDeleting
                                ? 'bg-red-600 hover:bg-red-700 cursor-pointer'
                                : 'bg-red-300 cursor-not-allowed'
                                }`}
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}