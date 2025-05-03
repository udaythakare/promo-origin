// app/coupons/components/CouponCard.tsx (Server Component)
import Link from 'next/link';
import CouponActions from './CouponActions';
import { formatDate } from '@/helpers/dateHelpers';
import Image from 'next/image';

export default function CouponCard({ coupon }) {
    const isExpired = new Date(coupon.end_date) < new Date();
    const usageStatus = coupon.max_claims
        ? `${coupon.current_claims}/${coupon.max_claims} claimed`
        : 'Unlimited claims';

    // Calculate days remaining
    const endDate = new Date(coupon.end_date);
    const today = new Date();
    const daysRemaining = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
            {coupon.image_url && (
                <div className="relative h-40 w-full overflow-hidden rounded-t-lg">
                    <Image
                        src={coupon.image_url}
                        alt={coupon.title}
                        fill
                        className="object-cover"
                    />
                    <div className="absolute top-2 right-2 px-3 py-1 bg-red-600 text-white font-bold rounded-full text-sm">
                        {coupon.title}
                    </div>
                </div>
            )}
            <div className="p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-medium text-lg text-blue-800">{coupon.description}</h3>
                        {coupon.coupon_type && (
                            <p className="text-xs text-gray-600 mt-1">
                                Type: <span className="font-medium">{coupon.coupon_type.replace(/_/g, ' ')}</span>
                            </p>
                        )}
                    </div>
                    <div className={`px-2 py-1 text-xs rounded-full ${!coupon.is_active ? 'bg-gray-100 text-gray-600' :
                        isExpired ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                        }`}>
                        {!coupon.is_active ? 'Disabled' : isExpired ? 'Expired' : 'Active'}
                    </div>
                </div>
                <div className="mt-3 text-sm">
                    <p className="text-gray-700">
                        {usageStatus}
                    </p>
                    <p className="text-gray-500 mt-1">
                        Valid: {formatDate(coupon.start_date)} - {formatDate(coupon.end_date)}
                    </p>
                    {!isExpired && daysRemaining > 0 && (
                        <p className="text-blue-600 font-medium mt-1">
                            {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} remaining
                        </p>
                    )}
                    {coupon.current_redemption > 0 && (
                        <p className="text-gray-500 mt-1">
                            Redeemed: {coupon.current_redemption}
                        </p>
                    )}
                </div>
                <div className="mt-4 flex justify-end">
                    <CouponActions couponId={coupon.id} />
                </div>
            </div>
        </div>
    );
}