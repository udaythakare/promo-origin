// components/CouponCard.js
'use client';
import { useState } from 'react';
import Image from 'next/image';
import QRModal from './QRModal';

export default function CouponCard({ coupon, userId }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Calculate days remaining
    const endDate = new Date(coupon.end_date);
    const today = new Date();
    const daysRemaining = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));

    // Format dates for display
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Generate the QR value containing userId and couponId
    const qrValue = JSON.stringify({
        userId: userId,
        couponId: coupon.id
    });

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-100 hover:shadow-lg transition-shadow duration-300">
            <div className="relative h-40 w-full">
                {coupon.image_url ? (
                    <Image
                        src={coupon.image_url}
                        alt={coupon.title}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="bg-blue-100 h-full w-full flex items-center justify-center">
                        <span className="text-blue-500 font-semibold text-xl">{coupon.title}</span>
                    </div>
                )}
            </div>

            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-blue-700 truncate">{coupon.title}</h3>
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                        {coupon.coupon_type === 'redeem_at_store' ? 'In-Store' : 'Online'}
                    </span>
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{coupon.description}</p>

                <div className="flex justify-between text-xs text-gray-500 mb-4">
                    <span>Valid until: {formatDate(coupon.end_date)}</span>
                    <span className={`font-medium ${daysRemaining < 5 ? 'text-red-500' : 'text-green-600'}`}>
                        {daysRemaining} days left
                    </span>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                    Redeem Coupon
                </button>
            </div>

            <QRModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                qrValue={qrValue}
                couponTitle={coupon.title}
            />
        </div>
    );
}
