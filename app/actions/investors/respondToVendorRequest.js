"use server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getUserId } from "@/helpers/userHelper";

export async function respondToVendorRequest({ connectionId, action }) {

  const userId = await getUserId();
  if (!userId || userId?.msg) {
    return { success: false, message: "Unauthorized" };
  }

  if (!["accepted", "rejected"].includes(action)) {
    return { success: false, message: "Invalid action" };
  }

  // Fetch connection
  const { data: connection, error: fetchError } = await supabaseAdmin
    .from("investor_vendor_connections")
    .select("*")
    .eq("id", connectionId)
    .single();

  if (fetchError || !connection) {
    return { success: false, message: "Connection not found" };
  }

  // Security: only investor can respond to vendor-initiated request
  const isReceiver =
    connection.initiated_by === "vendor" &&
    connection.investor_id === userId;

  if (!isReceiver) {
    return { success: false, message: "Not authorized to respond" };
  }

  if (connection.status !== "pending") {
    return { success: false, message: `Already ${connection.status}` };
  }

  // Update status
  const updateData = {
    status: action,
    updated_at: new Date().toISOString(),
  };

  if (action === "accepted") {
    updateData.accepted_at = new Date().toISOString();
  }

  const { error: updateError } = await supabaseAdmin
    .from("investor_vendor_connections")
    .update(updateData)
    .eq("id", connectionId);

  if (updateError) {
    return { success: false, message: "Failed to update" };
  }

  // Notify the vendor
  const notifMessage =
    action === "accepted"
      ? "Your connection request was accepted! You can now chat."
      : "Your connection request was declined.";

  await supabaseAdmin.from("internal_notifications").insert({
    user_id: connection.vendor_id,
    title: action === "accepted" ? "Request Accepted!" : "Request Declined",
    message: notifMessage,
    type: "connection_response",
    category: "investment",
    reference_id: connectionId,
  });

  return { success: true, action };
}