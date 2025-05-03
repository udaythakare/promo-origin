// app/profile/page.js
import Link from 'next/link'
import React from 'react'
import { fetchUserData } from './actions/userActions'
import { getUserId } from '@/helpers/userHelper'
import LocationSection from './components/LocationSection'
import { fetchUserCoupons } from '@/actions/couponActions'
// import CouponsList from './components/CouponsList'
import CouponsList from './components/CouponList'
export default async function Page() {
    const userResult = await fetchUserData()
    const userCouponsResult = await fetchUserCoupons()
    let userId = await getUserId();

    if (userId.msg) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <p className="text-red-600 font-medium">Error: User not logged in</p>
                    <Link href="/api/auth/signin" className="mt-4 inline-block text-blue-600 hover:underline">
                        Login here
                    </Link>
                </div>
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
    const coupons = userCouponsResult.success ? userCouponsResult.coupons : []

    return (
        <div className="min-h-screen bg-blue-50 py-8 px-4">
            {/* User Welcome & Coupons Section */}
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-200 mb-6">
                    <h1 className="text-2xl font-semibold text-blue-700 mb-4">
                        Welcome back, {user.username}!
                    </h1>


                    <div className="mb-2">
                        <h2 className="text-xl font-medium text-blue-600 mb-4">Your Claimed Coupons</h2>
                        <CouponsList coupons={coupons} userId={user.id} />
                    </div>
                </div>

                {/* Location Section */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-200">
                    <h2 className="text-xl font-semibold text-blue-700 mb-4">
                        Delivery Information
                    </h2>
                    <p className="text-gray-600 mb-4">Update your delivery address information below:</p>
                    {/* Location Form Component */}
                    <LocationSection userData={user} />
                </div>
            </div>
        </div>
    )
}