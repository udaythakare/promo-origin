import { getBusinessInfo } from '@/actions/businessInfoAction';
// import BusinessInfoForm from '@/components/BusinessInfoForm';
import React from 'react';
import BusinessInfoForm from './components/BusinessInfoForm';

const BusinessInfoPage = async () => {
    const data = await getBusinessInfo();

    if (!data.success) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="p-6 bg-white rounded-lg shadow-md max-w-md w-full">
                    <h3 className="text-xl font-semibold text-red-600 mb-2">Error</h3>
                    <p className="text-gray-700">{data.message || 'Could not retrieve business information'}</p>
                </div>
            </div>
        );
    }

    const businessInfo = data.businessInfo;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-blue-900 mb-6 text-center md:text-left">
                Manage Your Business Profile
            </h1>
            <BusinessInfoForm businessInfo={businessInfo} />
        </div>
    );
};

export default BusinessInfoPage;