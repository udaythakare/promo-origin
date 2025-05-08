// app/coupons/page.tsx - Main coupons page (Server Component)
import { Suspense } from 'react';
// import CouponsList from './components/CouponsList';
import AddCouponButton from './components/AddCouponButton';
import { getAllCoupons } from './actions/couponActions';
import { Search } from './components/Search';
import CouponsList from './components/CouponList';

export default async function CouponsPage({
    searchParams,
}) {
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h1 className="text-2xl font-bold text-blue-800 mb-4 sm:mb-0">Coupon Management</h1>
                <AddCouponButton />
            </div>

            <div className="mb-6">
                <Search placeholder="Search coupons..." />
            </div>

            <Suspense fallback={<CouponsListSkeleton />}>
                <CouponsList query={query} currentPage={currentPage} />
            </Suspense>
        </div>
    );
}

function CouponsListSkeleton() {
    return (
        <div className="space-y-4">
            {Array(5).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                    <div className="h-6 bg-gray-200 rounded animate-pulse mb-3 w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-2/3"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                </div>
            ))}
        </div>
    );
}
