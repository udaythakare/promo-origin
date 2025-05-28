import { useState } from 'react';
import { claimCoupon } from '@/actions/couponActions';

export const useCouponClaim = (refreshCouponData) => {
    const [claimingCoupons, setClaimingCoupons] = useState({});
    const [pendingClaim, setPendingClaim] = useState({
        couponId: null,
        couponType: null,
        redeemDuration: null,
        endDate: null,
        title: null
    });
    const [showModal, setShowModal] = useState(false);

    const handleClaimCouponClick = (coupon) => {
        const endDate = coupon.coupon_type === 'redeem_online'
            ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            : null;

        setPendingClaim({
            couponId: coupon.id,
            couponType: coupon.coupon_type,
            redeemDuration: coupon.redeem_duration || (coupon.coupon_type === 'redeem_at_store' ? '10 minutes' : null),
            endDate: endDate,
            title: coupon.title
        });

        setShowModal(true);
    };

    const handleClaimCoupon = async (id, coupon_type, redeem_duration, end_date) => {
        let redeemMinutes = 0;
        let message = '';

        if (coupon_type === 'redeem_at_store') {
            redeemMinutes = redeem_duration === "5 minutes" ? 5 : 10;
            message = `This coupon is for in-store redemption only. You have ${redeemMinutes} minutes to redeem this coupon.`;
        } else if (coupon_type === 'redeem_online') {
            const endDateObj = end_date ? new Date(end_date) : null;
            if (endDateObj && !isNaN(endDateObj.getTime())) {
                const formattedDate = endDateObj.toLocaleDateString();
                message = `You can redeem this online coupon anytime until ${formattedDate}.`;
            } else {
                message = "You can redeem this online coupon.";
            }
        }

        setClaimingCoupons(prev => ({ ...prev, [id]: 'claiming' }));

        try {
            const response = await claimCoupon(id, redeemMinutes);

            if (!response || !response.success) {
                throw new Error(response?.message || "Error claiming coupon");
            }

            alert(`Coupon claimed successfully! ${message}`);
            setClaimingCoupons(prev => ({ ...prev, [id]: 'claimed' }));
            await refreshCouponData();
        } catch (error) {
            console.error('Error claiming coupon:', error);
            const errorMessage = error.message || "Error claiming coupon";
            alert(errorMessage);
            setClaimingCoupons(prev => ({ ...prev, [id]: 'error' }));
            throw error;
        } finally {
            setTimeout(() => {
                setClaimingCoupons(prev => {
                    const newState = { ...prev };
                    delete newState[id];
                    return newState;
                });
            }, 2000);
        }
    };

    const handleConfirmClaim = async () => {
        setShowModal(false);

        if (!pendingClaim.couponId) {
            throw new Error("No coupon selected for claiming");
        }

        console.log(pendingClaim, 'this is pending claim from claim coupons')

        try {
            await handleClaimCoupon(
                pendingClaim.couponId,
                pendingClaim.couponType,
                pendingClaim.redeemDuration,
                pendingClaim.endDate
            );
        } finally {
            setPendingClaim({
                couponId: null,
                couponType: null,
                redeemDuration: null,
                endDate: null
            });
        }
    };

    return {
        claimingCoupons,
        pendingClaim,
        showModal,
        setShowModal,
        handleClaimCouponClick,
        handleConfirmClaim
    };
};
