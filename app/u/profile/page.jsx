// app/profile/page.js
import Link from 'next/link'
import React from 'react'
import { fetchUserData } from './actions/userActions'
import { getSessionData, getUserId } from '@/helpers/userHelper'
import LocationSection from './components/LocationSection'
import { fetchUserCoupons } from '@/actions/couponActions'
// import CouponsList from './components/CouponsList'
import CouponsList from './components/CouponList'
import { ChevronRight, LogOut, MapPin, Settings, ShoppingBag, User } from 'lucide-react'
export default async function Page() {
    const userResult = await fetchUserData()
    const userCouponsResult = await fetchUserCoupons()
    let userId = await getUserId();
    let userSessionData = await getSessionData();

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
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            <div className="max-w-5xl mx-auto px-3 py-4 sm:px-6 sm:py-6">
                {/* Header with user info - Improved mobile layout */}
                <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-3 sm:p-4 mb-4 sm:mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center space-x-3 mb-3 sm:mb-0">
                            <div className="bg-blue-100 rounded-full p-2">
                                <User className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-lg sm:text-xl font-semibold text-gray-800">{user.username}</h1>
                                <p className="text-xs sm:text-sm text-gray-500">{user.email}</p>
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <button className="text-xs sm:text-sm bg-blue-50 hover:bg-blue-100 text-blue-600 px-2 py-1 sm:px-3 sm:py-1 rounded-md transition flex items-center">
                                <Settings className="h-4 w-4 inline" />
                                <span className="ml-1 hidden xs:inline">Settings</span>
                            </button>
                            <button className="text-xs sm:text-sm bg-red-50 hover:bg-red-100 text-red-600 px-2 py-1 sm:px-3 sm:py-1 rounded-md transition flex items-center">
                                <LogOut className="h-4 w-4 inline" />
                                <span className="ml-1 hidden xs:inline">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main content grid - Adjusted for mobile */}
                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                    {/* Business owner section */}
                    {userSessionData.roles.includes('app_business_owner') && (
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-md p-4 sm:p-5 text-white">
                            <h2 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">Business Dashboard</h2>
                            <p className="text-blue-100 mb-3 sm:mb-4 text-xs sm:text-sm">Manage your business listings, promotions and analytics</p>
                            <Link href="/vendor/dashboard"
                                className="flex items-center justify-between bg-white text-blue-700 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-sm sm:font-medium hover:bg-blue-50 transition shadow-sm">
                                Manage your business
                                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                            </Link>
                        </div>
                    )}

                    {/* Delivery info section - Moved up for mobile */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-green-50 to-white p-3 sm:p-5 border-b border-green-100">
                            <h2 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center">
                                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 text-green-600" />
                                Delivery Address
                            </h2>
                        </div>

                        <div className="p-3 sm:p-5">
                            <LocationSection userData={user} />
                        </div>

                        <div className="bg-gray-50 p-3 sm:p-4 text-xs sm:text-sm text-gray-500">
                            <p className="flex items-start">
                                <span className="text-green-500 mr-2 text-sm">✓</span>
                                <span>Your address is used to show you relevant deals and delivery options in your area.</span>
                            </p>
                        </div>
                    </div>

                    {/* Coupons section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-50 to-white p-3 sm:p-5 border-b border-blue-100">
                            <h2 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center">
                                <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 text-blue-600" />
                                Your Claimed Coupons
                            </h2>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {coupons.length > 0 ? (
                                coupons.map(coupon => (
                                    <div key={coupon.id} className={`p-3 sm:p-4 hover:bg-gray-50 transition ${coupon.status === 'expired' ? 'opacity-60' : ''}`}>
                                        <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center">
                                            <div className="mb-1 xs:mb-0">
                                                <span className="font-medium text-gray-800 text-sm sm:text-base">{coupon.business}</span>
                                                <div className="text-xs sm:text-sm text-gray-500">Code: {coupon.code}</div>
                                            </div>
                                            <div className="xs:text-right">
                                                <div className="font-bold text-blue-600 text-sm sm:text-base">{coupon.discount}</div>
                                                <div className="text-xs text-gray-500">
                                                    {coupon.status === 'active' ? (
                                                        <>Valid until {new Date(coupon.validUntil).toLocaleDateString()}</>
                                                    ) : (
                                                        <span className="text-red-500">Expired</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-4 sm:p-6 text-center text-gray-500 text-sm">
                                    You haven't claimed any coupons yet
                                </div>
                            )}
                        </div>

                        <div className="bg-gray-50 p-2 sm:p-3 text-center">
                            <Link href="/coupons" className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm font-medium">
                                Browse available coupons
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}