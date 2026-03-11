"use client";

import { useState, useTransition } from "react";
import { updateUserRole } from "@/app/actions/organisation";

export default function RoleSelect({
    organizationId,
    targetUserId,
    currentRole,
    isCurrentUser
}: {
    organizationId: string;
    targetUserId: string;
    currentRole: "ADMIN" | "USER";
    isCurrentUser: boolean;
}) {
    const [isPending, startTransition] = useTransition();
    const [role, setRole] = useState(currentRole);

    const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newRole = e.target.value as "ADMIN" | "USER";
        setRole(newRole);

        startTransition(async () => {
            const result = await updateUserRole(organizationId, targetUserId, newRole);

            if (result.error) {
                alert(result.error);
                setRole(currentRole);
            }
        });
    };

    return (
        <select
            value={role}
            onChange={handleChange}
            disabled={isPending || isCurrentUser}
            className={`text-xs border border-zinc-300 rounded px-2 py-1 font-medium focus:outline-none focus:border-orange-500 transition-colors ${isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                } ${role === "ADMIN" ? 'bg-orange-50 text-orange-700' : 'bg-white text-zinc-700'
                }`}
        >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
        </select>
    );
}