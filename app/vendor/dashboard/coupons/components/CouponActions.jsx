// app/coupons/components/CouponActions.tsx (Client Component)
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DeleteCouponModal from './DeleteCouponModal';

export default function CouponActions({ couponId }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const router = useRouter();

    return (
        <>
            <div className="flex space-x-2">
                <Link
                    href={`/vendor/dashboard/coupons/${couponId}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                    View
                </Link>
                <Link
                    href={`/vendor/dashboard/coupons/edit/${couponId}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                    Edit
                </Link>
                <button
                    onClick={() => setShowDeleteModal(true)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                    Delete
                </button>
            </div>

            {showDeleteModal && (
                <DeleteCouponModal
                    couponId={couponId}
                    onClose={() => setShowDeleteModal(false)}
                />
            )}
        </>
    );
}