'use client';

import Link from 'next/link';
import CouponActions from './CouponActions';
import { formatDate } from '@/helpers/dateHelpers';
import ClaimsCounter from './ClaimCounter';
import { useLanguage } from '@/context/LanguageContext';

export default function CouponCard({ coupon, userId }) {

    const ctx = useLanguage();
    const t = ctx?.t;

    const isExpired = new Date(coupon.end_date) < new Date();

    // Calculate days remaining
    const endDate = new Date(coupon.end_date);
    const today = new Date();
    const daysRemaining = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));

    // Status styles
    const getStatusStyles = () => {
        if (!coupon.is_active) return 'bg-gray-300 text-black';
        if (isExpired) return 'bg-red-400 text-black';
        return 'bg-green-400 text-black';
    };

    const getStatusText = () => {
        if (!coupon.is_active) return t?.coupons?.disabled ?? "Disabled";
        if (isExpired) return t?.coupons?.expired ?? "Expired";
        return t?.coupons?.active ?? "Active";
    };

    return (
        <div className="bg-white border-4 border-black hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 transform hover:-translate-y-1">

            <div className="p-4">

                <div className="flex justify-between items-start">

                    <div>

                        <h3 className="font-bold text-2xl text-black mb-2">
                            {coupon.title}
                        </h3>

                        <p className="font-medium text-lg text-black">
                            {coupon.description}
                        </p>

                        {/* Coupon type */}

                        <p className="text-sm mt-2 font-medium uppercase">

                            {t?.coupons?.type ?? "Type"}:

                            <span className="font-bold ml-1">
                                {t?.coupons?.redeemStore ?? "Redeem at Store"}
                            </span>

                        </p>

                    </div>

                    {/* Status */}

                    <div className={`px-3 py-1 text-sm font-bold border-2 border-black ${getStatusStyles()}`}>
                        {getStatusText()}
                    </div>

                </div>

                {/* Claims Section */}

                <div
                    className="mt-4 border-2 border-black p-3"
                    style={{ backgroundColor: "#fff4ec" }}
                >

                    <ClaimsCounter
                        couponId={coupon.id}
                        initialCount={coupon.current_claims}
                        maxClaims={coupon.max_claims}
                        userId={userId}
                    />

                    <p className="mt-1">

                        {t?.coupons?.valid ?? "Valid"}:

                        {" "}

                        {formatDate(coupon.start_date)}

                        {" - "}

                        {formatDate(coupon.end_date)}

                    </p>

                    {!isExpired && daysRemaining > 0 && (

                        <p className="font-bold mt-1" style={{ color: "#df6824" }}>

                            {daysRemaining}

                            {" "}

                            {daysRemaining === 1
                                ? t?.coupons?.day ?? "Day"
                                : t?.coupons?.days ?? "Days"
                            }

                            {" "}

                            {t?.coupons?.remaining ?? "Remaining"}

                        </p>

                    )}

                    {coupon.current_redemption > 0 && (

                        <p className="mt-1">

                            {t?.coupons?.redeemed ?? "Redeemed"}:

                            {" "}

                            {coupon.current_redemption}

                        </p>

                    )}

                </div>

                {/* Actions */}

                {coupon.current_claims === 0 && (

                    <div className="mt-4 border-t-2 border-black pt-3">
                        <CouponActions couponId={coupon.id} />
                    </div>

                )}

            </div>

        </div>
    );
}