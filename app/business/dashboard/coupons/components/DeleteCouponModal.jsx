// app/coupons/components/DeleteCouponModal.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteCoupon } from '../actions/couponActions';
import { useLanguage } from '@/context/LanguageContext';

export default function DeleteCouponModal({
    couponId,
    onClose
}) {

    const ctx = useLanguage();
    const t = ctx?.t;

    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {

        setIsDeleting(true);

        try {

            await deleteCoupon(couponId);

            router.refresh();

            onClose();

        } catch (error) {

            console.error('Failed to delete coupon:', error);

        } finally {

            setIsDeleting(false);

        }

    };

    return (

        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">

            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-md w-full p-6">

                <h3 className="text-lg font-bold text-black mb-4">
                    {t?.coupons?.confirmDeletion ?? "Confirm Deletion"}
                </h3>

                <p className="text-gray-700 mb-6">

                    {t?.coupons?.deleteWarning ??
                        "Are you sure you want to delete this coupon? This action cannot be undone."}

                </p>

                <div className="flex justify-end gap-3">

                    {/* Cancel */}

                    <button
                        onClick={onClose}
                        disabled={isDeleting}
                        className="px-4 py-2 font-bold border-2 border-black"
                        style={{ backgroundColor: "#fff4ec" }}
                    >
                        {t?.common?.cancel ?? "Cancel"}
                    </button>

                    {/* Delete */}

                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="px-4 py-2 font-bold border-2 border-black text-white"
                        style={{ backgroundColor: "#dc2626" }}
                    >

                        {isDeleting
                            ? t?.coupons?.deleting ?? "Deleting..."
                            : t?.coupons?.deleteCoupon ?? "Delete Coupon"}

                    </button>

                </div>

            </div>

        </div>

    );
}