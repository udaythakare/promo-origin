'use client';

import React from 'react';
import { FiDollarSign, FiShoppingCart, FiUsers, FiEye } from 'react-icons/fi';
import StatCard from '../StatCard';
import RecentCouponsTable from '../RecentCouponTable';
import ActivityFeed from '../ActivityFeed';

const DashboardContent = () => {
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatCard
                    icon={<FiDollarSign size={22} className="text-blue-600" />}
                    title="Total Revenue"
                    value="$12,876"
                    trend={12.5}
                    color="bg-blue-50"
                />
                <StatCard
                    icon={<FiShoppingCart size={22} className="text-green-600" />}
                    title="Coupons Redeemed"
                    value="823"
                    trend={8.2}
                    color="bg-green-50"
                />
                <StatCard
                    icon={<FiUsers size={22} className="text-purple-600" />}
                    title="New Customers"
                    value="143"
                    trend={-3.8}
                    color="bg-purple-50"
                />
                <StatCard
                    icon={<FiEye size={22} className="text-amber-600" />}
                    title="Coupon Views"
                    value="16,438"
                    trend={24.3}
                    color="bg-amber-50"
                />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <RecentCouponsTable />
                </div>
                <div>
                    <ActivityFeed />
                </div>
            </div>
        </>
    );
};

export default DashboardContent;