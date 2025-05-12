import React from 'react'

const NeoBrutalistLoading = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
            <div className="relative">
                {/* Main loading container */}
                <div className="bg-white border-4 border-black shadow-[8px_8px_0_black] p-8 rounded-lg">
                    {/* Animated blocks */}
                    <div className="flex space-x-4 justify-center items-center">
                        {[1, 2, 3, 4].map((block) => (
                            <div
                                key={block}
                                className={`w-12 h-12 bg-blue-600 border-2 border-black animate-bounce`}
                                style={{
                                    animationDelay: `${block * 0.2}s`,
                                    animationDuration: '0.8s'
                                }}
                            />
                        ))}
                    </div>

                    {/* Loading text */}
                    <div className="mt-6 text-center">
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