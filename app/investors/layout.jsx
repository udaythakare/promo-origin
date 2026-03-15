import Sidebar from "./components/Sidebar";
import { getUserId } from "@/helpers/userHelper";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { redirect } from "next/navigation";

export default async function InvestorLayout({ children }) {
    const userId = await getUserId();

    if (!userId || userId?.msg) redirect('/auth/signin')

    // Check investor profile status
    const { data: investor } = await supabaseAdmin
        .from('investor_profiles')
        .select('is_verified, rejection_reason')
        .eq('user_id', userId)
        .single()

    // Has profile but not verified
    if (investor && !investor.is_verified) {
        if (investor.rejection_reason) redirect('/investor-status/rejected')
redirect('/investor-status/pending')
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
                <div className="px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8 pb-24 lg:pb-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}