

// app/businesses/[id]/loading.tsx - Loading component for business details page
import React from 'react';

export default function BusinessDetailsLoading() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-blue-700 p-6">
                    <div className="h-8 w-2/3 bg-blue-800 rounded animate-pulse"></div>
                    <div className="h-6 w-1/3 bg-blue-800 rounded animate-pulse mt-2"></div>
                </div>

                <div className="p-6">
                    <div className="mb-6">
                        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                        <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
                        <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
                        <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
                            <div className="space-y-2">
                                <div className="h-5 w-full bg-gray-200 rounded animate-pulse"></div>
                                <div className="h-5 w-full bg-gray-200 rounded animate-pulse"></div>
                                <div className="h-5 w-full bg-gray-200 rounded animate-pulse"></div>
                            </div>
                        </div>

                        <div>
                            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                            <div className="p-3 bg-gray-100 rounded-md mb-2">
                                <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-1"></div>
                                <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-1"></div>
                                <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 border-t pt-4">
                        <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}