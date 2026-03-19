'use client';

import React, { useState } from 'react';
import {
    LayoutDashboard, Ticket, QrCode, BarChart2,
    ArrowLeft, MoreHorizontal, X,
    Store, Users, TrendingUp
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

const LANGUAGE_OPTIONS = [
    { code: 'en', label: 'EN', flag: '🇬🇧' },
    { code: 'hi', label: 'HI', flag: '🇮🇳' },
    { code: 'mr', label: 'MR', flag: '🇮🇳' },
];

const ORANGE = '#df6824';
const BAR_HEIGHT = 64;

const VendorBottomBar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [showMoreDrawer, setShowMoreDrawer] = useState(false);

    const ctx = useLanguage();
    const language = ctx?.language ?? 'en';
    const changeLanguage = ctx?.changeLanguage ?? (() => {});
    const t = ctx?.t;

    const mainItems = [
        {
            id: '/business/dashboard',
            exact: true,
            icon: LayoutDashboard,
            label: t?.sidebar?.dashboard ?? 'Dashboard',
        },
        {
            id: '/business/dashboard/coupons',
            exact: false,
            icon: Ticket,
            label: t?.sidebar?.coupons ?? 'Coupons',
        },
        {
            id: '/business/dashboard/scan-coupon',
            exact: false,
            icon: QrCode,
            label: t?.sidebar?.scanCoupon ?? 'Scan',
        },
        {
            id: '/business/dashboard/analytics',
            exact: false,
            icon: BarChart2,
            label: t?.sidebar?.analytics ?? 'Analytics',
        },
    ];

    const moreItems = [
        {
            id: '/business/dashboard/business-info',
            icon: Store,
            label: t?.sidebar?.businessInfo ?? 'Business Info',
        },
        {
            id: '/business/dashboard/investors',
            exact: true,
            icon: Users,
            label: t?.sidebar?.investors ?? 'Investors',
        },
        {
            id: '/business/dashboard/investors/browse',
            exact: false,
            icon: TrendingUp,
            label: t?.sidebar?.browseInvestors ?? 'Browse Investors',
        },
        {
            id: '/u/profile',
            exact: false,
            icon: ArrowLeft,
            label: t?.sidebar?.profile ?? 'Profile',
        },
    ];

    // Precise active check — exact match or prefix match based on flag
    const isActive = (item) => {
        if (item.exact) return pathname === item.id;
        return pathname === item.id || pathname.startsWith(item.id + '/');
    };

    const isMoreActive = moreItems.some(item => isActive(item));

    const handleNav = (path) => {
        router.push(path);
        setShowMoreDrawer(false);
    };

    return (
        <>
            {/* ── Backdrop ── */}
            {showMoreDrawer && (
                <div
                    className="fixed inset-0 z-[48] md:hidden"
                    style={{ background: 'rgba(0,0,0,0.8)' }}
                    onClick={() => setShowMoreDrawer(false)}
                />
            )}

            {/* ── More Drawer ── */}
            {showMoreDrawer && (
                <div
                    className="fixed left-0 right-0 z-[49] md:hidden"
                    style={{
                        bottom: BAR_HEIGHT,
                        background: '#0d0d0d',
                        borderTop: `3px solid ${ORANGE}`,
                        borderLeft: `3px solid ${ORANGE}`,
                        borderRight: `3px solid ${ORANGE}`,
                        boxShadow: `0 -8px 32px rgba(0,0,0,0.9), 0 0 0 1px #000`,
                    }}
                >
                    {/* Drawer header */}
                    <div
                        className="flex items-center justify-between px-4 py-2.5"
                        style={{ borderBottom: '1px solid #222' }}
                    >
                        <div className="flex items-center gap-2">
                            <div
                                className="w-1.5 h-4"
                                style={{ background: ORANGE }}
                            />
                            <span
                                className="text-[11px] font-black uppercase tracking-widest"
                                style={{ color: ORANGE }}
                            >
                                More Options
                            </span>
                        </div>
                        <button
                            onClick={() => setShowMoreDrawer(false)}
                            className="p-1.5 transition active:scale-90"
                            style={{ border: `1px solid #333`, color: '#666' }}
                        >
                            <X size={14} />
                        </button>
                    </div>

                    {/* Nav items — 2 columns */}
                    <div className="grid grid-cols-2 p-3 gap-2">
                        {moreItems.map((item) => {
                            const active = isActive(item);
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => handleNav(item.id)}
                                    className="flex items-center gap-2.5 px-3 py-3 transition-all active:scale-95 border-2"
                                    style={{
                                        background: active ? ORANGE : '#1a1a1a',
                                        borderColor: active ? ORANGE : '#2a2a2a',
                                        color: active ? '#000' : '#9ca3af',
                                        boxShadow: active ? `3px 3px 0px rgba(0,0,0,0.8)` : 'none',
                                    }}
                                >
                                    <item.icon
                                        size={15}
                                        strokeWidth={active ? 2.5 : 1.8}
                                    />
                                    <span className="text-[11px] font-black uppercase tracking-wide truncate">
                                        {item.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Language row */}
                    <div
                        className="px-3 pb-3 pt-1"
                        style={{ borderTop: '1px solid #1e1e1e' }}
                    >
                        <p className="text-[9px] font-black uppercase tracking-widest mb-2 px-0.5"
                            style={{ color: '#444' }}>
                            Language
                        </p>
                        <div className="flex gap-2">
                            {LANGUAGE_OPTIONS.map((option) => {
                                const isSelected = language === option.code;
                                return (
                                    <button
                                        key={option.code}
                                        onClick={() => changeLanguage(option.code)}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border-2 text-xs font-black uppercase tracking-wide transition-all active:scale-95"
                                        style={{
                                            background: isSelected ? ORANGE : '#1a1a1a',
                                            borderColor: isSelected ? ORANGE : '#2a2a2a',
                                            color: isSelected ? '#000' : '#555',
                                            boxShadow: isSelected ? `2px 2px 0px rgba(0,0,0,0.8)` : 'none',
                                        }}
                                    >
                                        <span className="text-base leading-none">{option.flag}</span>
                                        <span>{option.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Bottom Bar ── */}
            <div
                className="fixed left-0 right-0 bottom-0 md:hidden z-50"
                style={{
                    height: BAR_HEIGHT,
                    background: '#000',
                    borderTop: `3px solid ${ORANGE}`,
                    paddingBottom: 'env(safe-area-inset-bottom, 0px)',
                    boxShadow: '0 -4px 20px rgba(0,0,0,0.6)',
                }}
            >
                <div className="flex items-stretch h-full">
                    {mainItems.map((item, index) => {
                        const active = isActive(item);
                        return (
                            <button
                                key={item.id}
                                onClick={() => router.push(item.id)}
                                className="flex-1 flex flex-col items-center justify-center gap-1 transition-all duration-150 active:scale-95 relative"
                                style={{
                                    background: active ? ORANGE : 'transparent',
                                    borderRight: index < mainItems.length - 1
                                        ? '1px solid #1a1a1a'
                                        : 'none',
                                }}
                            >
                                {/* Active top indicator */}
                                {active && (
                                    <div
                                        className="absolute top-0 left-0 right-0 h-0.5"
                                        style={{ background: '#000' }}
                                    />
                                )}
                                <item.icon
                                    size={18}
                                    strokeWidth={active ? 2.5 : 1.8}
                                    style={{ color: active ? '#000' : '#4b5563' }}
                                />
                                <span
                                    className="text-[9px] font-black uppercase tracking-wider leading-none"
                                    style={{ color: active ? '#000' : '#4b5563' }}
                                >
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}

                    {/* More button */}
                    <button
                        onClick={() => setShowMoreDrawer(prev => !prev)}
                        className="flex-1 flex flex-col items-center justify-center gap-1 transition-all duration-150 active:scale-95 relative"
                        style={{
                            background: (showMoreDrawer || isMoreActive) ? ORANGE : 'transparent',
                            borderLeft: '1px solid #1a1a1a',
                        }}
                    >
                        {(showMoreDrawer || isMoreActive) && (
                            <div
                                className="absolute top-0 left-0 right-0 h-0.5"
                                style={{ background: '#000' }}
                            />
                        )}
                        <MoreHorizontal
                            size={18}
                            strokeWidth={(showMoreDrawer || isMoreActive) ? 2.5 : 1.8}
                            style={{ color: (showMoreDrawer || isMoreActive) ? '#000' : '#4b5563' }}
                        />
                        <span
                            className="text-[9px] font-black uppercase tracking-wider leading-none"
                            style={{ color: (showMoreDrawer || isMoreActive) ? '#000' : '#4b5563' }}
                        >
                            More
                        </span>
                    </button>
                </div>
            </div>

            {/* Page content spacer */}
            <div className="md:hidden" style={{ height: BAR_HEIGHT }} />
        </>
    );
};

export default VendorBottomBar;