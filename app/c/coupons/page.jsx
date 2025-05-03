'use client';
import React, { useState, useEffect } from 'react';
import { MapPin, Search, Filter, ChevronRight, Tag, Calendar, Store, ExternalLink } from 'lucide-react';
import { claimCoupon, fetchAllCoupons, fetchAreaCoupons } from '@/actions/couponActions';
import { getAddressDropdowns } from '@/actions/addressActions';

const CouponPage = () => {
    const [coupons, setCoupons] = useState([]);
    const [areas, setAreas] = useState([]);
    const [selectedArea, setSelectedArea] = useState('');
    const [loading, setLoading] = useState(true);
    const [detailsOpen, setDetailsOpen] = useState(null);

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
        setLoading(true);
        try {
            const response = await claimCoupon(id);

            if (!response.success) {
                alert(response.message || "Error claiming coupon");
                return;
            }

            alert("Coupon claimed successfully!");

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
        } finally {
            setLoading(false);
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
        <div className="min-h-screen bg-blue-50">
            {/* Header */}
            <div className="bg-blue-600 text-white p-4 shadow-md">
                <div className="container mx-auto">
                    <h1 className="text-2xl font-bold">Exclusive Coupons</h1>
                    <p className="text-blue-100">Save big with our special offers</p>
                </div>
            </div>

            {/* Filter Section */}
            <div className="bg-white shadow-md sticky top-0 z-10 p-4 border-b border-blue-100">
                <div className="container mx-auto">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-lg font-semibold text-blue-800">Find Coupons</h2>
                        <button
                            onClick={clearFilters}
                            className={`text-xs ${selectedArea ? 'text-blue-600 hover:text-blue-800 underline' : 'text-gray-400'}`}
                            disabled={!selectedArea}
                        >
                            Clear Filter
                        </button>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="w-full sm:w-64">
                            <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
                                Filter by Area
                            </label>
                            <div className="relative">
                                <select
                                    id="area"
                                    className="w-full p-2 pl-9 border border-blue-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
                                    value={selectedArea}
                                    onChange={handleAreaChange}
                                >
                                    <option value="">All Areas</option>
                                    {areas.map((area) => (
                                        <option key={area.id} value={area.name}>
                                            {area.name}
                                        </option>
                                    ))}
                                </select>
                                <MapPin size={16} className="absolute left-3 top-3 text-blue-500" />
                            </div>
                        </div>

                        {/* Applied Filters Section */}
                        {selectedArea && (
                            <div className="flex items-center">
                                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1.5 rounded-full flex items-center">
                                    <MapPin size={12} className="mr-1" />
                                    {selectedArea}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Coupons Section */}
            <div className="container mx-auto p-4">
                {loading && (
                    <div className="flex justify-center p-12">
                        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                    </div>
                )}

                {!loading && coupons.length === 0 && (
                    <div className="text-center p-12">
                        <div className="text-gray-500 text-lg">No coupons found for this area</div>
                        <button
                            onClick={clearFilters}
                            className="mt-4 text-blue-600 hover:text-blue-800 underline"
                        >
                            View all coupons
                        </button>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {coupons.map((coupon) => (
                        <div
                            key={coupon.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden border border-blue-100 hover:shadow-lg transition-shadow duration-300"
                        >
                            <div className="h-48 bg-gray-200 relative overflow-hidden">
                                <img
                                    src={coupon.image_url || "/api/placeholder/400/320"}
                                    alt={coupon.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                    {coupon.current_claims}/{coupon.max_claims} Claimed
                                </div>
                            </div>

                            <div className="p-4">
                                <h3 className="text-xl font-bold text-blue-800 mb-2">{coupon.title}</h3>
                                <p className="text-gray-600 mb-3 line-clamp-2">{coupon.description}</p>

                                <div className="flex items-center text-gray-500 mb-2">
                                    <Calendar size={16} className="mr-2" />
                                    <span className="text-sm">
                                        Valid: {formatDate(coupon.start_date)} - {formatDate(coupon.end_date)}
                                    </span>
                                </div>

                                <div className="flex items-center text-gray-500 mb-4">
                                    <Store size={16} className="mr-2" />
                                    <span className="text-sm">{coupon.coupon_type === 'redeem_at_store' ? 'Redeem at Store' : 'Online Redemption'}</span>
                                </div>

                                {detailsOpen === coupon.id ? (
                                    <div className="mt-3 pt-3 border-t border-gray-200">
                                        <p className="text-gray-700 mb-3">{coupon.description}</p>
                                        <p className="text-sm text-gray-600 mb-1">
                                            <strong>Start Date:</strong> {formatDate(coupon.start_date)}
                                        </p>
                                        <p className="text-sm text-gray-600 mb-3">
                                            <strong>End Date:</strong> {formatDate(coupon.end_date)}
                                        </p>
                                        <button
                                            onClick={() => setDetailsOpen(null)}
                                            className="text-blue-600 text-sm font-medium hover:text-blue-800 flex items-center"
                                        >
                                            Show Less
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex justify-between">
                                        <button
                                            onClick={() => setDetailsOpen(coupon.id)}
                                            className="text-blue-600 text-sm font-medium hover:text-blue-800 flex items-center"
                                        >
                                            View Details
                                            <ChevronRight size={16} className="ml-1" />
                                        </button>
                                    </div>
                                )}

                                <div className="mt-4">
                                    <button
                                        onClick={() => handleClaimCoupon(coupon.id)}
                                        disabled={coupon.current_claims >= coupon.max_claims || coupon.is_claimed}
                                        className={`w-full py-2 px-4 rounded-md text-white font-medium flex items-center justify-center transition-all ${coupon.current_claims >= coupon.max_claims || coupon.is_claimed
                                                ? 'bg-gray-400 opacity-70 cursor-not-allowed hover:bg-gray-400 text-gray-200'
                                                : 'bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow'
                                            }`}
                                    >
                                        <Tag size={16} className={`mr-2 ${coupon.current_claims >= coupon.max_claims || coupon.is_claimed ? 'opacity-70' : ''}`} />
                                        {coupon.current_claims >= coupon.max_claims ? 'Fully Claimed' : 'Claim Coupon'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-blue-800 text-white p-6 mt-8">
                <div className="container mx-auto text-center">
                    <p className="mb-2">© 2025 Coupon Marketplace</p>
                    <p className="text-blue-200 text-sm">Find the best deals near you</p>
                </div>
            </footer>
        </div>
    );
};

export default CouponPage;