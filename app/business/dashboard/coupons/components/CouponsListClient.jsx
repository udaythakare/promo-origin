'use client';
import CouponCard from './CouponCard';
import Pagination from './Pagination';

export default function CouponsListClient({
    initialCoupons,
    totalCount,
    currentPage,
    userId,
    couponsPerPage
}) {
    // Remove the realtime hook - just use initial coupons
    const coupons = initialCoupons;
    const totalPages = Math.ceil(totalCount / couponsPerPage);

    if (coupons.length === 0) {
        return (
            <div className="bg-orange-100 border-4 border-black p-8 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <p className="text-black font-bold text-xl">NO COUPONS FOUND. CREATE YOUR FIRST COUPON TO GET STARTED!</p>
            </div>
        );
    }

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coupons.map((coupon) => (
                    <CouponCard key={coupon.id} coupon={coupon} userId={userId} />
                ))}
            </div>
            {totalPages > 1 && (
                <div className="mt-12">
                    <Pagination totalPages={totalPages} currentPage={currentPage} />
                </div>
            )}
        </div>
    );
}