'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { Package, Users, CheckCircle, X } from 'lucide-react';
import { getAllVendorCoupons } from './actions/analyticsActions';
// Import your server action if using the server action approach
// import { fetchCouponUsers } from './actions/couponActions';

const CouponAnalyticsTable = ({ coupons }) => {
    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [modalType, setModalType] = useState(null); // 'claims' or 'redemptions'
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const openModal = async (coupon, type) => {
        setLoading(true);
        setError(null);
        try {
            // Different endpoints for claims vs redemptions
            const endpoint = type === 'claims' ? 'claimed-coupon-users' : 'redeemed-coupon-users';
            const url = new URL(`${process.env.NEXT_PUBLIC_SITE_URL}/api/analytics/${endpoint}`);
            url.searchParams.append('couponId', coupon.id);

            const response = await fetch(url.toString(), {
                method: "GET",
                credentials: 'include',
            });

            if (response.ok) {
                const userData = await response.json();
                setUsers(userData);
            } else {
                const errorData = await response.json();
                console.error('Failed to fetch user data:', errorData.message);
                setError(errorData.message || 'Failed to fetch user data');
                setUsers([]);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('Network error occurred');
            setUsers([]);
        } finally {
            setLoading(false);
        }

        setSelectedCoupon(coupon);
        setModalType(type);
        setIsModalOpen(true);
    };

    // Calculate totals for summary cards
    const totalMaxClaims = coupons.reduce((sum, coupon) => sum + coupon.max_claims, 0);
    const totalCurrentClaims = coupons.reduce((sum, coupon) => sum + coupon.current_claims, 0);
    const totalRedemptions = coupons.reduce((sum, coupon) => sum + coupon.current_redemption, 0);

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-black text-black bg-yellow-300 inline-block px-4 py-2 transform rotate-1 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">Coupon Analytics</h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-pink-300 rounded-none transform -rotate-1 p-5 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex flex-row items-center justify-between pb-2">
                        <h3 className="text-sm font-bold text-black">Total Available Coupons</h3>
                        <Package className="h-5 w-5 text-black" />
                    </div>
                    <div className="text-3xl font-black">{totalMaxClaims}</div>
                </div>

                <div className="bg-blue-300 rounded-none transform rotate-1 p-5 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex flex-row items-center justify-between pb-2">
                        <h3 className="text-sm font-bold text-black">Total Claimed Coupons</h3>
                        <Users className="h-5 w-5 text-black" />
                    </div>
                    <div className="text-3xl font-black">{totalCurrentClaims}</div>
                </div>

                <div className="bg-green-300 rounded-none transform -rotate-1 p-5 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex flex-row items-center justify-between pb-2">
                        <h3 className="text-sm font-bold text-black">Total Redeemed Coupons</h3>
                        <CheckCircle className="h-5 w-5 text-black" />
                    </div>
                    <div className="text-3xl font-black">{totalRedemptions}</div>
                </div>
            </div>

            {/* Responsive Table */}
            <div className="overflow-x-auto border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <table className="min-w-full">
                    <thead className="bg-yellow-300">
                        <tr>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-black text-black uppercase tracking-wider border-b-2 border-black">
                                Title
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-black text-black uppercase tracking-wider border-b-2 border-black hidden md:table-cell">
                                Description
                            </th>
                            <th scope="col" className="px-6 py-4 text-center text-xs font-black text-black uppercase tracking-wider border-b-2 border-black">
                                Available
                            </th>
                            <th scope="col" className="px-6 py-4 text-center text-xs font-black text-black uppercase tracking-wider border-b-2 border-black">
                                Claimed
                            </th>
                            <th scope="col" className="px-6 py-4 text-center text-xs font-black text-black uppercase tracking-wider border-b-2 border-black">
                                Redeemed
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-black text-black uppercase tracking-wider border-b-2 border-black">
                                Validity
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {coupons.map((coupon, index) => (
                            <tr key={coupon.id} className={index % 2 === 0 ? 'bg-purple-50' : 'bg-blue-50'}>
                                <td className="px-6 py-4 whitespace-nowrap font-bold text-black border-b-2 border-black">
                                    {coupon.title}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-black hidden md:table-cell border-b-2 border-black">
                                    {coupon.description}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-black text-center border-b-2 border-black">
                                    {coupon.max_claims}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center border-b-2 border-black">
                                    <button
                                        onClick={() => openModal(coupon, 'claims')}
                                        disabled={loading}
                                        className="bg-blue-400 text-black hover:bg-blue-500 disabled:opacity-50 font-bold px-4 py-1 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                                    >
                                        {loading ? '...' : coupon.current_claims}
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center border-b-2 border-black">
                                    <button
                                        onClick={() => openModal(coupon, 'redemptions')}
                                        disabled={loading}
                                        className="bg-pink-400 text-black hover:bg-pink-500 disabled:opacity-50 font-bold px-4 py-1 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                                    >
                                        {loading ? '...' : coupon.current_redemption}
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-black border-b-2 border-black">
                                    {new Date(coupon.start_date).toLocaleDateString()} - {new Date(coupon.end_date).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && selectedCoupon && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-none max-w-md w-full max-h-screen overflow-hidden transform rotate-1">
                        <div className="px-4 py-3 bg-yellow-300 border-b-4 border-black flex justify-between items-center">
                            <h3 className="font-black text-lg text-black">
                                Users Who {modalType === 'claims' ? 'Claimed' : 'Redeemed'} "{selectedCoupon.title}"
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="bg-red-400 text-black hover:bg-red-500 p-1 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="p-4 max-h-96 overflow-y-auto">
                            {loading ? (
                                <p className="text-center py-4 text-black font-bold">Loading...</p>
                            ) : error ? (
                                <p className="text-center py-4 text-red-600 font-bold">Error: {error}</p>
                            ) : users.length > 0 ? (
                                <div className="space-y-4">
                                    {users.map(userCoupon => (
                                        <div key={userCoupon.claimId} className="p-3 border-3 border-black bg-purple-100 transform -rotate-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                            <p className="font-bold text-black">
                                                {userCoupon.user.fullName || userCoupon.user.username}
                                            </p>
                                            <p className="text-sm text-black">{userCoupon.user.email}</p>
                                            {userCoupon.user.mobileNumber && (
                                                <p className="text-sm text-black">📱 {userCoupon.user.mobileNumber}</p>
                                            )}
                                            <div className="text-xs text-black font-medium mt-2 space-y-1">
                                                <p>Status: <span className="font-bold">{userCoupon.couponStatus || 'Claimed'}</span></p>
                                                {userCoupon.remainingClaimTime && (
                                                    <p>Valid Until: {new Date(userCoupon.remainingClaimTime).toLocaleString()}</p>
                                                )}
                                                {userCoupon.isExpired && (
                                                    <p className="text-red-600 font-bold">⚠️ Expired</p>
                                                )}
                                                <p>User Since: {new Date(userCoupon.user.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center py-4 text-black font-bold">
                                    No {modalType === 'claims' ? 'claims' : 'redemptions'} yet
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const Page = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                setLoading(true);
                const response = await getAllVendorCoupons();
                if (response && response.success && response.coupons) {
                    setCoupons(response.coupons);
                } else {
                    setError('Failed to fetch coupons data');
                }
            } catch (err) {
                setError('Error fetching coupons: ' + (err.message || 'Unknown error'));
                console.error('Error fetching coupons:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCoupons();
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
                <div className="text-center bg-yellow-300 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform rotate-2">
                    <div className="animate-spin rounded-full h-12 w-12 border-8 border-black border-t-transparent mx-auto"></div>
                    <p className="mt-4 text-black font-bold">Loading coupon data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-300 border-4 border-black rounded-none p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform -rotate-1">
                    <h2 className="text-lg font-black text-black">Error Loading Data</h2>
                    <p className="text-black font-bold mt-1">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-black hover:bg-gray-800 text-white font-bold rounded-none border-2 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] transform rotate-1"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 bg-orange-50">
            <CouponAnalyticsTable coupons={coupons} />
        </div>
    );
};

export default Page;