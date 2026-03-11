import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export async function GET() {
  try {

    const supabase = await createSupabaseServerClient();

    // TEMP USER (replace later with session user)
    const userId = "f1d98686-2bc6-4337-a927-6bf55f756e3e";

    /* ================= INVESTMENTS ================= */

    const { data: investments, error: investError } = await supabase
      .from("investments")
      .select("amount,status,roi_percentage,invested_at")
      .eq("investor_id", userId);

    if (investError) throw investError;

    const investmentList = investments || [];

    /* ================= CONNECTIONS ================= */

    const { data: connections, error: connError } = await supabase
      .from("investor_vendor_connections")
      .select("status")
      .eq("investor_id", userId);

    if (connError) throw connError;

    const connectionList = connections || [];

    /* ================= CALCULATIONS ================= */

    const totalInvestments = investmentList.length;

    const totalAmount = investmentList.reduce(
      (sum, inv) => sum + Number(inv.amount || 0),
      0
    );

    const activeInvestments = investmentList.filter(
      (inv) => inv.status === "active"
    ).length;

    const completedInvestments = investmentList.filter(
      (inv) => inv.status === "completed"
    ).length;

    const totalConnections = connectionList.filter(
      (c) => c.status === "accepted"
    ).length;

    const pendingRequests = connectionList.filter(
      (c) => c.status === "pending"
    ).length;

    const totalProfit = investmentList.reduce((sum, inv) => {
      const amount = Number(inv.amount || 0);
      const roi = Number(inv.roi_percentage || 0);
      return sum + (amount * roi) / 100;
    }, 0);

    const overallROI =
      totalAmount > 0
        ? ((totalProfit / totalAmount) * 100).toFixed(2)
        : "0.00";

    /* ================= MONTHLY GROWTH ================= */

    const monthlyMap = {};

    investmentList.forEach((inv) => {
      if (!inv.invested_at) return;

      const date = new Date(inv.invested_at);

      const key = date.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });

      if (!monthlyMap[key]) monthlyMap[key] = 0;

      monthlyMap[key] += Number(inv.amount || 0);
    });

    const monthlyGrowth = Object.entries(monthlyMap)
      .map(([month, amount]) => ({ month, amount }))
      .sort((a, b) => new Date(a.month) - new Date(b.month));

    /* ================= RESPONSE ================= */

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