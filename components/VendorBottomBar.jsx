'use client';

import React, { useState } from 'react';
import { Home, Tag, MapPin, Heart, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const VendorBottomBar = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('coupons');

    const navItems = [
        { id: '/c/coupons', icon: MapPin, label: 'Home' },
        { id: '/vendor/dashboard', icon: MapPin, label: 'Dashboard' },
        { id: '/vendor/dashboard/coupons', icon: MapPin, label: 'Coupons' },
        { id: '/vendor/dashboard/scan-coupon', icon: MapPin, label: 'Scan' },
        { id: '/vendor/dashboard/analytics', icon: MapPin, label: 'Analytics' },
    ];

    const handleTabChange = (id) => {
        setActiveTab(id);
        router.push(`${id}`);
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-blue-100 shadow-lg md:hidden z-50">
            <div className="flex justify-around items-center">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        className={`flex flex-col items-center justify-center py-2 px-3 w-1/5 relative ${activeTab === item.id ? 'text-blue-600' : 'text-gray-500'
                            }`}
                        onClick={() => handleTabChange(item.id)}
                    >
                        {activeTab === item.id && (
                            <motion.div
                                layoutId="bottomNavIndicator"
                                className="absolute top-0 h-1 w-12 bg-blue-600 rounded-b-md"
                                initial={false}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}

                        <item.icon size={20} className={activeTab === item.id ? 'text-blue-600' : 'text-gray-500'} />
                        <span className={`text-xs mt-1 ${activeTab === item.id ? 'font-medium' : ''}`}>
                            {item.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default VendorBottomBar;