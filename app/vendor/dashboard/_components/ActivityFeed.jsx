'use client';

import React from 'react';
import { FiCalendar } from 'react-icons/fi';

const ActivityFeed = () => {
    const activities = [
        { id: 1, action: 'New coupon redemption', user: 'John Smith', time: '5 minutes ago', details: 'Used SUMMER25 for $34.99 discount' },
        { id: 2, action: 'New customer signup', user: 'Emily Johnson', time: '1 hour ago', details: 'Referred by existing customer' },
        { id: 3, action: 'Coupon updated', user: 'Admin', time: '3 hours ago', details: 'Changed WELCOME15 expiration date' },
        { id: 4, action: 'Payment received', user: 'Michael Brown', time: '5 hours ago', details: '$129.99 subscription renewal' },
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
            </div>

            <div className="divide-y divide-gray-200">
                {activities.map((activity) => (
                    <div key={activity.id} className="px-6 py-4 hover:bg-gray-50">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                    <FiCalendar className="text-blue-600" size={16} />
                                </div>
                            </div>
                            <div className="ml-3 flex-1">
                                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                                <p className="text-sm text-gray-500">{activity.details}</p>
                                <div className="mt-1 flex items-center justify-between">
                                    <p className="text-xs text-gray-500">{activity.user}</p>
                                    <p className="text-xs text-gray-400">{activity.time}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="px-6 py-3 bg-gray-50 text-center">
                <button className="text-sm text-blue-600 font-medium hover:text-blue-700">
                    View All Activity
                </button>
            </div>
        </div>
    );
};

export default ActivityFeed;