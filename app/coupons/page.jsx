import GlobalCouponSection from "@/components/GlobalCouponSection";
import InstallPWAButton from "@/components/InstallPWAButton";
import Link from "next/link";
import Image from "next/image";
import NotificationToggle from "@/components/NotificationToggle";
import { getUserId } from "@/helpers/userHelper";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export default async function CouponPage() {
  // Get logged-in user ID
  const userId = await getUserId();

  // Create server Supabase client (Next 15 compatible)
  const supabase = await createSupabaseServerClient();

  // Check if investor profile exists
  const { data: investorProfile } = await supabase
    .from("investor_profiles")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  const isInvestor = !!investorProfile;

  return (
    <div className="min-h-screen pb-28 sm:pb-40">
      {/* ================= BUSINESS APPLY CARD ================= */}
      <div className="p-2 sm:p-4">
        <div className="bg-white border-3 sm:border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_rgba(0,0,0,1)] p-3 sm:p-4 relative overflow-hidden">
          <Image
            src="/business.png"
            alt="Business Application Card"
            className="w-20 sm:w-28 h-auto absolute bottom-0 -right-2 sm:-right-4"
            width={100}
            height={100}
          />

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative">
            <div className="relative z-10">
              <h2 className="text-lg sm:text-xl font-black mb-1 sm:mb-2">
                Don't have a business yet?
              </h2>
              <p className="text-gray-600 text-sm">
                Start your business journey with us and create amazing coupons
                for your customers.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <InstallPWAButton />
              <Link
                href="/u/profile/apply-for-business"
                className="px-4 sm:px-6 py-2 sm:py-3 bg-red-100 border-2 border-black hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all font-bold text-xs sm:text-base"
              >
                Apply for Business
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ================= INVESTOR CARD ================= */}
      <div className="p-2 sm:p-4">
        <div className="bg-yellow-50 border-3 sm:border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_rgba(0,0,0,1)] p-3 sm:p-4 relative overflow-hidden">
          <Image
            src="/investor.png"
            alt="Investor Application Card"
            className="w-20 sm:w-28 h-auto absolute bottom-0 -right-2 sm:-right-4"
            width={100}
            height={100}
          />

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative">
            <div className="relative z-10">
              <h2 className="text-xl font-black mb-2">
                Want to invest in local businesses?
              </h2>
              <p className="text-gray-700 text-sm">
                Become an investor and support local vendors while growing your
                capital.
              </p>
            </div>

            <div className="flex gap-4">
              {isInvestor ? (
                <Link
                  href="/investors"
                  className="px-6 py-3 bg-green-300 border-2 border-black hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all font-bold text-sm sm:text-base"
                >
                  Manage Investments
                </Link>
              ) : (
                <Link
                  href="/u/profile/apply-for-investor"
                  className="px-6 py-3 bg-yellow-300 border-2 border-black hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all font-bold text-sm sm:text-base"
                >
                  Apply as Investor
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================= NOTIFICATIONS ================= */}
      <NotificationToggle />

      {/* ================= COUPONS ================= */}
      <GlobalCouponSection userId={userId} />
    </div>
  );
}
