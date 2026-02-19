'use client';

import React from 'react';
import { Home, LayoutDashboard, Ticket, QrCode, BarChart2, ArrowLeft } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

const VendorBottomBar = () => {
    const router = useRouter();
    const pathname = usePathname();

    const navItems = [
        { id: '/u/profile', icon: ArrowLeft, label: 'Profile' },
        { id: '/business/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { id: '/business/dashboard/coupons', icon: Ticket, label: 'Coupons' },
        { id: '/business/dashboard/scan-coupon', icon: QrCode, label: 'Scan' },
        { id: '/business/dashboard/analytics', icon: BarChart2, label: 'Analytics' },
    ];

    const handleTabChange = (id) => {
        router.push(id);
    }

    const isActive = (path) => pathname === path;

    return (
        <div className="fixed bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 md:hidden z-50">
            <div className="flex justify-between items-center p-1.5 sm:p-2 bg-white border-3 sm:border-4 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0)]">
                {navItems.map((item) => {
                    const active = isActive(item.id);
                    return (
                        <button
                            key={item.id}
                            className={`flex flex-col items-center justify-center px-2 py-1.5 w-1/5 font-black transition-all duration-200
                                ${active ? 'scale-105' : 'hover:scale-105'}`}
                            onClick={() => handleTabChange(item.id)}
                        >
                            <div className={`
                                ${active ? 'bg-yellow-400' : 'bg-white'} 
                                p-1.5 border-2 border-black rounded-none
                                ${active ? 'shadow-[4px_4px_0px_0px_rgba(0,0,0)]' : 'hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)]'}
                                transition-all duration-200
                                transform hover:-translate-y-1 active:translate-y-0
                            `}>
                                <item.icon size={18} className="text-black" />
                            </div>
                            <span className={`text-[10px] mt-1.5 font-bold uppercase tracking-wider
                                ${active ? 'bg-black text-white px-1.5 py-0.5 border-2 border-black' : 'text-black'}`}>
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default VendorBottomBar;