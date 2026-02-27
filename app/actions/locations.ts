"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

type LocationData = {
    name: string;
    type: string;
};

export async function bulkCreateLocations(
    organizationId: string,
    parentId: string | null,
    locations: LocationData[]
) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    //data to insert
    const dataToInsert = locations.map((loc) => ({
        name: loc.name,
        type: loc.type,
        organizationId: organizationId,
        parentId: parentId,
    }));

    //inserting the data
    try {
        await prisma.location.createMany({
            data: dataToInsert,
        });

        revalidatePath(`/organization/${organizationId}`);
        if (parentId) {
            revalidatePath(`/organization/${organizationId}/location/${parentId}`);
        }
    } catch (error) {
        console.error("Bulk create failed:", error);
        throw new Error("Failed to create locations");
    }
}

export async function deleteLocation(locationId: string, organizationId: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const membership = await prisma.orgMember.findUnique({
        where: { userId_organizationId: { userId, organizationId } },
    });

    if (!membership || membership.role !== "ADMIN") {
        throw new Error("Only admins can delete locations");
    }

    try {
        const location = await prisma.location.findUnique({ where: { id: locationId } });

        await prisma.location.delete({
            where: { id: locationId }
        });

        revalidatePath(`/organization/${organizationId}`);
        if (location?.parentId) {
            revalidatePath(`/organization/${organizationId}/location/${location.parentId}`);
        }
    } catch (error) {
        console.error("Failed to delete location:", error);
        throw new Error("Database error during deletion");
    }
}