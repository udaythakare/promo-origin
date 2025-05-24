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

    // Update local data when prop changes
    useEffect(() => {
        setData(initialData);
    }, [initialData]);

    // Get userId when component mounts
    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const id = await getUserId();
                setUserId(id);
                console.log('User ID fetched:', id);
            } catch (error) {
                console.error("Failed to get user ID:", error);
            }
        };

        fetchUserId();
    }, []);

    // Function to refresh data from API
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
                console.log('Data refreshed successfully');
            }
        } catch (error) {
            console.error('Failed to refresh data:', error);
        }
    };

    // Set up realtime subscription
    useEffect(() => {
        if (!userId) {
            console.log('No userId, skipping subscription setup');
            return;
        }

        console.log('Setting up realtime subscription for redeemed coupons, user:', userId);

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
                (payload) => {
                    console.log('Realtime payload received for redeemed coupons:', payload);

                    // Refresh the entire dataset when any change occurs
                    refreshData();

                    const updatedCoupon = payload.new;

                    // Handle UI updates for any coupon status changes
                    if (payload.eventType === 'UPDATE') {
                        console.log('Coupon updated:', updatedCoupon);
                        revalidateMyCouponPage();
                    }

                    // Handle new coupon additions
                    if (payload.eventType === 'INSERT') {
                        console.log('New coupon added:', updatedCoupon);
                        revalidateMyCouponPage();
                    }
                }
            )
            .subscribe((status) => {
                console.log('Redeemed coupons subscription status:', status);

                if (status === 'SUBSCRIBED') {
                    console.log('Successfully subscribed to redeemed coupons realtime updates');
                } else if (status === 'CHANNEL_ERROR') {
                    console.error('Redeemed coupons channel subscription error');
                } else if (status === 'TIMED_OUT') {
                    console.error('Redeemed coupons channel subscription timed out');
                }
            });

        return () => {
            console.log('Cleaning up redeemed coupons subscription');
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

            // Update scroll position after animation
            setTimeout(() => {
                setScrollPosition(container.scrollLeft);
            }, 300);
        }
    };

    const handleScroll = (e) => {
        setScrollPosition(e.target.scrollLeft);
    };

    return (
        <div className="bg-blue-300 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0)] overflow-hidden max-w-full mx-auto">
            <div className="p-4 border-b-4 border-black bg-blue-400">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-black text-black flex items-center">
                        <ShoppingBag className="h-5 w-5 mr-2" />
                        YOUR REDEEMED COUPONS
                    </h2>
                    <button
                        onClick={refreshData}
                        className="bg-yellow-300 text-black font-black px-3 py-1 border-2 border-black text-sm hover:bg-yellow-400 transition"
                    >
                        Refresh
                    </button>
                </div>
            </div>

            <div className="relative">
                {success && coupons && coupons.length > 0 ? (
                    <>
                        {/* Scroll buttons */}
                        {scrollPosition > 0 && (
                            <button
                                onClick={() => scroll('left')}
                                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-yellow-300 text-black font-black p-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:shadow-none hover:translate-x-1 transition-all"
                            >
                                ←
                            </button>
                        )}

                        {scrollContainerRef.current &&
                            scrollPosition < scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth - 10 && (
                                <button
                                    onClick={() => scroll('right')}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-yellow-300 text-black font-black p-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:shadow-none hover:-translate-x-1 transition-all"
                                >
                                    →
                                </button>
                            )}

                        {/* Horizontal scrolling container */}
                        <div
                            ref={scrollContainerRef}
                            className="flex overflow-x-auto pb-4 scrollbar-hide snap-x"
                            onScroll={handleScroll}
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {coupons.map((coupon) => (
                                <div
                                    key={coupon.id}
                                    className="min-w-[280px] max-w-[320px] p-4 bg-white border-r-4 border-black first:border-l-0 snap-start flex-shrink-0"
                                >
                                    <div className="flex flex-col gap-3">
                                        <div>
                                            <div className="flex items-center mb-1">
                                                <Store className="h-4 w-4 mr-1" />
                                                <span className="font-black text-base">
                                                    {coupon.coupons?.businesses?.name || 'Business Name'}
                                                </span>
                                            </div>
                                            <div className="text-sm font-bold mb-2">
                                                {coupon.coupons?.description || 'No description available'}
                                            </div>
                                            <div className="flex items-center text-xs">
                                                <Calendar className="h-3 w-3 mr-1" />
                                                <span>Valid until {formatDate(coupon.coupons?.end_date)}</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-center">
                                            <div className="font-black text-lg bg-yellow-300 px-3 py-1 border-2 border-black rotate-2 mb-2">
                                                {coupon.coupons?.title || 'Coupon'}
                                            </div>
                                            <div className="flex items-center gap-1 text-xs font-bold">
                                                <span className={`px-2 py-1 border-2 border-black 
                                                ${(coupon.coupon_status === 'claimed') ? 'bg-green-400' :
                                                        (coupon.coupon_status === 'redeemed') ? 'bg-blue-400' : 'bg-red-400'}`}>
                                                    {(coupon.coupon_status || 'UNKNOWN').toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="p-6 text-center bg-white">
                        <p className="font-black text-lg">You haven't redeemed any coupons yet</p>
                        <div className="w-16 h-1 bg-black mx-auto my-3"></div>
                        <p className="font-bold">Redeem your claimed coupons at participating stores!</p>
                    </div>
                )}
            </div>

            <div className="bg-yellow-300 p-4 text-center border-t-4 border-black">
                <button onClick={() => router.push("/coupons")} className="inline-block bg-white text-black font-black px-4 py-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                    BROWSE AVAILABLE COUPONS
                </button>
            </div>
        </div>
    );
}

export default RedeemedCoupons