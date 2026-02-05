"use server";

import { supabaseAdmin } from "../../../lib/supabaseAdmin";
import { getUserId } from "../../../helpers/userHelper";

export async function getInvestmentStats() {
  try {
    const userId = await getUserId();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    /* 🔐 VERIFY INVESTOR ROLE FIRST */
    const { data: role, error: roleError } = await supabaseAdmin
      .from("user_roles")
      .select("id")
      .eq("user_id", userId)
      .eq("role", "app_investor")
      .eq("is_active", true)
      .single();

    if (roleError || !role) {
      throw new Error("User is not an investor");
    }

    /* 📊 TOTAL INVESTED AMOUNT */
    const { data: totalData, error: totalError } = await supabaseAdmin
      .from("investments")
      .select("amount")
      .eq("investor_id", userId);

    if (totalError) {
      throw totalError;
    }

    const totalInvested = totalData.reduce(
      (sum, inv) => sum + Number(inv.amount),
      0
    );

    /* 📦 ACTIVE INVESTMENTS COUNT */
    const activeCount = totalData.filter(
      (inv) => inv.status === "active"
    ).length;

    return {
      totalInvested,
      totalInvestments: totalData.length,
      activeInvestments: activeCount,
    };
  } catch (err) {
    console.error("[ Server ] getInvestmentStats error:", err);
    throw err;
  }
}
