"use server";

import { supabaseAdmin } from "../../../lib/supabaseAdmin";

export async function getDashboardStats() {
  try {
    // No investor filter until auth exists
    const { data, error } = await supabaseAdmin
      .from("investor_vendor_connections")
      .select("status");

    if (error) {
      throw error;
    }

    const pendingRequests =
      data?.filter((c) => c.status === "pending").length || 0;

    const connectedVendors =
      data?.filter((c) => c.status === "connected").length || 0;

    return {
      totalInvestments: "$0",
      vendorsMonitored: connectedVendors.toString(),
      pendingRequests: pendingRequests.toString(),
      avgROI: "0%",
    };
  } catch (err) {
    console.error("Dashboard stats error:", err);

    return {
      totalInvestments: "$0",
      vendorsMonitored: "0",
      pendingRequests: "0",
      avgROI: "0%",
    };
  }
}
