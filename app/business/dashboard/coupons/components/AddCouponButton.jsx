// AddCouponButton.tsx - Neo-Brutalism style
'use client';
import Link from 'next/link';

export default function AddCouponButton() {
    return (
        <Link
            href="/business/dashboard/coupons/new"
            className="bg-green-500 text-black font-bold py-3 px-6 border-4 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-200 transform inline-flex items-center"
        >
            <span className="mr-2 text-xl font-black">+</span> ADD NEW COUPON
        </Link>
    );
}