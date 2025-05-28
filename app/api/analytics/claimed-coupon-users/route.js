// GET - Fetch users who have claimed a specific coupon
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { options } from "../../auth/[...nextauth]/options";

export async function GET(request) {
    try {
        // Check authentication
        const session = await getServerSession(options);
        if (!session?.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        // Get couponId from query parameters
        const { searchParams } = new URL(request.url);
        const couponId = searchParams.get('couponId');

        if (!couponId) {
            return NextResponse.json(
                { message: 'Coupon ID is required' },
                { status: 400 }
            );
        }

        // Fetch users who have claimed the coupon with a JOIN query
        const { data: claimedUsers, error } = await supabaseAdmin
            .from('user_coupons')
            .select(`
                id,
                coupon_status,
                remaining_claim_time,
                is_expired,
                users (
                    id,
                    username,
                    email,
                    full_name,
                    mobile_number,
                    created_at
                )
            `)
            .eq('coupon_id', couponId)
            .eq('coupon_status', 'claimed');

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json(
                { message: 'Database error occurred' },
                { status: 500 }
            );
        }

        // Format the response data
        const formattedUsers = claimedUsers.map(userCoupon => ({
            claimId: userCoupon.id,
            couponStatus: userCoupon.coupon_status,
            remainingClaimTime: userCoupon.remaining_claim_time,
            isExpired: userCoupon.is_expired,
            user: {
                id: userCoupon.users.id,
                username: userCoupon.users.username,
                email: userCoupon.users.email,
                fullName: userCoupon.users.full_name,
                mobileNumber: userCoupon.users.mobile_number,
                createdAt: userCoupon.users.created_at
            }
        }));

        return NextResponse.json(formattedUsers);

    } catch (error) {
        console.error('Error fetching claimed coupon users:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}