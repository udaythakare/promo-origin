'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

function formatDate(dateStr, language) {

    if (!dateStr) return '—';

    const locale =
        language === 'hi'
            ? 'hi-IN'
            : language === 'mr'
                ? 'mr-IN'
                : 'en-IN';

    return new Date(dateStr).toLocaleDateString(locale, {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });

}

const RecentCouponsTable = ({ coupons = [] }) => {

    const ctx = useLanguage();
    const t = ctx?.t;
    const language = ctx?.language ?? 'en';

    const getStatusLabel = (coupon) => {

        if (coupon.is_expired) {
            return t?.table?.expired ?? 'Expired';
        }

        if (!coupon.is_active) {
            return t?.table?.inactive ?? 'Inactive';
        }

        return t?.table?.active ?? 'Active';

    };

    const getStatusStyle = (coupon) => {

    if (coupon.is_expired) {
        return 'bg-gray-100 text-gray-600';
    }

    if (!coupon.is_active) {
        return 'bg-red-100 text-red-700';
    }

    return 'bg-green-100 text-green-700';

};

    return (
        <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">

            {/* Header */}

            <div
                className="px-4 md:px-6 py-4 md:py-5 flex justify-between items-center"
                style={{ borderBottom: '2px solid #df6824' }}
            >

                <h3 className="text-base md:text-lg font-black text-gray-800 uppercase tracking-wide">
                    {t?.dashboard?.recentCoupons ?? 'Recent Coupons'}
                </h3>

                <Link
                    href="/business/dashboard/coupons"
                    className="text-sm font-bold uppercase tracking-wide hover:underline"
                    style={{ color: '#df6824' }}
                >
                    {t?.dashboard?.viewAll ?? 'View All'}
                </Link>

            </div>

            {/* Table */}

            <div className="overflow-x-auto">

                {coupons.length === 0 ? (

                    <div className="py-12 text-center text-gray-500">
                        <p className="font-bold uppercase">
                            {t?.dashboard?.noData ?? 'No coupons found.'}
                        </p>
                    </div>

                ) : (

                    <table className="min-w-full divide-y divide-gray-200">

                        <thead className="bg-gray-50">

                            <tr>

                                {[
                                    t?.table?.title ?? 'Title',
                                    t?.table?.status ?? 'Status',
                                    t?.table?.claims ?? 'Claims',
                                    t?.table?.redeemed ?? 'Redeemed',
                                    t?.table?.endDate ?? 'End Date',
                                ].map((header) => (

                                    <th
                                        key={header}
                                        className="px-4 md:px-6 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider"
                                    >
                                        {header}
                                    </th>

                                ))}

                            </tr>

                        </thead>

                        <tbody className="bg-white divide-y divide-gray-200">

                            {coupons.map((coupon) => (

                                <tr
                                    key={coupon.id}
                                    className="hover:bg-orange-50 transition-colors"
                                >

                                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                        {coupon.title}
                                    </td>

                                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">

                                        <span
                                            className={`px-2 py-0.5 inline-flex text-xs font-black rounded-full ${getStatusStyle(coupon)}`}
                                        >
                                            {getStatusLabel(coupon)}
                                        </span>

                                    </td>

                                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                                        {coupon.current_claims ?? 0} / {coupon.max_claims ?? '∞'}
                                    </td>

                                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                                        {coupon.current_redemption ?? 0}
                                    </td>

                                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(coupon.end_date, language)}
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                )}

            </div>

        </div>
    );
};

export default RecentCouponsTable;