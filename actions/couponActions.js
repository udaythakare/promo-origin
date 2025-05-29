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

//         // console.log(userCoupons)
//         // console.log(data)

//         return {
//             success: true,
//             coupons: data || [],
//         };
//     }

// }

// export async function fetchAllCoupons() {
//     const userId = await getUserId();

//     // If no user is logged in, return all coupons without is_claimed field
//     if (!userId) {
//         const { data, error } = await supabaseAdmin.from("coupons").select("*, businesses(name)");
//         if (error) {
//             console.error("Error fetching coupons:", error);
//             return { success: false, error };
//         }
//         return {
//             success: true,
//             coupons: data || [],
//         };
//     } else {
//         // Fetch all coupons
//         const { data: couponsData, error: couponsError } = await supabaseAdmin
//             .from("coupons")
//             .select("*, businesses(name, business_locations(*)) ");

//         if (couponsError) {
//             console.error("Error fetching coupons:", couponsError);
//             return { success: false, error: couponsError };
//         }


//         // // console.log(couponsData, '************************')

//         // Fetch user's claimed coupons
//         const { data: userCoupons, error: userCouponsError } = await supabaseAdmin
//             .from("user_coupons")
//             .select("*")
//             .eq("user_id", userId);

//         if (userCouponsError) {
//             console.error("Error fetching user coupons:", userCouponsError);
//             return { success: false, error: userCouponsError };
//         }

//         // Create a Set of coupon IDs that the user has claimed for efficient lookup
//         const claimedCouponIds = new Set(userCoupons.map(uc => uc.coupon_id));

//         // Add is_claimed field to each coupon
//         const couponsWithClaimStatus = couponsData.map(coupon => ({
//             ...coupon,
//             is_claimed: claimedCouponIds.has(coupon.id)
//         }));

//         return {
//             success: true,
//             coupons: couponsWithClaimStatus || [],
//         };
//     }
// }


// export async function fetchAreaCoupons(areaName) {
//     const userId = await getUserId();

//     // First, find businesses in the specified area
//     const { data: businessLocations, error: locationsError } = await supabaseAdmin
//         .from("business_locations")
//         .select("business_id")
//         .eq("area", areaName);

//     // // console.log(businessLocations)

//     if (locationsError) {
//         console.error("Error fetching business locations:", locationsError);
//         return { success: false, error: locationsError };
//     }

//     // If no businesses found in this area
//     if (!businessLocations || businessLocations.length === 0) {
//         return {
//             success: true,
//             coupons: [],
//         };
//     }

//     // Extract business IDs
//     const businessIds = businessLocations.map(location => location.business_id);

//     // If no user is logged in, return coupons without is_claimed field
//     if (!userId) {
//         const { data, error } = await supabaseAdmin
//             .from("coupons")
//             .select("*")
//             .in("business_id", businessIds);

//         if (error) {
//             console.error("Error fetching area coupons:", error);
//             return { success: false, error };
//         }

//         return {
//             success: true,
//             coupons: data || [],
//         };
//     } else {
//         // Fetch all coupons for the specified businesses
//         const { data: couponsData, error: couponsError } = await supabaseAdmin
//             .from("coupons")
//             .select("*, businesses(name)")
//             .in("business_id", businessIds);
//         // // console.log(couponsData)

//         if (couponsError) {
//             console.error("Error fetching area coupons:", couponsError);
//             return { success: false, error: couponsError };
//         }

//         // Fetch user's claimed coupons
//         const { data: userCoupons, error: userCouponsError } = await supabaseAdmin
//             .from("user_coupons")
//             .select("*")
//             .eq("user_id", userId);

//         if (userCouponsError) {
//             console.error("Error fetching user coupons:", userCouponsError);
//             return { success: false, error: userCouponsError };
//         }

//         // Create a Set of coupon IDs that the user has claimed for efficient lookup
//         const claimedCouponIds = new Set(userCoupons.map(uc => uc.coupon_id));

//         // Add is_claimed field to each coupon
//         const couponsWithClaimStatus = couponsData.map(coupon => ({
//             ...coupon,
//             is_claimed: claimedCouponIds.has(coupon.id)
//         }));

