'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { Package, Users, CheckCircle, X } from 'lucide-react';
import { getAllVendorCoupons } from './actions/analyticsActions';

const CouponAnalyticsTable = ({ coupons }) => {
    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [modalType, setModalType] = useState(null); // 'claims' or 'redemptions'
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (coupon, type) => {
        setSelectedCoupon(coupon);
        setModalType(type);
        setIsModalOpen(true);
    };

    // Calculate totals for summary cards
    const totalMaxClaims = coupons.reduce((sum, coupon) => sum + coupon.max_claims, 0);
    const totalCurrentClaims = coupons.reduce((sum, coupon) => sum + coupon.current_claims, 0);
    const totalRedemptions = coupons.reduce((sum, coupon) => sum + coupon.current_redemption, 0);

    // Mock user data for demonstration (in a real app, you would fetch this data)
    const mockUsers = [
        { id: 1, name: "John Doe", email: "john@example.com", claimed_at: "2025-05-02T14:30:00" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", claimed_at: "2025-05-02T16:45:00" },
        { id: 3, name: "Bob Johnson", email: "bob@example.com", claimed_at: "2025-05-03T09:15:00" }
    ];

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
                                        className="bg-blue-400 text-black hover:bg-blue-500 font-bold px-4 py-1 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                                    >
                                        {coupon.current_claims}
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center border-b-2 border-black">
                                    <button
                                        onClick={() => openModal(coupon, 'redemptions')}
                                        className="bg-pink-400 text-black hover:bg-pink-500 font-bold px-4 py-1 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                                    >
                                        {coupon.current_redemption}
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
                            {((modalType === 'claims' && selectedCoupon.current_claims > 0) ||
                                (modalType === 'redemptions' && selectedCoupon.current_redemption > 0)) ? (
                                <div className="space-y-4">
                                    {mockUsers.slice(0, modalType === 'claims' ?
                                        selectedCoupon.current_claims : selectedCoupon.current_redemption).map(user => (
                                            <div key={user.id} className="p-3 border-3 border-black bg-purple-100 transform -rotate-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                                <p className="font-bold text-black">{user.name}</p>
                                                <p className="text-sm text-black">{user.email}</p>
                                                <p className="text-xs text-black font-medium">
                                                    {modalType === 'claims' ? 'Claimed' : 'Redeemed'}: {new Date(user.claimed_at).toLocaleString()}
                                                </p>
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