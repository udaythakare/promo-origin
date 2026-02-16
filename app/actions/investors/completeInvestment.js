"use server";

import { supabaseAdmin } from "../../../lib/supabaseAdmin";
import { getUserId } from "../../../helpers/userHelper";
import { createNotification } from "../notifications/createNotification";

/* 🧠 Helper: Validate UUID */
function isValidUUID(value) {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value
    )
  );
}

export async function completeInvestment({ investmentId, roiPercentage }) {
  const userId = await getUserId();

  /* 🔐 Authorization Check */
  if (!userId) {
    return { success: false, code: "UNAUTHORIZED" };
  }

  /* 🆔 Validate UUID */
  if (!isValidUUID(investmentId)) {
    return { success: false, code: "INVALID_ID" };
  }

  /* 📊 Validate ROI */
  if (roiPercentage === undefined || roiPercentage === null) {
    return { success: false, code: "ROI_REQUIRED" };
  }

  if (Number(roiPercentage) < 0) {
    return { success: false, code: "INVALID_ROI" };
  }

  /* 🔍 Fetch investment */
  const { data: investment, error: fetchError } = await supabaseAdmin
    .from("investments")
    .select("id, status, business_id")
    .eq("id", investmentId)
    .eq("investor_id", userId)
    .single();

  if (fetchError || !investment) {
    return { success: false, code: "NOT_FOUND" };
  }

  /* 🚫 Already completed */
  if (investment.status === "completed") {
    return { success: false, code: "ALREADY_COMPLETED" };
  }

  /* ✅ Mark as completed */
  const { data, error } = await supabaseAdmin
    .from("investments")
    .update({
      status: "completed",
      roi_percentage: Number(roiPercentage),
      completed_at: new Date().toISOString(),
    })
    .eq("id", investmentId)
    .eq("investor_id", userId)
    .eq("status", "active") // race condition protection
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
    .single();

  if (error || !data) {
    console.error("Complete Investment Error:", error);
    return { success: false, code: "DB_ERROR" };
  }

  /* 🔔 CREATE NOTIFICATION */
  await createNotification({
    userId: userId,
    title: "Investment Completed ✅",
    message: `Your investment in ${
      data.businesses?.name || "a business"
    } has been successfully completed.`,
    type: "success",
    category: "investment",
    referenceId: data.id,
  });

  return {
    success: true,
    data,
  };
}
