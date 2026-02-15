'use client';
import { useState, useRef, useEffect } from 'react';
import { ShoppingBag, Store, Calendar } from 'lucide-react';
import { getUserId } from '@/helpers/userHelper';
import QRModal from '../../components/QRModal';
import { supabase } from '@/lib/supabase';
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
            const response = await fetch('/api/profile/user-claimed-coupon', {
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

                    refreshData();

                    const updatedCoupon = payload.new;

                    if (
                        payload.eventType === 'UPDATE' &&
                        updatedCoupon?.coupon_status === 'redeemed'
                    ) {
                        if (
                            isQROpen &&
                            selectedCoupon &&
                            selectedCoupon.id === updatedCoupon.id
                        ) {
                            setShowConfirmation(true);

                            setTimeout(() => {
                                setIsQROpen(false);
                                setShowConfirmation(false);
                                setSelectedCoupon(null);
                            }, 3000);
                        }

                        revalidateMyCouponPage();
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId, isQROpen, selectedCoupon]);

    useEffect(() => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            setCanScrollLeft(container.scrollLeft > 0);
            setCanScrollRight(
                container.scrollLeft <
                container.scrollWidth - container.clientWidth - 10
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
        } catch {
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
        setIsQROpen(true);
        setSelectedCoupon(coupon);
        setShowConfirmation(false);
    };

    const closeQRModal = () => {
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
        <div className="bg-blue-300 border-4 border-black shadow-xl overflow-hidden w-full">

            {/* HEADER */}
            <div className="px-4 sm:px-6 py-4 border-b-4 border-black bg-blue-400">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <h2 className="text-lg sm:text-xl font-black text-black flex items-center">
                        <ShoppingBag className="h-5 w-5 mr-2" />
                        YOUR CLAIMED COUPONS
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
                                    key={coupon.id || `coupon-${Math.random()}`}
                                    className="min-w-[260px] sm:min-w-[280px] max-w-[320px] p-4 bg-white border-4 border-black snap-start flex-shrink-0 hover:bg-yellow-100 transition"
                                >
                                    <div className="flex flex-col justify-between h-full gap-4">

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
                                            <div className="font-black text-lg bg-yellow-300 px-4 py-2 border-2 border-black mb-3 w-full">
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

                                        <div className="pt-3 border-t-2 border-dashed border-gray-300 flex justify-center">
                                            <button
                                                className="bg-black text-white text-sm font-black px-6 py-2 hover:bg-gray-800 transition disabled:opacity-50 active:scale-95"
                                                onClick={() => showQrCode(coupon)}
                                                disabled={coupon.coupon_status === 'redeemed'}
                                            >
                                                {coupon.coupon_status === 'redeemed' ? 'USED' : 'SHOW QR'}
                                            </button>
                                        </div>

                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="py-12 px-4 text-center bg-white border-4 border-black">
                        <p className="font-black text-lg mb-2">
                            You haven't claimed any coupons yet
                        </p>
                        <div className="w-20 h-1 bg-black mx-auto my-4"></div>
                        <p className="font-bold text-sm">
                            Find deals in your area now!
                        </p>
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
