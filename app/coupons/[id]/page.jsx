import { supabaseAdmin } from '@/lib/supabaseAdmin'  // <-- use service key
import Image from 'next/image'
import ClaimButton from './ClaimButton'
import { getServerSession } from 'next-auth'
import { options } from '@/app/api/auth/[...nextauth]/options'

export default async function Page({ params }) {
    const session = await getServerSession(options)
    const userId = session?.user?.id
    const { id } = await params

    // 1️⃣ Fetch the coupon itself
    const { data: couponData, error: couponError } = await supabaseAdmin
        .from('coupons')
        .select('*')
        .eq('id', id)
        .single()

    if (couponError) {
        return (
            <div className="flex items-center justify-center h-screen text-red-600">
                Error loading coupon: {couponError.message}
            </div>
        )
    }

    // 2️⃣ Check if THIS user has already claimed it
    let couponStatus = false
    if (userId) {
        const { data: userCoupon, error: ucError } = await supabaseAdmin
            .from('user_coupons')
            .select('coupon_status')
            .eq('user_id', userId)
            .eq('coupon_id', id)
            .limit(1)          // ← only return at most one row
            .maybeSingle()     // ← now safe: 0 or 1 row, never >1

        if (ucError) {
            console.error('Error fetching user_coupons:', ucError)
        } else if (userCoupon?.coupon_status === 'claimed') {
            couponStatus = true
        }
    }

    // 3️⃣ Render
    return (
        <div className="max-w-xl mx-auto px-4 py-6">
            <div className="bg-white shadow-md rounded-xl overflow-hidden border border-blue-200">
                {couponData.image_url && (
                    <Image
                        src={couponData.image_url}
                        alt={couponData.title}
                        width={800}
                        height={400}
                        className="w-full h-48 object-cover"
                    />
                )}
                <div className="p-4 space-y-2">
                    <h1 className="text-2xl font-bold text-blue-700">
                        {couponData.title}
                    </h1>
                    <p className="text-gray-700">{couponData.description}</p>

                    <div className="text-sm text-blue-600 space-y-1">
                        <p><strong>Code:</strong> {couponData.code}</p>
                        <p><strong>Type:</strong> {couponData.discount_type}</p>
                        <p>
                            <strong>Value:</strong> {couponData.discount_value}
                            {couponData.discount_type === 'percentage' ? '%' : '$'}
                        </p>
                        <p><strong>Min Purchase:</strong> ${couponData.minimum_purchase}</p>
                        <p>
                            <strong>Valid From:</strong>{' '}
                            {new Date(couponData.start_date).toLocaleDateString()}
                        </p>
                        <p>
                            <strong>Expires On:</strong>{' '}
                            {new Date(couponData.end_date).toLocaleDateString()}
                        </p>
                        <p>
                            <strong>Status:</strong>{' '}
                            {couponData.is_active ? 'Active' : 'Inactive'}
                        </p>
                        <div>
                            <ClaimButton
                                couponId={couponData.id}
                                couponStatus={couponStatus}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
