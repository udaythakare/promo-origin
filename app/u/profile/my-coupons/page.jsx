import React from 'react'
import { fetchUserClaimedCoupons, fetchUserRedeemedCoupons } from '@/actions/couponActions'
import ClaimedCoupons from './components/ClaimedCoupons';
import RedeemedCoupons from './components/RedeemedCoupons';

const page = async () => {
    const data = await fetchUserClaimedCoupons();
    const redeemedData = await fetchUserRedeemedCoupons(); // Assuming you have a function to fetch redeemed coupons
    return (
        <div>
            <ClaimedCoupons data={data} />
            <RedeemedCoupons data={redeemedData} />

            Under construction
        </div>
    )
}

export default page
