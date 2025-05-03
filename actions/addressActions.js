'use server';
import { getUserId } from '@/helpers/userHelper';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function getAddressDropdowns() {
    const { data: areaData, erorr: areaError } = await supabaseAdmin.from("area").select("*");
    if (areaError) {
        console.error("Error fetching area data:", areaError);
        return { success: false, error: areaError };
    }
    const { data: cityData, error: cityError } = await supabaseAdmin.from("city").select("*");
    if (cityError) {
        console.error("Error fetching city data:", cityError);
        return { success: false, error: cityError };
    }
    const { data: stateData, error: stateError } = await supabaseAdmin.from("state").select("*");
    if (stateError) {
        console.error("Error fetching state data:", stateError);
        return { success: false, error: stateError };
    }

    console.log(areaData, cityData, stateData, "Address Dropdowns Data")

    return {
        success: true,
        areaData: areaData || [],
        cityData: cityData || [],
        stateData: stateData || [],
    };
}

export async function getUserLocationData() {
    const userId = await getUserId();
    if (!userId) {
        return { success: false, message: "User not logged in" };
    }
    const { data, error } = await supabaseAdmin
        .from("user_locations")
        .select("*")
        .eq("user_id", userId)
        .single();
    if (error) {
        console.error("Error fetching user location data:", error);
        return { success: false, error };
    }
    return {
        data
    };
}