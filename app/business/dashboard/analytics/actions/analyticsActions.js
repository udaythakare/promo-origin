'use server';
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getUserId } from "@/helpers/userHelper";

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
        return { success: false, error };
    }

    return {
        success: true,
        coupons: data || [],
    };
}

export async function getCouponStatusInfo() {
    const userId = await getUserId();
    if (!userId) {
        return { success: false, message: "User not logged in" };
    }

    const { data, error } = await supabaseAdmin
        .from("user_coupons")
        .select("*")
        .eq("user_id", userId);

    if (error) {
        console.error("Error fetching coupons:", error);
        return { success: false, error };
    }

    return {
        success: true,
        coupons: data || [],
    };
}