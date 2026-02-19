'use client'
import { Calendar, ShoppingBag, Store, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getUserId } from '@/helpers/userHelper';
import { supabase } from '@/lib/supabase';
import { revalidateMyCouponPage } from '@/actions/revalidateActions';

const RedeemedCoupons = ({ data: initialData, onDataUpdate }) => {
    const [data, setData] = useState(initialData);
    const router = useRouter();
    const { success, coupons } = data || { success: false, coupons: [] };
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        setData(initialData);
    }, [initialData]);

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const id = await getUserId();
                setUserId(id);
            } catch (error) {
                console.error("Failed to get user ID:", error);
            }
        };
        fetchUserId();
    }, []);

    const refreshData = async () => {
        try {
            const response = await fetch('/api/profile/user-redeemed-coupon', {
                credentials: 'include',
            });
            if (response.ok) {
                const newData = await response.json();
                setData(newData);
                if (onDataUpdate) onDataUpdate(newData);
            }
        } catch (error) {
            console.error('Failed to refresh data:', error);
        }
    };

    useEffect(() => {
        if (!userId) return;

        const channel = supabase
            .channel(`redeemed_coupons_changes_${userId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'user_coupons',
                    filter: `user_id=eq.${userId}`
                },
                () => {
                    refreshData();
                    revalidateMyCouponPage();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId]);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return 'Invalid date';
        }
    };

    return (
        <div>
            {/* Section Header */}
            <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h2 className="text-lg sm:text-xl font-black text-black uppercase flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5" />
                    Redeemed Coupons
                </h2>
                <button
                    onClick={refreshData}
                    className="bg-yellow-300 text-black font-black px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all active:scale-95 flex items-center gap-1"
                >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Refresh
                </button>
            </div>

            {/* Coupon Cards */}
            {success && coupons && coupons.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {coupons.map((coupon) => (
                        <div
                            key={coupon.id}
                            className="bg-white border-3 sm:border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0)] p-3 sm:p-4 flex flex-col justify-between"
                        >
                            {/* Business Name */}
                            <div className="flex items-center gap-2 mb-2">
                                <Store className="w-4 h-4 flex-shrink-0" />
                                <span className="font-black text-sm sm:text-base leading-tight truncate">
                                    {coupon.coupons?.businesses?.name || 'Business Name'}
                                </span>
                            </div>

                            {/* Description */}
                            <p className="text-xs sm:text-sm font-bold text-gray-700 mb-2 leading-snug line-clamp-2">
                                {coupon.coupons?.description || 'No description available'}
                            </p>

                            {/* Coupon Title Badge */}
                            <div className="font-black text-sm sm:text-base bg-yellow-300 px-3 py-1.5 border-2 border-black text-center mb-2">
                                {coupon.coupons?.title || 'Coupon'}
                            </div>

                            {/* Date + Status Row */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center text-xs font-semibold text-gray-600">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    {formatDate(coupon.coupons?.end_date)}
                                </div>
                                <span
                                    className={`text-xs font-black px-2 py-0.5 border-2 border-black ${coupon.coupon_status === 'redeemed'
                                            ? 'bg-green-400'
                                            : 'bg-gray-300'
                                        }`}
                                >
                                    {(coupon.coupon_status || 'UNKNOWN').toUpperCase()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-10 px-4 text-center bg-white border-3 sm:border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0)]">
                    <ShoppingBag className="w-10 h-10 mx-auto mb-3 text-gray-400" />
                    <p className="font-black text-base sm:text-lg mb-1">
                        No redeemed coupons yet
                    </p>
                    <p className="font-bold text-xs sm:text-sm text-gray-500">
                        Redeem your claimed coupons at participating stores!
                    </p>
                </div>
            )}

            {/* Browse CTA */}
            <div className="mt-4 sm:mt-6 text-center">
                <button
                    onClick={() => router.push("/coupons")}
                    className="bg-yellow-400 text-black font-black px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base border-3 sm:border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all uppercase"
                >
                    Browse Available Coupons
                </button>
            </div>
        </div>
    );
};

export default RedeemedCoupons;
