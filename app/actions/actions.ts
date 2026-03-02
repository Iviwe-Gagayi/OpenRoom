"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateOrganizationSettings(
    organizationId: string,
    data: { slotDurationMinutes: number; maxHoursPerUser: number | null }
) {
    const { userId } = await auth();
    if (!userId) return { error: "Unauthorized" };

    const adminCheck = await prisma.orgMember.findUnique({
        where: { userId_organizationId: { userId, organizationId } },
    });

    if (!adminCheck || adminCheck.role !== "ADMIN") {
        return { error: "Only admins can update settings." };
    }

    try {
        await prisma.organization.update({
            where: { id: organizationId },
            data: {
                slotDurationMinutes: data.slotDurationMinutes,
                maxHoursPerUser: data.maxHoursPerUser,
            },
        });

        revalidatePath(`/organization/${organizationId}?view=settings`);
        return { success: true };

    } catch (error) {
        console.error("Settings Update Error:", error);
        return { error: "Failed to save organization settings." };
    }
}