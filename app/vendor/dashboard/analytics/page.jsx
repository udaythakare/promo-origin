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
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Coupon Analytics</h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg shadow p-4 border">
                    <div className="flex flex-row items-center justify-between pb-2">
                        <h3 className="text-sm font-medium text-gray-600">Total Available Coupons</h3>
                        <Package className="h-4 w-4 text-gray-500" />
                    </div>
                    <div className="text-2xl font-bold">{totalMaxClaims}</div>
                </div>

                <div className="bg-white rounded-lg shadow p-4 border">
                    <div className="flex flex-row items-center justify-between pb-2">
                        <h3 className="text-sm font-medium text-gray-600">Total Claimed Coupons</h3>
                        <Users className="h-4 w-4 text-gray-500" />
                    </div>
                    <div className="text-2xl font-bold">{totalCurrentClaims}</div>
                </div>

                <div className="bg-white rounded-lg shadow p-4 border">
                    <div className="flex flex-row items-center justify-between pb-2">
                        <h3 className="text-sm font-medium text-gray-600">Total Redeemed Coupons</h3>
                        <CheckCircle className="h-4 w-4 text-gray-500" />
                    </div>
                    <div className="text-2xl font-bold">{totalRedemptions}</div>
                </div>
            </div>

            {/* Responsive Table */}
            <div className="overflow-x-auto rounded-md border bg-white">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Title
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                                Description
                            </th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Available
                            </th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Claimed
                            </th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Redeemed
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Validity
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {coupons.map((coupon) => (
                            <tr key={coupon.id}>
                                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                    {coupon.title}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-500 hidden md:table-cell">
                                    {coupon.description}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-center">
                                    {coupon.max_claims}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <button
                                        onClick={() => openModal(coupon, 'claims')}
                                        className="text-blue-600 hover:underline font-medium"
                                    >
                                        {coupon.current_claims}
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <button
                                        onClick={() => openModal(coupon, 'redemptions')}
                                        className="text-blue-600 hover:underline font-medium"
                                    >
                                        {coupon.current_redemption}
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
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
                    <div className="bg-white rounded-lg max-w-md w-full max-h-screen overflow-hidden">
                        <div className="px-4 py-3 border-b flex justify-between items-center">
                            <h3 className="font-medium text-lg">
                                Users Who {modalType === 'claims' ? 'Claimed' : 'Redeemed'} "{selectedCoupon.title}"
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="p-4 max-h-96 overflow-y-auto">
                            {((modalType === 'claims' && selectedCoupon.current_claims > 0) ||
                                (modalType === 'redemptions' && selectedCoupon.current_redemption > 0)) ? (
                                <div className="space-y-3">
                                    {mockUsers.slice(0, modalType === 'claims' ?
                                        selectedCoupon.current_claims : selectedCoupon.current_redemption).map(user => (
                                            <div key={user.id} className="p-3 rounded-md border">
                                                <p className="font-medium">{user.name}</p>
                                                <p className="text-sm text-gray-500">{user.email}</p>
                                                <p className="text-xs text-gray-400">
                                                    {modalType === 'claims' ? 'Claimed' : 'Redeemed'}: {new Date(user.claimed_at).toLocaleString()}
                                                </p>
                                            </div>
                                        ))}
                                </div>
                            ) : (
                                <p className="text-center py-4 text-gray-500">
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
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading coupon data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <h2 className="text-lg font-medium text-red-800">Error Loading Data</h2>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-3 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-md text-sm"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <CouponAnalyticsTable coupons={coupons} />
        </div>
    );
};

export default Page;