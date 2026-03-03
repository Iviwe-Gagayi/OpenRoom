"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { createOrganisation } from "@/app/actions/organisation";

export default function AddOrganizationButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex flex-col items-center justify-center h-full min-h-[160px] w-full p-8 border-2 border-dashed border-zinc-300  bg-zinc-50/50 text-zinc-500 hover:bg-white hover:border-orange-500 hover:text-zinc-700 transition-all cursor-pointer group"
            >
                <div className="bg-white p-3 rounded-full shadow-sm mb-3 group-hover:scale-105 transition-transform">
                    <Plus className="w-6 h-6 text-zinc-600" />
                </div>
                <span className="font-medium text-sm">Create New Organization</span>
            </button>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4">


                    <div className="bg-white  shadow-xl w-full max-w-md relative animate-in fade-in zoom-in duration-200">

                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="p-8">
                            <h2 className="text-2xl font-bold tracking-tighter mb-2">Create Organization</h2>
                            <p className="text-zinc-500 mb-6 text-sm">
                                Set up a new workspace. You will automatically be added as the Admin.
                            </p>


                            <form
                                action={async (formData) => {
                                    await createOrganisation(formData);
                                    setIsOpen(false);
                                }}
                                className="flex flex-col gap-4"
                            >
                                <input
                                    type="text"
                                    name="orgName"
                                    placeholder="Organization Name (e.g., Company XYZ)"
                                    required
                                    className="px-4 py-2 border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                                />

                                <div className="flex justify-end gap-3 mt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsOpen(false)}
                                        className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="cursor-pointer bg-orange-600 text-white text-sm font-bold py-2 px-6 rounded-md hover:bg-orange-700 transition-colors"
                                    >
                                        Create
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}