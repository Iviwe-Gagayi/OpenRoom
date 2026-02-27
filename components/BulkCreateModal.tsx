"use client";

import { useState, useTransition } from "react";
import { bulkCreateLocations } from "@/app/actions/locations";

type BulkCreateModalProps = {
    organisationId: string;
    parentId: string | null;
    onClose: () => void;
};

export default function BulkCreateModal({ organisationId, parentId, onClose }: BulkCreateModalProps) {
    const [step, setStep] = useState<1 | 2>(1);
    const [isPending, startTransition] = useTransition();

    // State
    const [type, setType] = useState("Building");
    const [prefix, setPrefix] = useState("");
    const [quantity, setQuantity] = useState(1);

    // Preview Grid
    const [previewList, setPreviewList] = useState<{ name: string; type: string }[]>([]);

    const handleGenerate = () => {
        const generated = Array.from({ length: quantity }, (_, i) => ({
            name: quantity === 1 ? prefix : `${prefix}${i + 1}`.trim(),
            type: type,
        }));
        setPreviewList(generated);
        setStep(2);
    };

    const handleNameChange = (index: number, newName: string) => {
        const updated = [...previewList];
        updated[index].name = newName;
        setPreviewList(updated);
    };

    const handleSubmit = () => {
        startTransition(async () => {
            try {
                await bulkCreateLocations(organisationId, parentId, previewList);
                onClose();
            } catch (error) {
                console.error(error);
                alert("Failed to create locations. Check console.");
            }
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 w-full max-w-lg shadow-xl border border-zinc-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold tracking-tighter">
                        {step === 1 ? "Create Locations" : "Review & Edit"}
                    </h2>
                    <button onClick={onClose} className="cursor-pointer text-zinc-400 hover:text-zinc-900">&times;</button>
                </div>

                {step === 1 ? (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-zinc-700 mb-1">Type</label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="w-full p-2 border border-zinc-300 focus:border-orange-500 outline-none"
                            >
                                <option value="CAMPUS">Zone</option>
                                <option value="BUILDING">Building</option>
                                <option value="FLOOR">Floor</option>
                                <option value="ROOM">Room</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-zinc-700 mb-1">Prefix / Name</label>
                                <input
                                    type="text"
                                    value={prefix}
                                    onChange={(e) => setPrefix(e.target.value)}
                                    placeholder={quantity === 1 ? "e.g. Main Hall" : "e.g. Room "}
                                    className="w-full p-2 border border-zinc-300 focus:border-orange-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-zinc-700 mb-1">Quantity</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="200"
                                    value={quantity}
                                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                    className="w-full p-2 border border-zinc-300 focus:border-orange-500 outline-none"
                                />
                            </div>
                        </div>
                        <button
                            onClick={handleGenerate}
                            disabled={!prefix.trim() && quantity === 1}
                            className=" cursor-pointer w-full bg-zinc-900 text-white font-bold py-2 mt-4 disabled:opacity-50"
                        >
                            Generate Preview
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
                            {previewList.map((loc, idx) => (
                                <input
                                    key={idx}
                                    type="text"
                                    value={loc.name}
                                    onChange={(e) => handleNameChange(idx, e.target.value)}
                                    className="w-full p-2 border border-zinc-300 focus:border-orange-500 outline-none"
                                />
                            ))}
                        </div>
                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={() => setStep(1)}
                                className="cursor-pointer flex-1 border border-zinc-300 font-bold py-2 hover:bg-zinc-50"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isPending}
                                className="cursor-pointer flex-1 bg-orange-600 text-white font-bold py-2 hover:bg-orange-700 disabled:opacity-50"
                            >
                                {isPending ? "Saving..." : "Save to Database"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}