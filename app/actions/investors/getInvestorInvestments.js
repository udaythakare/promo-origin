"use server";

import { supabaseAdmin } from "../../../lib/supabaseAdmin";

// helper: basic UUID validation
function isValidUUID(value) {
  return typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export async function getInvestorInvestments(investorId) {
  // 🔒 Guard clause (CRITICAL)
  if (!isValidUUID(investorId)) {
    console.warn("Invalid investorId, skipping DB query:", investorId);
    return [];
  }

  const { data, error } = await supabaseAdmin
    .from("investments")
    .select(`
      id,
      amount,
      roi_percentage,
      status,
      invested_at,
      completed_at,
      business_id,
      businesses ( name )
    `)
    .eq("investor_id", investorId)
    .order("invested_at", { ascending: false });

  if (error) {
    console.error("getInvestorInvestments error:", error);
    throw error;
  }

  return data;
}
