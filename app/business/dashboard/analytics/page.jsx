'use client';

import React, { useState, useEffect } from 'react';
import { Package, Users, CheckCircle, X } from 'lucide-react';
import { getAllVendorCoupons } from './actions/analyticsActions';
import { useLanguage } from '@/context/LanguageContext';

import ClaimsChart from './components/ClaimsChart';
import CouponPerformanceChart from './components/CouponPerformanceChart';

const CouponAnalyticsTable = ({ coupons }) => {

    const { t } = useLanguage();

    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [modalType, setModalType] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const openModal = async (coupon, type) => {

        setLoading(true);
        setError(null);

        try {

            const endpoint =
                type === 'claims'
                    ? 'claimed-coupon-users'
                    : 'redeemed-coupon-users';

            const url = new URL(
                `${process.env.NEXT_PUBLIC_SITE_URL}/api/analytics/${endpoint}`
            );

            url.searchParams.append('couponId', coupon.id);

            const response = await fetch(url.toString(), {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {

                const userData = await response.json();
                setUsers(userData);

            } else {

                const errorData = await response.json();
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

    const totalMaxClaims = coupons.reduce(
        (sum, coupon) => sum + (coupon.max_claims || 0),
        0
    );

    const totalCurrentClaims = coupons.reduce(
        (sum, coupon) => sum + (coupon.current_claims || 0),
        0
    );

    const totalRedemptions = coupons.reduce(
        (sum, coupon) => sum + (coupon.current_redemption || 0),
        0
    );

    return (

        <div className="space-y-10">

            <h1 className="text-3xl font-black text-black bg-[#df6824] inline-block px-4 py-2 transform rotate-1 border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)]">
                {t?.analytics?.title ?? "Coupon Analytics"}
            </h1>

            {/* SUMMARY CARDS */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <div className="bg-[#df6824] p-5 border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] transform -rotate-1">

                    <div className="flex justify-between items-center">
                        <h3 className="text-sm font-bold">
                            {t?.analytics?.totalCoupons ?? "Total Available Coupons"}
                        </h3>
                        <Package />
                    </div>

                    <p className="text-3xl font-black mt-2">
                        {totalMaxClaims}
                    </p>

                </div>

                <div className="bg-[#df6824] p-5 border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] transform rotate-1">

                    <div className="flex justify-between items-center">
                        <h3 className="text-sm font-bold">
                            {t?.analytics?.totalClaims ?? "Total Claimed Coupons"}
                        </h3>
                        <Users />
                    </div>

                    <p className="text-3xl font-black mt-2">
                        {totalCurrentClaims}
                    </p>

                </div>

                <div className="bg-[#df6824] p-5 border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] transform -rotate-1">

                    <div className="flex justify-between items-center">
                        <h3 className="text-sm font-bold">
                            {t?.analytics?.totalRedemptions ?? "Total Redeemed Coupons"}
                        </h3>
                        <CheckCircle />
                    </div>

                    <p className="text-3xl font-black mt-2">
                        {totalRedemptions}
                    </p>

                </div>

            </div>

            {/* CHARTS */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                <ClaimsChart
                    data={coupons.map(c => ({
                        date: new Date(c.start_date).toLocaleDateString(),
                        claims: c.current_claims || 0
                    }))}
                />

                <CouponPerformanceChart
                    data={coupons.map(c => ({
                        name: c.title,
                        claims: c.current_claims || 0,
                        redeemed: c.current_redemption || 0
                    }))}
                />

            </div>

            {/* TABLE */}

            <div className="overflow-x-auto border-4 border-black bg-white shadow-[8px_8px_0px_rgba(0,0,0,1)]">

                <table className="min-w-full">

                    <thead className="bg-[#df6824]">

                        <tr>

                            <th className="px-6 py-4 text-left font-black">
                                {t?.coupons?.title ?? "Title"}
                            </th>

                            <th className="px-6 py-4 hidden md:table-cell font-black">
                                {t?.coupons?.description ?? "Description"}
                            </th>

                            <th className="px-6 py-4 text-center font-black">
                                Available
                            </th>

                            <th className="px-6 py-4 text-center font-black">
                                Claimed
                            </th>

                            <th className="px-6 py-4 text-center font-black">
                                Redeemed
                            </th>

                            <th className="px-6 py-4 font-black">
                                Validity
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {coupons.map((coupon, index) => (

                            <tr
                                key={coupon.id}
                                className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}
                            >

                                <td className="px-6 py-4 font-bold border-b-2 border-black">
                                    {coupon.title}
                                </td>

                                <td className="px-6 py-4 hidden md:table-cell border-b-2 border-black">
                                    {coupon.description}
                                </td>

                                <td className="text-center border-b-2 border-black">
                                    {coupon.max_claims}
                                </td>

                                <td className="text-center border-b-2 border-black">

                                    <button
                                        onClick={() => openModal(coupon, 'claims')}
                                        className="bg-[#df6824] px-4 py-1 border-2 border-black shadow-[3px_3px_0px]"
                                    >
                                        {coupon.current_claims}
                                    </button>

                                </td>

                                <td className="text-center border-b-2 border-black">

                                    <button
                                        onClick={() => openModal(coupon, 'redemptions')}
                                        className="bg-[#df6824] px-4 py-1 border-2 border-black shadow-[3px_3px_0px]"
                                    >
                                        {coupon.current_redemption}
                                    </button>

                                </td>

                                <td className="border-b-2 border-black px-6">

                                    {new Date(coupon.start_date).toLocaleDateString()} -{' '}
                                    {new Date(coupon.end_date).toLocaleDateString()}

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

            {/* MODAL */}

            {isModalOpen && selectedCoupon && (

                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">

                    <div className="bg-white border-4 border-black shadow-[12px_12px_0px] max-w-md w-full">

                        <div className="bg-[#df6824] p-3 flex justify-between border-b-4 border-black">

                            <h3 className="font-black">

                                {modalType === 'claims'
                                    ? t?.analytics?.usersClaimed ?? "Users Who Claimed"
                                    : t?.analytics?.usersRedeemed ?? "Users Who Redeemed"}

                            </h3>

                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="bg-black text-white p-1 border-2 border-black"
                            >
                                <X />
                            </button>

                        </div>

                        <div className="p-4">

                            {loading ? (

                                <p>{t?.analytics?.loading ?? "Loading..."}</p>

                            ) : users.length > 0 ? (

                                users.map(userCoupon => (

                                    <div
                                        key={userCoupon.claimId}
                                        className="border-2 border-black p-3 mb-3"
                                    >

                                        <p className="font-bold">
                                            {userCoupon.user.fullName ||
                                                userCoupon.user.username}
                                        </p>

                                        <p className="text-sm">
                                            {userCoupon.user.email}
                                        </p>

                                    </div>

                                ))

                            ) : (

                                <p>No data found</p>

                            )}

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
};

const Page = () => {

    const { t } = useLanguage();

    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchCoupons = async () => {

            const response = await getAllVendorCoupons();

            if (response?.success) {
                setCoupons(response.coupons);
            }

            setLoading(false);

        };

        fetchCoupons();

    }, []);

    if (loading) {

        return (

            <div className="flex justify-center items-center h-64">

                <div className="bg-[#df6824] p-6 border-4 border-black shadow-[8px_8px_0px]">

                    <p className="font-bold">
                        {t?.analytics?.loading ?? "Loading analytics..."}
                    </p>

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