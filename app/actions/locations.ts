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