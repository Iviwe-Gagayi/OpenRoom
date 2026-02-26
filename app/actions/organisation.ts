"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createOrganisation(formData: FormData) {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("Unauthorized")
    };

    const orgName = formData.get("orgName") as string;
    if (!orgName) throw new Error("Organization name is required");

    try {
        // Creating the organization and adding the current user as the admin
        await prisma.organization.create({
            data: {
                name: orgName,
                members: {
                    create: {
                        userId: userId,
                        role: "ADMIN",
                    },
                },
            },
        });

        revalidatePath("/bookings");
    } catch (error) {
        console.error("Failed to create organization:", error);
        throw new Error("Failed to create organization");
    }
}