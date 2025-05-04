'use client';

import { claimCoupon, fetchAllCoupons, fetchAreaCoupons } from '@/actions/couponActions';
import { Check, ChevronRight, Gift, QrCode, Scissors, Timer } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import {
    getCoupons,
    getSelectedArea,
    getLoadingState,
    saveCoupons,
    clearAllFilters
} from '@/helpers/couponStateManager';

const GlobalCouponSection = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(false);
    const [detailsOpen, setDetailsOpen] = useState(null);
    const [claimingCoupons, setClaimingCoupons] = useState({});
    const [selectedArea, setSelectedArea] = useState('');
    const [session, setSession] = useState(true); // Assuming user is logged in by default

    // Load data from localStorage and set up event listeners
    useEffect(() => {
        // Initial load from localStorage
        setCoupons(getCoupons());
        setLoading(getLoadingState());
        setSelectedArea(getSelectedArea());

        // Set up event listeners for state changes
        const handleCouponsUpdated = () => {
            setCoupons(getCoupons());
        };

        const handleAreaUpdated = () => {
            setSelectedArea(getSelectedArea());
        };

        const handleLoadingUpdated = () => {
            setLoading(getLoadingState());
        };

        // Listen for state changes
        window.addEventListener('coupons-updated', handleCouponsUpdated);
        window.addEventListener('area-updated', handleAreaUpdated);
        window.addEventListener('loading-updated', handleLoadingUpdated);
        window.addEventListener('filters-cleared', () => setSelectedArea(''));

        // If there's no data in localStorage yet, fetch it
        if (getCoupons().length === 0) {
            fetchInitialData();
        }

        // Clean up event listeners
        return () => {
            window.removeEventListener('coupons-updated', handleCouponsUpdated);
            window.removeEventListener('area-updated', handleAreaUpdated);
            window.removeEventListener('loading-updated', handleLoadingUpdated);
            window.removeEventListener('filters-cleared', () => setSelectedArea(''));
        };
    }, []);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const area = getSelectedArea();

            // Fetch coupons based on selected area or fetch all
            const response = area
                ? await fetchAreaCoupons(area)
                : await fetchAllCoupons();

            if (response?.coupons) {
                setCoupons(response.coupons);
                saveCoupons(response.coupons);
            }
        } catch (error) {
            console.error('Error fetching initial coupon data:', error);
        } finally {
            setLoading(false);
        }
    };

    const clearFilters = async () => {
        setLoading(true);
        clearAllFilters();
        setSelectedArea('');

        try {
            const response = await fetchAllCoupons();
            if (response?.coupons) {
                setCoupons(response.coupons);
                saveCoupons(response.coupons);
            }
        } catch (error) {
            console.error('Error clearing filters:', error);
        } finally {
            setLoading(false);
        }
    };

    const isCouponClaimed = (couponId) => {
        const coupon = coupons.find(c => c.id === couponId);
        return coupon?.is_claimed || false;
    };

    const getBackgroundColor = (index) => {
        const colors = ['bg-yellow-200', 'bg-blue-200', 'bg-green-200', 'bg-pink-200', 'bg-purple-200', 'bg-orange-200'];
        return colors[index % colors.length];
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleClaimCoupon = async (id) => {
        setClaimingCoupons(prev => ({ ...prev, [id]: 'claiming' }));

        try {
            const response = await claimCoupon(id);

            if (!response.success) {
                alert(response.message || "Error claiming coupon");
                setClaimingCoupons(prev => ({ ...prev, [id]: 'error' }));
                return;
            }

            alert("Coupon claimed successfully!");
            setClaimingCoupons(prev => ({ ...prev, [id]: 'claimed' }));

            // Refresh coupons after claiming
            const area = getSelectedArea();
            if (area) {
                const refreshResponse = await fetchAreaCoupons(area);
                if (refreshResponse?.coupons) {
                    setCoupons(refreshResponse.coupons);
                    saveCoupons(refreshResponse.coupons);
                }
            } else {
                const refreshResponse = await fetchAllCoupons();
                if (refreshResponse?.coupons) {
                    setCoupons(refreshResponse.coupons);
                    saveCoupons(refreshResponse.coupons);
                }
            }
        } catch (error) {
            console.error('Error claiming coupon:', error);
            alert("Error claiming coupon");
            setClaimingCoupons(prev => ({ ...prev, [id]: 'error' }));
        } finally {
            setTimeout(() => {
                setClaimingCoupons(prev => {
                    const newState = { ...prev };
                    delete newState[id];
                    return newState;
                });
            }, 2000);
        }
    };

    const showQrCode = (couponId) => {
        // Implement QR code display functionality
        alert(`Showing QR code for coupon ${couponId}`);
    };

    return (
        <div className="container mx-auto py-6">
            {loading && (
                <div className="flex justify-center p-12">
                    <div className="animate-spin h-12 w-12 border-8 border-blue-500 border-t-black rounded-none"></div>
                </div>
            )}

            {!loading && coupons.length === 0 && (
                <div className="text-center p-12">
                    <div className="text-black text-xl font-bold p-6 bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0)]">NO COUPONS FOUND FOR THIS AREA</div>
                    <button
                        onClick={clearFilters}
                        className="mt-6 text-white bg-blue-500 px-4 py-2 font-bold border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                    >
                        VIEW ALL COUPONS
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-5 relative">
                {coupons.map((coupon, index) => {
                    const isClaimed = isCouponClaimed(coupon.id);

                    return (
                        <div
                            key={coupon.id}
                            className={`${getBackgroundColor(index)} border-2 border-black p-4 relative overflow-hidden
                                shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0)] transition-all duration-200`}
                        >
                            <div className="flex flex-row items-start justify-between mb-3">
                                <div>
                                    <h2 className="text-2xl font-black uppercase tracking-tight bg-white px-3 py-1 border-2 border-black inline-block">
                                        {coupon.title}
                                    </h2>

                                    <h3 className="text-lg font-bold uppercase mt-2">
                                        <span className="bg-black text-white px-2 py-0.5">
                                            {coupon.vendor_profiles?.business_name || 'VENDOR'}
                                        </span>
                                    </h3>
                                </div>

                                <Gift size={28} className="bg-white p-1 border-2 border-black" />
                            </div>

                            <p className="font-medium mb-4 bg-white/90 p-2 border-l-4 border-black text-sm">{coupon.description}</p>

                            <div className="flex justify-between items-center mb-3">
                                <div className="bg-white border-2 border-black px-2 py-1 inline-block">
                                    <p className="text-xs font-bold flex items-center">
                                        <Timer className="inline-block mr-1 w-4 h-4" />
                                        VALID: {formatDate(coupon.start_date)} - {formatDate(coupon.end_date)}
                                    </p>
                                </div>

                                <div className="bg-white border-2 border-black px-2 py-1 inline-block">
                                    <p className="text-xs font-bold">
                                        {coupon.current_claims}/{coupon.max_claims} CLAIMED
                                    </p>
                                </div>
                            </div>

                            {detailsOpen === coupon.id ? (
                                <div className="mt-3 pt-3 border-t-2 border-black mb-4">
                                    <p className="text-black font-bold mb-3">{coupon.description}</p>
                                    <p className="text-sm text-black mb-1 font-bold">
                                        <strong>REDEMPTION:</strong> {coupon.coupon_type === 'redeem_at_store' ? 'IN-STORE' : 'ONLINE'}
                                    </p>
                                    <button
                                        onClick={() => setDetailsOpen(null)}
                                        className="text-blue-600 text-sm font-black hover:text-blue-800 flex items-center underline"
                                    >
                                        SHOW LESS
                                    </button>
                                </div>
                            ) : (
                                <div className="flex justify-between mb-4">
                                    <button
                                        onClick={() => setDetailsOpen(coupon.id)}
                                        className="text-blue-600 text-sm font-black hover:text-blue-800 flex items-center underline"
                                    >
                                        VIEW DETAILS
                                        <ChevronRight size={16} className="ml-1" />
                                    </button>
                                </div>
                            )}

                            {isClaimed ? (
                                <div className="flex gap-2">
                                    <button
                                        disabled
                                        className="flex-1 bg-black text-white font-bold py-2 px-4 uppercase border-2 border-black cursor-not-allowed flex justify-center items-center"
                                    >
                                        <Check className="mr-2" size={18} /> CLAIMED
                                    </button>

                                    <button
                                        onClick={() => showQrCode(coupon.id)}
                                        className="bg-white text-black font-bold py-2 px-4 uppercase border-2 border-black hover:bg-gray-100 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0)] transition-all flex justify-center items-center"
                                    >
                                        <QrCode className="mr-2" size={18} /> QR
                                    </button>
                                </div>
                            ) : coupon.current_claims >= coupon.max_claims ? (
                                <button
                                    disabled
                                    className="w-full bg-gray-400 text-gray-200 font-bold py-2 px-4 uppercase border-2 border-black cursor-not-allowed flex justify-center items-center"
                                >
                                    FULLY CLAIMED
                                </button>
                            ) : claimingCoupons[coupon.id] === 'claiming' ? (
                                <button
                                    disabled
                                    className="w-full bg-white text-black font-bold py-2 px-4 uppercase border-2 border-black cursor-wait relative overflow-hidden"
                                >
                                    <div className="absolute top-0 left-0 h-full bg-black/10 animate-[loading_1.5s_infinite]" style={{ width: "70%" }}></div>
                                    CLAIMING...
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleClaimCoupon(coupon.id)}
                                    disabled={!session}
                                    className={`w-full ${!session ? 'bg-gray-200 cursor-not-allowed' : 'bg-white hover:bg-gray-100'} text-black font-bold py-2 px-4 uppercase border-2 border-black transition-all ${!session ? '' : 'hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)]'} flex justify-center items-center`}
                                >
                                    <Scissors className="mr-2" size={18} /> {!session ? 'SIGN IN TO CLAIM' : 'CLAIM NOW!'}
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default GlobalCouponSection;