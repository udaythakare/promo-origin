'use client';
import { useState } from 'react';
import { ShoppingBag, Store, Calendar, Percent, CheckCircle, AlertCircle } from 'lucide-react';

export default function ClaimedCoupons({ data }) {
    // Assuming data is passed as a prop
    const { success, coupons } = data || { success: false, coupons: [] };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="bg-blue-300 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0)] overflow-hidden max-w-md mx-auto">
            <div className="p-4 border-b-4 border-black bg-blue-400">
                <h2 className="text-xl font-black text-black flex items-center">
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    YOUR CLAIMED COUPONS
                </h2>
            </div>

            <div className="divide-y-4 divide-black">
                {success && coupons.length > 0 ? (
                    coupons.map((coupon) => (
                        <div key={coupon.id} className="p-4 bg-white hover:bg-yellow-100 transition">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                                <div className="flex-1">
                                    <div className="flex items-center mb-1">
                                        <Store className="h-4 w-4 mr-1" />
                                        <span className="font-black text-base">{coupon.coupons.businesses.name}</span>
                                    </div>
                                    <div className="text-sm font-bold mb-2">{coupon.coupons.description}</div>
                                    <div className="flex items-center text-xs">
                                        <Calendar className="h-3 w-3 mr-1" />
                                        <span>Valid until {formatDate(coupon.coupons.end_date)}</span>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center">
                                    <div className="font-black text-lg bg-yellow-300 px-3 py-1 border-2 border-black rotate-2 mb-2">
                                        {coupon.coupons.title}
                                    </div>
                                    <div className="flex items-center gap-1 text-xs font-bold">
                                        <span className={`px-2 py-1 border-2 border-black 
                      ${coupon.coupon_status === 'claimed' ? 'bg-green-400' : 'bg-red-400'}`}>
                                            {coupon.coupon_status.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-3 pt-2 border-t-2 border-dashed border-gray-300 flex justify-between items-center">
                                <div className="text-xs">
                                    <span className="font-bold">{coupon.coupons.current_claims}/{coupon.coupons.max_claims}</span> claimed
                                </div>
                                <button className="bg-black text-white text-sm font-bold px-3 py-1 hover:bg-gray-800 transition">
                                    USE COUPON
                                </button>
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
                <button className="inline-block bg-white text-black font-black px-4 py-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                    BROWSE AVAILABLE COUPONS
                </button>
            </div>
        </div>
    );
}