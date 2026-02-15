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
  Settings,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", path: "/investors", icon: LayoutDashboard },
  { name: "Vendors", path: "/investors/vendors", icon: Store },
  { name: "Investments", path: "/investors/investments", icon: Wallet },
  { name: "Analytics", path: "/investors/analytics", icon: BarChart3 },
  { name: "Messages", path: "/investors/messages", icon: MessageSquare },
  { name: "Notifications", path: "/investors/notifications", icon: Bell },
  { name: "Settings", path: "/investors/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-white border-r shadow-sm">

        {/* Logo */}
        <div className="px-6 py-6 border-b">
          <h1 className="text-2xl font-bold text-green-600">
            LocalGrow
          </h1>
          <p className="text-sm text-gray-500">
            Investor Portal
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.path}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
                  ${
                    isActive
                      ? "bg-green-600 text-white"
                      : "text-gray-700 hover:bg-green-50"
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
        <div className="px-6 py-4 text-xs text-gray-400 border-t">
          © {new Date().getFullYear()} LocalGrow
        </div>
      </aside>

      {/* ================= MOBILE BOTTOM NAV ================= */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-md z-50">
        <div className="flex justify-around items-center h-16">

          {menuItems.slice(0, 5).map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.path}
                className="flex flex-col items-center justify-center text-xs"
              >
                <Icon
                  size={20}
                  className={
                    isActive ? "text-green-600" : "text-gray-500"
                  }
                />
                <span
                  className={
                    isActive
                      ? "text-green-600 font-medium"
                      : "text-gray-500"
                  }
                >
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
