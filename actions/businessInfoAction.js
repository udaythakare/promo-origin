'use server';
import { getUserId } from '@/helpers/userHelper';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function getBusinessInfo() {
    const userId = await getUserId();
    if (!userId) {
        return { success: false, message: "User not logged in" };
    }
    const { data, error } = await supabaseAdmin
        .from("businesses")
        .select("*")
        .eq("user_id", userId)
        .single();
    if (error) {
        console.error("Error fetching business info:", error);
        return { success: false, error };
    }

    const { data: businessLocationData, error: businessLocationError } = await supabaseAdmin
        .from("business_locations")
        .select("*")
        .eq("business_id", data.id)
        .single();
    if (businessLocationError) {
        console.error("Error fetching business location data:", businessLocationError);
        return { success: false, error: businessLocationError };
    }
    return {
        success: true,
        businessInfo: {
            ...data,
            ...businessLocationData
        }
    };
}

export async function updateBusinessInfo(formData) {
    console.log(formData, "Form Data in updateBusinessInfo action");
    try {
        const userId = await getUserId();
        if (!userId) {
            return { success: false, message: "User not logged in" };
        }

        // Verify this user owns the business
        if (formData.user_id !== userId) {
            return { success: false, message: "Unauthorized to update this business" };
        }

        // const supabaseAdmin = createClient(cookies());

        // Business table fields
        const businessData = {
            name: formData.name,
            description: formData.description,
            category_id: formData.category_id,
            website: formData.website,
            phone: formData.phone,
            email: formData.email,
        };

        // Business location table fields
        const locationData = {
            address: formData.address,
            area: formData.area,
            city: formData.city,
            state: formData.state,
            postal_code: formData.postal_code,
            country: formData.country,
        };

        // Update the business record
        const { error: businessError } = await supabaseAdmin
            .from('businesses')
            .update(businessData)
            // .eq('id', formData.id)
            .eq('user_id', userId);

        if (businessError) {
            console.error("Error updating business:", businessError);
            return { success: false, message: "Failed to update business information" };
        }

        // Update the business_locations record
        const { error: locationError } = await supabaseAdmin
            .from('business_locations')
            .update(locationData)
            .eq('id', formData.id)
        // .eq('business_id', formData.id);

        if (locationError) {
            console.error("Error updating business location:", locationError);
            return { success: false, message: "Failed to update location information" };
        }

        return {
            success: true,
            message: "Business information updated successfully"
        };
    } catch (error) {
        console.error("Unexpected error updating business info:", error);
        return {
            success: false,
            message: "An unexpected error occurred while updating business information"
        };
    }
}