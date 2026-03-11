'use server';

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getUserId } from "@/helpers/userHelper";

/**
 * Fetch all coupons created by the vendor
 */
export async function getAllVendorCoupons() {

    const userId = await getUserId();

    if (!userId) {
        return { success: false, message: "User not logged in" };
    }

    const { data, error } = await supabaseAdmin
        .from("coupons")
        .select("*")
        .eq("user_id", userId);

    if (error) {
        console.error("Error fetching coupons:", error);
        return { success: false, error: error.message };
    }

    return {
        success: true,
        coupons: data || [],
    };
}

/**
 * Fetch analytics statistics for vendor dashboard
 */
export async function getVendorAnalyticsStats() {

    const userId = await getUserId();

    if (!userId) {
        return { success: false, message: "User not logged in" };
    }

    /* Get vendor coupons */

    const { data: coupons, error: couponError } = await supabaseAdmin
        .from("coupons")
        .select("id, max_claims, current_claims, current_redemption")
        .eq("user_id", userId);

    if (couponError) {
        console.error("Error fetching coupons:", couponError);
        return { success: false, error: couponError.message };
    }

    const couponIds = coupons.map(c => c.id);

    /* Total coupons */

    const totalCoupons = coupons.length;

    /* Total available claims */

    const totalAvailable = coupons.reduce(
        (sum, c) => sum + (c.max_claims || 0),
        0
    );

    /* Total claims */

    const totalClaims = coupons.reduce(
        (sum, c) => sum + (c.current_claims || 0),
        0
    );

    /* Total redemptions */

    const totalRedemptions = coupons.reduce(
        (sum, c) => sum + (c.current_redemption || 0),
        0
    );

    /* Redemption rate */

    const redemptionRate =
        totalClaims > 0
            ? ((totalRedemptions / totalClaims) * 100).toFixed(2)
            : 0;

    return {
        success: true,
        stats: {
            totalCoupons,
            totalAvailable,
            totalClaims,
            totalRedemptions,
            redemptionRate,
        },
        couponIds,
    };
}

/**
 * Get users who claimed a coupon
 */
export async function getCouponClaimUsers(couponId) {

    const { data, error } = await supabaseAdmin
        .from("user_coupons")
        .select(`
            id,
            coupon_status,
            remaining_claim_time,
            users (
                id,
                username,
                email,
                full_name,
                mobile_number,
                created_at
            )
        `)
        .eq("coupon_id", couponId);

    if (error) {
        console.error("Error fetching claimed users:", error);
        return { success: false, error: error.message };
    }

    return {
        success: true,
        users: data || [],
    };
}

/**
 * Get users who redeemed a coupon
 */
export async function getCouponRedemptionUsers(couponId) {

    const { data, error } = await supabaseAdmin
        .from("coupon_requests")
        .select(`
            id,
            status,
            users (
                id,
                username,
                email,
                full_name,
                mobile_number
            )
        `)
        .eq("coupon_id", couponId)
        .eq("status", "completed");

    if (error) {
        console.error("Error fetching redeemed users:", error);
        return { success: false, error: error.message };
    }

    return {
        success: true,
        users: data || [],
    };
}