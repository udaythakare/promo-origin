"use server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getUserId } from "@/helpers/userHelper";
import { createNotification } from "../notifications/createNotification";

export async function sendConnectionRequest(vendorBusinessId) {
  try {
    /* 🔐 Get Logged-in Investor */
    const investorId = await getUserId();

    if (!investorId) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    /* 🏢 Step 1: Get vendor user_id from business */
    const { data: business, error: businessError } = await supabaseAdmin
      .from("businesses")
      .select("user_id, name")
      .eq("id", vendorBusinessId)
      .single();

    if (businessError || !business) {
      return {
        success: false,
        message: "Vendor not found",
      };
    }

    const vendorUserId = business.user_id;

    /* 🔍 Step 2: Check if connection already exists */
    const { data: existingConnection, error: checkError } =
      await supabaseAdmin
        .from("investor_vendor_connections")
        .select("id")
        .eq("investor_id", investorId)
        .eq("vendor_id", vendorUserId)
        .maybeSingle();

    if (checkError) {
      console.error("Error checking existing connection:", checkError);
      return {
        success: false,
        message: "Database error",
      };
    }

    if (existingConnection) {
      return {
        success: false,
        message: "Connection already exists",
      };
    }

    /* ✅ Step 3: Create connection request */
    const { data: newConnection, error: insertError } =
      await supabaseAdmin
        .from("investor_vendor_connections")
        .insert({
          investor_id: investorId,
          vendor_id: vendorUserId,
          initiated_by: "investor",
          status: "pending",
        })
        .select()
        .single();

    if (insertError || !newConnection) {
      console.error("Error creating connection:", insertError);
      return {
        success: false,
        message: "Failed to send request",
      };
    }

    /* 🔔 Step 4: Notify Vendor */
    await createNotification({
      userId: vendorUserId,
      title: "New Investor Connection Request 🤝",
      message: `An investor wants to connect with your business "${business.name}".`,
      type: "info",
      category: "connection",
      referenceId: newConnection.id,
    });

    return {
      success: true,
      message: "Request sent successfully",
      connectionId: newConnection.id,
    };
  } catch (error) {
    console.error("Unexpected error in sendConnectionRequest:", error);
    return {
      success: false,
      message: "An unexpected error occurred",
    };
  }
}
