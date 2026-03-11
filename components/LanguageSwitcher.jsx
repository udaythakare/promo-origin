'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

const LANGUAGE_OPTIONS = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'hi', label: 'हिंदी',   flag: '🇮🇳' },
    { code: 'mr', label: 'मराठी',   flag: '🇮🇳' },
];

export default function LanguageSwitcher() {
    const { language, changeLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const current = LANGUAGE_OPTIONS.find((l) => l.code === language) || LANGUAGE_OPTIONS[0];

    return (
        <div ref={ref} className="relative">
            {/* Button */}
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                style={{ borderColor: '#df6824', color: '#df6824' }}
                className="flex items-center gap-2 px-3 py-2 bg-black border-2 
                           text-sm font-bold uppercase tracking-wide
                           hover:bg-gray-900 transition-all w-full"
            >
                <span>{current.flag}</span>
                <span>{current.label}</span>
                <svg
                    className={`w-3.5 h-3.5 ml-auto transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown - opens upward since it's at bottom */}
            {isOpen && (
                <div
                    style={{ borderColor: '#df6824' }}
                    className="absolute bottom-full left-0 mb-1 w-full bg-black border-2 shadow-lg z-[999] overflow-hidden"
                >
                    {LANGUAGE_OPTIONS.map((option) => (
                        <button
                            key={option.code}
                            onClick={() => {
                                changeLanguage(option.code);
                                setIsOpen(false);
                            }}
                            style={language === option.code
                                ? { backgroundColor: '#df6824', color: '#000' }
                                : { color: '#d1d5db' }
                            }
                            className={`flex items-center gap-2 w-full px-3 py-2.5 text-sm font-bold uppercase tracking-wide text-left transition-colors
                                ${language !== option.code ? 'hover:bg-gray-900' : ''}`}
                        >
                            <span>{option.flag}</span>
                            <span>{option.label}</span>
                            {language === option.code && (
                                <span className="ml-auto text-black text-xs">✓</span>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}