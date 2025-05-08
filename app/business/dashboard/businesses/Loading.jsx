// app/businesses/loading.tsx - Loading component for businesses page
import React from 'react';

export default function Loading() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <div className="h-8 w-36 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-10 w-28 bg-gray-200 rounded animate-pulse"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                        <div className="bg-gray-100 p-4">
                            <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-2"></div>
                            <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                        <div className="p-4">
                            <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
                            <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
                            <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse"></div>
                            <div className="flex justify-end gap-2 mt-4">
                                <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
                                <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
                                <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// app/businesses/[id]/loading.tsx - Loading component for business details page
