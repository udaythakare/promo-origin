// app/profile/page.jsx
import React from 'react'
import { cookies } from 'next/headers'
import ClaimedCoupons from './components/ClaimedCoupons'
import RedeemedCoupons from './components/RedeemedCoupons'

const page = async () => {
    // 1️⃣ Read the incoming Cookie header
    // `cookies().toString()` gives you "key1=val1; key2=val2" etc.
    const cookieHeader = cookies().toString()

    // 2️⃣ Fire both requests in parallel, forwarding the cookie header
    const [claimedRes, redeemedRes] = await Promise.all([
        fetch(
            `${process.env.NEXT_PUBLIC_SITE_URL}/api/profile/user-claimed-coupon`,
            {
                cache: 'no-store',
                headers: {
                    // forward auth cookies/session
                    cookie: cookieHeader,
                },
                credentials: "include"
            }
        ),
        fetch(
            `${process.env.NEXT_PUBLIC_SITE_URL}/api/profile/user-redeemed-coupon`,
            {
                cache: 'no-store',
                headers: { cookie: cookieHeader },
                credentials: "include"
            },
        ),
    ])

    // 3️⃣ Parse JSON
    const claimedJson = await claimedRes.json()
    const redeemedJson = await redeemedRes.json()

    // console.log(claimedJson, 'claimedJson')

    // 4️⃣ Render components
    return (
        <div>
            <ClaimedCoupons data={claimedJson} />
            <RedeemedCoupons data={redeemedJson} />
        </div>
    )
}

export default page
