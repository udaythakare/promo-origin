// app/coupons/components/CouponCard.tsx (Server Component)
import Link from 'next/link';
// import { formatDate } from '../utils/dateUtils';
import CouponActions from './CouponActions';
import { formatDate } from '@/helpers/dateHelpers';

export default function CouponCard({ coupon }) {
    const isExpired = new Date(coupon.end_date) < new Date();
    const usageLimit = coupon.max_uses
        ? `${coupon.current_uses}/${coupon.max_uses}`
        : `${coupon.current_uses}/∞`;

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-medium text-lg text-blue-800">{coupon.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">Code: <span className="font-mono bg-blue-50 px-1 py-0.5 rounded">{coupon.code}</span></p>
                    </div>
                    <div className={`px-2 py-1 text-xs rounded-full ${!coupon.is_active ? 'bg-gray-100 text-gray-600' :
                        isExpired ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                        }`}>
                        {!coupon.is_active ? 'Disabled' : isExpired ? 'Expired' : 'Active'}
                    </div>
                </div>

                <div className="mt-3 text-sm">
                    <p className="text-gray-700">
                        {coupon.discount_type === 'percentage' ? `${coupon.discount_value}% off` :
                            coupon.discount_type === 'fixed_amount' ? `$${coupon.discount_value} off` :
                                coupon.discount_type === 'buy_one_get_one' ? 'Buy one get one free' : 'Free item'}
                    </p>
                    <p className="text-gray-500 mt-1">
                        Valid: {formatDate(coupon.start_date)} - {formatDate(coupon.end_date)}
                    </p>
                    <p className="text-gray-500 mt-1">
                        Uses: {usageLimit}
                    </p>
                </div>

                <div className="mt-4 flex justify-end">
                    <CouponActions couponId={coupon.id} />
                </div>
            </div>
        </div>
    );
}
