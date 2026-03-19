"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Store,
  Wallet,
  BarChart3,
  MessageSquare,
  Bell,
  User,
  Handshake,
  MoreHorizontal,
  X,
} from "lucide-react";
import { useState } from "react";

const YELLOW = '#f5c518';
const BAR_HEIGHT = 64;

const menuItems = [
  { name: "Dashboard",     path: "/investors",               icon: LayoutDashboard, exact: true  },
  { name: "Vendors",       path: "/investors/vendors",       icon: Store,           exact: false },
  { name: "Investments",   path: "/investors/investments",   icon: Wallet,          exact: false },
  { name: "Analytics",     path: "/investors/analytics",     icon: BarChart3,       exact: false },
  { name: "Connections",   path: "/investors/connections",   icon: Handshake,       exact: false },
  { name: "Messages",      path: "/investors/messages",      icon: MessageSquare,   exact: false },
  { name: "Notifications", path: "/investors/notifications", icon: Bell,            exact: false },
  { name: "Profile",       path: "/investors/profile",       icon: User,            exact: false },
];

// 4 main items on bottom bar
const mainItems = menuItems.slice(0, 4);
// Rest go into More drawer
const moreItems = menuItems.slice(4);

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [showMoreDrawer, setShowMoreDrawer] = useState(false);

  const isActive = (item) => {
    if (item.exact) return pathname === item.path;
    return pathname === item.path || pathname.startsWith(item.path + '/');
  };

  const isMoreActive = moreItems.some(item => isActive(item));

  const handleNav = (path) => {
    router.push(path);
    setShowMoreDrawer(false);
  };

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-black border-r-4 border-black">

        {/* Logo */}
        <div className="px-6 py-8" style={{ borderBottom: `4px solid ${YELLOW}` }}>
          <h1 className="text-2xl font-black uppercase tracking-tight" style={{ color: YELLOW }}>
            LocalGrow
          </h1>
          <p className="text-sm text-gray-400 font-bold uppercase tracking-wider mt-1">
            Investor Portal
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1" suppressHydrationWarning>
          {menuItems.map((item) => {
            const active = isActive(item);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.path}
                className="flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-wide transition-all"
                style={{
                  background: active ? YELLOW : 'transparent',
                  color: active ? '#000' : '#d1d5db',
                  boxShadow: active ? `4px 4px 0px 0px rgba(245,197,24,0.3)` : 'none',
                }}
              >
                <Icon size={18} strokeWidth={active ? 2.5 : 1.8} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div
          className="px-6 py-4 text-xs text-gray-500 font-bold uppercase"
          style={{ borderTop: `4px solid ${YELLOW}` }}
        >
          © {new Date().getFullYear()} LocalGrow
        </div>
      </aside>

      {/* ================= MOBILE BOTTOM NAV ================= */}

      {/* Backdrop */}
      {showMoreDrawer && (
        <div
          className="fixed inset-0 z-[48] lg:hidden"
          style={{ background: 'rgba(0,0,0,0.8)' }}
          onClick={() => setShowMoreDrawer(false)}
        />
      )}

      {/* More Drawer */}
      {showMoreDrawer && (
        <div
          className="fixed left-0 right-0 z-[49] lg:hidden"
          style={{
            bottom: BAR_HEIGHT,
            background: '#0d0d0d',
            borderTop: `3px solid ${YELLOW}`,
            borderLeft: `3px solid ${YELLOW}`,
            borderRight: `3px solid ${YELLOW}`,
            boxShadow: '0 -8px 32px rgba(0,0,0,0.9)',
          }}
        >
          {/* Drawer header */}
          <div
            className="flex items-center justify-between px-4 py-2.5"
            style={{ borderBottom: '1px solid #222' }}
          >
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-4" style={{ background: YELLOW }} />
              <span
                className="text-[11px] font-black uppercase tracking-widest"
                style={{ color: YELLOW }}
              >
                More Options
              </span>
            </div>
            <button
              onClick={() => setShowMoreDrawer(false)}
              className="p-1.5 transition active:scale-90"
              style={{ border: '1px solid #333', color: '#666' }}
            >
              <X size={14} />
            </button>
          </div>

          {/* Drawer nav items — 2 columns */}
          <div className="grid grid-cols-2 p-3 gap-2">
            {moreItems.map((item) => {
              const active = isActive(item);
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNav(item.path)}
                  className="flex items-center gap-2.5 px-3 py-3 transition-all active:scale-95 border-2"
                  style={{
                    background: active ? YELLOW : '#1a1a1a',
                    borderColor: active ? YELLOW : '#2a2a2a',
                    color: active ? '#000' : '#9ca3af',
                    boxShadow: active ? '3px 3px 0px rgba(0,0,0,0.8)' : 'none',
                  }}
                >
                  <Icon size={15} strokeWidth={active ? 2.5 : 1.8} />
                  <span className="text-[11px] font-black uppercase tracking-wide truncate">
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom Bar */}
      <div
        className="fixed left-0 right-0 bottom-0 lg:hidden z-50"
        style={{
          height: BAR_HEIGHT,
          background: '#000',
          borderTop: `3px solid ${YELLOW}`,
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.6)',
        }}
      >
        <div className="flex items-stretch h-full">

          {mainItems.map((item, index) => {
            const active = isActive(item);
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className="flex-1 flex flex-col items-center justify-center gap-1 transition-all duration-150 active:scale-95 relative"
                style={{
                  background: active ? YELLOW : 'transparent',
                  borderRight: index < mainItems.length - 1 ? '1px solid #1a1a1a' : 'none',
                }}
              >
                {active && (
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-black" />
                )}
                <Icon
                  size={18}
                  strokeWidth={active ? 2.5 : 1.8}
                  style={{ color: active ? '#000' : '#4b5563' }}
                />
                <span
                  className="text-[9px] font-black uppercase tracking-wider leading-none"
                  style={{ color: active ? '#000' : '#4b5563' }}
                >
                  {item.name}
                </span>
              </button>
            );
          })}

          {/* More button */}
          <button
            onClick={() => setShowMoreDrawer(prev => !prev)}
            className="flex-1 flex flex-col items-center justify-center gap-1 transition-all duration-150 active:scale-95 relative"
            style={{
              background: (showMoreDrawer || isMoreActive) ? YELLOW : 'transparent',
              borderLeft: '1px solid #1a1a1a',
            }}
          >
            {(showMoreDrawer || isMoreActive) && (
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-black" />
            )}
            <MoreHorizontal
              size={18}
              strokeWidth={(showMoreDrawer || isMoreActive) ? 2.5 : 1.8}
              style={{ color: (showMoreDrawer || isMoreActive) ? '#000' : '#4b5563' }}
            />
            <span
              className="text-[9px] font-black uppercase tracking-wider leading-none"
              style={{ color: (showMoreDrawer || isMoreActive) ? '#000' : '#4b5563' }}
            >
              More
            </span>
          </button>

        </div>
      </div>

      {/* Page content spacer */}
      <div className="lg:hidden" style={{ height: BAR_HEIGHT }} />
    </>
  );
}