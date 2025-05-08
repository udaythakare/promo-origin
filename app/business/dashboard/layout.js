'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from './_components/Sidebar';
import TopBar from './_components/TopBar';
import VendorBottomBar from '@/components/VendorBottomBar';
import BusinessNavbar from '@/components/BusinessNavbar';

export default function DashboardLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    // Extract the active page from the pathname
    const getActivePageFromPath = (path) => {
        const segments = path.split('/');
        const lastSegment = segments[segments.length - 1];
        return lastSegment === 'dashboard' ? 'dashboard' : lastSegment;
    };

    const [activePage, setActivePage] = useState(() => getActivePageFromPath(pathname));

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
                {/* <TopBar toggleSidebar={toggleSidebar} /> */}
                <BusinessNavbar />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    {children}
                </main>
            <VendorBottomBar />

            </div>
        </div>
    );
}