import React from 'react'
import { cookies } from 'next/headers'
import { Ticket } from 'lucide-react'
import ClaimedCoupons from './components/ClaimedCoupons'
import RedeemedCoupons from './components/RedeemedCoupons'

const page = async () => {
    const cookieHeader = (await cookies()).toString()

    const [claimedRes, redeemedRes] = await Promise.all([
        fetch(
            `${process.env.NEXT_PUBLIC_SITE_URL}/api/profile/user-claimed-coupon`,
            {
                cache: 'force-cache',
                next: { revalidate: 3600 },
                headers: { cookie: cookieHeader },
                credentials: "include",
            }
        ),
        fetch(
            `${process.env.NEXT_PUBLIC_SITE_URL}/api/profile/user-redeemed-coupon`,
            {
                cache: 'force-cache',
                next: { revalidate: 3600 },
                headers: { cookie: cookieHeader },
                credentials: "include"
            },
        ),
    ])

    const claimedJson = await claimedRes.json()
    const redeemedJson = await redeemedRes.json()

    return (
        <div className="min-h-screen pb-24 md:pb-8">

            {/* ================= HEADER ================= */}
            <div className="bg-yellow-400 border-b-4 border-black px-3 sm:px-6 py-4 sm:py-6">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-black uppercase flex items-center gap-2">
                        <Ticket className="w-6 h-6 sm:w-7 sm:h-7" />
                        My Coupons
                    </h1>
                    <p className="mt-1 text-sm font-bold text-black/70">
                        Your claimed and redeemed coupons in one place.
                    </p>
                </div>
            </div>

            {/* ================= COUPONS ================= */}
            <div className="max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-6 sm:space-y-8">

                {/* Claimed */}
                <ClaimedCoupons data={claimedJson} />

                {/* Redeemed */}
                <RedeemedCoupons data={redeemedJson} />

            </div>
        </div>
    )
}

export default page