//         return {
//             success: true,
//             coupons: couponsWithClaimStatus || [],
//         };
//     }
// }

// export async function claimCoupon(couponId) {
//     const userId = await getUserId();
//     if (!userId) {
//         return { success: false, message: "User not logged in" };
//     }


//     const { data: couponOwnerData, error: couponOwnerError } = await supabaseAdmin
//         .from("coupons")
//         .select("user_id")
//         .eq("id", couponId)
//         .single();

//     if (couponOwnerError) {
//         console.error("Error fetching coupon owner data:", couponOwnerError);
//         return { success: false, error: couponOwnerError };
//     }
//     if (couponOwnerData.user_id === userId) {
//         return { success: false, message: "You cannot claim your own coupon" };
//     }

//     // Check if user has already claimed this coupon
//     const { data: existingCoupon, error: checkError } = await supabaseAdmin
//         .from("user_coupons")
//         .select("*")
//         .eq("user_id", userId)
//         .eq("coupon_id", couponId)
//         .single();

//     // If there was no error, it means the coupon was found
//     if (existingCoupon) {
//         return {
//             success: false,
//             message: "Coupon already claimed by this user",
//             coupon: existingCoupon
//         };
//     }

//     // If there was an error other than "not found", return it
//     if (checkError && checkError.code !== "PGRST116") {
//         console.error("Error checking existing coupon:", checkError);
//         return { success: false, error: checkError };
//     }

//     // If we get here, the user hasn't claimed the coupon yet
//     const { data, error } = await supabaseAdmin
//         .from("user_coupons")
//         .insert([{ user_id: userId, coupon_id: couponId, coupon_status: "claimed" }])
//         .select("*")
//         .single();

//     if (error) {
//         console.error("Error claiming coupon:", error);
//         return { success: false, error };
//     }


//     // 2) fetch the current counter
//     const { data: couponRow, error: fetchError } = await supabaseAdmin
//         .from("coupons")
//         .select("current_claims")
//         .eq("id", couponId)
//         .single();

//     if (fetchError) {
//         console.error("Error fetching coupon:", fetchError);
//         return { success: false, error: fetchError };
//     }

//     // 3) write it back +1
//     const { data: updatedCoupon, error: updError } = await supabaseAdmin
//         .from("coupons")
//         .update({
//             current_claims: couponRow.current_claims + 1
//         })
//         .match({ id: couponId })
//         .select("*")
//         .single();

//     if (updError) {
//         console.error("Error updating coupon count:", updError);
//         return { success: false, error: updError };
//     }


//     revalidatePath("/u/profile");
//     revalidatePath("/coupons");



//     return {
//         success: true,
//         coupon: data,
//     };
// }


