'use client';
import { useState, useRef, useEffect } from 'react';
import { ShoppingBag, Store, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { getUserId } from '@/helpers/userHelper';
import QRModal from '../../components/QRModal';



export default function ClaimedCoupons({ data }) {
    // Assuming data is passed as a prop
    const { success, coupons } = data || { success: false, coupons: [] };
    const scrollContainerRef = useRef(null);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [isQROpen, setIsQROpen] = useState(false);
    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [userId, setUserId] = useState(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    // Get userId when component mounts
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

            // Update scroll position after animation
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
    };

    // Generate QR code value
    const getQrValue = () => {
        if (!selectedCoupon || !userId) return '';
        return JSON.stringify({
            userId: userId,
            couponId: selectedCoupon.id
        });
    };

    return (
        <div className="bg-blue-300 border-4 border-black shadow-lg overflow-hidden max-w-full mx-auto">
            <div className="p-4 border-b-4 border-black bg-blue-400">
                <h2 className="text-xl font-black text-black flex items-center">
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    YOUR CLAIMED COUPONS
                </h2>
            </div>

            <div className="relative">
                {success && coupons && coupons.length > 0 ? (
                    <>
                        {/* Scroll buttons */}
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

                        {/* Horizontal scrolling container */}
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
                                                ${(coupon.coupon_status === 'claimed') ? 'bg-green-400' : 'bg-red-400'}`}>
                                                    {(coupon.coupon_status || 'UNKNOWN').toUpperCase()}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-2 pt-2 border-t-2 border-dashed border-gray-300 flex justify-between items-center">
                                            <button
                                                className="bg-black text-white text-sm font-bold px-3 py-1 hover:bg-gray-800 transition"
                                                onClick={() => showQrCode(coupon)}
                                            >
                                                QR
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
                    onClose={() => setIsQROpen(false)}
                    qrValue={getQrValue()}
                    couponTitle={selectedCoupon.coupons?.title || 'Coupon'}
                />
            )}
        </div>
    );
}