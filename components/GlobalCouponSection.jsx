'use client';

import { claimCoupon, fetchAllCoupons, fetchAreaCoupons } from '@/actions/couponActions';
import { Check, ChevronDown, ChevronUp, Gift, QrCode, Scissors, Timer, X, RefreshCw } from 'lucide-react';
import React, { useState, useEffect, useCallback } from 'react';
import {
    getCoupons,
    getSelectedArea,
    getLoadingState,
    saveCoupons,
    clearAllFilters,
    shouldRefreshData,
    areCouponsStale
} from '@/helpers/couponStateManager';
import { joinAddress } from '@/utils/addressUtils';
import QRModal from '@/app/u/profile/components/QRModal';
import { getUserId } from '@/helpers/userHelper';

const GlobalCouponSection = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(false);
    const [detailsOpen, setDetailsOpen] = useState(null);
    const [claimingCoupons, setClaimingCoupons] = useState({});
    const [selectedArea, setSelectedArea] = useState('');
    const [session, setSession] = useState(true); // Assuming user is logged in by default
    const [isQROpen, setIsQROpen] = useState(false);
    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [lastRefreshed, setLastRefreshed] = useState(null);
    const [qrData, setQrData] = useState(''); // Added state for QR data

    // Handler functions defined once using useCallback
    const handleCouponsUpdated = useCallback(() => {
        setCoupons(getCoupons());
        setLastRefreshed(new Date());
    }, []);

    const handleAreaUpdated = useCallback(() => {
        setSelectedArea(getSelectedArea());
    }, []);

    const handleLoadingUpdated = useCallback(() => {
        setLoading(getLoadingState());
    }, []);

    const handleFilterCleared = useCallback(() => {
        setSelectedArea('');
    }, []);

    // Fetch fresh data
    const refreshCouponData = useCallback(async () => {
        try {
            setLoading(true);
            const area = getSelectedArea();

            // Fetch fresh data based on current area selection
            const response = area
                ? await fetchAreaCoupons(area)
                : await fetchAllCoupons();

            if (response?.coupons) {
                setCoupons(response.coupons);
                saveCoupons(response.coupons);
                setLastRefreshed(new Date());
            }
        } catch (error) {
            console.error('Error refreshing coupon data:', error);
            // Add user-facing error notification here if needed
        } finally {
            setLoading(false);
        }
    }, []);

    // Load data from localStorage and set up event listeners
    useEffect(() => {
        // Initial load from localStorage
        setCoupons(getCoupons());
        setLoading(getLoadingState());
        setSelectedArea(getSelectedArea());

        // Set up event listeners for state changes
        window.addEventListener('coupons-updated', handleCouponsUpdated);
        window.addEventListener('area-updated', handleAreaUpdated);
        window.addEventListener('loading-updated', handleLoadingUpdated);
        window.addEventListener('filters-cleared', handleFilterCleared);

        // Check if we need to fetch fresh data
        if (getCoupons().length === 0 || areCouponsStale()) {
            refreshCouponData();
        } else {
            setLastRefreshed(new Date());
        }

        // Set up periodic refresh
        const refreshInterval = setInterval(() => {
            if (shouldRefreshData()) {
                refreshCouponData();
            }
        }, 60000); // Check every minute

        // Clean up event listeners and interval
        return () => {
            window.removeEventListener('coupons-updated', handleCouponsUpdated);
            window.removeEventListener('area-updated', handleAreaUpdated);
            window.removeEventListener('loading-updated', handleLoadingUpdated);
            window.removeEventListener('filters-cleared', handleFilterCleared);
            clearInterval(refreshInterval);
        };
    }, [handleCouponsUpdated, handleAreaUpdated, handleLoadingUpdated, handleFilterCleared, refreshCouponData]);

    const clearFilters = async () => {
        setLoading(true);
        clearAllFilters();
        setSelectedArea('');

        try {
            const response = await fetchAllCoupons();
            if (response?.coupons) {
                setCoupons(response.coupons);
                saveCoupons(response.coupons);
                setLastRefreshed(new Date());
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
        const colors = [
            'bg-yellow-200',
            'bg-blue-200',
            'bg-green-200',
            'bg-pink-200',
            'bg-purple-200',
            'bg-orange-200',
            'bg-teal-200',
            'bg-red-200'
        ];
        return colors[index % colors.length];
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';

        try {
            const date = new Date(dateString);
            // Check if date is valid
            if (isNaN(date.getTime())) return 'Invalid Date';

            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Invalid Date';
        }
    };

    const formatRefreshTime = (date) => {
        if (!date) return '';
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleClaimCoupon = async (id, coupon_type, redeem_duration, end_date) => {
        // Calculate the redeem duration in minutes based on the coupon type
        let redeemMinutes = 0;
        let message = '';

        if (coupon_type === 'redeem_at_store') {
            // Parse the redeem_duration or use provided value (5 or 10 minutes)
            redeemMinutes = redeem_duration === "5 minutes" ? 5 : 10;
            message = `This coupon is for in-store redemption only. You have ${redeemMinutes} minutes to redeem this coupon.`;
        } else if (coupon_type === 'redeem_online') {
            // For online redemption, show end date information
            const endDateObj = end_date ? new Date(end_date) : null;
            if (endDateObj && !isNaN(endDateObj.getTime())) {
                const formattedDate = endDateObj.toLocaleDateString();
                message = `You can redeem this online coupon anytime until ${formattedDate}.`;
            } else {
                message = "You can redeem this online coupon.";
            }
        }

        if (message) alert(message);
        setClaimingCoupons(prev => ({ ...prev, [id]: 'claiming' }));

        try {
            // Pass the redeemMinutes to the claimCoupon function
            const response = await claimCoupon(id, redeemMinutes);

            if (!response.success) {
                alert(response.message || "Error claiming coupon");
                setClaimingCoupons(prev => ({ ...prev, [id]: 'error' }));
                return;
            }

            alert("Coupon claimed successfully!");
            setClaimingCoupons(prev => ({ ...prev, [id]: 'claimed' }));

            // Refresh coupons after claiming
            await refreshCouponData();

            // If it's a store redemption coupon, start a countdown timer
            if (coupon_type === 'redeem_at_store' && response.coupon?.remaining_claim_time) {
                // You could implement a countdown timer here if needed
                // For example, adding state to track expiring coupons
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

    const showQrCode = async (coupon) => {
        try {
            // Get user ID before opening modal
            const userId = await getUserId();
            const data = JSON.stringify({ userId, couponId: coupon.id });
            setQrData(data);
            setSelectedCoupon(coupon);
            setIsQROpen(true);
        } catch (error) {
            console.error('Error preparing QR code:', error);
            alert('Unable to generate QR code. Please try again.');
        }
    };

    const toggleDetails = (couponId) => {
        setDetailsOpen(detailsOpen === couponId ? null : couponId);
    };

    const getProgressBarWidth = (current, max) => {
        if (!current || !max || max <= 0) return '0%';
        return `${Math.min((current / max) * 100, 100)}%`;
    };

    return (
        <div className="container mx-auto py-6 px-4">
            <div className="flex justify-between items-center mb-6">
                <div className="text-sm text-gray-600">
                    {lastRefreshed && (
                        <span>Last updated: {formatRefreshTime(lastRefreshed)}</span>
                    )}
                </div>
                <button
                    onClick={refreshCouponData}
                    disabled={loading}
                    className="flex items-center gap-2 text-sm bg-white px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                >
                    <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                    Refresh Coupons
                </button>
            </div>

            {loading && (
                <div className="flex justify-center p-12">
                    <div className="animate-spin h-16 w-16 border-8 border-blue-500 border-t-black rounded-none"></div>
                </div>
            )}

            {!loading && coupons.length === 0 && (
                <div className="text-center p-8">
                    <div className="text-black text-2xl font-black p-8 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0)] rotate-1">
                        NO COUPONS FOUND FOR THIS AREA
                    </div>
                    <button
                        onClick={clearFilters}
                        className="mt-8 text-white bg-blue-500 px-6 py-3 font-black border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all text-lg uppercase -rotate-1"
                    >
                        VIEW ALL COUPONS
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
                {coupons.map((coupon, index) => {
                    const isClaimed = isCouponClaimed(coupon.id);
                    const isDetailsOpen = detailsOpen === coupon.id;

                    return (
                        <div
                            key={coupon.id}
                            className={`${getBackgroundColor(index)} border-4 border-black p-5 relative overflow-hidden
                                shadow-[8px_8px_0px_0px_rgba(0,0,0)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0)] 
                                transition-all duration-200 ${index % 2 === 0 ? 'rotate-1' : '-rotate-1'}`}
                        >
                            {/* Scissors decoration in corner */}
                            <div className="absolute -top-3 -left-3 w-12 h-12 bg-white border-4 border-black transform rotate-45"></div>
                            <div className="absolute top-0 left-0 w-8 h-8 flex items-center justify-center">
                                <Scissors size={16} className="transform -rotate-45" />
                            </div>

                            {/* Main content */}
                            <div className="flex flex-col md:flex-row items-start justify-between mb-4 gap-3">
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight bg-white px-3 py-1 border-3 border-black inline-block transform -rotate-1 mb-3 shadow-[2px_2px_0px_0px_rgba(0,0,0)]">
                                        {coupon.title}
                                    </h2>

                                    <div className="flex flex-wrap items-center gap-2 mt-2">
                                        <h3 className="text-md font-black uppercase break-words max-w-full">
                                            <span className="bg-black text-white px-3 py-1 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.5)] inline-block">
                                                {coupon?.businesses?.name || 'VENDOR'}
                                            </span>
                                        </h3>
                                        <Gift size={24} className="bg-white p-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0)]" />
                                    </div>
                                </div>
                            </div>

                            <p className="font-medium mb-4 bg-white/90 p-3 border-l-4 border-black text-sm sm:text-base shadow-[3px_3px_0px_0px_rgba(0,0,0)]">
                                {coupon.description && coupon.description.length > 100 && !isDetailsOpen
                                    ? `${coupon.description.substring(0, 100)}...`
                                    : coupon.description || 'No description available'}
                            </p>

                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                                <div className="bg-white border-3 border-black px-3 py-1 inline-flex items-center shadow-[3px_3px_0px_0px_rgba(0,0,0)]">
                                    <Timer className="inline-block mr-2 w-4 h-4" />
                                    <p className="text-xs font-bold whitespace-nowrap">
                                        {formatDate(coupon.start_date)} - {formatDate(coupon.end_date)}
                                    </p>
                                </div>

                                <div className="w-full sm:w-auto">
                                    <div className="bg-white border-3 border-black px-3 py-1 font-bold text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0)]">
                                        <div className="flex justify-between items-center gap-2">
                                            <span>{coupon.current_claims || 0}/{coupon.max_claims || 0} CLAIMED</span>
                                        </div>
                                        <div className="w-full bg-gray-200 h-2 mt-1 overflow-hidden">
                                            <div
                                                className="bg-black h-full"
                                                style={{ width: getProgressBarWidth(coupon.current_claims, coupon.max_claims) }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {isDetailsOpen && (
                                <div className="mt-3 pt-3 border-t-2 border-black mb-4">
                                    <div className="bg-white p-3 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0)]">
                                        <p className="text-black font-medium mb-3">{coupon.description || 'No description available'}</p>
                                        <p className="text-sm text-black mb-3 font-bold flex items-center gap-2">
                                            <span className="bg-black text-white px-2 py-1">REDEMPTION:</span>
                                            <span>{coupon.coupon_type === 'redeem_at_store' ? 'IN-STORE' : 'ONLINE'}</span>
                                        </p>
                                        <p className="text-sm text-black font-bold flex items-center gap-2">
                                            <span className="bg-black text-white px-2 py-1">LOCATION:</span>
                                            <span>{coupon?.businesses?.business_locations && coupon.businesses.business_locations[0] ?
                                                joinAddress(coupon.businesses.business_locations[0]) :
                                                'Contact store for details'}</span>
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-between items-center mb-4">
                                <button
                                    onClick={() => toggleDetails(coupon.id)}
                                    className="bg-white text-blue-600 text-sm font-black hover:text-blue-800 
                                            flex items-center px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0)]
                                            hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                                >
                                    {isDetailsOpen ? (
                                        <>HIDE DETAILS <ChevronUp size={16} className="ml-1" /></>
                                    ) : (
                                        <>VIEW DETAILS <ChevronDown size={16} className="ml-1" /></>
                                    )}
                                </button>

                                {coupon.coupon_type === 'redeem_at_store' && (
                                    <div className="font-bold text-xs bg-black text-white px-2 py-1">
                                        IN-STORE ONLY
                                    </div>
                                )}
                            </div>

                            {isClaimed ? (
                                <div className="flex gap-3">
                                    <button
                                        disabled
                                        className="flex-1 bg-black text-white font-black py-3 px-4 uppercase border-3 border-black cursor-not-allowed flex justify-center items-center shadow-[3px_3px_0px_0px_rgba(255,255,255,0.3)]"
                                    >
                                        <Check className="mr-2" size={20} /> CLAIMED
                                    </button>

                                    <button
                                        onClick={() => showQrCode(coupon)}
                                        className="bg-white text-black font-black py-3 px-4 uppercase border-3 border-black 
                                                hover:bg-gray-100 shadow-[3px_3px_0px_0px_rgba(0,0,0)] 
                                                hover:shadow-none hover:translate-x-1 hover:translate-y-1 
                                                transition-all flex justify-center items-center"
                                    >
                                        <QrCode className="mr-2" size={20} /> QR
                                    </button>
                                </div>
                            ) : coupon.current_claims >= coupon.max_claims ? (
                                <button
                                    disabled
                                    className="w-full bg-gray-400 text-white font-black py-3 px-4 uppercase border-3 border-black cursor-not-allowed flex justify-center items-center"
                                >
                                    <X className="mr-2" size={20} /> FULLY CLAIMED
                                </button>
                            ) : claimingCoupons[coupon.id] === 'claiming' ? (
                                <button
                                    disabled
                                    className="w-full bg-white text-black font-black py-3 px-4 uppercase border-3 border-black cursor-wait relative overflow-hidden shadow-[3px_3px_0px_0px_rgba(0,0,0)]"
                                >
                                    <div className="absolute top-0 left-0 h-full bg-black/10 animate-[loading_1.5s_infinite]" style={{ width: "70%" }}></div>
                                    CLAIMING...
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleClaimCoupon(coupon.id, coupon.coupon_type, coupon.redeem_duration, coupon.end_date)}
                                    disabled={!session}
                                    className={`w-full ${!session ? 'bg-gray-200 cursor-not-allowed' : 'bg-white hover:bg-gray-100'} 
                                            text-black font-black py-3 px-4 uppercase border-3 border-black transition-all 
                                            ${!session ? '' : 'shadow-[6px_6px_0px_0px_rgba(0,0,0)] hover:shadow-none hover:translate-x-2 hover:translate-y-2'} 
                                            flex justify-center items-center`}
                                >
                                    <Scissors className="mr-2" size={20} /> {!session ? 'SIGN IN TO CLAIM' : 'CLAIM NOW!'}
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>

            {isQROpen && (
                <QRModal
                    isOpen={isQROpen}
                    onClose={() => setIsQROpen(false)}
                    qrValue={qrData}
                    couponTitle={selectedCoupon?.title || 'Coupon'}
                />
            )}
        </div>
    );
};

export default GlobalCouponSection;