"use server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getUserId } from "@/helpers/userHelper";

export async function getInvestors() {

  const userId = await getUserId();
  if (!userId || userId?.msg) {
    return { success: false, message: "Unauthorized" };
  }

  // Fetch all active investor profiles
  const { data: profiles, error } = await supabaseAdmin
    .from("investor_profiles")
    .select(`
      id,
      user_id,
      full_name,
      city,
      country,
      profile_type,
      company_name,
      investment_range_min,
      investment_range_max,
      risk_appetite,
      investment_type,
      preferred_industries,
      expected_roi,
      investment_horizon
    `)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getInvestors error:", JSON.stringify(error));
    return { success: false, message: error.message };
  }

  // Fetch existing connections for this vendor
  // So we can show correct button state on each investor card
  const { data: connections } = await supabaseAdmin
    .from("investor_vendor_connections")
    .select("id, investor_id, status")
    .eq("vendor_id", userId);

  // Build connection map: investor_user_id → { id, status }
  const connectionMap = {};
  if (connections) {
    connections.forEach((c) => {
      connectionMap[c.investor_id] = { id: c.id, status: c.status };
    });
  }

  // Attach connection status to each investor
  const enriched = profiles.map((p) => ({
    ...p,
    connection: connectionMap[p.user_id] || null,
  }));

  return {
    success: true,
    investors: enriched,
  };
}