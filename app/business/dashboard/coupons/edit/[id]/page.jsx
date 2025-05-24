import Link from 'next/link';
import { notFound } from 'next/navigation';
import CouponForm from '../../components/CouponForm';
import { getCouponById } from '../../actions/couponActions';

export default async function EditCouponPage(props) {
    const params = await props.params;
    const coupon = await getCouponById(params.id);

    if (!coupon) {
        notFound();
    }

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="mb-6">
                <Link href="/business/dashboard/coupons" className="text-blue-600 hover:text-blue-800">
                    ← Back to Coupons
                </Link>
                <h1 className="text-2xl font-bold text-blue-800 mt-2">Edit Coupon</h1>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <CouponForm coupon={coupon} />
            </div>
        </div>
    );
}
