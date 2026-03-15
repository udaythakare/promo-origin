import GlobalCouponSection from "@/components/GlobalCouponSection";
import NotificationToggle from "@/components/NotificationToggle";
import { getUserId } from "@/helpers/userHelper";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import Link from "next/link";

export default async function CouponPage() {
  const userId = await getUserId();
  const supabase = await createSupabaseServerClient();

  return (
    <div className="min-h-screen bg-[#f6f6fb]">

      {/* ================= HERO SECTION ================= */}
      <section className="relative w-full flex items-center justify-center overflow-hidden"
        style={{ minHeight: "clamp(360px, 55vw, 620px)" }}>

        {/* Background Image */}
        <img
          src="/herosection.png"
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/80 z-[1]" />

        {/* Hero Content */}
        <div className="relative z-[2] w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white py-10 sm:py-14">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-[11px] sm:text-sm font-semibold tracking-wide text-white/90 mb-4 sm:mb-6">
            <span className="w-2 h-2 rounded-full bg-[#6c4bff] animate-pulse flex-shrink-0" />
            New deals added daily
          </div>

          {/* Heading */}
          <h1 className="text-2xl xs:text-3xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
            Discover The Best
            <br />
            <span className="text-[#a78bfa]">Local Deals</span> Near You
          </h1>

          {/* Subtext */}
          <p className="mt-3 sm:mt-5 text-gray-300 max-w-xl mx-auto text-xs sm:text-base md:text-lg leading-relaxed px-2">
            Claim exclusive coupons from nearby stores and enjoy amazing
            discounts while supporting your favorite local businesses.
          </p>

          {/* CTA Buttons */}
          <div className="mt-6 sm:mt-8 flex justify-center gap-3 flex-wrap">
            <Link
              href="#coupons"
              className="px-5 sm:px-7 py-2.5 sm:py-3 bg-[#3716a8] text-white font-bold rounded-xl shadow-lg hover:bg-[#4d2bc7] active:scale-95 hover:scale-105 hover:shadow-[0_8px_24px_rgba(55,22,168,0.5)] transition-all duration-200 text-sm sm:text-base"
            >
              Explore Coupons
            </Link>
            <Link
              href="/about"
              className="px-5 sm:px-7 py-2.5 sm:py-3 border border-white/40 text-white rounded-xl backdrop-blur-sm hover:bg-white/15 hover:border-white/60 active:scale-95 transition-all duration-200 text-sm sm:text-base"
            >
              Learn More
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-8 sm:mt-12 grid grid-cols-3 gap-2 sm:gap-6 md:gap-10 text-center max-w-lg mx-auto sm:max-w-none">
            {[
              { value: "500+", label: "Active Coupons" },
              { value: "150+", label: "Local Shops" },
              { value: "10K+", label: "Happy Users" },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center">
                <div className="text-xl xs:text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {value}
                </div>
                <div className="mt-0.5 sm:mt-1 text-gray-400 text-[10px] sm:text-sm font-medium leading-tight">
                  {label}
                </div>
                <div className="mt-1.5 sm:mt-2 w-6 sm:w-8 h-0.5 rounded-full bg-[#6c4bff] mx-auto" />
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ================= NOTIFICATIONS ================= */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 mt-4 sm:mt-6">
        <NotificationToggle />
      </div>

      {/* ================= COUPONS ================= */}
      {/* pb-24 ensures content clears the bottom nav bar on mobile/PWA */}
      <div id="coupons" className="max-w-7xl mx-auto px-3 sm:px-4 mt-4 sm:mt-6 pb-24 md:pb-10">
        <GlobalCouponSection userId={userId} />
      </div>

    </div>
  );
}