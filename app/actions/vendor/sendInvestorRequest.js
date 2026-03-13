"use server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getUserId } from "@/helpers/userHelper";

export async function sendInvestorRequest({ investorUserId }) {

  const userId = await getUserId();
  if (!userId || userId?.msg) {
    return { success: false, message: "Unauthorized" };
  }

  const { data: existing } = await supabaseAdmin
    .from("investor_vendor_connections")
    .select("id, status")
    .eq("investor_id", investorUserId)
    .eq("vendor_id", userId)
    .maybeSingle();

  if (existing) {
    return {
      success: false,
      status: existing.status,
      connectionId: existing.id,
      message: "Connection already exists",
    };
  }

  const { data: connection, error } = await supabaseAdmin
    .from("investor_vendor_connections")
    .insert({
      investor_id: investorUserId,
      vendor_id: userId,
      initiated_by: "vendor",
      status: "pending",
    })
    .select("id")
    .single();

  if (error) {
    console.error("sendInvestorRequest error:", JSON.stringify(error));
    return { success: false, message: error.message };
  }

  await supabaseAdmin.from("internal_notifications").insert({
    user_id: investorUserId,
    title: "New Investment Request",
    message: "A vendor wants to connect with you for investment",
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