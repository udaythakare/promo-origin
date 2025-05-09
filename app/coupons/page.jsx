"use client";
import React from "react";
import GlobalFilterSection from "@/components/GlobalFilterSection";
import GlobalCouponSection from "@/components/GlobalCouponSection";
import InstallPWAButton from "@/components/InstallPWAButton";
import Link from "next/link";
import Image from "next/image";

const CouponPage = () => {
  return (
    <div className="min-h-screen pb-40">
      {/* <GlobalFilterSection /> */}
      {/* Business Application Card */}
      <div className="p-4">
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 relative overflow-hidden">
        <Image src="/business.png" alt="Business Application Card" className="w-28 h-auto absolute bottom-0 -right-4" width={100} height={100} />

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative">
            <div className="relative z-10">
              <h2 className="text-xl font-black mb-2">
                Don't have a business yet?
              </h2>
              <p className="text-gray-600 text-sm">
                Start your business journey with us and create amazing coupons for
                your customers.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <InstallPWAButton />
              <Link
                href="/u/profile/apply-for-business"
                className="px-6 py-3 bg-red-100 border-2 border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all font-bold text-sm sm:text-base whitespace-nowrap"
              >
                Apply for Business
              </Link>
            </div>
          </div>
        </div>
      </div>
     
      <GlobalCouponSection />

      {/* Loading animation keyframes */}
      <style jsx>{`
        @keyframes loading {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};

export default CouponPage;
