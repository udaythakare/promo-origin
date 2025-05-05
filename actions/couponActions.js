'use server';
import { getUserId } from '@/helpers/userHelper';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { revalidatePath } from 'next/cache';

// export async function fetchAllCoupons() {
//     const userId = await getUserId();
//     if (!userId) {
//         const { data, error } = await supabaseAdmin.from("coupons").select("*");
//         if (error) {
//             console.error("Error fetching coupons:", error);
//             return { success: false, error };
//         }
//         return {
//             success: true,
//             coupons: data || [],
//         };
//     } else {
//         const { data, error } = await supabaseAdmin
//             .from("coupons")
//             .select("*")

//         if (error) {
//             console.error("Error fetching coupons:", error);
//             return { success: false, error };
//         }
//         const { data: userCoupons, error: userCouponsError } = await supabaseAdmin
//             .from("user_coupons")
//             .select("*")
//             .eq("user_id", userId)

//         console.log(userCoupons)
//         console.log(data)

//         return {
//             success: true,
//             coupons: data || [],
//         };
//     }

// }

export async function fetchAllCoupons() {
    const userId = await getUserId();

    // If no user is logged in, return all coupons without is_claimed field
    if (!userId) {
        const { data, error } = await supabaseAdmin.from("coupons").select("*, businesses(name)");
        if (error) {
            console.error("Error fetching coupons:", error);
            return { success: false, error };
        }
        return {
            success: true,
            coupons: data || [],
        };
    } else {
        // Fetch all coupons
        const { data: couponsData, error: couponsError } = await supabaseAdmin
            .from("coupons")
            .select("*, businesses(name)");

        if (couponsError) {
            console.error("Error fetching coupons:", couponsError);
            return { success: false, error: couponsError };
        }

        console.log(couponsData, '************************')

        // Fetch user's claimed coupons
        const { data: userCoupons, error: userCouponsError } = await supabaseAdmin
            .from("user_coupons")
            .select("*")
            .eq("user_id", userId);

        if (userCouponsError) {
            console.error("Error fetching user coupons:", userCouponsError);
            return { success: false, error: userCouponsError };
        }

        // Create a Set of coupon IDs that the user has claimed for efficient lookup
        const claimedCouponIds = new Set(userCoupons.map(uc => uc.coupon_id));

        // Add is_claimed field to each coupon
        const couponsWithClaimStatus = couponsData.map(coupon => ({
            ...coupon,
            is_claimed: claimedCouponIds.has(coupon.id)
        }));

        return {
            success: true,
            coupons: couponsWithClaimStatus || [],
        };
    }
}


export async function fetchAreaCoupons(areaName) {
    const userId = await getUserId();

    // First, find businesses in the specified area
    const { data: businessLocations, error: locationsError } = await supabaseAdmin
        .from("business_locations")
        .select("business_id")
        .eq("area", areaName);

    console.log(businessLocations)

    if (locationsError) {
        console.error("Error fetching business locations:", locationsError);
        return { success: false, error: locationsError };
    }

    // If no businesses found in this area
    if (!businessLocations || businessLocations.length === 0) {
        return {
            success: true,
            coupons: [],
        };
    }

    // Extract business IDs
    const businessIds = businessLocations.map(location => location.business_id);

    // If no user is logged in, return coupons without is_claimed field
    if (!userId) {
        const { data, error } = await supabaseAdmin
            .from("coupons")
            .select("*")
            .in("business_id", businessIds);

        if (error) {
            console.error("Error fetching area coupons:", error);
            return { success: false, error };
        }

        return {
            success: true,
            coupons: data || [],
        };
    } else {
        // Fetch all coupons for the specified businesses
        const { data: couponsData, error: couponsError } = await supabaseAdmin
            .from("coupons")
            .select("*, businesses(name)")
            .in("business_id", businessIds);
        console.log(couponsData)

        if (couponsError) {
            console.error("Error fetching area coupons:", couponsError);
            return { success: false, error: couponsError };
        }

        // Fetch user's claimed coupons
        const { data: userCoupons, error: userCouponsError } = await supabaseAdmin
            .from("user_coupons")
            .select("*")
            .eq("user_id", userId);

        if (userCouponsError) {
            console.error("Error fetching user coupons:", userCouponsError);
            return { success: false, error: userCouponsError };
        }

        // Create a Set of coupon IDs that the user has claimed for efficient lookup
        const claimedCouponIds = new Set(userCoupons.map(uc => uc.coupon_id));

        // Add is_claimed field to each coupon
        const couponsWithClaimStatus = couponsData.map(coupon => ({
            ...coupon,
            is_claimed: claimedCouponIds.has(coupon.id)
        }));

        return {
            success: true,
            coupons: couponsWithClaimStatus || [],
        };
    }
}

