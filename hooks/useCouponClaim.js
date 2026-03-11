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

        setPendingClaim({
            couponId: coupon.id,
            couponType: 'redeem_at_store',
            redeemDuration: coupon.redeem_duration || '10 minutes',
            endDate: null,
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

        }

        setClaimingCoupons(prev => ({ ...prev, [id]: 'claiming' }));

        try {

            const response = await claimCoupon(id, redeemMinutes);

            if (!response || !response.success) {

                const errorMessage = response?.message || "Error claiming coupon";

                alert(errorMessage);

                setClaimingCoupons(prev => ({ ...prev, [id]: 'error' }));

                return;
            }

            alert(`Coupon claimed successfully! ${message}`);

            setClaimingCoupons(prev => ({ ...prev, [id]: 'claimed' }));

            await refreshCouponData();

        } catch (error) {

            console.error('Error claiming coupon:', error);

            alert(error.message || "Error claiming coupon");

            setClaimingCoupons(prev => ({ ...prev, [id]: 'error' }));

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
            alert("No coupon selected for claiming");
            return;
        }

        console.log(pendingClaim, 'this is pending claim from claim coupons')

        await handleClaimCoupon(
            pendingClaim.couponId,
            pendingClaim.couponType,
            pendingClaim.redeemDuration,
            pendingClaim.endDate
        );

        setPendingClaim({
            couponId: null,
            couponType: null,
            redeemDuration: null,
            endDate: null
        });

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