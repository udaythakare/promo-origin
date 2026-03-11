'use client';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import CouponForm from '../../components/CouponForm';
import { getCouponById } from '../../actions/couponActions';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function EditCouponPage({ params }) {

    const ctx = useLanguage();
    const t = ctx?.t;

    const [coupon, setCoupon] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function fetchCoupon() {

            const data = await getCouponById(params.id);

            if (!data) {
                notFound();
            }

            setCoupon(data);
            setLoading(false);
        }

        fetchCoupon();

    }, [params.id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-40 font-bold"
                 style={{ color: '#df6824' }}>
                {t?.common?.loading ?? "Loading..."}
            </div>
        );
    }

    return (

        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">

            <div className="mb-6">

                <Link
                    href="/business/dashboard/coupons"
                    className="font-bold hover:underline"
                    style={{ color: '#df6824' }}
                >
                    ← {t?.common?.backToCoupons ?? "Back to Coupons"}
                </Link>

                <h1
                    className="text-2xl font-bold mt-2"
                    style={{ color: '#df6824' }}
                >
                    {t?.coupons?.editCoupon ?? "Edit Coupon"}
                </h1>

            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">

                <CouponForm coupon={coupon} />

            </div>

        </div>

    );
}