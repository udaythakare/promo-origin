"use server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getUserId } from "@/helpers/userHelper";

export async function getInvestorProfile() {
  const userId = await getUserId();

  if (!userId) return null;

  const { data, error } = await supabaseAdmin
    .from("investor_profiles")
    .select(`
      *,
      users (
        email,
        username
      )
    `)
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("Profile Fetch Error:", error);
    return null;
  }

  return data;
}
