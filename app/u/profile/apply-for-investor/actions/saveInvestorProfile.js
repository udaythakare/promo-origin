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
        investment_range_min: investmentRangeMin ? Number(investmentRangeMin) : null,
        investment_range_max: investmentRangeMax ? Number(investmentRangeMax) : null,
        risk_appetite: riskAppetite,
        investment_type: investmentType,
        debt_interest_rate: debtInterestRate ? Number(debtInterestRate) : null,
        preferred_industries: preferredIndustries || null,
        preferred_locations: preferredLocations || null,
        investment_horizon: investmentHorizon,
        expected_roi: expectedROI ? Number(expectedROI) : null,
        updated_at: new Date(),
    }

    // Check if profile already exists
    const { data: existingProfile, error: fetchError } = await supabaseAdmin
        .from("investor_profiles")
        .select("id, is_verified, rejection_reason")
        .eq("user_id", userId)
        .maybeSingle()

    if (fetchError) throw fetchError

    if (existingProfile) {

        // Block if already approved
        if (existingProfile.is_verified === true) {
            throw new Error("Your investor profile is already approved.")
        }

        // Block if pending (not rejected, not approved)
        if (!existingProfile.is_verified && !existingProfile.rejection_reason) {
            throw new Error("Your application is already under review.")
        }

        // If rejected → UPDATE and reset rejection fields so it goes back to pending
        const { error: updateError } = await supabaseAdmin
            .from("investor_profiles")
            .update({
                ...investorData,
                is_verified: false,      // ← stays unverified
                is_active: false,        // ← stays inactive until approved
                rejection_reason: null,  // ← CLEAR the rejection — this was the bug
            })
            .eq("user_id", userId)

        if (updateError) throw updateError

    } else {

        // No profile exists → INSERT fresh
        const { error: insertError } = await supabaseAdmin
            .from("investor_profiles")
            .insert({
                ...investorData,
                is_verified: false,
                is_active: false,
                rejection_reason: null,
            })

        if (insertError) throw insertError
    }

    // Ensure investor role exists
    const { data: existingRole } = await supabaseAdmin
        .from("user_roles")
        .select("id")
        .eq("user_id", userId)
        .eq("role", "app_investor")
        .maybeSingle()

    if (!existingRole) {
        const { error: roleError } = await supabaseAdmin
            .from("user_roles")
            .insert({
                user_id: userId,
                role: "app_investor",
                is_active: true,
                is_verified: false,
            })

        if (roleError) throw roleError
    }

    // Send internal notification
    await supabaseAdmin
        .from("internal_notifications")
        .insert({
            user_id: userId,
            title: "📋 Application Received",
            message: `Your investor profile application has been received. Our team will review it within 1–2 business days.`,
            type: "info",
            category: "investor_application",
            is_read: false,
        })

    return { success: true }
}