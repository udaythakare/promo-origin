"use server";

import { supabaseAdmin } from "../../../lib/supabaseAdmin.js";

export async function sendVendorRequest({ investorId, vendorUserId }) {

  // Step 1: Check if connection already exists
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
      connectionId: existing.id,
      message: "Request already exists",
    };
  }

  // Step 2: Create the connection request
  const { data: connection, error } = await supabaseAdmin
    .from("investor_vendor_connections")
    .insert({
      investor_id: investorId,
      vendor_id: vendorUserId,
      initiated_by: "investor",
      status: "pending",
    })
    .select("id")
    .single();

  if (error) {
    console.error("Send vendor request error:", error);
    throw new Error(error.message);
  }

  // Step 3: Notify the vendor
  await supabaseAdmin
    .from("internal_notifications")
    .insert({
      user_id: vendorUserId,
      title: "New Investment Request",
      message: "An investor wants to connect with your business",
      type: "connection_request",
      category: "investment",
      reference_id: connection.id,
    });

  return {
    success: true,
    status: "pending",
    connectionId: connection.id,
  };
}