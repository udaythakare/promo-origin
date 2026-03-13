"use server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getUserId } from "@/helpers/userHelper";

export async function getVendorConnections() {

  const userId = await getUserId();
  if (!userId || userId?.msg) {
    return { success: false, message: "Unauthorized" };
  }

  // Step 1: Fetch connections with correct FK hint names
  const { data, error } = await supabaseAdmin
    .from("investor_vendor_connections")
    .select(`
      id,
      status,
      initiated_by,
      created_at,
      accepted_at,
      investor_id,
      vendor_id,
      investor:users!fk_investor_user (
        id,
        full_name,
        email
      )
    `)
    .eq("vendor_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getVendorConnections error:", JSON.stringify(error));
    return { success: false, message: error.message };
  }

  // Step 2: Fetch investor profiles separately
  const investorIds = data.map((c) => c.investor_id).filter(Boolean);
  let profilesMap = {};

  if (investorIds.length > 0) {
    const { data: profiles } = await supabaseAdmin
      .from("investor_profiles")
      .select(`
        user_id,
        profile_type,
        company_name,
        city,
        investment_range_min,
        investment_range_max,
        risk_appetite,
        investment_type
      `)
      .in("user_id", investorIds);

    if (profiles) {
      profiles.forEach((p) => {
        profilesMap[p.user_id] = p;
      });
    }
  }

  // Step 3: Attach profile to each connection
  const enriched = data.map((c) => ({
    ...c,
    investor_profile: profilesMap[c.investor_id] || null,
  }));

  // Step 4: Separate into groups
  const incoming = enriched.filter(
    (c) => c.initiated_by === "investor" && c.status === "pending"
  );
  const sentByVendor = enriched.filter(
    (c) => c.initiated_by === "vendor" && c.status === "pending"
  );
  const accepted = enriched.filter((c) => c.status === "accepted");
  const rejected = enriched.filter((c) => c.status === "rejected");

  return {
    success: true,
    incoming,
    sentByVendor,
    accepted,
    rejected,
    all: enriched,
  };
}