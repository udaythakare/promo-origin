"use server";

import { supabaseAdmin } from "../../../lib/supabaseAdmin.js";



/**
 * Fetch investor ↔ vendor connection status
 */
export async function getVendorConnection({
  investorId,
  vendorUserId,
}) {
  const { data, error } = await supabaseAdmin
    .from("investor_vendor_connections")
    .select("status")
    .eq("investor_id", investorId)
    .eq("vendor_id", vendorUserId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching vendor connection:", error);
    throw new Error(error.message);
  }

  return data; // null if no connection
}
