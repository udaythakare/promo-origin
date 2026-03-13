"use server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getUserId } from "@/helpers/userHelper";

export async function sendMessage({ connectionId, content }) {

  const userId = await getUserId();
  if (!userId || userId?.msg) {
    return { success: false, message: "Unauthorized" };
  }

  if (!content?.trim()) {
    return { success: false, message: "Message cannot be empty" };
  }

  // Verify participant
  const { data: connection, error: connError } = await supabaseAdmin
    .from("investor_vendor_connections")
    .select("id, investor_id, vendor_id, status")
    .eq("id", connectionId)
    .single();

  if (connError || !connection) {
    return { success: false, message: "Connection not found" };
  }

  const isParticipant =
    connection.investor_id === userId ||
    connection.vendor_id === userId;

  if (!isParticipant) {
    return { success: false, message: "Access denied" };
  }

  if (connection.status !== "accepted") {
    return { success: false, message: "Connection not active" };
  }

  // Insert message
  const { data: message, error: msgError } = await supabaseAdmin
    .from("messages")
    .insert({
      connection_id: connectionId,
      sender_id: userId,
      content: content.trim(),
    })
    .select(`
      id,
      content,
      sender_id,
      is_read,
      created_at,
      sender:users!messages_sender_id_fkey (
        id,
        full_name
      )
    `)
    .single();

  if (msgError) {
    console.error("sendMessage error:", JSON.stringify(msgError));
    return { success: false, message: msgError.message };
  }

  return { success: true, message };
}