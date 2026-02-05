"use server";

import { supabaseAdmin } from "../../../../../lib/supabaseAdmin";
import { getUserId } from "../../../../../helpers/userHelper";

export async function saveInvestorProfile(formData) {
  const userId = await getUserId();
  if (!userId) throw new Error("User not authenticated");

  const {
    fullName,
    phone,
    city,
    investmentRange,
    investmentInterest,
  } = formData;

  // 1️⃣ Check if profile already exists
  const { data: existingProfile } = await supabaseAdmin
    .from("investor_profiles")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (existingProfile) {
    // 2️⃣ UPDATE existing profile
    const { error: updateError } = await supabaseAdmin
      .from("investor_profiles")
      .update({
        full_name: fullName,
        phone,
        city,
        investment_range: investmentRange,
        investment_interest: investmentInterest,
        updated_at: new Date(),
      })
      .eq("user_id", userId);

    if (updateError) throw updateError;
  } else {
    // 3️⃣ INSERT new profile
    const { error: insertError } = await supabaseAdmin
      .from("investor_profiles")
      .insert({
        user_id: userId,
        full_name: fullName,
        phone,
        city,
        investment_range: investmentRange,
        investment_interest: investmentInterest,
      });

    if (insertError) throw insertError;
  }

  // 4️⃣ Ensure investor role exists
  const { data: existingRole } = await supabaseAdmin
    .from("user_roles")
    .select("id")
    .eq("user_id", userId)
    .eq("role", "app_investor")
    .single();

  if (!existingRole) {
    const { error: roleError } = await supabaseAdmin
      .from("user_roles")
      .insert({
        user_id: userId,
        role: "app_investor",
        is_active: true,
        is_verified: false,
      });

    if (roleError) throw roleError;
  }

  return { success: true };
}
