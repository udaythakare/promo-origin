import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export async function GET() {
  try {
    const supabase = createSupabaseServerClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = user.id;

    const { data: investments, error: investError } =
      await supabase
        .from("investments")
        .select("amount, status")
        .eq("investor_id", userId);

    if (investError) throw investError;

    const { data: connections, error: connError } =
      await supabase
        .from("investor_vendor_connections")
        .select("status")
        .eq("investor_id", userId);

    if (connError) throw connError;

    const totalInvestments = investments?.length || 0;

    const totalAmount =
      investments?.reduce((sum, inv) => sum + (inv.amount || 0), 0) || 0;

    const activeInvestments =
      investments?.filter((inv) => inv.status === "active").length || 0;

    const completedInvestments =
      investments?.filter((inv) => inv.status === "completed").length || 0;

    const totalConnections =
      connections?.filter((c) => c.status === "accepted").length || 0;

    const pendingRequests =
      connections?.filter((c) => c.status === "pending").length || 0;

    return NextResponse.json({
      success: true,
      analytics: {
        totalInvestments,
        totalAmount,
        activeInvestments,
        completedInvestments,
        totalConnections,
        pendingRequests,
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
