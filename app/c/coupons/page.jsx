'use client';
import React, { useState, useEffect } from 'react';
import { 
    MapPin, 
    Search, 
    Filter, 
    ChevronRight, 
    Tag, 
    Calendar, 
    Store, 
    Gift, 
    Timer, 
    Check, 
    QrCode, 
    Scissors 
} from 'lucide-react';
import { claimCoupon, fetchAllCoupons, fetchAreaCoupons } from '@/actions/couponActions';
import { getAddressDropdowns } from '@/actions/addressActions';
import Link from 'next/link';

const CouponPage = () => {
    const [coupons, setCoupons] = useState([]);
    const [areas, setAreas] = useState([]);
    const [selectedArea, setSelectedArea] = useState('');
    const [loading, setLoading] = useState(true);
    const [detailsOpen, setDetailsOpen] = useState(null);
    const [claimingCoupons, setClaimingCoupons] = useState({});
    const [session, setSession] = useState(true); // Assuming user is logged in by default

    // Get background color based on index
    const getBackgroundColor = (index) => {
        const colors = ['bg-yellow-200', 'bg-blue-200', 'bg-green-200', 'bg-pink-200', 'bg-purple-200', 'bg-orange-200'];
        return colors[index % colors.length];
    };

    // Check if coupon is claimed
    const isCouponClaimed = (couponId) => {
        const coupon = coupons.find(c => c.id === couponId);
        return coupon?.is_claimed || false;
    };

    // Show QR code (placeholder function)
    const showQrCode = (couponId) => {
        alert(`QR Code for coupon ${couponId} would be displayed here`);
    };

    // Initial data fetch
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch all coupons and address dropdowns
                const couponResponse = await fetchAllCoupons();
                const dropdownResponse = await getAddressDropdowns();

                console.log('Coupon response:', couponResponse);

                if (couponResponse?.coupons) {
                    setCoupons(couponResponse.coupons);
                }

                if (dropdownResponse?.areaData) {
                    setAreas(dropdownResponse.areaData);
                }
            } catch (error) {
                console.error('Error fetching initial data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Handle area selection change
    const handleAreaChange = async (e) => {
        const area = e.target.value;
        setSelectedArea(area);

        try {
            setLoading(true);

            if (area === '') {
                // If "All Areas" is selected, fetch all coupons
                const response = await fetchAllCoupons();
                if (response?.coupons) {
                    setCoupons(response.coupons);
                }
            } else {
                // Fetch coupons for selected area
                const response = await fetchAreaCoupons(area);
                if (response?.coupons) {
                    setCoupons(response.coupons);
                }
            }
        } catch (error) {
            console.error('Error fetching coupons by area:', error);
        } finally {
            setLoading(false);
        }
    };

    // Clear all filters
    const clearFilters = async () => {
        setSelectedArea('');
        setLoading(true);

        try {
            const response = await fetchAllCoupons();
            if (response?.coupons) {
                setCoupons(response.coupons);
            }
        } catch (error) {
            console.error('Error clearing filters:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle claim coupon
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
            if (selectedArea) {
                const refreshResponse = await fetchAreaCoupons(selectedArea);
                if (refreshResponse?.coupons) {
                    setCoupons(refreshResponse.coupons);
                }
            } else {
                const refreshResponse = await fetchAllCoupons();
                if (refreshResponse?.coupons) {
                    setCoupons(refreshResponse.coupons);
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

    // Format date for display
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-yellow-50">
            {/* Filter Section */}
            <div className="bg-green-400 sticky top-0 z-10 p-4 border-b-6 border-black">
                <div className="container mx-auto">
                    <div className="flex justify-between items-start sm:items-center">
                        <h2 className="text-xl font-black text-black mb-2 sm:mb-0">FIND COUPONS</h2>
                        <button
                            onClick={clearFilters}
                            className={`text-sm font-bold ${selectedArea ? 'bg-red-500 text-white px-3 py-1 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all' : 'text-gray-600'}`}
                            disabled={!selectedArea}
                        >
                            {selectedArea ? 'CLEAR FILTER' : 'CLEAR FILTER'}
                        </button>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="w-full sm:w-64">
                            <label htmlFor="area" className="block text-sm font-black text-black mb-1">
                                FILTER BY AREA
                            </label>
                            <div className="relative">
                                <select
                                    id="area"
                                    className="w-full p-2 pl-10 border-4 border-black rounded-none bg-white font-bold text-black shadow-[4px_4px_0px_0px_rgba(0,0,0)] focus:outline-none"
                                    value={selectedArea}
                                    onChange={handleAreaChange}
                                >
                                    <option value="">ALL AREAS</option>
                                    {areas.map((area) => (
                                        <option key={area.id} value={area.name}>
                                            {area.name.toUpperCase()}
                                        </option>
                                    ))}
                                </select>
                                <MapPin size={16} className="absolute left-3 top-3 text-black" />
                            </div>
                        </div>

                        {selectedArea && (
                            <div className="flex items-center mt-2 sm:mt-6">
                                <span className="bg-yellow-300 text-black text-sm font-bold px-3 py-2 border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0)] flex items-center">
                                    <MapPin size={14} className="mr-1" />
                                    {selectedArea.toUpperCase()}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Coupons Section */}
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
                                        <div className="absolute top-0 left-0 h-full bg-black/10 animate-[loading_1.5s_infinite]" style={{width: "70%"}}></div>
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

            {/* Footer */}
            <footer className="bg-blue-800 text-white p-6 mt-8 border-t-8 border-black">
                <div className="container mx-auto text-center">
                    <p className="mb-2 font-black text-xl">© 2025 COUPON MARKETPLACE</p>
                    <p className="text-blue-200 font-bold">FIND THE BEST DEALS NEAR YOU</p>
                </div>
            </footer>
            
            {/* Loading animation keyframes */}
            <style jsx>{`
                @keyframes loading {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
};

export default CouponPage;