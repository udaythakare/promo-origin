import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function CouponCard({ coupon, isLoggedIn, onClaim }) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Calculate remaining days
    const calculateRemainingDays = (endDate) => {
        const today = new Date();
        const end = new Date(endDate);
        const diffTime = end - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const remainingDays = calculateRemainingDays(coupon.valid_until);
    const hasLocations = coupon.coupon_locations && coupon.coupon_locations.length > 0;

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            {/* Card Header */}
            <div className="relative">
                {coupon.vendors.logo_url ? (
                    <div className="w-full h-32 relative">
                        <Image
                            src={coupon.vendors.logo_url}
                            alt={coupon.vendors.business_name}
                            fill
                            style={{ objectFit: 'cover' }}
                        />
                    </div>
                ) : (
                    <div className="w-full h-32 bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-lg">{coupon.vendors.business_name}</span>
                    </div>
                )}

                {/* Discount Badge */}
                <div className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {coupon.discount_type === 'percentage' ? `${coupon.discount_value}% OFF` : `$${coupon.discount_value} OFF`}
                </div>
            </div>

            {/* Card Body */}
            <div className="p-4">
                <h3 className="font-bold text-lg text-blue-800 mb-2">{coupon.description}</h3>

                <div className="flex items-center justify-between mb-3 text-sm">
                    <div className="flex items-center text-gray-600">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <span>Valid until: {formatDate(coupon.valid_until)}</span>
                    </div>

                    <span className={`text-xs font-medium px-2 py-1 rounded ${remainingDays < 3 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                        {remainingDays} days left
                    </span>
                </div>

                {/* Vendor Info */}
                <div className="flex items-center mb-3">
                    <span className="text-gray-700 font-medium">{coupon.vendors.business_name}</span>
                </div>

                {/* Locations Section (Collapsible) */}
                {hasLocations && (
                    <div className="mb-3">
                        <button
                            className="text-blue-600 text-sm flex items-center"
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            <span>Available at {coupon.coupon_locations.length} location{coupon.coupon_locations.length !== 1 ? 's' : ''}</span>
                            <svg
                                className={`w-4 h-4 ml-1 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {isExpanded && (
                            <div className="mt-2 text-sm text-gray-600 border-t pt-2">
                                <ul className="space-y-1">
                                    {coupon.coupon_locations.map((cl, index) => (
                                        <li key={index} className="flex items-start">
                                            <svg className="w-4 h-4 mr-1 mt-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                            </svg>
                                            <span>{cl.shop_locations.location_name} - {cl.shop_locations.address}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                {/* Action Button */}
                {isLoggedIn ? (
                    <button
                        onClick={onClaim}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium transition-colors"
                    >
                        Claim Coupon
                    </button>
                ) : (
                    <Link href="/api/auth/signin" className="block text-center w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium transition-colors">
                        Log in to Claim
                    </Link>
                )}

                {/* Code */}
                <div className="mt-2 text-center">
                    <span className="text-xs text-gray-500">Code: {coupon.coupon_code}</span>
                </div>
            </div>
        </div>
    );
}