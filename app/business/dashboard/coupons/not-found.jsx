'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function NotFound() {

    const ctx = useLanguage();
    const t = ctx?.t;

    return (

        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">

            <h1
                className="text-4xl font-bold mb-4"
                style={{ color: '#df6824' }}
            >
                404
            </h1>

            <h2 className="text-2xl font-medium text-gray-800 mb-6">
                {t?.common?.notFoundTitle ?? "Coupon Not Found"}
            </h2>

            <p className="text-gray-600 mb-8 max-w-md">
                {t?.common?.notFoundMessage ??
                    "Sorry, the coupon you're looking for doesn't exist or has been removed."}
            </p>

            <Link
                href="/business/dashboard/coupons"
                className="px-5 py-3 border-4 border-black font-bold text-black transition-all hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                style={{ backgroundColor: '#df6824' }}
            >
                {t?.common?.backToCoupons ?? "Back to Coupons"}
            </Link>

        </div>

    );
}