'use client';
import Link from 'next/link';
import CouponActions from './CouponActions';
import { formatDate } from '@/helpers/dateHelpers';
import ClaimsCounter from './ClaimCounter';

export default function CouponCard({ coupon, userId }) {
    // Remove the realtime hook - just use the coupon prop directly
    const isExpired = new Date(coupon.end_date) < new Date();

    // Calculate days remaining
    const endDate = new Date(coupon.end_date);
    const today = new Date();
    const daysRemaining = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));

    // Choose status color
    const getStatusStyles = () => {
        if (!coupon.is_active) return 'bg-gray-300 text-black';
        if (isExpired) return 'bg-red-400 text-black';
        return 'bg-green-400 text-black';
    };

    return (
        <div className="bg-white border-4 border-black hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 transform hover:-translate-y-1">
            <div className="p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-2xl text-black mb-2">{coupon.title}</h3>
                        <p className="font-medium text-lg text-black">{coupon.description}</p>
                        {coupon.coupon_type && (
                            <p className="text-sm mt-2 font-medium uppercase">
                                Type: <span className="font-bold">{coupon.coupon_type.replace(/_/g, ' ')}</span>
                            </p>
                        )}
                    </div>
                    <div className={`px-3 py-1 text-sm font-bold border-2 border-black ${getStatusStyles()}`}>
                        {!coupon.is_active ? 'DISABLED' : isExpired ? 'EXPIRED' : 'ACTIVE'}
                    </div>
                </div>
                <div className="mt-4 bg-blue-100 border-2 border-black p-3">
                    <ClaimsCounter
                        couponId={coupon.id}
                        initialCount={coupon.current_claims}
                        maxClaims={coupon.max_claims}
                        userId={userId}
                    />
                    <p className="mt-1">
                        Valid: {formatDate(coupon.start_date)} - {formatDate(coupon.end_date)}
                    </p>
                    {!isExpired && daysRemaining > 0 && (
                        <p className="font-bold mt-1 text-blue-800">
                            {daysRemaining} {daysRemaining === 1 ? 'DAY' : 'DAYS'} REMAINING
                        </p>
                    )}
                    {coupon.current_redemption > 0 && (
                        <p className="mt-1">
                            Redeemed: {coupon.current_redemption}
                        </p>
                    )}
                </div>
                {coupon.current_claims === 0 && (
                    <div className="mt-4 border-t-2 border-black pt-3">
                        <CouponActions couponId={coupon.id} />
                    </div>
                )}
            </div>
        </div>
    );
}