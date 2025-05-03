'use client';

import { useRouter } from "next/navigation";
import {
    FiHome,
    FiShoppingBag,
    FiBarChart2,
    FiSettings,
    FiUsers,
    FiFileText,
    FiHelpCircle,
    FiLogOut,
    FiX
} from 'react-icons/fi';
import Image from 'next/image';

const Sidebar = ({ isSidebarOpen, toggleSidebar, activePage, setActivePage }) => {
    const router = useRouter();

    const menuItems = [
        { icon: <FiHome size={20} />, name: 'Dashboard', id: 'dashboard' },
        { icon: <FiShoppingBag size={20} />, name: 'Coupons', id: 'coupons' },
        { icon: <FiShoppingBag size={20} />, name: 'Business Info', id: 'business-info' },
        // { icon: <FiBarChart2 size={20} />, name: 'Analytics', id: 'analytics' },
        // { icon: <FiUsers size={20} />, name: 'Customers', id: 'customers' },
        // { icon: <FiFileText size={20} />, name: 'Reports', id: 'reports' },
        // { icon: <FiSettings size={20} />, name: 'Settings', id: 'settings' },
        // { icon: <FiHelpCircle size={20} />, name: 'Help', id: 'help' },
        { icon: <FiHelpCircle size={20} />, name: 'Scan Coupon', id: 'scan-coupon' },
        { icon: <FiHelpCircle size={20} />, name: 'Coupon Analytics', id: 'analytics' }
    ];

    return (
        <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} 
                    fixed md:static inset-y-0 left-0 z-50 w-64 bg-blue-700 transition-transform duration-300 ease-in-out
                    flex flex-col h-full shadow-lg`}>
            {/* Mobile Close Button */}
            <button
                className="md:hidden absolute top-4 right-4 text-white"
                onClick={toggleSidebar}
            >
                <FiX size={24} />
            </button>

            {/* Logo */}
            <div className="px-6 py-8">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <FiShoppingBag className="text-blue-300" size={24} />
                    CouponHub
                </h1>
                <p className="text-blue-200 text-sm">Vendor Portal</p>
            </div>

            {/* Navigation Menu */}
            <nav className="mt-2 flex-1 overflow-y-auto">
                <ul className="px-4 py-2">
                    {menuItems.map((item) => (
                        <li key={item.id} className="mb-1">
                            <button
                                onClick={() => setActivePage(item.id)}
                                className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors
                                    ${activePage === item.id
                                        ? 'bg-blue-800 text-white'
                                        : 'text-blue-100 hover:bg-blue-600'}`}
                            >
                                <span className="mr-3">{item.icon}</span>
                                {item.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* User Profile */}
            <div className="p-4 mt-auto border-t border-blue-600">
                <div className="flex items-center">
                    <div className="relative w-10 h-10 rounded-full bg-blue-500 overflow-hidden">
                        <Image
                            src="/api/placeholder/40/40"
                            alt="User Avatar"
                            width={40}
                            height={40}
                            className="object-cover"
                        />
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-medium text-white">Jane's Shop</p>
                        <p className="text-xs text-blue-200">Business Owner</p>
                    </div>
                    <button className="ml-auto text-blue-200 hover:text-white">
                        <FiLogOut size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;