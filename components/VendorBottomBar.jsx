'use client';

import React, { useState } from 'react';
import { LayoutDashboard, Ticket, QrCode, BarChart2, ArrowLeft, Languages } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

const LANGUAGE_OPTIONS = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'hi', label: 'हिंदी',   flag: '🇮🇳' },
    { code: 'mr', label: 'मराठी',   flag: '🇮🇳' },
];

const VendorBottomBar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [showLangModal, setShowLangModal] = useState(false);

    const ctx = useLanguage();
    const language = ctx?.language ?? 'en';
    const changeLanguage = ctx?.changeLanguage ?? (() => {});
    const t = ctx?.t;

    // ✅ Labels come from translations
    const navItems = [
        { id: '/u/profile',                      icon: ArrowLeft,       label: t?.sidebar?.profile    ?? 'Profile' },
        { id: '/business/dashboard',             icon: LayoutDashboard, label: t?.sidebar?.dashboard  ?? 'Dashboard' },
        { id: '/business/dashboard/coupons',     icon: Ticket,          label: t?.sidebar?.coupons    ?? 'Coupons' },
        { id: '/business/dashboard/scan-coupon', icon: QrCode,          label: t?.sidebar?.scanCoupon ?? 'Scan' },
        { id: '/business/dashboard/analytics',   icon: BarChart2,       label: t?.sidebar?.analytics  ?? 'Analytics' },
    ];

    const isActive = (path) => pathname === path;
    const current = LANGUAGE_OPTIONS.find((l) => l.code === language) || LANGUAGE_OPTIONS[0];

    const handleLanguageChange = (code) => {
        changeLanguage(code);
        setShowLangModal(false);
    };

    return (
        <>
            {/* Language Modal */}
            {showLangModal && (
                <>
                    <div
                        className="fixed inset-0 bg-black bg-opacity-70 z-[60]"
                        onClick={() => setShowLangModal(false)}
                    />
                    <div
                        className="fixed bottom-24 left-4 right-4 z-[70] bg-black border-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                        style={{ borderColor: '#df6824' }}
                    >
                        <div
                            className="px-4 py-3 flex items-center justify-between"
                            style={{ borderBottom: '2px solid #df6824' }}
                        >
                            <p
                                className="text-sm font-black uppercase tracking-wider"
                                style={{ color: '#df6824' }}
                            >
                                Select Language
                            </p>
                            <button
                                onClick={() => setShowLangModal(false)}
                                className="text-gray-400 hover:text-white transition-colors font-black text-lg"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-3 flex flex-col gap-2">
                            {LANGUAGE_OPTIONS.map((option) => {
                                const isSelected = language === option.code;
                                return (
                                    <button
                                        key={option.code}
                                        onClick={() => handleLanguageChange(option.code)}
                                        style={isSelected
                                            ? { backgroundColor: '#df6824', color: '#000', borderColor: '#df6824' }
                                            : { borderColor: '#444', color: '#d1d5db' }
                                        }
                                        className="flex items-center gap-3 w-full px-4 py-3 border-2 font-bold uppercase tracking-wide text-sm transition-all active:scale-95"
                                    >
                                        <span className="text-xl">{option.flag}</span>
                                        <span>{option.label}</span>
                                        {isSelected && (
                                            <span className="ml-auto font-black text-black">✓</span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}

            {/* Bottom Bar */}
            <div className="fixed bottom-2 left-2 right-2 md:hidden z-50">
                <div
                    className="flex justify-between items-center p-1.5 bg-black border-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    style={{ borderColor: '#df6824' }}
                >
                    {navItems.map((item) => {
                        const active = isActive(item.id);
                        return (
                            <button
                                key={item.id}
                                className="flex flex-col items-center justify-center px-2 py-1.5 w-1/6 transition-all duration-200 active:scale-95"
                                onClick={() => router.push(item.id)}
                            >
                                <div
                                    style={active
                                        ? { backgroundColor: '#df6824', borderColor: '#df6824' }
                                        : { borderColor: '#555' }
                                    }
                                    className="p-1.5 border-2 transition-all duration-200"
                                >
                                    <item.icon
                                        size={18}
                                        style={{ color: active ? '#000' : '#9ca3af' }}
                                    />
                                </div>
                                <span
                                    style={active
                                        ? { backgroundColor: '#df6824', color: '#000' }
                                        : { color: '#6b7280' }
                                    }
                                    className="text-[9px] mt-1 font-black uppercase tracking-wider px-1"
                                >
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}

                    {/* Language Button */}
                    <button
                        className="flex flex-col items-center justify-center px-2 py-1.5 w-1/6 transition-all duration-200 active:scale-95"
                        onClick={() => setShowLangModal(true)}
                    >
                        <div
                            style={showLangModal
                                ? { backgroundColor: '#df6824', borderColor: '#df6824' }
                                : { borderColor: '#555' }
                            }
                            className="p-1.5 border-2 transition-all duration-200"
                        >
                            <Languages
                                size={18}
                                style={{ color: showLangModal ? '#000' : '#9ca3af' }}
                            />
                        </div>
                        <span
                            style={showLangModal
                                ? { backgroundColor: '#df6824', color: '#000' }
                                : { color: '#6b7280' }
                            }
                            className="text-[9px] mt-1 font-black uppercase tracking-wider px-1"
                        >
                            {current.flag}
                        </span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default VendorBottomBar;