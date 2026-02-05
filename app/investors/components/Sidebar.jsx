// app/investors/components/Sidebar.jsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { name: "Dashboard", path: "/investors" },
  { name: "Vendors", path: "/investors/vendors" },
  { name: "AI Matchmaking", path: "/investors/ai-matchmaking" },
  { name: "Investments", path: "/investors/investments" },
  { name: "Analytics", path: "/investors/analytics" },
  { name: "Messages", path: "/investors/messages" },
  { name: "Notifications", path: "/investors/notifications" },
  { name: "Settings", path: "/investors/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r px-4 py-6">
      
      {/* Logo / Title */}
      <div className="mb-8">
        <h1 className="text-xl font-bold text-green-600">LocalGrow</h1>
        <p className="text-sm text-gray-500">Investor Portal</p>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.name}
              href={item.path}
              className={`block px-4 py-2 rounded-lg transition ${
                isActive
                  ? "bg-green-600 text-white"
                  : "text-gray-700 hover:bg-green-50"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
