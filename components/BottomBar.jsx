'use client';

import React, { useState, useEffect } from 'react';
import { ListCheck, Tag, User } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

const MobileBottomNav = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [activeTab, setActiveTab] = useState('');

    const navItems = [
        { id: '/coupons',              icon: Tag,       label: 'Hot Deal'   },
        { id: '/u/profile/my-coupons', icon: ListCheck, label: 'My Coupons' },
        { id: '/u/profile',            icon: User,      label: 'My Profile' },
    ];

    useEffect(() => {
        const matchingItem = navItems.find(item =>
            pathname === item.id || pathname.startsWith(`${item.id}/`)
        );
        if (matchingItem) setActiveTab(matchingItem.id);
    }, [pathname]);

    const handleTabChange = (id) => {
        setActiveTab(id);
        router.push(id);
    };

    return (
        /* 
            - Flush to bottom edge, full width
            - bg-white fills the safe area gap on iPhone PWA
            - border-t on top only — clean separation from content
        */
        <div
            className="fixed bottom-0 left-0 right-0 md:hidden z-40 bg-white border-t-2 border-black"
            style={{
                paddingBottom: 'env(safe-area-inset-bottom, 0px)',
                boxShadow: '0 -3px 0px 0px rgba(0,0,0,1)',
            }}
        >
            <div className="flex items-center justify-around px-2 py-2">
                {navItems.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => handleTabChange(item.id)}
                            className="flex-1 flex flex-col items-center justify-center gap-1.5 py-1 active:scale-95 transition-all duration-200"
                        >
                            {/* Pill capsule */}
                            <div className={`
                                flex items-center justify-center
                                w-14 h-8 rounded-full transition-all duration-200
                                ${isActive ? 'bg-[#3716A8]' : 'bg-transparent'}
                            `}>
                                <item.icon
                                    size={18}
                                    strokeWidth={isActive ? 2.5 : 1.8}
                                    className={isActive ? 'text-white' : 'text-black'}
                                />
                            </div>

                            {/* Label */}
                            <span className={`
                                text-[10px] leading-none transition-all duration-200
                                ${isActive ? 'font-black text-[#3716A8]' : 'font-medium text-black'}
                            `}>
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default MobileBottomNav;