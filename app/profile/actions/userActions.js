'use server';

import { supabaseAdmin } from '@/lib/supabaseAdmin';  // service-role key
import { getServerSession } from 'next-auth';
import { options } from '@/app/api/auth/[...nextauth]/options';

export async function fetchUserData() {
    // 1. Check auth
    const session = await getServerSession(options);
    if (!session) {
        return { success: false, message: 'Login first' };
    }

    const userId = session.user.id;

    // 2. Query the users table
    const { data: user, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();    // expect exactly one

    // 3. Handle errors / missing row
    if (error) {
        console.error('fetchUserData error:', error);
        return {
            success: false,
            message: 'Could not fetch user data',
            error: error.message,
        };
    }
    if (!user) {
        return {
            success: false,
            message: 'User not found',
        };
    }

    // 4. Success!
    return {
        success: true,
        user,        // your full user row
    };
}

export async function fetchUserCoupons() {
    // 1️⃣ Auth check
    const session = await getServerSession(options);
    if (!session) {
        return { success: false, message: 'Login first', coupons: [] };
    }
    const userId = session.user.id;

    // 2️⃣ Fetch all user_coupons with their coupon details
    const { data, error } = await supabaseAdmin
        .from('user_coupons')
        .select(`
            id,
            acquisition_type,
            coins_spent,
            is_used,
            coupon_id,
            coupons (
                id,
                title,
                description,
                code,
                discount_type,
                discount_value,
                minimum_purchase,
                start_date,
                end_date,
                image_url,
                is_active,
                business_id,
                businesses (
                    id,
                    name,
                    business_locations (
                        id,
                        address,
                        city,
                        state,
                        is_primary
                    )
                )
            )
        `)
        .eq('user_id', userId)
        .eq('is_used', false);

    // 3️⃣ Error handling
    if (error) {
        console.error('fetchUserCoupons error:', error);
        return {
            success: false,
            message: 'Could not fetch your coupons',
            error: error.message,
            coupons: [],
        };
    }

    // 4️⃣ Process the data to find primary locations
    const processedCoupons = data.map(userCoupon => {
        const coupon = userCoupon.coupons;

        // Find the primary business location if it exists
        const primaryLocation = coupon?.businesses?.business_locations?.find(
            location => location.is_primary === true
        );

        return {
            ...userCoupon,
            coupons: {
                ...coupon,
                businesses: {
                    id: coupon?.businesses?.id,
                    name: coupon?.businesses?.name,
                    primary_location: primaryLocation || null
                }
            }
        };
    });

    // Optional: Filter out coupons without a primary location
    const couponsWithPrimaryLocation = processedCoupons.filter(
        item => item.coupons.businesses.primary_location !== null
    );

    // 5️⃣ Return the processed list
    return {
        success: true,
        coupons: couponsWithPrimaryLocation,
    };
}