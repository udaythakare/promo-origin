'use client';

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import CouponsContent from './contentPages/CouponsContent';
import AnalyticsContent from './contentPages/AnalyticsContent';
import CustomersContent from './contentPages/CustomersContent';
import ReportsContent from './contentPages/ReportsContent';
import SettingsContent from './contentPages/SettingsContent';
import HelpContent from './contentPages/HelpContent';
import DashboardContent from './contentPages/DashboardContent';
import { useRouter } from 'next/navigation';

// Main Dashboard Layout
const VendorDashboard = () => {
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activePage, setActivePage] = useState('dashboard');
    const [loading, setLoading] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Content mapping for different pages
    const renderContent = () => {
        switch (activePage) {
            case 'dashboard':
                return <DashboardContent />;
            case 'coupons':
                // return <CouponsContent />;
                return router.push("/business/dashboard/coupons")
            case 'analytics':
                return <AnalyticsContent />;
            case 'customers':
                return <CustomersContent />;
            case 'reports':
                return <ReportsContent />;
            case 'settings':
                return <SettingsContent />;
            case 'help':
                return <HelpContent />;
            default:
                return <DashboardContent />;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Overlay for mobile when sidebar is open */}


            <div className="flex-1 flex flex-col overflow-hidden">

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default VendorDashboard;