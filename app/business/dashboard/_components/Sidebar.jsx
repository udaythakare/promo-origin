'use client';

import { useRouter, usePathname } from "next/navigation";
import {
    FiHome,
    FiShoppingBag,
    FiBarChart2,
    FiHelpCircle,
    FiLogOut,
    FiX
} from 'react-icons/fi';

import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {

    const router = useRouter();
    const pathname = usePathname();

    const ctx = useLanguage();
    const t = ctx?.t;

    const menuItems = [
        {
            icon: <FiHome size={20} />,
            name: t?.sidebar?.dashboard ?? "Dashboard",
            path: "/business/dashboard"
        },
        {
            icon: <FiShoppingBag size={20} />,
            name: t?.sidebar?.coupons ?? "Coupons",
            path: "/business/dashboard/coupons"
        },
        {
            icon: <FiShoppingBag size={20} />,
            name: t?.sidebar?.businessInfo ?? "Business Info",
            path: "/business/dashboard/buisness-info"
        },
        {
            icon: <FiHelpCircle size={20} />,
            name: t?.sidebar?.scanCoupon ?? "Scan",
            path: "/business/dashboard/scan-coupon"
        },
        {
            icon: <FiBarChart2 size={20} />,
            name: t?.sidebar?.analytics ?? "Analytics",
            path: "/business/dashboard/analytics"
        }
    ];

    const handleNavigation = (path) => {
        router.push(path);
        if (toggleSidebar) toggleSidebar();
    };

    return (

        <div
            className={`${isSidebarOpen
                ? 'translate-x-0'
                : '-translate-x-full md:translate-x-0'
                }
                fixed md:static inset-y-0 left-0 z-50 w-64 bg-black
                transition-transform duration-300 ease-in-out
                flex flex-col h-full border-r-4 border-black`}
        >

            {/* Mobile Close Button */}

            <button
                className="md:hidden absolute top-4 right-4"
                style={{ color: '#df6824' }}
                onClick={toggleSidebar}
            >
                <FiX size={24} />
            </button>


            {/* Logo */}

            <div
                className="px-6 py-8"
                style={{ borderBottom: '4px solid #df6824' }}
            >

                <h1
                    className="text-2xl font-black flex items-center gap-2 uppercase tracking-tight"
                    style={{ color: '#df6824' }}
                >
                    <FiShoppingBag size={24} />
                    LocalGrow
                </h1>

                <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mt-1">
                    {t?.sidebar?.vendorPortal ?? "Vendor Portal"}
                </p>

            </div>


            {/* Navigation */}

            <nav className="flex-1 overflow-y-auto">

                <ul className="px-4 py-4 space-y-1">

                    {menuItems.map((item) => {

                        const isActive = pathname === item.path;

                        return (

                            <li key={item.path}>

                                <button
                                    onClick={() => handleNavigation(item.path)}
                                    className={`flex items-center w-full px-4 py-3 text-sm font-bold uppercase tracking-wide transition-all
                                    ${isActive
                                            ? 'bg-[#df6824] text-black'
                                            : 'text-gray-300 hover:bg-gray-900 hover:text-[#df6824]'
                                        }`}
                                >

                                    <span className="mr-3">
                                        {item.icon}
                                    </span>

                                    {item.name}

                                </button>

                            </li>

                        );

                    })}

                </ul>

            </nav>


            {/* Language Switcher */}

            <div
                className="px-4 py-4"
                style={{ borderTop: '4px solid #df6824' }}
            >

                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">
                    {t?.common?.language ?? "Language"}
                </p>

                <LanguageSwitcher />

            </div>

        </div>

    );

};

export default Sidebar;