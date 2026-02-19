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
        { icon: <FiHelpCircle size={20} />, name: 'Scan Coupon', id: 'scan-coupon' },
        { icon: <FiBarChart2 size={20} />, name: 'Coupon Analytics', id: 'analytics' }
    ];

    return (
        <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} 
                    fixed md:static inset-y-0 left-0 z-50 w-64 bg-black transition-transform duration-300 ease-in-out
                    flex flex-col h-full border-r-4 border-black`}>
            {/* Mobile Close Button */}
            <button
                className="md:hidden absolute top-4 right-4 text-yellow-400 hover:text-white transition-colors"
                onClick={toggleSidebar}
            >
                <FiX size={24} />
            </button>

            {/* Logo */}
            <div className="px-6 py-8 border-b-4 border-yellow-400">
                <h1 className="text-2xl font-black text-yellow-400 flex items-center gap-2 uppercase tracking-tight">
                    <FiShoppingBag className="text-yellow-400" size={24} />
                    CouponStall
                </h1>
                <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mt-1">Vendor Portal</p>
            </div>

            {/* Navigation Menu */}
            <nav className="mt-2 flex-1 overflow-y-auto">
                <ul className="px-4 py-2">
                    {menuItems.map((item) => (
                        <li key={item.id} className="mb-1">
                            <button
                                onClick={() => setActivePage(item.id)}
                                className={`flex items-center w-full px-4 py-3 text-sm font-bold uppercase tracking-wide transition-all
                                    ${activePage === item.id
                                        ? 'bg-yellow-400 text-black shadow-[4px_4px_0px_0px_rgba(250,204,21,0.4)]'
                                        : 'text-gray-300 hover:bg-gray-900 hover:text-yellow-400'}`}
                            >
                                <span className="mr-3">{item.icon}</span>
                                {item.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* User Profile */}
            <div className="p-4 mt-auto border-t-4 border-yellow-400">
                <div className="flex items-center">
                    <div className="relative w-10 h-10 bg-yellow-400 overflow-hidden border-2 border-yellow-400">
                        <div className="w-full h-full flex items-center justify-center text-black font-black text-lg">
                            V
                        </div>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-bold text-white">Vendor</p>
                        <p className="text-xs text-gray-400 font-bold">Business Owner</p>
                    </div>
                    <button className="ml-auto text-gray-400 hover:text-yellow-400 transition-colors">
                        <FiLogOut size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;