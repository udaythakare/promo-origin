'use server'

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { revalidatePath } from 'next/cache';
import { options } from '@/app/api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth';

export async function handleClaimCouponAction(params) {
    const session = await getServerSession(options);

    if (!session) {
        return { success: false, message: "Login First!" };
    }

    const user_id = session.user.id;
    const { couponId } = params;

    try {
        // First check if the coupon is already claimed by the user
        const { data: existingCoupon, error: fetchError } = await supabaseAdmin
            .from("user_coupons")
            .select("*")
            .eq("user_id", user_id)
            .eq("coupon_id", couponId)
            .maybeSingle(); // because we expect either 0 or 1 record

        console.log(user_id)
        console.log(couponId)
        console.log(existingCoupon)
        if (fetchError) {
            console.error('Error checking existing coupon:', fetchError);
            return { success: false, message: "Error while checking coupon.", error: fetchError.message };
        }

        if (existingCoupon) {
            return { success: false, message: "Coupon already claimed!" };
        }

        // If not claimed, insert the new claim
        const { error: insertError } = await supabaseAdmin.from("user_coupons").insert({
            user_id,
            coupon_id: couponId,
            acquisition_type: "purchase",
            coins_spent: 0,
            coupon_status: "claimed",
        });

        if (insertError) {
            console.error('Error inserting into user_coupons:', insertError);
            return { success: false, message: "Error while claiming the coupon.", error: insertError.message };
        }

        return { success: true, message: "Coupon successfully claimed!" };
    } catch (err) {
        console.error('Unexpected error in handleClaimCouponAction:', err);
        return { success: false, message: "An unexpected error occurred." };
    }
}

