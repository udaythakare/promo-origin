'use client';

import React, { useState, useEffect } from 'react';
import { ListCheck, Tag, User } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

const MobileBottomNav = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [activeTab, setActiveTab] = useState('');

    const navItems = [
        { id: '/c/coupons', icon: Tag, label: 'COUPONS', bgColor: 'bg-yellow-200' },
        { id: '/c/c', icon: ListCheck, label: 'MY COUPONS', bgColor: 'bg-red-200' },
        { id: '/u/profile', icon: User, label: 'MY PROFILE', bgColor: 'bg-blue-200' },
    ];

    // Update active tab based on current pathname
    useEffect(() => {
        // Check if the current path starts with any of our nav item paths
        const matchingItem = navItems.find(item => 
            pathname === item.id || pathname.startsWith(`${item.id}/`)
        );
        
        if (matchingItem) {
            setActiveTab(matchingItem.id);
        }
    }, [pathname]);

    const handleTabChange = (id) => {
        setActiveTab(id);
        router.push(id);
    }

    return (
        <div className="fixed bottom-2 left-2 right-2 md:hidden z-50">
            <div className="flex justify-between items-center p-2 bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0)]">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        className={`flex flex-col items-center justify-center px-4 font-black transition-transform ${
                            activeTab === item.id ? 'scale-105' : ''
                        }`}
                        onClick={() => handleTabChange(item.id)}
                    >
                        <div className={`
                            ${activeTab === item.id ? item.bgColor : 'bg-white'} 
                            p-2 border-2 border-black 
                            ${activeTab === item.id ? 'shadow-[4px_4px_0px_0px_rgba(0,0,0)]' : ''}
                            transition-all duration-200
                        `}>
                            <item.icon size={20} className="text-black" />
                        </div>
                        <span className={`text-xs mt-2 font-bold ${activeTab === item.id ? 'bg-black text-white px-2' : 'text-black'}`}>
                            {item.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default MobileBottomNav;