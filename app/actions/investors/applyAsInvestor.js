"use server";

import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";

export async function applyAsInvestor() {
  // ✅ MUST await (because supabaseServer is now async)
  const supabase = await createSupabaseServerClient();

  // Get logged-in user from session
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/auth/signup");
  }

  const userId = user.id;

  // Check if investor profile already exists
  const { data: existingInvestor, error: fetchError } = await supabase
    .from("investor_profiles")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle(); // ✅ safer than .single()

  if (fetchError) {
    throw new Error("Failed to check investor profile");
  }

  // If already investor → redirect
  if (existingInvestor) {
    redirect("/investors");
  }

  // Create new investor profile
  const { error: insertError } = await supabase
    .from("investor_profiles")
    .insert({
      user_id: userId,
      created_at: new Date().toISOString(),
    });

  if (insertError) {
    throw new Error("Failed to create investor profile");
  }

  // Redirect after success
  redirect("/investors");
}
