// app/profile/page.js
import Link from 'next/link'
import React from 'react'
import { getUser, getUserRolesFromDB } from '@/helpers/userHelper'
import LocationSection from './components/LocationSection'
import { ChevronRight, IdCard, MapPin, Settings, User } from 'lucide-react'
import LogoutButton from './components/LogoutButton'
import PersonalInfoSection from './components/PersonalInfoSection'

export default async function Page() {
    const user = await getUser();
    const userRoles = await getUserRolesFromDB(user.id);

    if (user.msg) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-100">
                <div className="bg-white p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0)]">
                    <p className="text-red-600 font-black">Error: User not logged in</p>
                    <Link href="/login"
                        className="mt-4 inline-block bg-blue-400 text-black font-bold px-4 py-2 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                        LOGIN HERE
                    </Link>
                </div>
            </div>
        )
    }


    return (
        <div className="min-h-screen py-6">
            <div className="max-w-5xl mx-auto px-3">
                {/* Header with user info */}
                <div className="bg-gray-100 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0)] p-4 mb-6">
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
                            <LogoutButton />
                        </div>
                    </div>
                </div>

                {/* Main content grid */}
                <div className="grid grid-cols-1 gap-6">
                    {/* Business owner section */}
                    {userRoles.includes('app_business_owner') && (
                        <div className="bg-yellow-500 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0)] p-5">
                            <h2 className="font-black text-xl mb-2 uppercase">Business Dashboard</h2>
                            <p className="mb-4 text-sm font-bold">Manage your business listings, promotions and analytics</p>
                            <Link href="/business/dashboard"
                                className="flex items-center justify-between bg-white text-black font-black px-4 py-3 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                                MANAGE YOUR BUSINESS
                                <ChevronRight className="h-5 w-5" />
                            </Link>
                        </div>
                    )}

                    <div className="bg-green-400 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0)] overflow-hidden">
                        <div className="p-4 border-b-4 border-black bg-green-300">
                            <h2 className="text-xl font-black text-black flex items-center">
                                <IdCard className="h-5 w-5 mr-2" />
                                PERSONAL INFO
                            </h2>
                        </div>

                        <div className=" bg-white border-b-4 border-black">
                            <PersonalInfoSection userData={user} />
                        </div>

                    </div>

                    {/* Delivery info section */}
                    <div className="bg-green-400 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0)] overflow-hidden">
                        <div className="p-4 border-b-4 border-black bg-green-300">
                            <h2 className="text-xl font-black text-black flex items-center">
                                <MapPin className="h-5 w-5 mr-2" />
                                YOUR LOCATION
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

                </div>
            </div>
        </div >
    );
}