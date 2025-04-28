'use client'
import { getSession } from 'next-auth/react'
import React from 'react'
import { handleClaimCouponAction } from './actions/claimCouponActions'

const ClaimButton = ({ couponId, couponStatus }) => {

    const handleClaimCoupon = async () => {
        console.log('this is handleClaim')
        const params = {
            couponId,
        }
        const res = await handleClaimCouponAction(params);

        console.log(res.message)


    }
    return (
        <button onClick={() => handleClaimCoupon()} disabled={couponStatus}>
            claim
        </button>
    )
}

export default ClaimButton
