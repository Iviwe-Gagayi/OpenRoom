"use client";

import { useState } from "react";
import { removeMember } from "@/app/actions/member";

type Member = {
    userId: string;
    role: string;
    createdAt: Date;
    name: string;
    email: string;
};

export default function MemberList({
    members,
    organizationId,
    currentUserId
}: {
    members: Member[],
    organizationId: string,
    currentUserId: string
}) {
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const handleRemove = async (targetUserId: string) => {
        if (!confirm("Are you sure you want to remove this user?")) return;

        setLoadingId(targetUserId);
        const result = await removeMember(targetUserId, organizationId);

        if (result.error) {
            alert(result.error);
        }
        setLoadingId(null);
    };

    return (
        <div className="border border-zinc-200 bg-white shadow-sm">
            <div className="p-4 border-b border-zinc-200 bg-zinc-50">
                <h2 className="font-bold text-zinc-900">Active Members</h2>
            </div>

            <ul className="divide-y divide-zinc-200">
                {members.map((member) => (
                    <li key={member.userId} className="flex items-center justify-between p-4 hover:bg-zinc-50 transition-colors">
                        <div>
                            <p className="font-bold text-sm text-zinc-900">
                                {member.name} {member.userId === currentUserId && "(You)"}
                            </p>
                            <p className="text-xs text-zinc-500 mt-1">
                                {member.email} • Role: <span className="font-semibold">{member.role}</span>
                            </p>
                        </div>

                        {member.userId !== currentUserId && (
                            <button
                                onClick={() => handleRemove(member.userId)}
                                disabled={loadingId === member.userId}
                                className="cursor-pointer text-sm text-red-600 hover:text-red-800 font-medium disabled:opacity-50 transition-colors px-3 py-1"
                            >
                                {loadingId === member.userId ? "Removing..." : "Remove"}
                            </button>
                        )}

                    </li>
                ))}
            </ul>
        </div>
    );
}