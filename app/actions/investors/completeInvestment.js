"use server";

import { supabaseAdmin } from "../../../lib/supabaseAdmin";
import { getUserId } from "../../../helpers/userHelper";

export async function completeInvestment({ investmentId, roiPercentage }) {
  const userId = await getUserId();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  /* 🔐 Ensure investment belongs to investor */
  const { data: investment, error: fetchError } = await supabaseAdmin
    .from("investments")
    .select("id")
    .eq("id", investmentId)
    .eq("investor_id", userId)
    .single();

  if (fetchError || !investment) {
    throw new Error("Investment not found or unauthorized");
  }

  /* ✅ Mark as completed */
  const { data, error } = await supabaseAdmin
    .from("investments")
    .update({
      status: "completed",
      roi_percentage: roiPercentage,
      completed_at: new Date().toISOString(),
    })
    .eq("id", investmentId)
    .select()
    .single();

  if (error) {
    throw new Error("Failed to complete investment");
  }

  return data;
}
