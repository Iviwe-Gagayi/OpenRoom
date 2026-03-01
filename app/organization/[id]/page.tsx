import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import AddLocationButton from "./AddLocationButton";
import DeleteLocationButton from "./DeleteLocationButton";
import InviteUserForm from "./InviteUserForm";

export default async function OrganizationPage({
    params,
    searchParams
}: {
    params: Promise<{ id: string }>
    searchParams: Promise<{ view?: string }>
}) {
    const { userId } = await auth();
    if (!userId) redirect("/LandingPage");

    // Await the params in Next.js 15
    const { id: organizationId } = await params;
    const { view } = await searchParams;

    const currentView = view === "users" ? "users" : "locations";


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
    const isAdmin = membership.role === "ADMIN";

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

                {/* Header Section */}
                <div className="z-10 flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tighter">
                            {membership.organization.name}
                        </h1>
                        <p className="text-xs font-mono text-zinc-400 mt-1 uppercase">
                            Organization
                        </p>
                    </div>
                </div>

                {/* Admin Toggle */}
                {isAdmin && (
                    <div className="flex gap-4 border-b border-zinc-200 mb-8 pb-px">
                        <Link
                            href={`/organization/${organizationId}`}
                            className={`pb-3 text-sm font-medium transition-colors border-b-2 ${currentView === "locations"
                                ? "border-orange-500 text-orange-600"
                                : "border-transparent text-zinc-500 hover:text-zinc-900 hover:border-zinc-300"
                                }`}
                        >
                            Locations
                        </Link>
                        <Link
                            href={`/organization/${organizationId}?view=users`}
                            className={`pb-3 text-sm font-medium transition-colors border-b-2 ${currentView === "users"
                                ? "border-orange-500 text-orange-600"
                                : "border-transparent text-zinc-500 hover:text-zinc-900 hover:border-zinc-300"
                                }`}
                        >
                            Users & Invites
                        </Link>
                    </div>
                )}

                {currentView === "locations" ? (

                    /* Locations */
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Add Location*/}
                        {isAdmin && (
                            <div className="flex border-2 border-dashed border-zinc-300 hover:border-orange-500 transition-colors min-h-[120px]">
                                <div className="m-auto">
                                    <AddLocationButton
                                        organisationId={organizationId}
                                        parentId={null}
                                    />
                                </div>
                            </div>
                        )}
                        {rootLocations.map((loc) => (
                            <Link
                                key={loc.id}
                                href={`/organization/${organizationId}/location/${loc.id}`}
                                className="relative block p-6 border border-zinc-200 hover:border-orange-500 transition-colors shadow-sm bg-white group"
                            >
                                <h2 className="font-bold text-lg pr-8">{loc.name}</h2>
                                <p className="text-xs font-mono text-zinc-400 mt-2 uppercase">{loc.type}</p>

                                {isAdmin && (
                                    <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <DeleteLocationButton locationId={loc.id} organisationId={organizationId} />
                                    </div>
                                )}
                            </Link>
                        ))}
                    </div>

                ) : (

                    /* Users & Invites */
                    <div className="space-y-8">
                        <InviteUserForm organizationId={organizationId} />

                        {/* TODO: Add Data Table for existing members later */}
                        <div className="p-12 border border-zinc-200 bg-zinc-50 rounded-xl text-center">
                            <p className="text-zinc-500">Member directory will go here.</p>
                        </div>
                    </div>

                )}
            </main>
        </div>
    );
}