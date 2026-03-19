'use server';

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getUserId } from "@/helpers/userHelper";

/**
 * Fetch all coupons created by the vendor
 * Uses business_id → businesses.user_id join to ensure only THIS vendor's coupons
 */
export async function getAllVendorCoupons() {

    const userId = await getUserId();

    if (!userId) {
        return { success: false, message: "User not logged in" };
    }

    // Step 1 — get this vendor's business ids
    const { data: businesses, error: bizError } = await supabaseAdmin
        .from("businesses")
        .select("id")
        .eq("user_id", userId);

    if (bizError) {
        console.error("Error fetching businesses:", bizError);
        return { success: false, error: bizError.message };
    }

    if (!businesses || businesses.length === 0) {
        return { success: true, coupons: [] };
    }

    const businessIds = businesses.map(b => b.id);

    // Step 2 — get coupons belonging to those businesses only
    const { data, error } = await supabaseAdmin
        .from("coupons")
        .select("*")
        .in("business_id", businessIds)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

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

    // Step 1 — get vendor's business ids
    const { data: businesses, error: bizError } = await supabaseAdmin
        .from("businesses")
        .select("id")
        .eq("user_id", userId);

    if (bizError) {
        console.error("Error fetching businesses:", bizError);
        return { success: false, error: bizError.message };
    }

    if (!businesses || businesses.length === 0) {
        return {
            success: true,
            stats: {
                totalCoupons: 0,
                totalAvailable: 0,
                totalClaims: 0,
                totalRedemptions: 0,
                redemptionRate: 0,
            },
            couponIds: [],
        };
    }

    const businessIds = businesses.map(b => b.id);

    // Step 2 — get coupons for those businesses
    const { data: coupons, error: couponError } = await supabaseAdmin
        .from("coupons")
        .select("id, max_claims, current_claims, current_redemption")
        .in("business_id", businessIds)
        .eq("is_active", true);

    if (couponError) {
        console.error("Error fetching coupons:", couponError);
        return { success: false, error: couponError.message };
    }

    const couponIds = (coupons || []).map(c => c.id);

    const totalCoupons = coupons.length;

    const totalAvailable = coupons.reduce(
        (sum, c) => sum + (c.max_claims || 0),
        0
    );

    const totalClaims = coupons.reduce(
        (sum, c) => sum + (c.current_claims || 0),
        0
    );

    const totalRedemptions = coupons.reduce(
        (sum, c) => sum + (c.current_redemption || 0),
        0
    );

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