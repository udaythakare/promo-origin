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
    country,
    profileType,
    companyName,
    registrationNumber,
    officeAddress,
    netWorth,
    annualIncome,
    investmentRangeMin,
    investmentRangeMax,
    riskAppetite,
    investmentType,
    debtInterestRate,
    preferredIndustries,
    preferredLocations,
    investmentHorizon,
    expectedROI,
  } = formData;

  // Construct structured investor object
  const investorData = {
    user_id: userId,
    full_name: fullName,
    phone,
    city,
    country,
    profile_type: profileType,
    company_name: companyName,
    registration_number: registrationNumber,
    office_address: officeAddress,
    net_worth: netWorth ? Number(netWorth) : null,
    annual_income: annualIncome ? Number(annualIncome) : null,
    investment_range_min: investmentRangeMin
      ? Number(investmentRangeMin)
      : null,
    investment_range_max: investmentRangeMax
      ? Number(investmentRangeMax)
      : null,
    risk_appetite: riskAppetite,
    investment_type: investmentType,
    debt_interest_rate: debtInterestRate
      ? Number(debtInterestRate)
      : null,
    preferred_industries: preferredIndustries || null,
    preferred_locations: preferredLocations || null,
    investment_horizon: investmentHorizon,
    expected_roi: expectedROI ? Number(expectedROI) : null,
    updated_at: new Date(),
  };

  // 1️⃣ Check if profile already exists
  const { data: existingProfile, error: fetchError } =
    await supabaseAdmin
      .from("investor_profiles")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

  if (fetchError) throw fetchError;

  if (existingProfile) {
    // 2️⃣ UPDATE existing profile
    const { error: updateError } = await supabaseAdmin
      .from("investor_profiles")
      .update(investorData)
      .eq("user_id", userId);

    if (updateError) throw updateError;
  } else {
    // 3️⃣ INSERT new profile
    const { error: insertError } = await supabaseAdmin
      .from("investor_profiles")
      .insert(investorData);

    if (insertError) throw insertError;
  }

  // 4️⃣ Ensure investor role exists
  const { data: existingRole } = await supabaseAdmin
    .from("user_roles")
    .select("id")
    .eq("user_id", userId)
    .eq("role", "app_investor")
    .maybeSingle();

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