export async function claimCoupon(couponId) {
    const userId = await getUserId();
    if (!userId) {
        return { success: false, message: "User not logged in" };
    }


    const { data: couponOwnerData, error: couponOwnerError } = await supabaseAdmin
        .from("coupons")
        .select("user_id")
        .eq("id", couponId)
        .single();

    if (couponOwnerError) {
        console.error("Error fetching coupon owner data:", couponOwnerError);
        return { success: false, error: couponOwnerError };
    }
    if (couponOwnerData.user_id === userId) {
        return { success: false, message: "You cannot claim your own coupon" };
    }

    // Check if user has already claimed this coupon
    const { data: existingCoupon, error: checkError } = await supabaseAdmin
        .from("user_coupons")
        .select("*")
        .eq("user_id", userId)
        .eq("coupon_id", couponId)
        .single();

    // If there was no error, it means the coupon was found
    if (existingCoupon) {
        return {
            success: false,
            message: "Coupon already claimed by this user",
            coupon: existingCoupon
        };
    }

    // If there was an error other than "not found", return it
    if (checkError && checkError.code !== "PGRST116") {
        console.error("Error checking existing coupon:", checkError);
        return { success: false, error: checkError };
    }

    // If we get here, the user hasn't claimed the coupon yet
    const { data, error } = await supabaseAdmin
        .from("user_coupons")
        .insert([{ user_id: userId, coupon_id: couponId, coupon_status: "claimed" }])
        .select("*")
        .single();

    if (error) {
        console.error("Error claiming coupon:", error);
        return { success: false, error };
    }


    // 2) fetch the current counter
    const { data: couponRow, error: fetchError } = await supabaseAdmin
        .from("coupons")
        .select("current_claims")
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
            current_claims: couponRow.current_claims + 1
        })
        .match({ id: couponId })
        .select("*")
        .single();

    if (updError) {
        console.error("Error updating coupon count:", updError);
        return { success: false, error: updError };
    }


    revalidatePath("/u/profile");
    revalidatePath("/c/coupons");



    return {
        success: true,
        coupon: data,
    };
}


export async function fetchUserCoupons(couponId) {
    const userId = await getUserId();
    if (!userId) {
        return { success: false, message: "User not logged in" };
    }

    const { data, error } = await supabaseAdmin
        .from("user_coupons")
        .select("*, coupons(*)")
        .eq("user_id", userId)

    if (error) {
        console.error("Error fetching user coupons:", error);
        return { success: false, error };
    }

    return {
        success: true,
        coupons: data || [],
    };
}

export async function fetchUserClaimedCoupons() {
    const userId = await getUserId();
    if (!userId) {
        return { success: false, message: "User not logged in" };
    }

    const { data, error } = await supabaseAdmin
        .from("user_coupons")
        .select("*, coupons(*, businesses(name))")
        .eq("user_id", userId)
        .eq("coupon_status", "claimed");

    if (error) {
        console.error("Error fetching user claimed coupons:", error);
        return { success: false, error };
    }


    return {
        success: true,
        coupons: data || [],
    };
}

export async function fetchUserRedeemedCoupons() {
    const userId = await getUserId();
    if (!userId) {
        return { success: false, message: "User not logged in" };
    }

    const { data, error } = await supabaseAdmin
        .from("user_coupons")
        .select("*, coupons(*, businesses(name))")
        .eq("user_id", userId)
        .eq("coupon_status", "redeemed");

    if (error) {
        console.error("Error fetching user claimed coupons:", error);
        return { success: false, error };
    }


    return {
        success: true,
        coupons: data || [],
    };
}