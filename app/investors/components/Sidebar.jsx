"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Store,
  Wallet,
  BarChart3,
  MessageSquare,
  Bell,
  User,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", path: "/investors", icon: LayoutDashboard },
  { name: "Vendors", path: "/investors/vendors", icon: Store },
  { name: "Investments", path: "/investors/investments", icon: Wallet },
  { name: "Analytics", path: "/investors/analytics", icon: BarChart3 },
  { name: "Messages", path: "/investors/messages", icon: MessageSquare },
  { name: "Notifications", path: "/investors/notifications", icon: Bell },
  { name: "Profile", path: "/investors/profile", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-black border-r-4 border-black">

        {/* Logo */}
        <div className="px-6 py-8 border-b-4 border-yellow-400">
          <h1 className="text-2xl font-black text-yellow-400 uppercase tracking-tight">
            LocalGrow
          </h1>
          <p className="text-sm text-gray-400 font-bold uppercase tracking-wider mt-1">
            Investor Portal
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.path}
                className={`
                  flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-wide transition-all
                  ${isActive
                    ? "bg-yellow-400 text-black shadow-[4px_4px_0px_0px_rgba(250,204,21,0.4)]"
                    : "text-gray-300 hover:bg-gray-900 hover:text-yellow-400"
                  }
                `}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 text-xs text-gray-500 font-bold border-t-4 border-yellow-400 uppercase">
          © {new Date().getFullYear()} LocalGrow
        </div>
      </aside>

      {/* ================= MOBILE BOTTOM NAV ================= */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4 z-50">
        <div className="flex justify-between items-center p-2 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0)]">
          {menuItems.slice(0, 5).map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.path}
                className="flex flex-col items-center justify-center px-2 py-1.5 w-1/5 font-black transition-all duration-200 hover:scale-105"
              >
                <div className={`
                  ${isActive ? 'bg-yellow-400' : 'bg-white'} 
                  p-1.5 border-2 border-black
                  ${isActive ? 'shadow-[4px_4px_0px_0px_rgba(0,0,0)]' : 'hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)]'}
                  transition-all duration-200
                  transform hover:-translate-y-1 active:translate-y-0
                `}>
                  <Icon size={18} className="text-black" />
                </div>
                <span className={`text-[10px] mt-1.5 font-bold uppercase tracking-wider
                  ${isActive ? 'bg-black text-white px-1.5 py-0.5 border-2 border-black' : 'text-black'}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
