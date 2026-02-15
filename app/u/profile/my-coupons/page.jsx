// app/profile/page.jsx
import React from 'react'
import { cookies } from 'next/headers'
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
        <div className="min-h-screen bg-slate-50">

           {/* ================= HERO HEADER ================= */}
<div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
            My Profile Dashboard
        </h1>
        <p className="mt-2 text-indigo-100 text-sm sm:text-base max-w-xl">
            Manage your claimed and redeemed coupons in one place.
        </p>
    </div>
</div>


            {/* ================= MAIN CONTENT ================= */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-12">

                {/* Claimed Coupons Section */}
                <section className="bg-white rounded-2xl shadow-lg border border-slate-100 p-5 sm:p-6 md:p-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                        <h2 className="text-xl sm:text-2xl font-semibold text-indigo-700">
                            Claimed Coupons
                        </h2>
                        <div className="w-16 h-1 bg-indigo-600 rounded hidden sm:block"></div>
                    </div>

                    <ClaimedCoupons data={claimedJson} />
                </section>

                {/* Redeemed Coupons Section */}
                <section className="bg-white rounded-2xl shadow-lg border border-slate-100 p-5 sm:p-6 md:p-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                        <h2 className="text-xl sm:text-2xl font-semibold text-emerald-600">
                            Redeemed Coupons
                        </h2>
                        <div className="w-16 h-1 bg-emerald-600 rounded hidden sm:block"></div>
                    </div>

                    <RedeemedCoupons data={redeemedJson} />
                </section>

            </div>

        </div>
    )
}

export default page
