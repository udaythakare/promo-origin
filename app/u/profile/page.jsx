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
            <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-100">
                <div className="bg-white p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0)]">
                    <p className="text-red-600 font-black">Error: User not logged in</p>
                    <Link href="/api/auth/signin" 
                        className="mt-4 inline-block bg-blue-400 text-black font-bold px-4 py-2 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                        LOGIN HERE
                    </Link>
                </div>
            </div>
        )
    }

    // If not authenticated, prompt login
    if (!userResult.success) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-100">
                <div className="bg-white p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0)]">
                    <p className="mb-4 text-lg font-bold text-black">
                        Please login to view your coupons.
                    </p>
                    <Link href="/api/auth/signin" 
                        className="inline-block bg-blue-400 text-black font-bold px-4 py-2 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                        LOGIN HERE
                    </Link>
                </div>
            </div>
        )
    }

    const user = userResult.user
    const coupons = userCouponsResult.success ? userCouponsResult.coupons : []

    return (
        <div className="min-h-screen py-6">
            <div className="max-w-5xl mx-auto px-3">
                {/* Header with user info */}
                <div className="bg-blue-400 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0)] p-4 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center space-x-3 mb-3 sm:mb-0">
                            <div className="bg-white rounded-full p-2 border-3 border-black">
                                <User className="h-6 w-6 text-black" />
                            </div>
                            <div>
                                <h1 className="text-xl font-black text-black">{user.username}</h1>
                                <p className="text-sm font-bold">{user.email}</p>
                            </div>
                        </div>
                        <div className="flex space-x-3">
                            <button className="bg-white text-black font-bold px-3 py-2 border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center">
                                <Settings className="h-5 w-5 mr-1" />
                                <span className="hidden xs:inline">SETTINGS</span>
                            </button>
                            <button className="bg-red-400 text-black font-bold px-3 py-2 border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center">
                                <LogOut className="h-5 w-5 mr-1" />
                                <span className="hidden xs:inline">LOGOUT</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main content grid */}
                <div className="grid grid-cols-1 gap-6">
                    {/* Business owner section */}
                    {userSessionData.roles.includes('app_business_owner') && (
                        <div className="bg-yellow-500 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0)] p-5">
                            <h2 className="font-black text-xl mb-2 uppercase">Business Dashboard</h2>
                            <p className="mb-4 text-sm font-bold">Manage your business listings, promotions and analytics</p>
                            <Link href="/vendor/dashboard"
                                className="flex items-center justify-between bg-white text-black font-black px-4 py-3 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                                MANAGE YOUR BUSINESS
                                <ChevronRight className="h-5 w-5" />
                            </Link>
                        </div>
                    )}

                    {/* Delivery info section */}
                    <div className="bg-green-400 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0)] overflow-hidden">
                        <div className="p-4 border-b-4 border-black bg-green-300">
                            <h2 className="text-xl font-black text-black flex items-center">
                                <MapPin className="h-5 w-5 mr-2" />
                                DELIVERY ADDRESS
                            </h2>
                        </div>

                        <div className=" bg-white border-b-4 border-black">
                            <LocationSection userData={user} />
                        </div>

                        <div className="bg-green-200 p-4 text-sm">
                            <p className="flex items-start font-bold">
                                <span className="text-black mr-2 text-lg font-black">✓</span>
                                <span>Your address is used to show you relevant deals and delivery options in your area.</span>
                            </p>
                        </div>
                    </div>

                    {/* Coupons section */}
                    <div className="bg-blue-300 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0)] overflow-hidden mb-20">
                        <div className="p-4 border-b-4 border-black bg-blue-400">
                            <h2 className="text-xl font-black text-black flex items-center">
                                <ShoppingBag className="h-5 w-5 mr-2" />
                                YOUR CLAIMED COUPONS
                            </h2>
                        </div>

                        <div className="divide-y-4 divide-black">
                            {coupons.length > 0 ? (
                                coupons.map(coupon => (
                                    <div key={coupon.id} className={`p-4 bg-white hover:bg-yellow-100 transition ${coupon.status === 'expired' ? 'opacity-60' : ''}`}>
                                        <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center">
                                            <div className="mb-2 xs:mb-0">
                                                <span className="font-black text-base">{coupon.business}</span>
                                                <div className="text-sm font-bold">Code: <span className="bg-black text-white px-2">{coupon.code}</span></div>
                                            </div>
                                            <div className="xs:text-right">
                                                <div className="font-black text-lg bg-yellow-300 inline-block px-2 border-2 border-black">{coupon.discount}</div>
                                                <div className="text-sm font-bold mt-1">
                                                    {coupon.status === 'active' ? (
                                                        <>Valid until {new Date(coupon.validUntil).toLocaleDateString()}</>
                                                    ) : (
                                                        <span className="bg-red-400 text-black px-2 py-1 border-2 border-black">EXPIRED</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-6 text-center bg-white">
                                    <p className="font-black text-lg">You haven't claimed any coupons yet</p>
                                    <div className="w-16 h-1 bg-black mx-auto my-3"></div>
                                    <p className="font-bold">Find deals in your area now!</p>
                                </div>
                            )}
                        </div>

                        <div className="bg-yellow-300 p-4 text-center border-t-4 border-black">
                            <Link href="/coupons" 
                                className="inline-block bg-white text-black font-black px-4 py-2 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                                BROWSE AVAILABLE COUPONS
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}