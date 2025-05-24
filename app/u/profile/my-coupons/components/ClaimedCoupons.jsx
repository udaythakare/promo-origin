'use client';
import { useState, useRef, useEffect } from 'react';
import { ShoppingBag, Store, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { getUserId } from '@/helpers/userHelper';
import QRModal from '../../components/QRModal';
import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { revalidateMyCouponPage } from '@/actions/revalidateActions';

export default function ClaimedCoupons({ data: initialData, onDataUpdate }) {
    const [data, setData] = useState(initialData);
    const { success, coupons } = data || { success: false, coupons: [] };

    const scrollContainerRef = useRef(null);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [isQROpen, setIsQROpen] = useState(false);
    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [userId, setUserId] = useState(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

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
            const response = await fetch('/api/profile/user-claimed-coupon', {
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

        console.log('Setting up realtime subscription for user:', userId);

        const channel = supabase
            .channel(`user_coupons_changes_${userId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'user_coupons',
                    filter: `user_id=eq.${userId}`
                },
                (payload) => {
                    console.log('Realtime payload received:', payload);

                    // Refresh the entire dataset when any change occurs
                    refreshData();

                    const updatedCoupon = payload.new;

                    // Handle UI updates for redeemed coupons
                    if (payload.eventType === 'UPDATE' && updatedCoupon?.coupon_status === 'redeemed') {
                        console.log('Coupon redeemed:', updatedCoupon);

                        // Check if this is the currently selected coupon in QR modal
                        if (isQROpen && selectedCoupon && selectedCoupon.id === updatedCoupon.id) {
                            console.log('Setting confirmation for currently open QR modal');
                            setShowConfirmation(true);

                            revalidateMyCouponPage();
                            // Auto-close modal after animation
                            setTimeout(() => {
                                setIsQROpen(false);
                                setShowConfirmation(false);
                                setSelectedCoupon(null);
                            }, 3000);
                        }
                    }
                }
            )
            .subscribe((status) => {
                console.log('Subscription status:', status);

                if (status === 'SUBSCRIBED') {
                    console.log('Successfully subscribed to realtime updates');
                } else if (status === 'CHANNEL_ERROR') {
                    console.error('Channel subscription error');
                } else if (status === 'TIMED_OUT') {
                    console.error('Channel subscription timed out');
                }
            });

        return () => {
            console.log('Cleaning up subscription');
            supabase.removeChannel(channel);
        };
    }, [userId, isQROpen, selectedCoupon]);

    // Check scroll possibilities when container ref is available or scroll position changes
    useEffect(() => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            setCanScrollLeft(container.scrollLeft > 0);
            setCanScrollRight(
                container.scrollLeft < container.scrollWidth - container.clientWidth - 10
            );
        }
    }, [scrollPosition]);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';

        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            console.error("Invalid date format:", error);
            return 'Invalid date';
        }
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

    const showQrCode = (coupon) => {
        console.log('Opening QR modal for coupon:', coupon.id);
        setIsQROpen(true);
        setSelectedCoupon(coupon);
        setShowConfirmation(false);
    };

    const closeQRModal = () => {
        console.log('Closing QR modal');
        setIsQROpen(false);
        setShowConfirmation(false);
        setSelectedCoupon(null);
    };

    const getQrValue = () => {
        if (!selectedCoupon || !userId) return '';
        return JSON.stringify({
            userId: userId,
            couponId: selectedCoupon.coupon_id
        });
    };

    return (
        <div className="bg-blue-300 border-4 border-black shadow-lg overflow-hidden max-w-full mx-auto">
            <div className="p-4 border-b-4 border-black bg-blue-400">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-black text-black flex items-center">
                        <ShoppingBag className="h-5 w-5 mr-2" />
                        YOUR CLAIMED COUPONS
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
                        {canScrollLeft && (
                            <button
                                onClick={() => scroll('left')}
                                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-yellow-300 text-black font-black p-2 border-2 border-black shadow-md hover:shadow-none transition-all"
                            >
                                ←
                            </button>
                        )}

                        {canScrollRight && (
                            <button
                                onClick={() => scroll('right')}
                                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-yellow-300 text-black font-black p-2 border-2 border-black shadow-md hover:shadow-none transition-all"
                            >
                                →
                            </button>
                        )}

                        <div
                            ref={scrollContainerRef}
                            className="flex overflow-x-auto pb-4 snap-x"
                            onScroll={handleScroll}
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {coupons.map((coupon) => (
                                <div
                                    key={coupon.id || `coupon-${Math.random()}`}
                                    className="min-w-[280px] max-w-[320px] p-4 bg-white border-r-4 border-black first:border-l-0 snap-start flex-shrink-0 hover:bg-yellow-100 transition"
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
                                            <div className="font-black text-lg bg-yellow-300 px-3 py-1 border-2 border-black mb-2">
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

                                        <div className="mt-2 pt-2 border-t-2 border-dashed border-gray-300 flex justify-between items-center">
                                            <button
                                                className="bg-black text-white text-sm font-bold px-3 py-1 hover:bg-gray-800 transition disabled:opacity-50"
                                                onClick={() => showQrCode(coupon)}
                                                disabled={coupon.coupon_status === 'redeemed'}
                                            >
                                                {coupon.coupon_status === 'redeemed' ? 'USED' : 'QR'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="p-6 text-center bg-white">
                        <p className="font-black text-lg">You haven't claimed any coupons yet</p>
                        <div className="w-16 h-1 bg-black mx-auto my-3"></div>
                        <p className="font-bold">Find deals in your area now!</p>
                    </div>
                )}
            </div>

            {isQROpen && selectedCoupon && (
                <QRModal
                    isOpen={isQROpen}
                    onClose={closeQRModal}
                    qrValue={getQrValue()}
                    couponTitle={selectedCoupon.coupons?.title || 'Coupon'}
                    showConfirmation={showConfirmation}
                />
            )}
        </div>
    );
}