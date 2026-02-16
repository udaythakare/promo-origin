"use server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function createNotification({
  userId,
  title,
  message,
  type = "info",
  category = null,
  referenceId = null,
}) {
  const { error } = await supabaseAdmin
    .from("internal_notifications")
    .insert({
      user_id: userId,
      title,
      message,
      type,
      category,
      reference_id: referenceId,
    });

  if (error) {
    console.error("Notification Error:", error);
  }
}
