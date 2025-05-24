// app/coupons/page.tsx - Main coupons page (Server Component) with Neo-Brutalism theme
import { Suspense } from 'react';
import AddCouponButton from './components/AddCouponButton';
import { Search } from './components/Search';
import CouponsList from './components/CouponList';

export default async function CouponsPage(props) {
    const searchParams = await props.searchParams;
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;

    return (
        <div className="max-w-7xl mx-auto pb-40">
            {/* Header section with offset shadow */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                <h1 className="text-2xl font-black text-blue-900 mb-4 sm:mb-0 relative inline-block">
                    <span className="relative z-10">COUPON MANAGEMENT</span>
                    <div className="absolute bottom-0 left-0 w-full h-3 bg-pink-500 -z-10"></div>
                </h1>
                <AddCouponButton />
            </div>

            {/* Search section with thick border */}
            <div className="mb-8 bg-white border-4 border-black p-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <Search placeholder="SEARCH COUPONS..." />
            </div>

            {/* Main content area */}
            <div className="">
                <Suspense fallback={<CouponsListSkeleton />}>
                    <CouponsList query={query} currentPage={currentPage} />
                </Suspense>
            </div>
        </div>
    );
}

function CouponsListSkeleton() {
    return (
        <div className="space-y-6">
            {Array(5).fill(0).map((_, i) => (
                <div
                    key={i}
                    className="bg-blue-100 border-4 border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                >
                    <div className="h-8 bg-gray-300 border-2 border-black rounded-none mb-4 w-1/3"></div>
                    <div className="h-6 bg-gray-300 border-2 border-black rounded-none mb-3 w-2/3"></div>
                    <div className="h-6 bg-gray-300 border-2 border-black rounded-none w-1/2"></div>
                </div>
            ))}
        </div>
    );
}