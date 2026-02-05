"use server"
import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache";

export async function createBooking(roomId: string, slotTime: string) {
    const { userId } = await auth();
    const clerkUser = await currentUser();

    if (!userId || !clerkUser) throw new Error("Unauthorized");

    // Extract the date from the slotTime (e.g., "2026-02-05")
    const datePart = slotTime.split('-').slice(0, 3).join('-');
    const fullName = `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() || "Anonymous User";

    try {
        const result = await prisma.$transaction(async (tx) => {
            // 1. Sync User
            await tx.user.upsert({
                where: { id: userId },
                update: { name: fullName },
                create: { id: userId, name: fullName },
            });

            // 2. ENFORCE 2-HOUR LIMIT
            // Count how many bookings this user has for today
            const dailyCount = await tx.booking.count({
                where: {
                    userId: userId,
                    slotTime: { startsWith: datePart }
                }
            });

            if (dailyCount >= 2) {
                throw new Error("You have reached the 2-hour daily limit.");
            }

            // 3. Check if slot is already taken
            const existing = await tx.booking.findFirst({
                where: { roomId, slotTime },
            });
            if (existing) throw new Error("Room already booked.");

            // 4. Create Booking
            return await tx.booking.create({
                data: { roomId, slotTime, userId },
            });
        });

        revalidatePath("/booking");
        return { success: true, data: result };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getBookings() {
    const date = new Date().toISOString().split('T')[0];
    return await prisma.booking.findMany({
        where: { slotTime: { startsWith: date } },
        include: { user: true }
    });
}

export async function cancelBooking(bookingId: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    try {
        await prisma.booking.delete({
            where: {
                id: bookingId,
                userId: userId // Only the owner can delete
            },
        });

        revalidatePath("/booking");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: "Failed to cancel booking." };
    }
}