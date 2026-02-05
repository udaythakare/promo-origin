"use server";

import { supabaseAdmin } from "../../../lib/supabaseAdmin.js";

/**
 * Create investor → vendor connection request
 * Prevents duplicate requests
 */
export async function sendVendorRequest({
  investorId,
  vendorUserId,
}) {
  // 1. Check if connection already exists
  const { data: existing } = await supabaseAdmin
    .from("investor_vendor_connections")
    .select("id, status")
    .eq("investor_id", investorId)
    .eq("vendor_id", vendorUserId)
    .maybeSingle();

  if (existing) {
    return {
      success: false,
      status: existing.status,
      message: "Request already exists",
    };
  }

  // 2. Create new request
  const { error } = await supabaseAdmin
    .from("investor_vendor_connections")
    .insert({
      investor_id: investorId,
      vendor_id: vendorUserId,
      initiated_by: "investor",
      status: "pending",
    });

  if (error) {
    console.error("Send vendor request error:", error);
    throw new Error(error.message);
  }

  return {
    success: true,
    status: "pending",
  };
}
