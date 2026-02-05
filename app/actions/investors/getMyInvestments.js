"use server";

import { supabaseAdmin } from "../../lib/supabaseAdmin";
import { getUserId } from "../../helpers/userHelper";

export async function getMyInvestments() {
  const userId = await getUserId();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  /* 🔐 VERIFY INVESTOR ROLE (NOW SAFE) */
  const { data: role, error: roleError } = await supabaseAdmin
    .from("user_roles")
    .select("id")
    .eq("user_id", userId)
    .eq("role", "app_investor")
    .eq("is_active", true)
    .single();

  if (roleError || !role) {
    throw new Error("User is not an investor");
  }

  /* 💼 FETCH INVESTMENTS */
  const { data, error } = await supabaseAdmin
    .from("investments")
    .select(`
      id,
      amount,
      status,
      invested_at,
      roi_percentage,
      businesses (
        id,
        name,
        city
      )
    `)
    .eq("investor_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    throw new Error("Failed to fetch investments");
  }

  return data;
}
