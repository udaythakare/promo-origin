// app/coupons/new/page.tsx (Server Component)
import Link from 'next/link';
import CouponForm from '../components/CouponForm';

export default function NewCouponPage() {
    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="mb-6">
                <Link href="/vendor/dashboard/coupons" className="text-blue-600 hover:text-blue-800">
                    ← Back to Coupons
                </Link>
                <h1 className="text-2xl font-bold text-blue-800 mt-2">Create New Coupon</h1>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <CouponForm />
            </div>
        </div>
    );
}