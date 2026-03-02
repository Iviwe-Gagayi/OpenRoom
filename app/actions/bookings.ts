"use server"

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache";

export async function createBooking(
    locationId: string,
    organizationId: string,
    startTimeISO: string,
    endTimeISO: string
) {
    const { userId } = await auth();
    if (!userId) return { error: "Unauthorized" };

    const startTime = new Date(startTimeISO);
    const endTime = new Date(endTimeISO);

    try {
        await prisma.$transaction(async (tx) => {

            const org = await tx.organization.findUnique({
                where: { id: organizationId }
            });
            if (!org) throw new Error("Organization not found.");

            //checking for overlapping bookings in the same location
            const existingBooking = await tx.booking.findFirst({
                where: {
                    locationId,
                    startTime: { lt: endTime },
                    endTime: { gt: startTime }
                }
            });

            if (existingBooking) {
                throw new Error("This room was just booked by someone else for this time!");
            }


            //max hours per user check 
            if (org.maxHoursPerUser !== null) {
                const startOfDay = new Date(startTime);
                startOfDay.setHours(0, 0, 0, 0);
                const endOfDay = new Date(startTime);
                endOfDay.setHours(23, 59, 59, 999);


                const todaysBookings = await tx.booking.findMany({
                    where: {
                        userId: userId,
                        startTime: { gte: startOfDay, lte: endOfDay },
                        location: { organizationId: organizationId }
                    }
                });


                const bookedMs = todaysBookings.reduce((total, b) => {
                    return total + (b.endTime.getTime() - b.startTime.getTime());
                }, 0);
                const bookedHours = bookedMs / (1000 * 60 * 60);


                const requestedHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

                if (bookedHours + requestedHours > org.maxHoursPerUser) {
                    throw new Error(`This booking exceeds your ${org.maxHoursPerUser}-hour daily limit.`);
                }
            }

            //Creating booking if all checks pass
            return await tx.booking.create({
                data: {
                    locationId,
                    userId,
                    startTime,
                    endTime
                }
            });
        });


        revalidatePath(`/organization/${organizationId}/location/${locationId}`);
        return { success: true };

    } catch (error: any) {
        return { error: error.message || "Failed to create booking." };
    }
}

export async function getLocationBookings(locationId: string, targetDateISO: string) {
    const targetDate = new Date(targetDateISO);
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    return await prisma.booking.findMany({
        where: {
            locationId,
            startTime: { gte: startOfDay, lte: endOfDay }
        },
        orderBy: { startTime: 'asc' }
    });
}

export async function cancelBooking(bookingId: string, locationId: string, organizationId: string) {
    const { userId } = await auth();
    if (!userId) return { error: "Unauthorized" };

    try {
        await prisma.booking.delete({
            where: {
                id: bookingId,
                userId: userId
            },
        });

        revalidatePath(`/organization/${organizationId}/location/${locationId}`);
        return { success: true };
    } catch (error: any) {
        return { error: "Failed to cancel booking." };
    }
}