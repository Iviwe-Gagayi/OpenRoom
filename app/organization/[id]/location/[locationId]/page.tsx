import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import AddLocationButton from "../../AddLocationButton";
import DeleteLocationButton from "../../DeleteLocationButton";
import AdminLeafNodeManager from "./AdminLeafNodeManager";
import BookingInterface from "./BookingInterface";

export const dynamic = 'force-dynamic';

export default async function LocationPage({
    params
}: {
    params: Promise<{ id: string, locationId: string }>
}) {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    const { id: organizationId, locationId } = await params;


    const membership = await prisma.orgMember.findUnique({
        where: { userId_organizationId: { userId, organizationId } },
    });

    if (!membership) redirect("/bookings");


    const currentLocation = await prisma.location.findFirst({
        where: { id: locationId, organizationId: organizationId },
        include: {
            parent: true,
            organization: true,
            children: true
        }
    });

    if (!currentLocation) redirect(`/organization/${organizationId}`);


    const rawChildren = await prisma.location.findMany({
        where: { parentId: locationId, organizationId: organizationId },
    });


    const children = rawChildren.sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' })
    );

    const isLeafNode = children.length === 0;

    const backUrl = currentLocation.parentId
        ? `/organization/${organizationId}/location/${currentLocation.parentId}`
        : `/organization/${organizationId}`;

    const isAdmin = membership.role === "ADMIN";

    return (
        <div className="min-h-screen bg-white text-zinc-900">
            <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none"
                style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}
            />
            <main className=" max-w-5xl mx-auto px-6 pt-32">

                <Link
                    href={backUrl}
                    className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 mb-6 transition-colors"
                >
                    &larr; Back to {currentLocation.parent ? currentLocation.parent.name : "Organization"}
                </Link>

                <div className=" z-10 flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tighter">
                            {currentLocation.name}
                        </h1>
                        <p className="text-xs font-mono text-zinc-400 mt-1 uppercase">
                            {currentLocation.type}
                        </p>
                    </div>
                </div>

                {/* Container has no children */}
                {isLeafNode ? (
                    isAdmin ? (
                        <AdminLeafNodeManager currentLocation={currentLocation} />
                    ) : (
                        <div className="mb-24 p-12 border border-zinc-200 bg-white rounded-xl text-center shadow-sm">
                            <h2 className="text-xl font-bold mb-2">Booking Calendar</h2>
                            <div className="text-zinc-500">
                                <BookingInterface
                                    locationId={currentLocation.id}
                                    organizationId={currentLocation.organizationId}
                                    slotDurationMinutes={currentLocation.organization.slotDurationMinutes}
                                />
                            </div>
                        </div>
                    )
                ) : (
                    /* Parent has children */
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {children.map((child) => (
                            <Link
                                key={child.id}
                                href={`/organization/${organizationId}/location/${child.id}`}
                                className="relative block p-6 border border-zinc-200 hover:border-orange-500 transition-colors shadow-sm bg-white group"
                            >
                                <h2 className="font-bold text-lg pr-8">{child.name}</h2>
                                <p className="text-xs font-mono text-zinc-400 mt-2 uppercase">{child.type}</p>

                                {membership.role === "ADMIN" && (
                                    <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <DeleteLocationButton locationId={child.id} organisationId={organizationId} />
                                    </div>
                                )}


                            </Link>
                        ))}

                        {membership.role === "ADMIN" && (
                            <div className="flex border-2 border-dashed border-zinc-300 hover:border-orange-500 transition-colors min-h-[120px]">
                                <div className="m-auto">
                                    <AddLocationButton
                                        organisationId={organizationId}
                                        parentId={currentLocation.id}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}