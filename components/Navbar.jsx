'use client';
import { useState } from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

export default function Navbar({ session }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="bg-blue-600 shadow-md">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0">
                        <Link href="/" className="flex items-center">
                            <span className="text-white text-xl font-bold">CouponFinder</span>
                        </Link>
                    </div>

                    {/* Desktop menu */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-center space-x-4">
                            <Link href="/" className="text-white hover:bg-blue-700 px-3 py-2 rounded-md font-medium">
                                Home
                            </Link>
                            <Link href="/about" className="text-white hover:bg-blue-700 px-3 py-2 rounded-md font-medium">
                                About
                            </Link>
                            <Link href="/coupons" className="text-white hover:bg-blue-700 px-3 py-2 rounded-md font-medium">
                                coupons
                            </Link>
                            {session ? (
                                <>
                                    <Link href="/my-coupons" className="text-white hover:bg-blue-700 px-3 py-2 rounded-md font-medium">
                                        My Coupons
                                    </Link>
                                    <button
                                        onClick={() => signOut()}
                                        className="bg-white text-blue-600 hover:bg-blue-100 px-3 py-2 rounded-md font-medium"
                                    >
                                        Log Out
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link href="/login" className="bg-white text-blue-600 hover:bg-blue-100 px-3 py-2 rounded-md font-medium">
                                        Log In
                                    </Link>
                                    <Link href="/register" className="text-white border border-white hover:bg-blue-700 px-3 py-2 rounded-md font-medium">
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-700 focus:outline-none"
                        >
                            <svg
                                className="h-6 w-6"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu, show/hide based on menu state */}
            {isMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link href="/"
                            className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium"
                            onClick={() => setIsMenuOpen(false)}>
                            Home
                        </Link>
                        <Link href="/about"
                            className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium"
                            onClick={() => setIsMenuOpen(false)}>
                            About
                        </Link>
                        {session ? (
                            <>
                                <Link href="/my-coupons"
                                    className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium"
                                    onClick={() => setIsMenuOpen(false)}>
                                    My Coupons
                                </Link>
                                <button
                                    onClick={() => {
                                        signOut();
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full text-left bg-white text-blue-600 hover:bg-blue-100 block px-3 py-2 rounded-md text-base font-medium"
                                >
                                    Log Out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/api/auth/signin"
                                    className="bg-white text-blue-600 hover:bg-blue-100 block px-3 py-2 rounded-md text-base font-medium"
                                    onClick={() => setIsMenuOpen(false)}>
                                    Log In
                                </Link>
                                <Link href="/register"
                                    className="text-white border border-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium"
                                    onClick={() => setIsMenuOpen(false)}>
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
