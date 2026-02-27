import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import AddLocationButton from "./AddLocationButton";
import DeleteLocationButton from "./DeleteLocationButton";

export default async function OrganizationPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { userId } = await auth();
    if (!userId) redirect("/LandingPage");

    // Await the params in Next.js 15
    const { id: organizationId } = await params;


    const membership = await prisma.orgMember.findUnique({
        where: {
            userId_organizationId: {
                userId: userId,
                organizationId: organizationId
            }
        },
        include: { organization: true }
    });

    if (!membership) redirect("/bookings");

    // Fetch the Locations with no parent
    const rawLocations = await prisma.location.findMany({
        where: {
            organizationId: organizationId,
            parentId: null
        },
    });

    const rootLocations = rawLocations.sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' })
    );

    return (
        <div className="min-h-screen bg-white text-zinc-900">
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}
            />
            <main className="max-w-5xl mx-auto px-6 pt-32">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tighter">
                        {membership.organization.name}
                    </h1>
                    <p className="text-zinc-500">Select a location to book.</p>
                </div>

                {rootLocations.length > 0 ? (

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">


                        {membership.role === "ADMIN" && (
                            <div className="flex border-2 border-dashed border-zinc-300 hover:border-orange-500 transition-colors min-h-[120px]">
                                <div className="m-auto">
                                    <AddLocationButton organisationId={organizationId} parentId={null} />
                                </div>
                            </div>
                        )}

                        {rootLocations.map((location) => (
                            <Link
                                key={location.id}
                                href={`/organization/${organizationId}/location/${location.id}`}
                                className="z-10 block p-6 border border-zinc-200 hover:border-orange-500 transition-colors shadow-sm bg-white group"
                            >
                                <h2 className="font-bold text-lg pr-8">{location.name}</h2>
                                <p className="text-xs font-mono text-zinc-400 mt-2 uppercase">{location.type}</p>

                                {membership.role === "ADMIN" && (
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <DeleteLocationButton locationId={location.id} organisationId={organizationId} />
                                    </div>
                                )}
                            </Link>
                        ))}



                    </div>
                ) : (
                    <div className="p-8 border !border-dashed !border-red-300 text-center">
                        <p className="text-zinc-500 p-4">No root locations found.</p>
                        {membership.role === "ADMIN" && (
                            <AddLocationButton organisationId={organizationId} parentId={null} />
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}