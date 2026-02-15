import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();

    // 🔥 TEMPORARY HARDCODE (since you use custom auth)
    const userId = "f1d98686-2bc6-4337-a927-6bf55f756e3e";

    // ================= FETCH INVESTMENTS =================
    const { data: investments, error: investError } =
      await supabase
        .from("investments")
        .select("amount, status, roi_percentage, invested_at")
        .eq("investor_id", userId);

    if (investError) throw investError;

    // ================= FETCH CONNECTIONS =================
    const { data: connections, error: connError } =
      await supabase
        .from("investor_vendor_connections")
        .select("status")
        .eq("investor_id", userId);

    if (connError) throw connError;

    const totalInvestments = investments?.length || 0;

    const totalAmount =
      investments?.reduce((sum, inv) => sum + Number(inv.amount || 0), 0) || 0;

    const activeInvestments =
      investments?.filter((inv) => inv.status === "active").length || 0;

    const completedInvestments =
      investments?.filter((inv) => inv.status === "completed").length || 0;

    const totalConnections =
      connections?.filter((c) => c.status === "accepted").length || 0;

    const pendingRequests =
      connections?.filter((c) => c.status === "pending").length || 0;

    const totalProfit =
      investments?.reduce((sum, inv) => {
        const profit =
          (Number(inv.amount || 0) *
            Number(inv.roi_percentage || 0)) /
          100;
        return sum + profit;
      }, 0) || 0;

    const overallROI =
      totalAmount > 0
        ? ((totalProfit / totalAmount) * 100).toFixed(2)
        : "0.00";

    const monthlyMap = {};

    investments?.forEach((inv) => {
      if (!inv.invested_at) return;

      const date = new Date(inv.invested_at);
      const monthKey = date.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });

      if (!monthlyMap[monthKey]) {
        monthlyMap[monthKey] = 0;
      }

      monthlyMap[monthKey] += Number(inv.amount || 0);
    });

    const monthlyGrowth = Object.keys(monthlyMap).map((month) => ({
      month,
      amount: monthlyMap[month],
    }));

    return NextResponse.json({
      success: true,
      analytics: {
        totalInvestments,
        totalAmount,
        activeInvestments,
        completedInvestments,
        totalConnections,
        pendingRequests,
        totalProfit,
        overallROI,
        monthlyGrowth,
      },
    });

  } catch (error) {
    console.error("Analytics API Error:", error);

    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
