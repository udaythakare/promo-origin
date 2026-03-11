'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import loadingAnimation from '@/public/animations/success-animation.json'

const Lottie = dynamic(() => import('lottie-react'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-16 h-16">
      <div className="h-8 w-8 border-4 border-gray-200 border-t-[#3716A8] rounded-full animate-spin" />
    </div>
  ),
})

const AppLoading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f7ff] px-4">

      <div className="w-full max-w-sm">

        {/* Card */}
        <div className="bg-white border border-[#3716A8]/10 rounded-2xl shadow-lg p-8 text-center transition-all">

          {/* Animation */}
          <div className="flex justify-center mb-6">
            <div className="w-32 h-32 flex items-center justify-center rounded-xl bg-[#3716A8]/5 border border-[#3716A8]/10">

              <Lottie
                animationData={loadingAnimation}
                loop={true}
                autoplay={true}
                style={{ width: "100%", height: "100%" }}
              />

            </div>
          </div>

          {/* Text */}
          <div className="space-y-2">

            <h2 className="text-lg font-bold text-gray-900">
              Loading your dashboard
            </h2>

            <p className="text-sm text-gray-500">
              Please wait while we prepare everything for you
            </p>

          </div>

          {/* Animated dots */}
          <div className="flex justify-center mt-6 gap-2">

            <span className="w-2 h-2 bg-[#3716A8] rounded-full animate-bounce"></span>
            <span className="w-2 h-2 bg-[#3716A8] rounded-full animate-bounce [animation-delay:.15s]"></span>
            <span className="w-2 h-2 bg-[#3716A8] rounded-full animate-bounce [animation-delay:.3s]"></span>

          </div>

        </div>

      </div>

    </div>
  )
}

export default AppLoading