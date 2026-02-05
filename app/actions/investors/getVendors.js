"use server";

import { supabaseAdmin } from "../../../lib/supabaseAdmin";

/**
 * Fetch all businesses (vendors) with category and primary location
 * Used in Investor → Vendors list
 */
export async function getVendors() {
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
      business_categories (
        id,
        name
      ),
      business_locations (
        id,
        city,
        state,
        address,
        is_primary
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching vendors:", error);
    throw new Error(error.message);
  }

  return data;
}
