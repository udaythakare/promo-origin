import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <h1 className="text-4xl font-bold text-blue-800 mb-4">404</h1>
            <h2 className="text-2xl font-medium text-gray-700 mb-6">Coupon Not Found</h2>
            <p className="text-gray-500 mb-8 text-center">
                Sorry, the coupon you're looking for doesn't exist or has been removed.
            </p>
            <Link
                href="/vendor/dashboard/coupons"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
                Back to Coupons
            </Link>
        </div>
    );
}