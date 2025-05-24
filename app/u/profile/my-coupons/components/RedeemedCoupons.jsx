'use client'
import { Calendar, ShoppingBag, Store } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';

const RedeemedCoupons = ({ data }) => {
    // Assuming data is passed as a prop
    const router = useRouter();
    const { success, coupons } = data || { success: false, coupons: [] };
    const scrollContainerRef = useRef(null);
    const [scrollPosition, setScrollPosition] = useState(0);

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

    return (
        <div className="bg-blue-300 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0)] overflow-hidden max-w-full mx-auto">
            <div className="p-4 border-b-4 border-black bg-blue-400">
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

                                        {/* <div className="mt-2 pt-2 border-t-2 border-dashed border-gray-300 flex justify-between items-center">
                                            <div className="text-xs">
                                                <span className="font-bold">{coupon.coupons.current_claims}/{coupon.coupons.max_claims}</span> claimed
                                            </div>
                                            <button className="bg-black text-white text-sm font-bold px-3 py-1 hover:bg-gray-800 transition">
                                                USE COUPON
                                            </button>
                                        </div> */}
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

            <div className="bg-yellow-300 p-4 text-center border-t-4 border-black">
                <button onClick={() => router.push("/coupons")} className="inline-block bg-white text-black font-black px-4 py-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                    BROWSE AVAILABLE COUPONS
                </button>
            </div>
        </div>
    );
}

export default RedeemedCoupons