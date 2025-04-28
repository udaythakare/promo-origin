// In /app/api/redeem-coupon/route.js
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request) {
    try {
        // Parse the JSON body from the request
        const body = await request.json();
        const { userId, couponId, businessLocationId, userCouponId } = body;

        const { data, error } = await supabaseAdmin
            .from('coupon_requests')
            .insert({
                user_id: userId,
                coupon_id: couponId,
                business_location_id: businessLocationId,
                user_coupon_id: userCouponId,
                status: 'pending'
            })
            .select('id, verification_code')
            .single();

        if (error) throw error;

        // Return a new NextResponse with the data
        return NextResponse.json({
            requestId: data.id,
            verificationCode: data.verification_code
        }, { status: 200 });
    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            { message: 'Failed to create coupon request' },
            { status: 500 }
        );
    }
}