"use server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getUserId } from "@/helpers/userHelper";

export async function respondToConnection({ connectionId, action }) {

  const userId = await getUserId();
  if (!userId || userId?.msg) {
    return { success: false, message: "Unauthorized" };
  }

  if (!["accepted", "rejected"].includes(action)) {
    return { success: false, message: "Invalid action" };
  }

  const { data: connection, error: fetchError } = await supabaseAdmin
    .from("investor_vendor_connections")
    .select("*")
    .eq("id", connectionId)
    .single();

  if (fetchError || !connection) {
    return { success: false, message: "Connection not found" };
  }

  const isReceiver =
    connection.initiated_by === "investor" && connection.vendor_id === userId;

  if (!isReceiver) {
    return { success: false, message: "Not authorized to respond" };
  }

  if (connection.status !== "pending") {
    return { success: false, message: `Already ${connection.status}` };
  }

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
    console.error("respondToConnection error:", updateError);
    return { success: false, message: "Failed to update" };
  }

  const notifMessage =
    action === "accepted"
      ? "Your connection request was accepted! You can now chat."
      : "Your connection request was declined.";

  await supabaseAdmin.from("internal_notifications").insert({
    user_id: connection.investor_id,
    title: action === "accepted" ? "Request Accepted!" : "Request Declined",
    message: notifMessage,
    type: "connection_response",
    category: "investment",
    reference_id: connectionId,
  });

  return { success: true, action };
}