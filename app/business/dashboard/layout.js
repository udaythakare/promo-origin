'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from './_components/Sidebar';
import TopBar from './_components/TopBar';
import VendorBottomBar from '@/components/VendorBottomBar';
import BusinessNavbar from '@/components/BusinessNavbar';
import { getUserId } from '@/helpers/userHelper';

export default function DashboardLayout({ children }) {
    const pathname = usePathname();
    const router = useRouter();

    // Extract the active page from the pathname
    const getActivePageFromPath = (path) => {
        const segments = path.split('/');
        const lastSegment = segments[segments.length - 1];
        return lastSegment === 'dashboard' ? 'dashboard' : lastSegment;
    };

    // ALL useState hooks must be at the top, before any conditional returns
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [userId, setUserId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activePage, setActivePage] = useState(() => getActivePageFromPath(pathname));

    // Get user ID on component mount
    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const id = await getUserId();
                setUserId(id);
            } catch (error) {
                console.error('Error fetching user ID:', error);
                setUserId(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserId();
    }, []);

    // Update the active page when pathname changes
    useEffect(() => {
        setActivePage(getActivePageFromPath(pathname));
    }, [pathname]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Handle page navigation
    const handlePageChange = (pageId) => {
        setActivePage(pageId);

        // Navigate to the corresponding route
        if (pageId === 'dashboard') {
            router.push('/business/dashboard');
        } else {
            router.push(`/business/dashboard/${pageId}`);
        }

        // Close sidebar on mobile after navigation
        if (window.innerWidth < 768) {
            setIsSidebarOpen(false);
        }
    };

    // Show loading spinner while fetching user ID
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-yellow-200">
                <div className="text-center">
                    <div className="animate-spin w-12 h-12 border-4 border-black border-t-yellow-400 rounded-full mx-auto mb-4"></div>
                    <p className="text-lg font-bold">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    // Show login prompt if no user ID
    if (!userId) {
        return (
            <div className="flex items-center justify-center h-screen bg-yellow-200">
                <div className="text-center p-8 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <p className="text-xl font-bold text-gray-700 mb-4">Access Denied</p>
                    <p className="text-gray-600 mb-6">Please log in to view the dashboard.</p>
                    <button
                        onClick={() => router.push('/auth/signin')}
                        className="px-6 py-3 bg-yellow-400 border-4 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Overlay for mobile when sidebar is open */}
            {isSidebarOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={toggleSidebar}
                ></div>
            )}

            {/* Sidebar */}
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
                activePage={activePage}
                setActivePage={handlePageChange}
            />

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Pass userId to BusinessNavbar - it will handle notifications */}
                <BusinessNavbar userId={userId} />

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-3 sm:p-4 md:p-6 pb-24 md:pb-6">
                    {children}
                </main>

                <VendorBottomBar />
            </div>
        </div>
    );
}