// CouponActions.tsx - Neo-Brutalism style
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DeleteCouponModal from './DeleteCouponModal';
import { useLanguage } from '@/context/LanguageContext';

export default function CouponActions({ couponId }) {

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const router = useRouter();

    const ctx = useLanguage();
    const t = ctx?.t;

    return (
        <>
            <div className="flex flex-wrap gap-2">

                {/* VIEW */}

                <Link
                    href={`/business/dashboard/coupons/${couponId}`}
                    className="text-black px-4 py-1 border-2 border-black font-bold transition-colors"
                    style={{ backgroundColor: '#df6824' }}
                >
                    {t?.common?.view ?? "View"}
                </Link>

                {/* EDIT */}

                <Link
                    href={`/business/dashboard/coupons/edit/${couponId}`}
                    className="text-black px-4 py-1 border-2 border-black font-bold transition-colors"
                    style={{ backgroundColor: '#fff4ec' }}
                >
                    {t?.common?.edit ?? "Edit"}
                </Link>

                {/* DELETE */}

                <button
                    onClick={() => setShowDeleteModal(true)}
                    className="text-black px-4 py-1 border-2 border-black font-bold transition-colors"
                    style={{ backgroundColor: '#fca5a5' }}
                >
                    {t?.common?.delete ?? "Delete"}
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