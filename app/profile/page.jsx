import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import { fetchUserCoupons, fetchUserData } from './actions/userActions'
import { getUserId } from '@/helpers/userHelper'

export default async function Page() {
    // Fetch user data and their coupons
    const userResult = await fetchUserData()
    const couponsResult = await fetchUserCoupons()
    let userId = await getUserId();
    if (userId.msg) {
        return (
            <div>
                Error user not logged in
            </div>
        )
    }
    // If not authenticated, prompt login
    if (!userResult.success) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50">
                <p className="mb-4 text-lg text-blue-700">
                    Please{' '}
                    <Link href="/api/auth/signin" className="underline text-blue-600">
                        login
                    </Link>{' '}
                    to view your coupons.
                </p>
            </div>
        )
    }

    const user = userResult.user
    const coupons = couponsResult.success ? couponsResult.coupons : []
    // console.log(coupons[0].coupons.businesses.primary_location.id)

    return (
        <div className="min-h-screen bg-blue-50 py-8 px-4">
            <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-6 border border-blue-200">
                <h1 className="text-2xl font-semibold text-blue-700 mb-2">
                    Welcome back, {user.username}!
                </h1>
                <p className="text-gray-600 mb-4">Here are your claimed coupons:</p>

                {coupons.length === 0 ? (
                    <p className="text-gray-500">You haven’t claimed any coupons yet.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {coupons.map((uc) => {
                            const c = uc.coupons
                            return (
                                <div
                                    key={uc.id}
                                    className="bg-white rounded-xl shadow p-4 border border-blue-200 overflow-hidden"
                                >
                                    {c.image_url && (
                                        <Image
                                            src={c.image_url}
                                            alt={c.title}
                                            width={400}
                                            height={200}
                                            className="w-full h-32 object-cover rounded-md mb-3"
                                        />
                                    )}
                                    <h2 className="text-lg font-bold text-blue-700 mb-1">{c.title}</h2>
                                    <p className="text-gray-700 text-sm mb-2">
                                        {c.description}
                                    </p>
                                    <p className="text-sm mb-1">
                                        <span className="font-semibold">Code:</span>{' '}
                                        <span className="text-blue-600">{c.code}</span>
                                    </p>
                                    <p className="text-sm mb-1">
                                        <span className="font-semibold">Value:</span>{' '}
                                        {c.discount_value}
                                        {c.discount_type === 'percentage' ? '%' : '$'}
                                    </p>
                                    <p className="text-sm mb-3">
                                        <span className="font-semibold">Status:</span>{' '}
                                        <span
                                            className={`font-medium ${uc.coupon_status === 'claimed'
                                                ? 'text-green-600'
                                                : 'text-gray-600'
                                                }`}
                                        >
                                            {uc.coupon_status}
                                        </span>
                                    </p>

                                    {/* <div>
                                        <RedeemComponent couponId={uc.coupons.id} userId={userId} businessLocationId={uc.coupons.businesses.primary_location.id} userCouponId={uc.id} />
                                    </div> */}
                                </div>
                            )
                        })}
                    </div>
                )}

                <div className="mt-6 text-center">
                    <Link
                        href="/vendor/dashboard"
                        className="inline-block px-5 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700"
                    >
                        Go to Vendor Dashboard
                    </Link>
                </div>
            </div>
        </div>
    )
}