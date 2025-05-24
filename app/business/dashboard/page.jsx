import { getBusinessInfo } from '@/actions/businessInfoAction';
import React from 'react'
import BusinessInfoForm from './business-info/components/BusinessInfoForm';

async function page() {
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

    <BusinessInfoForm businessInfo={businessInfo} />
  )
}

export default page