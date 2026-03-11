import GlobalCouponSection from "@/components/GlobalCouponSection";
import NotificationToggle from "@/components/NotificationToggle";
import { getUserId } from "@/helpers/userHelper";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import Link from "next/link";
import Image from "next/image";

export default async function CouponPage() {

  const userId = await getUserId();
  const supabase = await createSupabaseServerClient();

  return (
    <div className="min-h-screen bg-[#f6f6fb]">

      {/* ================= HERO SECTION ================= */}

      {/* ✅ FIX: The section itself is `relative` — Image fill works directly inside it */}
      <section className="relative w-full h-[420px] sm:h-[520px] md:h-[600px] flex items-center justify-center overflow-hidden">

        {/* ✅ FIX: Image placed directly inside the relative section, NOT inside an absolute div */}
        <img
  src="/herosection.png"
  alt="Hero"
  className="absolute inset-0 w-full h-full object-cover object-center"
/>

        {/* Dark Overlay — sits above the image */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/75 z-[1]" />

        {/* Hero Content */}
        <div className="relative z-[2] max-w-6xl mx-auto px-6 text-center text-white">

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-xs sm:text-sm font-semibold tracking-wide text-white/90 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#6c4bff] animate-pulse" />
            New deals added daily
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
            Discover The Best
            <br className="hidden sm:block" />
            <span className="text-[#a78bfa]">Local Deals</span> Near You
          </h1>

          <p className="mt-5 text-gray-300 max-w-2xl mx-auto text-sm sm:text-lg md:text-xl leading-relaxed">
            Claim exclusive coupons from nearby stores and enjoy amazing
            discounts while supporting your favorite local businesses.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <Link
              href="#coupons"
              className="px-7 py-3 bg-[#3716a8] text-white font-bold rounded-xl shadow-lg hover:bg-[#4d2bc7] hover:scale-105 hover:shadow-[0_8px_24px_rgba(55,22,168,0.5)] transition-all duration-200"
            >
              Explore Coupons
            </Link>
            <Link
              href="/about"
              className="px-7 py-3 border border-white/40 text-white rounded-xl backdrop-blur-sm hover:bg-white/15 hover:border-white/60 transition-all duration-200"
            >
              Learn More
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-4 sm:gap-8 text-center">
            {[
              { value: "500+", label: "Active Coupons" },
              { value: "150+", label: "Local Shops" },
              { value: "10K+", label: "Happy Users" },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center">
                <div className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {value}
                </div>
                <div className="mt-1 text-gray-400 text-xs sm:text-sm font-medium">
                  {label}
                </div>
                <div className="mt-2 w-8 h-0.5 rounded-full bg-[#6c4bff] mx-auto" />
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* ================= NOTIFICATIONS ================= */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <NotificationToggle />
      </div>


      {/* ================= COUPONS ================= */}
      <div id="coupons" className="max-w-7xl mx-auto px-4 mt-6 pb-20">
        <GlobalCouponSection userId={userId} />
      </div>

    </div>
  );
}