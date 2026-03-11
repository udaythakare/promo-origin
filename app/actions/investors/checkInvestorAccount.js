"use server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getUserId } from "@/helpers/userHelper";

export async function checkInvestorAccount() {

  const userId = await getUserId();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("id")
    .eq("user_id", userId)
    .eq("role", "app_investor")
    .maybeSingle(); // safer than .single()

  if (error) {
    console.error("Investor role check failed:", error);
    throw error;
  }

  return {
    hasInvestorAccount: !!data
  };
}