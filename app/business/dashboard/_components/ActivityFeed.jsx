'use client';

import React from 'react';
import { FiTag, FiCheckCircle, FiClock } from 'react-icons/fi';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

function timeAgo(dateStr, language) {

    if (!dateStr) return '—';

    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);

    if (language === 'hi') {
        if (diff < 60) return `${diff} सेकंड पहले`;
        if (diff < 3600) return `${Math.floor(diff / 60)} मिनट पहले`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} घंटे पहले`;
        return `${Math.floor(diff / 86400)} दिन पहले`;
    }

    if (language === 'mr') {
        if (diff < 60) return `${diff} सेकंदांपूर्वी`;
        if (diff < 3600) return `${Math.floor(diff / 60)} मिनिटांपूर्वी`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} तासांपूर्वी`;
        return `${Math.floor(diff / 86400)} दिवसांपूर्वी`;
    }

    // English default
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

const ActivityFeed = ({ coupons = [] }) => {

    const ctx = useLanguage();
    const t = ctx?.t;
    const language = ctx?.language ?? 'en';

    return (
        <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">

            {/* Header */}

            <div
                className="px-6 py-5"
                style={{ borderBottom: '2px solid #df6824' }}
            >

                <h3 className="text-base md:text-lg font-black text-gray-800 uppercase tracking-wide">
                    {t?.dashboard?.recentActivity ?? 'Recent Activity'}
                </h3>

            </div>

            {/* Activity List */}

            <div className="divide-y divide-gray-100">

                {coupons.length === 0 ? (

                    <div className="px-6 py-8 text-center text-gray-500">

                        <p className="font-bold uppercase text-sm">
                            {t?.dashboard?.noActivity ?? 'No activity yet.'}
                        </p>

                    </div>

                ) : (

                    coupons.slice(0, 5).map((coupon) => {

                        const isActive = coupon.is_active && !coupon.is_expired;

                        return (

                            <div
                                key={coupon.id}
                                className="px-4 md:px-6 py-4 hover:bg-orange-50 transition-colors"
                            >

                                <div className="flex items-start gap-3">

                                    {/* Icon */}

                                    <div
                                        className="w-8 h-8 flex-shrink-0 flex items-center justify-center border-2 border-black"
                                        style={{
                                            backgroundColor: isActive ? '#df6824' : '#f3f4f6'
                                        }}
                                    >

                                        {isActive
                                            ? <FiCheckCircle size={16} color="#000" />
                                            : <FiTag size={16} color="#6b7280" />
                                        }

                                    </div>

                                    {/* Info */}

                                    <div className="flex-1 min-w-0">

                                        <p className="text-sm font-black text-gray-900 truncate">
                                            {coupon.title}
                                        </p>

                                        <p className="text-xs text-gray-500 mt-0.5">

                                            {t?.table?.claims ?? 'Claims'}: {coupon.current_claims ?? 0}

                                            &nbsp;|&nbsp;

                                            {t?.table?.redeemed ?? 'Redeemed'}: {coupon.current_redemption ?? 0}

                                        </p>

                                    </div>

                                    {/* Time */}

                                    <div className="flex items-center gap-1 text-gray-400 flex-shrink-0">

                                        <FiClock size={11} />

                                        <span className="text-[10px] font-bold">
                                            {timeAgo(coupon.created_at, language)}
                                        </span>

                                    </div>

                                </div>

                            </div>

                        );

                    })

                )}

            </div>

            {/* Footer */}

            <div
                className="px-6 py-3 text-center"
                style={{
                    borderTop: '2px solid #df6824',
                    backgroundColor: '#fff7f0'
                }}
            >

                <Link
                    href="/business/dashboard/analytics"
                    className="text-sm font-black uppercase tracking-wide hover:underline"
                    style={{ color: '#df6824' }}
                >

                    {t?.dashboard?.viewAllActivity ?? 'View All Activity'}

                </Link>

            </div>

        </div>
    );
};

export default ActivityFeed;