'use client';
import React from 'react'
import dynamic from 'next/dynamic'
import loadingAnimation from '@/public/animations/success-animation.json'

const Lottie = dynamic(() => import('lottie-react'), {
    ssr: false,
    loading: () => (
        <div className="h-full w-full flex items-center justify-center">
            <div className="h-8 w-8 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
        </div>
    ),
});

const NeoBrutalistLoading = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
            <div className="relative">
                {/* Main loading container */}
                <div className="bg-white border-4 border-black shadow-[8px_8px_0_black] p-8 rounded-lg">
                    {/* Lottie Animation */}
                    <div className="flex justify-center items-center mb-6">
                        <div className="w-32 h-32 border-4 border-black bg-yellow-300 p-2 shadow-[4px_4px_0_black]">
                            <Lottie
                                animationData={loadingAnimation}
                                loop={true}
                                autoplay={true}
                                style={{ width: '100%', height: '100%' }}
                            />
                        </div>
                    </div>

                    {/* Loading text */}
                    <div className="text-center">
                        <span className="text-2xl font-bold text-black uppercase tracking-wider">
                            Loading
                            <span className="animate-pulse">...</span>
                        </span>
                    </div>
                </div>

                {/* Shadow effect for neo-brutalist depth */}
                <div
                    className="absolute inset-0 bg-black opacity-20 rounded-lg -z-10"
                    style={{
                        transform: 'translate(12px, 12px)',
                    }}
                />
            </div>
        </div>
    )
}

export default NeoBrutalistLoading