import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { createOrganisation } from "@/app/actions/organisation";
import AddOrganizationButton from "../organization/[id]/AddOrganizationButton";

export default async function Bookings() {

    const { userId } = await auth();

    if (!userId) {
        redirect("/LandingPage");
    }

    //checking if user is invited + adding them to the org if they are:
    const user = await currentUser();
    const email = user?.emailAddresses[0]?.emailAddress;

    if (email) {
        const pendingInvites = await prisma.orgInvite.findMany({
            where: { email: email.toLowerCase() }
        });

        if (pendingInvites.length > 0) {
            await prisma.orgMember.createMany({
                data: pendingInvites.map((invite) => ({
                    userId: userId,
                    organizationId: invite.organizationId,
                    role: "USER"
                })),
                skipDuplicates: true,
            });

            await prisma.orgInvite.deleteMany({
                where: { email: email.toLowerCase() }
            });

            redirect("/Bookings");
        }
    }

    const membership = await prisma.orgMember.findMany({
        where: { userId },
        include: { organization: true }
    });

    const hasOrganizations = membership.length > 0;

    return (

        <div className="min-h-screen bg-white text-zinc-900 selection:bg-orange-100">

            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}
            />

            <main className="relative z-10 max-w-5xl mx-auto px-6 pt-32">

                {hasOrganizations ? (
                    // If a User belongs to organization:
                    <div className="space-y-6">
                        <h1 className="text-3xl font-bold tracking-tighter">Your Organisations</h1>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {membership.map((membership) => (
                                <Link
                                    key={membership.organization.id}
                                    href={`/organization/${membership.organization.id}`}
                                    className="block p-6 border border-zinc-200 hover:border-orange-500 transition-colors bg-white shadow-sm"
                                >
                                    <h2 className="font-bold text-lg">{membership.organization.name}</h2>
                                    <p className="text-sm text-zinc-500 mt-2">Role: {membership.role}</p>
                                </Link>
                            ))}
                        </div>
                        <AddOrganizationButton />
                    </div>
                ) : (
                    //If a User doesn't belong to an organization:
                    <div className="max-w-md mx-auto mt-20 p-8 border border-zinc-200 bg-white">
                        <h1 className="text-2xl font-bold tracking-tighter mb-2">Welcome to Open_Room</h1>
                        <p className="text-zinc-600 mb-6">You aren't part of any organizations yet. </p>
                        <p className="text-zinc-600 mb-6">Ask your admin to add you to your organisation or create your own to get started. </p>

                        <form action={createOrganisation} className="flex flex-col gap-4">
                            <input
                                type="text"
                                name="orgName"
                                placeholder="Organization Name (e.g., Company XYZ)"
                                required
                                className="px-4 py-2 border border-zinc-300 focus:outline-none focus:border-orange-500"
                            />
                            <button
                                type="submit"
                                className="cursor-pointer bg-orange-600 text-white font-bold py-2 px-4 hover:bg-orange-700 transition-colors"
                            >
                                Create Organization
                            </button>
                        </form>
                    </div>
                )}
            </main>
        </div>
    )
}