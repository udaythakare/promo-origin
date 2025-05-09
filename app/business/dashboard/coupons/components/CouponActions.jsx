// CouponActions.tsx - Neo-Brutalism style
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
            <div className="flex flex-wrap gap-2">
                <Link
                    href={`/business/dashboard/coupons/${couponId}`}
                    className="bg-blue-400 text-black px-4 py-1 border-2 border-black font-bold hover:bg-blue-500 transition-colors"
                >
                    VIEW
                </Link>
                <Link
                    href={`/business/dashboard/coupons/edit/${couponId}`}
                    className="bg-yellow-400 text-black px-4 py-1 border-2 border-black font-bold hover:bg-yellow-500 transition-colors"
                >
                    EDIT
                </Link>
                <button
                    onClick={() => setShowDeleteModal(true)}
                    className="bg-red-400 text-black px-4 py-1 border-2 border-black font-bold hover:bg-red-500 transition-colors"
                >
                    DELETE
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