export async function fetchAllCoupons(options = {}) {
    const {
        sortBy = 'newest', // 'newest', 'oldest'
        dateFilter = null, // { after: '2024-01-01', before: '2024-12-31' }
        limit = null,
        offset = 0,
        includeCount = false
    } = options;

    const userId = await getUserId();

    // Build the base query
    let query = supabaseAdmin.from("coupons");

    // If no user is logged in, return all coupons without is_claimed field
    if (!userId) {
        query = query.select("*, businesses(name)");
    } else {
        query = query.select("*, businesses(name, business_locations(*))");
    }

    // Apply date filtering if provided
    if (dateFilter) {
        if (dateFilter.after) {
            query = query.gte('created_at', dateFilter.after);
        }
        if (dateFilter.before) {
            query = query.lte('created_at', dateFilter.before);
        }
    }

    // Apply sorting
    if (sortBy === 'newest') {
        query = query.order('created_at', { ascending: false });
    } else if (sortBy === 'oldest') {
        query = query.order('created_at', { ascending: true });
    }

    // Apply pagination
    if (limit) {
        query = query.range(offset, offset + limit - 1);
    }

    const { data, error, count } = await query;

    if (error) {
        console.error("Error fetching coupons:", error);
        return { success: false, error };
    }

    // Get total count if requested
    let totalCount = null;
    if (includeCount) {
        let countQuery = supabaseAdmin.from("coupons").select("*", { count: 'exact', head: true });

        // Apply same filters for count
        if (dateFilter) {
            if (dateFilter.after) {
                countQuery = countQuery.gte('created_at', dateFilter.after);
            }
            if (dateFilter.before) {
                countQuery = countQuery.lte('created_at', dateFilter.before);
            }
        }

        const { count: totalCouponsCount, error: countError } = await countQuery;
        if (!countError) {
            totalCount = totalCouponsCount;
        }
    }

    if (!userId) {
        return {
            success: true,
            coupons: data || [],
            totalCount
        };
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
    const couponsWithClaimStatus = data.map(coupon => ({
        ...coupon,
        is_claimed: claimedCouponIds.has(coupon.id)
    }));

    return {
        success: true,
        coupons: couponsWithClaimStatus || [],
        totalCount
    };
}

export async function fetchAreaCoupons(areaName, options = {}) {
    const {
        sortBy = 'newest', // 'newest', 'oldest'
        dateFilter = null, // { after: '2024-01-01', before: '2024-12-31' }
        limit = null,
        offset = 0,
        includeCount = false
    } = options;

    const userId = await getUserId();

    // Step 1: Find businesses in the specified area
    const { data: businessLocations, error: locationsError } = await supabaseAdmin
        .from("business_locations")
        .select("business_id")
        .eq("area", areaName);

    if (locationsError) {
        console.error("Error fetching business locations:", locationsError);
        return { success: false, error: locationsError };
    }

    if (!businessLocations || businessLocations.length === 0) {
        return { success: true, coupons: [], totalCount: 0 };
    }

    const businessIds = businessLocations.map(location => location.business_id);
    if (businessIds.length === 0) {
        return { success: true, coupons: [], totalCount: 0 };
    }

    // Step 2: Build the base coupon query
    let query = supabaseAdmin.from("coupons");

    // Add select based on user login status
    query = userId
        ? query.select("*, businesses(name)")
        : query.select("*");

    // Filter by business_ids using .in AFTER select
    query = query.in("business_id", businessIds);

    // Step 3: Apply optional filters
    if (dateFilter?.after) {
        query = query.gte("created_at", dateFilter.after);
    }
    if (dateFilter?.before) {
        query = query.lte("created_at", dateFilter.before);
    }

    if (sortBy === "newest") {
        query = query.order("created_at", { ascending: false });
    } else if (sortBy === "oldest") {
        query = query.order("created_at", { ascending: true });
    }

    // Apply pagination
    if (limit) {
        query = query.range(offset, offset + limit - 1);
    }

    const { data, error } = await query;

    if (error) {
        console.error("Error fetching area coupons:", error);
        return { success: false, error };
    }

    // Get total count if requested
    let totalCount = null;
    if (includeCount) {
        let countQuery = supabaseAdmin
            .from("coupons")
            .select("*", { count: 'exact', head: true })
            .in("business_id", businessIds);

        // Apply same filters for count
        if (dateFilter?.after) {
            countQuery = countQuery.gte("created_at", dateFilter.after);
        }
        if (dateFilter?.before) {
            countQuery = countQuery.lte("created_at", dateFilter.before);
        }

        const { count: totalCouponsCount, error: countError } = await countQuery;
        if (!countError) {
            totalCount = totalCouponsCount;
        }
    }

    if (!userId) {
        return {
            success: true,
            coupons: data || [],
            totalCount
        };
    }

    // Step 4: Check claimed coupons by user
    const { data: userCoupons, error: userCouponsError } = await supabaseAdmin
        .from("user_coupons")
        .select("coupon_id")
        .eq("user_id", userId);

    if (userCouponsError) {
        console.error("Error fetching user coupons:", userCouponsError);
        return { success: false, error: userCouponsError };
    }

    const claimedCouponIds = new Set(userCoupons.map(uc => uc.coupon_id));

    const couponsWithClaimStatus = data.map(coupon => ({
        ...coupon,
        is_claimed: claimedCouponIds.has(coupon.id)
    }));

    return {
        success: true,
        coupons: couponsWithClaimStatus,
        totalCount
    };
}


// Additional helper functions for specific use cases

export async function fetchRecentCoupons(days = 7) {
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - days);

    return await fetchAllCoupons({
        sortBy: 'newest',
        dateFilter: {
            after: dateThreshold.toISOString()
        }
    });
}

