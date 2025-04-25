// app/coupons/components/DeleteCouponModal.tsx (Client Component)
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteCoupon } from '../actions/couponActions';

export default function DeleteCouponModal({
    couponId,
    onClose
}) {
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
            <div className="bg-white rounded-lg max-w-md w-full p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Deletion</h3>
                <p className="text-gray-500 mb-6">Are you sure you want to delete this coupon? This action cannot be undone.</p>

                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                        disabled={isDeleting}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete Coupon'}
                    </button>
                </div>
            </div>
        </div>
    );
}