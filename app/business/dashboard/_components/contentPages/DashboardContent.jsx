'use client';

import React, { useState, useEffect } from 'react';
import { FiShoppingCart, FiUsers, FiTag, FiCheckCircle } from 'react-icons/fi';
import StatCard from '../StatCard';
import RecentCouponsTable from '../RecentCouponTable';
import ActivityFeed from '../ActivityFeed';
import { useLanguage } from '@/context/LanguageContext';

async function fetchDashboardStats() {
    const res = await fetch('/api/vendors/dashboard-stats', {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error('Failed to fetch stats');
    }

    return res.json();
}

const DashboardContent = () => {

    const ctx = useLanguage();
    const t = ctx?.t;

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        fetchDashboardStats()
            .then((data) => setStats(data))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));

    }, []);

    /* ---------------- LOADING ---------------- */

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">

                    <div
                        className="w-10 h-10 border-4 rounded-full animate-spin mx-auto mb-3"
                        style={{
                            borderColor: '#df6824',
                            borderTopColor: 'transparent'
                        }}
                    />

                    <p className="text-gray-600 font-medium">
                        {t?.dashboard?.loading ?? 'Loading dashboard...'}
                    </p>

                </div>
            </div>
        );
    }

    /* ---------------- ERROR ---------------- */

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">

                <div className="bg-white border-4 border-black p-6 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">

                    <p className="font-black text-black mb-3">
                        {t?.dashboard?.errorTitle ?? 'Error Loading Data'}
                    </p>

                    <button
                        onClick={() => {
                            setError(null);
                            setLoading(true);

                            fetchDashboardStats()
                                .then(setStats)
                                .catch((e) => setError(e.message))
                                .finally(() => setLoading(false));
                        }}
                        className="px-4 py-2 text-white font-bold text-sm border-2 border-black"
                        style={{ backgroundColor: '#df6824' }}
                    >
                        {t?.dashboard?.tryAgain ?? 'Try Again'}
                    </button>

                </div>

            </div>
        );
    }

    /* ---------------- STAT CARDS ---------------- */

    const statCards = [

        {
            icon: <FiTag size={22} />,
            title: t?.dashboard?.totalCoupons ?? 'Total Coupons',
            value: stats?.totalCoupons ?? 0,
            trend: null,
            color: 'bg-orange-50',
            iconColor: '#df6824'
        },

        {
            icon: <FiCheckCircle size={22} />,
            title: t?.dashboard?.couponsRedeemed ?? 'Coupons Redeemed',
            value: stats?.totalRedeemed ?? 0,
            trend: null,
            color: 'bg-orange-50',
            iconColor: '#df6824'
        },

        {
            icon: <FiUsers size={22} />,
            title: t?.dashboard?.totalClaims ?? 'Total Claims',
            value: stats?.totalClaims ?? 0,
            trend: null,
            color: 'bg-orange-50',
            iconColor: '#df6824'
        },

        {
            icon: <FiShoppingCart size={22} />,
            title: t?.dashboard?.activeCoupons ?? 'Active Coupons',
            value: stats?.activeCoupons ?? 0,
            trend: null,
            color: 'bg-orange-50',
            iconColor: '#df6824'
        }

    ];

    /* ---------------- UI ---------------- */

    return (
        <>

            {/* Stat Cards */}

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6">

                {statCards.map((card, idx) => (

                    <StatCard
                        key={idx}
                        icon={React.cloneElement(card.icon, { style: { color: card.iconColor } })}
                        title={card.title}
                        value={card.value}
                        trend={card.trend}
                        color={card.color}
                    />

                ))}

            </div>

            {/* Table + Activity */}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">

                <div className="lg:col-span-2">
                    <RecentCouponsTable coupons={stats?.recentCoupons ?? []} />
                </div>

                <div>
                    <ActivityFeed coupons={stats?.recentCoupons ?? []} />
                </div>

            </div>

        </>
    );
};

export default DashboardContent;