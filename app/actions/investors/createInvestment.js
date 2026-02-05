"use server";

import { supabaseAdmin } from "../../../lib/supabaseAdmin";
import { getUserId } from "../../../helpers/userHelper";

export async function createInvestment({ businessId, amount }) {
  const userId = await getUserId();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  /* 🔐 VERIFY INVESTOR ROLE */
  const { data: role, error: roleError } = await supabaseAdmin
    .from("user_roles")
    .select("id")
    .eq("user_id", userId)
    .eq("role", "app_investor")
    .eq("is_active", true)
    .single();

  if (roleError || !role) {
    throw new Error("Only investors can create investments");
  }

  /* 💰 CREATE INVESTMENT */
  const { data, error } = await supabaseAdmin
    .from("investments")
    .insert({
      investor_id: userId,
      business_id: businessId,
      amount,
      status: "active",
      invested_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Failed to create investment");
  }

  return data;
}
