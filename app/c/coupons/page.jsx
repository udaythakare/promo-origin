'use client';
import React from 'react';
import GlobalFilterSection from '@/components/GlobalFilterSection';
import GlobalCouponSection from '@/components/GlobalCouponSection';

const CouponPage = () => {
    return (
        <div className="min-h-screen bg-yellow-50">
            <GlobalFilterSection />
            <GlobalCouponSection />

            {/* Footer */}
            <footer className="bg-blue-800 text-white p-6 mt-8 border-t-8 border-black">
                <div className="container mx-auto text-center">
                    <p className="mb-2 font-black text-xl">© 2025 COUPON MARKETPLACE</p>
                    <p className="text-blue-200 font-bold">FIND THE BEST DEALS NEAR YOU</p>
                </div>
            </footer>

            {/* Loading animation keyframes */}
            <style jsx>{`
                @keyframes loading {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
};

export default CouponPage;