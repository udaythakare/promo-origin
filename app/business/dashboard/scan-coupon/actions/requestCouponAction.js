'use server'

import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function getCouponRedeemRequest(params) {
    console.log('this is params request')
}

export async function acceptCoupon(couponId, userId) {
    // 1) mark the user_coupon redeemed
    const { data: userCoupon, error: ucError } = await supabaseAdmin
        .from("user_coupons")
        .update({ coupon_status: "redeemed" })
        .match({ coupon_id: couponId, user_id: userId })
        .select("*")
        .single();

    if (ucError) {
        console.error("Error accepting coupon:", ucError);
        return { success: false, error: ucError };
    }

    // 2) fetch the current counter
    const { data: couponRow, error: fetchError } = await supabaseAdmin
        .from("coupons")
        .select("current_redemption")
        .eq("id", couponId)
        .single();

    if (fetchError) {
        console.error("Error fetching coupon:", fetchError);
        return { success: false, error: fetchError };
    }

    // 3) write it back +1
    const { data: updatedCoupon, error: updError } = await supabaseAdmin
        .from("coupons")
        .update({
            current_redemption: couponRow.current_redemption + 1
        })
        .match({ id: couponId })
        .select("*")
        .single();

    if (updError) {
        console.error("Error updating coupon count:", updError);
        return { success: false, error: updError };
    }

    return {
        success: true,
        coupon: userCoupon,
        couponDetails: updatedCoupon
    };
}
