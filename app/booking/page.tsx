import { UserButton } from "@clerk/nextjs";

export default function Booking() {
    return (
        <div className="min-h-screen bg-white p-8">
            <nav className="flex justify-between items-center mb-12">
                <h1 className="font-bold text-xl tracking-tighter">Open_Room / Dashboard</h1>
                <UserButton />
            </nav>

            <div className="border-2 border-dashed border-zinc-200 rounded-xl h-[60vh] flex items-center justify-center text-zinc-400 font-mono text-sm">
        // 8x5 grid coming soon
            </div>
        </div>
    );
}