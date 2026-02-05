"use server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";

// TODO: Replace with actual investor ID from auth session
const TEMP_INVESTOR_ID = "your-investor-uuid-here";

export async function sendConnectionRequest(vendorBusinessId) {
  try {
    // Step 1: Get the vendor's user_id from their business
    const { data: business, error: businessError } = await supabaseAdmin
      .from("businesses")
      .select("user_id")
      .eq("id", vendorBusinessId)
      .single();

    if (businessError || !business) {
      return {
        success: false,
        message: "Vendor not found",
      };
    }

    const vendorUserId = business.user_id;

    // Step 2: Check if connection already exists
    const { data: existingConnection, error: checkError } = await supabaseAdmin
      .from("investor_vendor_connections")
      .select("*")
      .eq("investor_id", TEMP_INVESTOR_ID)
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
        message: "You already have a connection with this vendor",
      };
    }

    // Step 3: Create new connection request
    const { data: newConnection, error: insertError } = await supabaseAdmin
      .from("investor_vendor_connections")
      .insert({
        investor_id: TEMP_INVESTOR_ID,
        vendor_id: vendorUserId,
        status: "pending",
        request_message: "I'm interested in learning more about your business.",
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error creating connection:", insertError);
      return {
        success: false,
        message: "Failed to send request",
      };
    }

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
