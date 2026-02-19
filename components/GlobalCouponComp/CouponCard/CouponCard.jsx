import React, { useState } from 'react';
import { Calendar, Check, ChevronDown, ChevronUp, Clock, Gift, QrCode, Scissors, Star, Store, Timer, Users, X } from 'lucide-react';
import { joinAddress } from '@/utils/addressUtils';
import ClaimsCounter from '@/app/business/dashboard/coupons/components/ClaimCounter';
import { getUserId } from '@/helpers/userHelper';

export const CouponCard = ({
    coupon,
    index,
    isClaimed,
    claimingStatus,
    session,
    onClaimClick,
    onShowQR,
    onToggleDetails,
    userId
}) => {
    const [detailsOpen, setDetailsOpen] = useState(false);

    const getBackgroundColor = (index) => {
        const colors = [
            'bg-yellow-300', 'bg-blue-100', 'bg-green-300', 'bg-pink-100',
            'bg-purple-300', 'bg-orange-100', 'bg-teal-300', 'bg-red-100'
        ];
        return colors[index % colors.length];
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Invalid Date';
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Invalid Date';
        }
    };

    const getProgressBarWidth = (current, max) => {
        if (!current || !max || max <= 0) return '0%';
        return `${Math.min((current / max) * 100, 100)}%`;
    };

    const handleToggleDetails = () => {
        setDetailsOpen(!detailsOpen);
        if (onToggleDetails) onToggleDetails(coupon.id);
    };

    return (
        <div className={`${getBackgroundColor(index)} border-2 border-gray-800 p-3 sm:p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow`}>
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 sm:mb-2">
                        {coupon.title}
                    </h2>

                    <div className="flex items-center gap-2">
                        <span className="bg-gray-800 text-white px-2 py-1 text-sm font-medium rounded">
                            {coupon?.businesses?.name || 'VENDOR'}
                        </span>
                        <Gift size={20} className="text-gray-600" />
                    </div>
                </div>
            </div>

            {/* Description */}
            <p className="text-gray-700 mb-3 p-2 bg-white rounded border-l-4 border-gray-800">
                {coupon.description && coupon.description.length > 100 && !detailsOpen
                    ? `${coupon.description.substring(0, 100)}...`
                    : coupon.description || 'No description available'}
            </p>

            {/* Date and Claims Info */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-3">
                <div className="bg-white border border-gray-300 px-3 py-1 rounded flex items-center">
                    <Timer className="mr-2 w-4 h-4" />
                    <span className="text-sm font-medium">
                        {formatDate(coupon.start_date)} - {formatDate(coupon.end_date)}
                    </span>
                </div>

                <div className="w-full sm:w-auto">
                    <div className="bg-white border border-gray-300 px-3 py-1 rounded">
                        <ClaimsCounter
                            couponId={coupon.id}
                            initialCount={coupon.current_claims}
                            maxClaims={coupon.max_claims}
                            userId={userId}
                        />
                        <div className="w-full bg-gray-200 h-2 mt-1 rounded overflow-hidden">
                            <div
                                className="bg-gray-800 h-full rounded"
                                style={{ width: getProgressBarWidth(coupon.current_claims, coupon.max_claims) }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Expanded Details */}
            {detailsOpen && (
                <div className="mt-3 pt-3 border-t border-gray-300 mb-3">
                    <div className="bg-white p-3 border border-gray-300 rounded">
                        <p className="text-gray-700 mb-2">{coupon.description || 'No description available'}</p>
                        <p className="text-sm mb-2 flex items-center gap-2">
                            <span className="bg-gray-800 text-white px-2 py-1 rounded text-xs">REDEMPTION:</span>
                            <span>{coupon.coupon_type === 'redeem_at_store' ? 'IN-STORE' : 'ONLINE'}</span>
                        </p>
                        <p className="text-sm flex items-center gap-2">
                            <span className="bg-gray-800 text-white px-2 py-1 rounded text-xs">LOCATION:</span>
                            <span>{coupon?.businesses?.business_locations && coupon.businesses.business_locations[0] ?
                                joinAddress(coupon.businesses.business_locations[0]) :
                                'Contact store for details'}</span>
                        </p>
                    </div>
                </div>
            )}

            {/* Toggle Details and Store Type */}
            <div className="flex justify-between items-center mb-3">
                <button
                    onClick={handleToggleDetails}
                    className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 px-2 py-1 rounded border border-blue-200 hover:bg-blue-50 transition-colors"
                >
                    {detailsOpen ? (
                        <>Hide Details <ChevronUp size={16} /></>
                    ) : (
                        <>View Details <ChevronDown size={16} /></>
                    )}
                </button>

                {coupon.coupon_type === 'redeem_at_store' && (
                    <span className="bg-gray-800 text-white px-2 py-1 text-xs rounded">
                        IN-STORE ONLY
                    </span>
                )}
            </div>

            {/* Action Buttons */}
            {isClaimed ? (
                <div className="flex gap-2">
                    <button
                        disabled
                        className="flex-1 bg-gray-800 text-white font-medium py-2 px-4 rounded cursor-not-allowed flex justify-center items-center"
                    >
                        <Check className="mr-2" size={18} /> CLAIMED
                    </button>
                    <button
                        onClick={() => onShowQR(coupon)}
                        className="bg-white text-gray-800 font-medium py-2 px-4 rounded border-2 border-gray-800 hover:bg-gray-50 transition-colors flex justify-center items-center"
                    >
                        <QrCode className="mr-2" size={18} /> QR
                    </button>
                </div>
            ) : coupon.current_claims >= coupon.max_claims ? (
                <button
                    disabled
                    className="w-full bg-gray-400 text-white font-medium py-2 px-4 rounded cursor-not-allowed flex justify-center items-center"
                >
                    <X className="mr-2" size={18} /> FULLY CLAIMED
                </button>
            ) : claimingStatus === 'claiming' ? (
                <button
                    disabled
                    className="w-full bg-gray-100 text-gray-800 font-medium py-2 px-4 rounded cursor-wait flex justify-center items-center border-2 border-gray-300"
                >
                    CLAIMING...
                </button>
            ) : (
                <button
                    onClick={() => onClaimClick(coupon)}
                    disabled={!session}
                    className={`w-full font-medium py-2 px-4 rounded transition-colors flex justify-center items-center ${!session
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed border-2 border-gray-300'
                        : 'bg-white text-gray-800 border-2 border-gray-800 hover:bg-gray-50'
                        }`}
                >
                    <Scissors className="mr-2" size={18} />
                    {!session ? 'SIGN IN TO CLAIM' : 'CLAIM NOW!'}
                </button>
            )}
        </div>
    );
};