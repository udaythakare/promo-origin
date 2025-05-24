import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCouponById } from '../actions/couponActions';
// import { formatDate } from '../utils/dateUtils';
import CouponActions from '../components/CouponActions';
import { formatDate } from '@/helpers/dateHelpers';

export default async function CouponDetailsPage(props) {
    const params = await props.params;
    const coupon = await getCouponById(params.id);

    if (!coupon) {
        notFound();
    }

    const isExpired = new Date(coupon.end_date) < new Date();

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="mb-6">
                <Link href="/business/dashboard/coupons" className="text-blue-600 hover:text-blue-800">
                    ← Back to Coupons
                </Link>
                <h1 className="text-2xl font-bold text-blue-800 mt-2">{coupon.title}</h1>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="text-sm text-gray-500 mb-1">Coupon Code</div>
                        <div className="font-mono text-lg bg-blue-50 px-2 py-1 rounded inline-block">{coupon.code}</div>
                    </div>

                    <div className={`px-3 py-1 text-sm rounded-full ${!coupon.is_active ? 'bg-gray-100 text-gray-600' :
                        isExpired ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                        }`}>
                        {!coupon.is_active ? 'Disabled' : isExpired ? 'Expired' : 'Active'}
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-lg font-medium text-blue-800 mb-3">Coupon Details</h3>
                        <dl className="space-y-3">
                            <div>
                                <dt className="text-sm text-gray-500">Discount Type</dt>
                                <dd className="font-medium">
                                    {coupon.discount_type === 'percentage' ? 'Percentage' :
                                        coupon.discount_type === 'fixed_amount' ? 'Fixed Amount' :
                                            coupon.discount_type === 'buy_one_get_one' ? 'Buy One Get One Free' : 'Free Item'}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-sm text-gray-500">Discount Value</dt>
                                <dd className="font-medium">
                                    {coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` :
                                        coupon.discount_type === 'fixed_amount' ? `$${coupon.discount_value}` : 'N/A'}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-sm text-gray-500">Minimum Purchase</dt>
                                <dd className="font-medium">
                                    {coupon.minimum_purchase > 0 ? `$${coupon.minimum_purchase}` : 'None'}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-sm text-gray-500">Valid From</dt>
                                <dd className="font-medium">{formatDate(coupon.start_date)}</dd>
                            </div>

                            <div>
                                <dt className="text-sm text-gray-500">Valid Until</dt>
                                <dd className="font-medium">{formatDate(coupon.end_date)}</dd>
                            </div>
                        </dl>
                    </div>

                    <div>
                        <h3 className="text-lg font-medium text-blue-800 mb-3">Usage Details</h3>
                        <dl className="space-y-3">
                            <div>
                                <dt className="text-sm text-gray-500">Usage Limit</dt>
                                <dd className="font-medium">
                                    {coupon.max_uses ? `${coupon.max_uses} uses` : 'Unlimited'}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-sm text-gray-500">Current Uses</dt>
                                <dd className="font-medium">{coupon.current_uses}</dd>
                            </div>

                            <div>
                                <dt className="text-sm text-gray-500">Applies To</dt>
                                <dd className="font-medium">
                                    {coupon.applies_to === 'entire_purchase' ? 'Entire Purchase' :
                                        coupon.applies_to === 'specific_category' ? 'Specific Category' :
                                            'Specific Product'}
                                </dd>
                            </div>

                            {coupon.applies_to !== 'entire_purchase' && (
                                <div>
                                    <dt className="text-sm text-gray-500">
                                        {coupon.applies_to === 'specific_category' ? 'Category' : 'Product'}
                                    </dt>
                                    <dd className="font-medium">
                                        {coupon.applies_to === 'specific_category'
                                            ? coupon.category_name || 'Unknown Category'
                                            : coupon.product_name || 'Unknown Product'}
                                    </dd>
                                </div>
                            )}

                            <div>
                                <dt className="text-sm text-gray-500">Locations</dt>
                                <dd className="font-medium">
                                    {coupon.applies_to_all_locations ? 'All Locations' : 'Specific Locations'}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>

                {coupon.description && (
                    <div className="mt-6">
                        <h3 className="text-lg font-medium text-blue-800 mb-2">Description</h3>
                        <p className="text-gray-700 whitespace-pre-line">{coupon.description}</p>
                    </div>
                )}

                <div className="mt-8 flex justify-end space-x-3">
                    <CouponActions couponId={coupon.id} />
                </div>
            </div>
        </div>
    );
}