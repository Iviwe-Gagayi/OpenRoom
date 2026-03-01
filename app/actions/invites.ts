"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createInvite(email: string, organizationId: string) {
    if (!email || !email.includes("@")) {
        return { error: "Please provide a valid email address." };
    }


    const { userId } = await auth();
    if (!userId) {
        return { error: "Unauthorized. Please log in." };
    }


    const membership = await prisma.orgMember.findUnique({
        where: {
            userId_organizationId: {
                userId,
                organizationId,
            },
        },
    });

    if (!membership || membership.role !== "ADMIN") {
        return { error: "Only administrators can invite new users." };
    }

    try {
        await prisma.orgInvite.create({
            data: {

                email: email.toLowerCase().trim(),
                organizationId: organizationId,
            },
        });


        revalidatePath(`/organization/${organizationId}`);

        return { success: true };

    } catch (error: any) {
        // 'P2002' is Prisma's error code for "Unique" constraint violation
        if (error.code === "P2002") {
            return { error: "An invite has already been sent to this email for this organization." };
        }

        console.error("Invite Error:", error);
        return { error: "Something went wrong creating the invite." };
    }
}