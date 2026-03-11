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

        revalidatePath("/booking");
    } catch (error) {
        console.error("Failed to create organization:", error);
        throw new Error("Failed to create organization");
    }
}

export async function deleteOrganization(organizationId: string) {
    const { userId } = await auth();
    if (!userId) return { error: "Unauthorized" };

    try {

        const member = await prisma.orgMember.findUnique({
            where: {
                userId_organizationId: {
                    userId: userId,
                    organizationId: organizationId,
                }
            }
        });

        if (!member || member.role !== "ADMIN") {
            return { error: "You do not have permission to delete this organization." };
        }


        await prisma.organization.delete({
            where: { id: organizationId }
        });


        revalidatePath('/booking');

        return { success: true };

    } catch (error: any) {
        return { error: error.message || "Failed to delete organization." };
    }
}