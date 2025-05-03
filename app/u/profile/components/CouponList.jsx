import CouponCard from './CouponCard';

export default function CouponsList({ coupons, userId }) {
    if (!coupons || coupons.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">You haven't claimed any coupons yet.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {coupons.map((couponData) => (
                <CouponCard
                    key={couponData.id}
                    coupon={couponData.coupons}
                    userId={userId}
                />
            ))}
        </div>
    );
}