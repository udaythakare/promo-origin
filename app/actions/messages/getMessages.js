"use server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getUserId } from "@/helpers/userHelper";

export async function getMessages(connectionId) {

  const userId = await getUserId();
  if (!userId || userId?.msg) {
    return { success: false, message: "Unauthorized" };
  }

  // Step 1: Verify participant
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

  // Step 2: Fetch messages WITHOUT join to avoid FK name issues
  const { data: messages, error: msgError } = await supabaseAdmin
    .from("messages")
    .select("id, content, sender_id, is_read, created_at")
    .eq("connection_id", connectionId)
    .order("created_at", { ascending: true });

  if (msgError) {
    console.error("getMessages error:", JSON.stringify(msgError));
    return { success: false, message: msgError.message };
  }

  // Step 3: Fetch both participant names separately
  const { data: investorUser } = await supabaseAdmin
    .from("users")
    .select("id, full_name")
    .eq("id", connection.investor_id)
    .single();

  const { data: vendorUser } = await supabaseAdmin
    .from("users")
    .select("id, full_name")
    .eq("id", connection.vendor_id)
    .single();

  // Step 4: Build a name lookup map
  // senderMap[user_id] = full_name
  const senderMap = {};
  if (investorUser) senderMap[investorUser.id] = investorUser.full_name;
  if (vendorUser) senderMap[vendorUser.id] = vendorUser.full_name;

  // Step 5: Attach sender name to each message
  const enrichedMessages = messages.map((msg) => ({
    ...msg,
    sender: {
      id: msg.sender_id,
      full_name: senderMap[msg.sender_id] || "Unknown",
    },
  }));

  // Step 6: Mark other person's messages as read
  await supabaseAdmin
    .from("messages")
    .update({ is_read: true })
    .eq("connection_id", connectionId)
    .neq("sender_id", userId)
    .eq("is_read", false);

  return {
    success: true,
    messages: enrichedMessages,
    connection,
    currentUserId: userId,
  };
}