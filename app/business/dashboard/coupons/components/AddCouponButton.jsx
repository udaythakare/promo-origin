'use client';

import Link from 'next/link';

export default function AddCouponButton() {
    return (
        <Link
            href="/business/dashboard/coupons/new"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md inline-flex items-center"
        >
            <span className="mr-1">+</span> Add New Coupon
        </Link>
    );
}
