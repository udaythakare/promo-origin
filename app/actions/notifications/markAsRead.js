"use server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function markAsRead(notificationId) {
  await supabaseAdmin
    .from("internal_notifications")
    .update({ is_read: true })
    .eq("id", notificationId);
}
