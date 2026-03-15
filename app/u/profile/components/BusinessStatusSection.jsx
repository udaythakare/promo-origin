import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { ChevronRight } from 'lucide-react'

export default async function BusinessStatusSection({ userId }) {
    const { data: business } = await supabaseAdmin
        .from('businesses')
        .select('id, name, status, rejection_reason')
        .eq('user_id', userId)
        .single()

    if (!business) return null

    // Approved — show dashboard link
    if (business.status === 'approved') {
        return (
            <div className="bg-yellow-500 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0)] p-5">
                <h2 className="font-black text-xl mb-2 uppercase">Business Dashboard</h2>
                <p className="mb-4 text-sm font-bold">
                    Manage your business listings, promotions and analytics
                </p>
                <Link
                    href="/business/dashboard"
                    className="flex items-center justify-between bg-white text-black font-black px-4 py-3 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                >
                    MANAGE YOUR BUSINESS
                    <ChevronRight className="h-5 w-5" />
                </Link>
            </div>
        )
    }

    // Pending — show waiting message
    if (business.status === 'pending') {
        return (
            <div className="bg-yellow-100 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0)] p-5">
                <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">⏳</span>
                    <h2 className="font-black text-xl uppercase">Application Under Review</h2>
                </div>
                <p className="text-sm font-bold mb-1">
                    Business: <span className="text-gray-700">{business.name}</span>
                </p>
                <p className="text-sm text-gray-600 mb-4">
                    Your business application is being reviewed by our admin team.
                    You will receive an email notification once a decision is made.
                </p>
                <Link
                    href="/business/pending"
                    className="flex items-center justify-between bg-white text-black font-black px-4 py-3 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                >
                    VIEW APPLICATION STATUS
                    <ChevronRight className="h-5 w-5" />
                </Link>
            </div>
        )
    }

    // Rejected — show rejection info
    if (business.status === 'rejected') {
        return (
            <div className="bg-red-100 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0)] p-5">
                <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">❌</span>
                    <h2 className="font-black text-xl uppercase">Application Rejected</h2>
                </div>
                <p className="text-sm font-bold mb-1">
                    Business: <span className="text-gray-700">{business.name}</span>
                </p>
                {business.rejection_reason && (
                    <p className="text-sm text-red-700 mb-4 bg-red-200 border-2 border-red-400 p-2">
                        Reason: {business.rejection_reason}
                    </p>
                )}
                <Link
                    href="/u/profile/apply-for-business"
                    className="flex items-center justify-between bg-white text-black font-black px-4 py-3 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                >
                    REAPPLY NOW
                    <ChevronRight className="h-5 w-5" />
                </Link>
            </div>
        )
    }

    return null
}