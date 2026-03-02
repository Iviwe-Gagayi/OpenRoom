"use client";

import { useState } from "react";
import { createInvite } from "@/app/actions/invites";

export default function InviteUserForm({ organizationId }: { organizationId: string }) {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<{ type: "success" | "error" | null, message: string }>({ type: null, message: "" });
    const [isPending, setIsPending] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsPending(true);
        setStatus({ type: null, message: "" });


        const result = await createInvite(email, organizationId);

        if (result.error) {
            setStatus({ type: "error", message: result.error });
        } else {
            setStatus({ type: "success", message: "User whitelisted successfully!" });
            setEmail("");
        }

        setIsPending(false);
    };

    return (
        <div className="p-6 border border-zinc-200 bg-white shadow-sm">
            <h2 className="text-lg font-bold mb-1">Add New User</h2>
            <p className="text-sm text-zinc-500 mb-6">
                Add an email address to the whitelist. They will automatically join this organization when they sign up.
            </p>

            <form onSubmit={handleSubmit} className="flex gap-3 items-start">
                <div className="flex-1">
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="jane@company.com"
                        className="w-full px-4 py-2 border border-zinc-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
                        disabled={isPending}
                    />
                    {status.message && (
                        <p className={`mt-2 text-sm ${status.type === "error" ? "text-red-600" : "text-green-600"}`}>
                            {status.message}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isPending || !email}
                    className=" cursor-pointer px-6 py-2 bg-zinc-900 text-white font-medium  transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending ? "Whitelisting..." : "Add User"}
                </button>
            </form>
        </div>
    );
}