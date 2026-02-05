"use server";

import { supabaseAdmin } from "../../../lib/supabaseAdmin.js";

/**
 * Fetch all investors with connection status for a specific vendor
 * Schema-safe version (NO invalid joins)
 */
export async function getAllInvestorsForVendor(vendorUserId) {
  // 1️⃣ Fetch all investors
  const { data: investors, error: investorError } = await supabaseAdmin
    .from("investor_profiles")
    .select(`
      user_id,
      full_name,
      city,
      investment_range,
      investment_interest
    `);

  if (investorError) {
    console.error("Error fetching investors:", investorError);
    throw new Error(investorError.message);
  }

  // 2️⃣ Fetch all connections for this vendor
  const { data: connections, error: connectionError } = await supabaseAdmin
    .from("investor_vendor_connections")
    .select(`
      investor_id,
      status
    `)
    .eq("vendor_id", vendorUserId);

  if (connectionError) {
    console.error("Error fetching connections:", connectionError);
    throw new Error(connectionError.message);
  }

  // 3️⃣ Merge data manually
  const connectionMap = new Map();
  connections.forEach((conn) => {
    connectionMap.set(conn.investor_id, conn.status);
  });

  // 4️⃣ Attach connection status to investors
  const result = investors.map((investor) => ({
    ...investor,
    connection_status: connectionMap.get(investor.user_id) || null,
  }));

  return result;
}
