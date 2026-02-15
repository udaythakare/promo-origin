"use server";

import { supabaseAdmin } from "../../../lib/supabaseAdmin";
import { getUserId } from "../../../helpers/userHelper";

export async function createInvestment({ businessId, amount }) {
  const userId = await getUserId();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  /* 🔐 VERIFY INVESTOR ROLE */
  const { data: role } = await supabaseAdmin
    .from("user_roles")
    .select("id")
    .eq("user_id", userId)
    .eq("role", "app_investor")
    .eq("is_active", true)
    .single();

  if (!role) {
    throw new Error("Only investors can create investments");
  }

  /* 🚨 PREVENT DUPLICATE ACTIVE INVESTMENT */
  const { data: existing } = await supabaseAdmin
    .from("investments")
    .select("id")
    .eq("investor_id", userId)
    .eq("business_id", businessId)
    .eq("status", "active")
    .maybeSingle();

  if (existing) {
    throw new Error(
      "You already have an active investment in this business."
    );
  }

  /* 💰 CREATE INVESTMENT */
  const { data, error } = await supabaseAdmin
    .from("investments")
    .insert({
      investor_id: userId,
      business_id: businessId,
      amount: Number(amount),
      status: "active",
      invested_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error("Supabase Insert Error:", error);
    throw new Error(error.message);
  }

  return data;
}
