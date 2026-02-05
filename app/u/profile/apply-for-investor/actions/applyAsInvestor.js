"use server";

import { supabaseAdmin } from "../../../../../lib/supabaseAdmin";
import { getUserId } from "../../../../../helpers/userHelper";

export async function applyAsInvestor({ interest }) {
  const userId = await getUserId();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const { data: existingRole } = await supabaseAdmin
    .from("user_roles")
    .select("id")
    .eq("user_id", userId)
    .eq("role", "app_investor")
    .single();

  if (existingRole) {
    return { alreadyInvestor: true };
  }

  const { error } = await supabaseAdmin
    .from("user_roles")
    .insert({
      user_id: userId,
      role: "app_investor",
      is_active: true,
      is_verified: false,
    });

  if (error) throw error;

  return { success: true };
}
