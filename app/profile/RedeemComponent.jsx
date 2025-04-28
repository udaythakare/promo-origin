
'use client';

import React, { useState } from 'react';
import QRCode from 'react-qr-code';

export default function RedeemComponent({ userId, couponId, businessLocationId, userCouponId }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [verificationCode, setVerificationCode] = useState(null);

    const openModal = async () => {
        const confirmRedeem = window.confirm("Are you sure you want to redeem this coupon?");
        if (!confirmRedeem) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/redeem-coupon', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, couponId, businessLocationId, userCouponId })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to redeem coupon');

            setVerificationCode(data.verificationCode);
            setIsModalOpen(true);
        } catch (err) {
            console.error('Error creating redemption request:', err);
            setError(err.message || 'Failed to create redemption request. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setVerificationCode(null);
    };

    return (
        <>
            <button
                onClick={openModal}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 disabled:opacity-50 transition"
            >
                {isLoading ? 'Processing...' : 'Redeem'}
            </button>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

            {isModalOpen && verificationCode && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 relative max-w-xs w-full">
                        <button
                            onClick={closeModal}
                            aria-label="Close modal"
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>

                        <h2 className="text-xl font-semibold text-blue-700 mb-4">
                            Scan to Redeem
                        </h2>
                        <div className="flex justify-center">
                            <QRCode value={verificationCode} size={128} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}