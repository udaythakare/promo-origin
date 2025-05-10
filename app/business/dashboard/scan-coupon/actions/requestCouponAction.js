'use server'

import { getUserId } from "@/helpers/userHelper";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function getCouponRedeemRequest(params) {
    // console.log('this is params request')
}

export async function acceptCoupon(couponId, userId) {
    // 1) mark the user_coupon redeemed
    const vendorId = await getUserId();
    console.log(vendorId, "vendor id in accept coupon");
    const { data: coupon, error: couponError } = await supabaseAdmin
        .from("coupons")
        .select("id")
        .eq("user_id", vendorId)
        .eq("id", couponId)

    console.log(coupon, 'coupon in accept coupon');
    if (!coupon || couponError || coupon.length === 0) {
        return { success: false, error: "Coupon does not belong to your shop!" };
    }

    // Check if the coupon has expired by comparing remaining_claim_time
    const { data: userCouponData, error: userCouponError } = await supabaseAdmin
        .from("user_coupons")
        .select("remaining_claim_time")
        .eq("user_id", userId)
        .eq("coupon_id", couponId)
        .single();

    if (userCouponError) {
        console.error("Error fetching user coupon data:", userCouponError);
        return { success: false, error: userCouponError };
    }

    const currentTime = new Date().getTime();
    if (userCouponData && userCouponData.remaining_claim_time < currentTime) {
        return { success: false, error: "Coupon has expired" };
    }

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