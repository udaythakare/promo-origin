'use server';
import { options } from "@/app/api/auth/[...nextauth]/options";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getServerSession } from "next-auth";

export async function getUserId() {
    const session = await getServerSession(options);
    if (!session) {
        return { msg: "user not logged in" }
    }

    return session.user.id
}

export async function getSessionData() {
    const session = await getServerSession(options);
    if (!session) {
        return { msg: "user not logged in" }
    }

    return session?.user

}

export async function getUserData(userId) {
    const { data, error } = await supabaseAdmin
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

    if (error) {
        console.error("Error fetching user data:", error);
        return { success: false, error };
    }

    return { success: true, user: data };
}

export async function getCouponStatus(couponId, userId) {
    const { data, error } = await supabaseAdmin
        .from("user_coupons")
        .select("*")
        .eq("coupon_id", couponId)
        .eq("user_id", userId)
        .single();

    if (error) {
        console.error("Error fetching coupon status:", error);
        return { success: false, error };
    }

    return { success: true, couponStatus: data };
}

