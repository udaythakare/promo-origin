"use server";

import { supabaseAdmin } from "../../../lib/supabaseAdmin.js";


/**
 * Fetch full vendor (business) details
 * Includes category, locations, and owner info
 */
export async function getVendorDetails(businessId) {
  const { data, error } = await supabaseAdmin
    .from("businesses")
    .select(`
      id,
      name,
      description,
      website,
      phone,
      email,
      user_id,
      created_at,
      business_categories (
        id,
        name
      ),
      business_locations (
        id,
        address,
        city,
        state,
        postal_code,
        country,
        is_primary
      ),
      users (
        id,
        full_name,
        email,
        mobile_number
      )
    `)
    .eq("id", businessId)
    .single();

  if (error) {
    console.error("Error fetching vendor details:", error);
    throw new Error(error.message);
  }

  return data;
}
