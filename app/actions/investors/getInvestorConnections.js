"use server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getUserId } from "@/helpers/userHelper";

export async function getInvestorConnections() {

  const userId = await getUserId();
  if (!userId || userId?.msg) {
    return { success: false, message: "Unauthorized" };
  }

  // Fetch all connections where this user is the investor
  const { data, error } = await supabaseAdmin
    .from("investor_vendor_connections")
    .select("id, status, initiated_by, created_at, accepted_at, investor_id, vendor_id")
    .eq("investor_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getInvestorConnections error:", JSON.stringify(error));
    return { success: false, message: error.message };
  }

  // Fetch all vendor user_ids from connections
  const vendorIds = data.map((c) => c.vendor_id).filter(Boolean);
  let vendorsMap = {};

  if (vendorIds.length > 0) {
    // Fetch vendor user info
    const { data: vendorUsers } = await supabaseAdmin
      .from("users")
      .select("id, full_name, email")
      .in("id", vendorIds);

    // Fetch vendor business info
    const { data: businesses } = await supabaseAdmin
      .from("businesses")
      .select("id, name, user_id, category_id")
      .in("user_id", vendorIds);

    if (vendorUsers) {
      vendorUsers.forEach((u) => {
        vendorsMap[u.id] = { ...vendorsMap[u.id], ...u };
      });
    }

    if (businesses) {
      businesses.forEach((b) => {
        vendorsMap[b.user_id] = {
          ...vendorsMap[b.user_id],
          business_name: b.name,
          business_id: b.id,
        };
      });
    }
  }

  // Attach vendor info to each connection
  const enriched = data.map((c) => ({
    ...c,
    vendor: vendorsMap[c.vendor_id] || null,
  }));

  // Separate into groups
  // incoming = vendor initiated, waiting for investor to respond
  const incoming = enriched.filter(
    (c) => c.initiated_by === "vendor" && c.status === "pending"
  );

  // outgoing = investor initiated, waiting for vendor
  const outgoing = enriched.filter(
    (c) => c.initiated_by === "investor" && c.status === "pending"
  );

  const accepted = enriched.filter((c) => c.status === "accepted");
  const rejected = enriched.filter((c) => c.status === "rejected");

  return {
    success: true,
    incoming,
    outgoing,
    accepted,
    rejected,
    all: enriched,
  };
}