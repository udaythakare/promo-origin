import { getAllCoupons } from '../actions/couponActions';
import CouponCard from './CouponCard';
import Pagination from './Pagination';

export default async function CouponsList({
    query,
    currentPage
}) {
    const couponsPerPage = 10;
    const { coupons, totalCount } = await getAllCoupons(query, currentPage, couponsPerPage);
    console.log(coupons, 'this is coupons');
    const totalPages = Math.ceil(totalCount / couponsPerPage);

    if (coupons.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <p className="text-gray-500">No coupons found. Create your first coupon to get started.</p>
            </div>
        );
    }

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {coupons.map((coupon) => (
                    <CouponCard key={coupon.id} coupon={coupon} />
                ))}
            </div>

            {totalPages > 1 && (
                <div className="mt-8">
                    <Pagination totalPages={totalPages} currentPage={currentPage} />
                </div>
            )}
        </div>
    );
}