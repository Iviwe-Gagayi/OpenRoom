"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function removeMember(targetUserId: string, organizationId: string) {
    const { userId } = await auth();
    if (!userId) return { error: "Unauthorized" };

    const adminCheck = await prisma.orgMember.findUnique({
        where: { userId_organizationId: { userId, organizationId } },
    });

    if (!adminCheck || adminCheck.role !== "ADMIN") {
        return { error: "Only admins can remove users." };
    }

    //Admin shouldn't delete themselves lol
    if (userId === targetUserId) {
        return { error: "You cannot remove yourself from the organization." };
    }

    try {
        await prisma.orgMember.delete({
            where: {
                userId_organizationId: {
                    userId: targetUserId,
                    organizationId: organizationId,
                },
            },
        });

        revalidatePath(`/organization/${organizationId}?view=users`);
        return { success: true };
    } catch (error) {
        console.error("Remove Member Error:", error);
        return { error: "Failed to remove member." };
    }
}