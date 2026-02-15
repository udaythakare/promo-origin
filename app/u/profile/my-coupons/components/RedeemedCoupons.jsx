'use client'
import { Calendar, ShoppingBag, Store } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { getUserId } from '@/helpers/userHelper';
import { supabase } from '@/lib/supabase';
import { revalidateMyCouponPage } from '@/actions/revalidateActions';

const RedeemedCoupons = ({ data: initialData, onDataUpdate }) => {

    const [data, setData] = useState(initialData);
    const router = useRouter();
    const { success, coupons } = data || { success: false, coupons: [] };

    const scrollContainerRef = useRef(null);
    const [scrollPosition, setScrollPosition] = useState(0);
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
                if (onDataUpdate) {
                    onDataUpdate(newData);
                }
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
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const scrollAmount = direction === 'left' ? -300 : 300;
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });

            setTimeout(() => {
                setScrollPosition(container.scrollLeft);
            }, 300);
        }
    };

    const handleScroll = (e) => {
        setScrollPosition(e.target.scrollLeft);
    };

    const canScrollLeft = scrollPosition > 0;

    const canScrollRight =
        scrollContainerRef.current &&
        scrollPosition <
        scrollContainerRef.current.scrollWidth -
        scrollContainerRef.current.clientWidth - 10;

    return (
        <div className="bg-blue-300 border-4 border-black shadow-xl overflow-hidden w-full">

            {/* HEADER */}
            <div className="px-4 sm:px-6 py-4 border-b-4 border-black bg-blue-400">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <h2 className="text-lg sm:text-xl font-black text-black flex items-center">
                        <ShoppingBag className="h-5 w-5 mr-2" />
                        YOUR REDEEMED COUPONS
                    </h2>

                    <button
                        onClick={refreshData}
                        className="bg-yellow-300 text-black font-black px-4 py-2 border-2 border-black text-sm hover:bg-yellow-400 transition active:scale-95"
                    >
                        Refresh
                    </button>
                </div>
            </div>

            {/* CONTENT */}
            <div className="relative px-4 sm:px-6 py-6">

                {success && coupons && coupons.length > 0 ? (
                    <>
                        {canScrollLeft && (
                            <button
                                onClick={() => scroll('left')}
                                className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-yellow-300 text-black font-black p-3 border-2 border-black shadow-md hover:shadow-none transition-all"
                            >
                                ←
                            </button>
                        )}

                        {canScrollRight && (
                            <button
                                onClick={() => scroll('right')}
                                className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-yellow-300 text-black font-black p-3 border-2 border-black shadow-md hover:shadow-none transition-all"
                            >
                                →
                            </button>
                        )}

                        <div
                            ref={scrollContainerRef}
                            className="flex gap-4 overflow-x-auto pb-4 snap-x scroll-smooth"
                            onScroll={handleScroll}
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {coupons.map((coupon) => (
                                <div
                                    key={coupon.id}
                                    className="min-w-[260px] sm:min-w-[280px] max-w-[320px] p-4 bg-white border-4 border-black snap-start flex-shrink-0"
                                >
                                    <div className="flex flex-col gap-4 h-full">

                                        <div>
                                            <div className="flex items-center mb-2">
                                                <Store className="h-4 w-4 mr-2" />
                                                <span className="font-black text-base leading-tight">
                                                    {coupon.coupons?.businesses?.name || 'Business Name'}
                                                </span>
                                            </div>

                                            <p className="text-sm font-bold mb-3 leading-snug">
                                                {coupon.coupons?.description || 'No description available'}
                                            </p>

                                            <div className="flex items-center text-xs font-semibold">
                                                <Calendar className="h-3 w-3 mr-1" />
                                                Valid until {formatDate(coupon.coupons?.end_date)}
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-center text-center">
                                            <div className="font-black text-lg bg-yellow-300 px-4 py-2 border-2 border-black rotate-2 mb-2 w-full">
                                                {coupon.coupons?.title || 'Coupon'}
                                            </div>

                                            <span
                                                className={`text-xs font-black px-3 py-1 border-2 border-black
                                                ${
                                                    coupon.coupon_status === 'claimed'
                                                        ? 'bg-green-400'
                                                        : coupon.coupon_status === 'redeemed'
                                                        ? 'bg-blue-400'
                                                        : 'bg-red-400'
                                                }`}
                                            >
                                                {(coupon.coupon_status || 'UNKNOWN').toUpperCase()}
                                            </span>
                                        </div>

                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="py-12 px-4 text-center bg-white border-4 border-black">
                        <p className="font-black text-lg mb-2">
                            You haven't redeemed any coupons yet
                        </p>
                        <div className="w-20 h-1 bg-black mx-auto my-4"></div>
                        <p className="font-bold text-sm">
                            Redeem your claimed coupons at participating stores!
                        </p>
                    </div>
                )}
            </div>

            {/* FOOTER CTA */}
            <div className="bg-yellow-300 px-4 sm:px-6 py-6 text-center border-t-4 border-black">
                <button
                    onClick={() => router.push("/coupons")}
                    className="inline-block bg-white text-black font-black px-6 py-3 border-2 border-black shadow-md hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                >
                    BROWSE AVAILABLE COUPONS
                </button>
            </div>

        </div>
    );
};

export default RedeemedCoupons;
