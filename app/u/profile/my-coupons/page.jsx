// app/profile/page.jsx
import React from 'react'
import { cookies } from 'next/headers'
import ClaimedCoupons from './components/ClaimedCoupons'
import RedeemedCoupons from './components/RedeemedCoupons'

const page = async () => {
    // 1️⃣ Read the incoming Cookie header
    // `cookies().toString()` gives you "key1=val1; key2=val2" etc.
    const cookieHeader = (await cookies()).toString()

    // 2️⃣ Fire both requests in parallel, forwarding the cookie header
    const [claimedRes, redeemedRes] = await Promise.all([
        fetch(
            `${process.env.NEXT_PUBLIC_SITE_URL}/api/profile/user-claimed-coupon`,
            {
                cache: 'force-cache',
                next: {
                    revalidate: 3600,
                },
                headers: {
                    // forward auth cookies/session
                    cookie: cookieHeader,
                },
                credentials: "include",
            }
        ),
        fetch(
            `${process.env.NEXT_PUBLIC_SITE_URL}/api/profile/user-redeemed-coupon`,
            {
                cache: 'force-cache',
                next: {
                    revalidate: 3600,
                },
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


// app/profile/page.jsx
// 'use client';
// import React, { useState, useEffect } from 'react';
// import ClaimedCoupons from './components/ClaimedCoupons';
// import RedeemedCoupons from './components/RedeemedCoupons';

// const ProfilePage = () => {
//     const [claimedData, setClaimedData] = useState(null);
//     const [redeemedData, setRedeemedData] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const [claimedRes, redeemedRes] = await Promise.all([
//                     fetch('/api/profile/user-claimed-coupon', {
//                         credentials: 'include',
//                     }),
//                     fetch('/api/profile/user-redeemed-coupon', {
//                         credentials: 'include',
//                     }),
//                 ]);

//                 if (!claimedRes.ok || !redeemedRes.ok) {
//                     throw new Error('Failed to fetch data');
//                 }

//                 const claimedJson = await claimedRes.json();
//                 const redeemedJson = await redeemedRes.json();

//                 setClaimedData(claimedJson);
//                 setRedeemedData(redeemedJson);
//             } catch (err) {
//                 console.error('Error fetching profile data:', err);
//                 setError(err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, []);

//     if (loading) {
//         return (
//             <div className="min-h-screen flex items-center justify-center">
//                 <div className="text-center">
//                     <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
//                     <p className="mt-4 font-bold">Loading your coupons...</p>
//                 </div>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="min-h-screen flex items-center justify-center">
//                 <div className="text-center">
//                     <p className="text-red-500 font-bold">Error: {error}</p>
//                     <button
//                         onClick={() => window.location.reload()}
//                         className="mt-4 bg-black text-white px-4 py-2 font-bold"
//                     >
//                         Retry
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div>
//             <ClaimedCoupons
//                 data={claimedData}
//                 onDataUpdate={setClaimedData} // Pass update function
//             />
//             <RedeemedCoupons
//                 data={redeemedData}
//                 onDataUpdate={setRedeemedData} // Pass update function
//             />
//         </div>
//     );
// };

// export default ProfilePage;