export async function fetchCouponsFromDateRange(startDate, endDate) {
    return await fetchAllCoupons({
        sortBy: 'newest',
        dateFilter: {
            after: startDate,
            before: endDate
        }
    });
}

export async function fetchLatestCoupons(limit = 10) {
    return await fetchAllCoupons({
        sortBy: 'newest',
        limit: limit
    });
}

export async function fetchAreaCouponsRecent(areaName, days = 7) {
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - days);

    return await fetchAreaCoupons(areaName, {
        sortBy: 'newest',
        dateFilter: {
            after: dateThreshold.toISOString()
        }
    });
}



export async function claimCoupon(couponId, redeemMinutes = 0) {
    const userId = await getUserId();
    if (!userId) {
        return { success: false, message: "User not logged in" };
    }

    // Fetch coupon details including type and end_date
    const { data: couponData, error: couponError } = await supabaseAdmin
        .from("coupons")
        .select("user_id, coupon_type, end_date, redemption_time_type, redemption_start_time, redemption_end_time")
        .eq("id", couponId)
        .single();

    if (couponError) {
        console.error("Error fetching coupon data:", couponError);
        return { success: false, error: couponError };
    }

    if (couponData.user_id === userId) {
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

    // Check time restrictions for specific hours redemption
    if (couponData.redemption_time_type === "specific_hours") {
        const now = new Date();
        const currentTime = now.toTimeString().slice(0, 8); // Get HH:MM:SS format

        const startTime = couponData.redemption_start_time;
        const endTime = couponData.redemption_end_time;

        // Function to compare time strings in HH:MM:SS format
        const isTimeInRange = (current, start, end) => {
            // Handle case where end time is next day (e.g., 22:00 to 06:00)
            if (start <= end) {
                // Same day range (e.g., 09:00 to 17:00)
                return current >= start && current <= end;
            } else {
                // Cross midnight range (e.g., 22:00 to 06:00)
                return current >= start || current <= end;
            }
        };

        if (!isTimeInRange(currentTime, startTime, endTime)) {
            return {
                success: false,
                message: `Coupon can only be claimed between ${startTime} and ${endTime}`
            };
        }
    }

    // Calculate expiration time based on coupon type
    let remaining_claim_time = null;
    let coupon_status = "claimed";

    if (couponData.coupon_type === 'redeem_at_store' && redeemMinutes > 0) {
        // For store redemption: Set short expiration time (current time + specified minutes)
        remaining_claim_time = new Date(Date.now() + redeemMinutes * 60 * 1000).toISOString();
    } else if (couponData.coupon_type === 'redeem_online' && couponData.end_date) {
        // For online redemption: Valid until the coupon's end_date
        remaining_claim_time = new Date(couponData.end_date).toISOString();
    }

    // Insert the new user_coupon with remaining claim time if applicable
    const { data, error } = await supabaseAdmin
        .from("user_coupons")
        .insert([{
            user_id: userId,
            coupon_id: couponId,
            coupon_status: coupon_status,
            remaining_claim_time: remaining_claim_time
        }])
        .select("*")
        .single();

    if (error) {
        console.error("Error claiming coupon:", error);
        return { success: false, error };
    }

    // Update the claim counter
    const { data: couponRow, error: fetchError } = await supabaseAdmin
        .from("coupons")
        .select("current_claims")
        .eq("id", couponId)
        .single();

    if (fetchError) {
        console.error("Error fetching coupon:", fetchError);
        return { success: false, error: fetchError };
    }

    // Increment the claims counter
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

    // revalidatePath("/u/profile");
    revalidatePath("/coupons");
    revalidatePath("/u/profile/my-coupons");

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