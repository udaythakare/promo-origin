"use server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getUserId } from "@/helpers/userHelper";

export async function getNotifications() {
  const userId = await getUserId();
  if (!userId) return [];

  const { data } = await supabaseAdmin
    .from("internal_notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20);

  return data || [];
}
