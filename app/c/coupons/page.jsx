'use client';
import React from 'react';
import GlobalFilterSection from '@/components/GlobalFilterSection';
import GlobalCouponSection from '@/components/GlobalCouponSection';

const CouponPage = () => {
    return (
        <div className="min-h-screen pb-40">
            {/* <GlobalFilterSection /> */}
            <GlobalCouponSection />

            

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