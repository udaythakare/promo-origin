'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

import {
  Menu as MenuIcon,
  X as XIcon,
  User as UserIcon,
  LogOut as LogOutIcon,
  ChevronDown,
  Filter as FilterIcon,
  Store,
  TrendingUp,
} from 'lucide-react';

import GlobalFilterSection from './GlobalFilterSection';
import InternalNotifications from './InternalNotifications';

export default function Navbar({ userId }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);

  const router = useRouter();
  const profileRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const filtersRef = useRef(null);

  /* CLICK OUTSIDE */
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) setProfileOpen(false);
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) setMobileMenuOpen(false);
      if (filtersRef.current && !filtersRef.current.contains(event.target)) setFiltersOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* SESSION */
  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session?.user) {
        const { data } = await supabase.from('users').select('*').eq('id', session.user.id).single();
        if (data) setUser(data);
      }
    };
    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_, currentSession) => {
      setSession(currentSession);
      if (currentSession?.user) {
        const { data } = await supabase.from('users').select('*').eq('id', currentSession.user.id).single();
        if (data) setUser(data);
      } else {
        setUser(null);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  /* SIGN OUT */
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setProfileOpen(false);
    router.push('/login');
  };

  /* INVESTOR CHECK */
  const handleBecomeInvestor = async () => {
    if (!userId) { router.push('/auth/signin'); return; }
    try {
      const { data, error } = await supabase.from('investor_profiles').select('id').eq('user_id', userId).maybeSingle();
      if (error) { router.push('/u/profile/apply-for-investor'); return; }
      router.push(data ? '/investors' : '/u/profile/apply-for-investor');
    } catch {
      router.push('/u/profile/apply-for-investor');
    }
    setMobileMenuOpen(false);
  };

  /* BUSINESS CHECK */
  const handleApplyBusiness = async () => {
    if (!userId) { router.push('/auth/signin'); return; }
    try {
      const { data, error } = await supabase.from('businesses').select('id').eq('user_id', userId).maybeSingle();
      if (error) { router.push('/u/profile/apply-for-business'); return; }
      router.push(data ? '/business/dashboard' : '/u/profile/apply-for-business');
    } catch {
      router.push('/u/profile/apply-for-business');
    }
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/coupons', label: 'Coupons' },
    { href: '/about', label: 'About' },
    { href: '/u/profile', label: 'Profile' },
    { href: '/u/profile/my-coupons', label: 'My Coupons' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b-2 border-black shadow-[0_2px_0_0_rgba(0,0,0,1)]">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">

          {/* ── Logo ── */}
          <Link
            href="/"
            className="flex-shrink-0 text-lg sm:text-xl font-extrabold text-[#3716a8] tracking-tight hover:opacity-80 transition"
          >
            LocalGrow
          </Link>

          {/* ── Desktop Nav Links ── */}
          <div className="hidden lg:flex items-center gap-1 text-sm font-medium">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="px-3 py-2 rounded-lg text-gray-700 hover:bg-[#3716a8]/10 hover:text-[#3716a8] transition"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* ── Right Actions ── */}
          <div className="flex items-center gap-1.5 sm:gap-2">

            {/* Notifications */}
            {userId && <InternalNotifications userId={userId} />}

            {/* Filters — hidden on mobile (BottomBar handles it) */}
            <div ref={filtersRef} className="relative hidden sm:block">
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="flex items-center gap-1.5 px-3 py-2 text-white bg-[#3716a8] rounded-lg
                  hover:bg-[#4d2bc7] active:scale-95 transition-all text-sm font-semibold"
              >
                <FilterIcon size={15} />
                <span className="hidden md:inline">Filters</span>
                <ChevronDown size={14} className={`transition-transform ${filtersOpen ? 'rotate-180' : ''}`} />
              </button>

              {filtersOpen && (
                <>
                  <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setFiltersOpen(false)} />
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border-2 border-black z-50">
                    <GlobalFilterSection />
                  </div>
                </>
              )}
            </div>

            {/* Apply Business — desktop only */}
            <button
              onClick={handleApplyBusiness}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-sm font-semibold border-2 border-[#3716a8]
                text-[#3716a8] rounded-lg hover:bg-[#3716a8] hover:text-white active:scale-95 transition-all"
            >
              <Store size={15} />
              Business
            </button>

            {/* Become Investor — desktop only */}
            <button
              onClick={handleBecomeInvestor}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-white
                bg-[#3716a8] rounded-lg hover:bg-[#4d2bc7] active:scale-95 transition-all"
            >
              <TrendingUp size={15} />
              Investor
            </button>

            {/* Profile Dropdown */}
            {session && (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-gray-100 active:scale-95 transition-all"
                  aria-label="Profile menu"
                >
                  <div className="w-8 h-8 rounded-full bg-[#3716a8] border-2 border-black flex items-center justify-center text-white shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                    <UserIcon size={15} />
                  </div>
                  <ChevronDown size={14} className={`hidden sm:block transition-transform text-gray-600 ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-2xl border-2 border-black overflow-hidden z-50">
                    <div className="px-4 py-3 border-b-2 border-black bg-[#3716a8]/5">
                      <p className="font-bold text-sm text-gray-900 truncate">
                        {user?.username || user?.full_name || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {user?.email || session?.user?.email}
                      </p>
                    </div>
                    <Link
                      href="/u/profile"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                      onClick={() => setProfileOpen(false)}
                    >
                      <UserIcon size={15} />
                      Profile
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 border-t border-gray-100 transition"
                    >
                      <LogOutIcon size={15} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Hamburger — visible on lg and below, but only when no session uses it */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 active:scale-95 transition-all"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <XIcon size={22} /> : <MenuIcon size={22} />}
            </button>

          </div>
        </div>
      </div>

      {/* ── Mobile / Tablet Dropdown Menu ── */}
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="lg:hidden border-t-2 border-black bg-white shadow-lg"
        >
          <div className="max-w-7xl mx-auto px-3 py-2 flex flex-col">

            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="px-4 py-3 text-sm font-medium text-gray-800 hover:bg-[#3716a8]/8 hover:text-[#3716a8] rounded-lg transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                {label}
              </Link>
            ))}

            <div className="h-px bg-gray-200 my-2" />

            {/* Filters in mobile menu */}
            <div className="sm:hidden px-2 pb-2">
              <GlobalFilterSection />
            </div>

            <div className="flex gap-2 px-2 pb-3 sm:hidden">
              <button
                onClick={handleApplyBusiness}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-bold
                  border-2 border-[#3716a8] text-[#3716a8] rounded-lg hover:bg-[#3716a8] hover:text-white
                  active:scale-95 transition-all"
              >
                <Store size={15} />
                Business
              </button>
              <button
                onClick={handleBecomeInvestor}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-bold
                  bg-[#3716a8] text-white rounded-lg hover:bg-[#4d2bc7]
                  active:scale-95 transition-all"
              >
                <TrendingUp size={15} />
                Investor
              </button>
            </div>

            {/* Show Business/Investor in menu for sm–lg too */}
            <div className="hidden sm:flex gap-2 px-2 pb-3">
              <button
                onClick={handleApplyBusiness}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-bold
                  border-2 border-[#3716a8] text-[#3716a8] rounded-lg hover:bg-[#3716a8] hover:text-white
                  active:scale-95 transition-all"
              >
                <Store size={15} />
                Apply Business
              </button>
              <button
                onClick={handleBecomeInvestor}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-bold
                  bg-[#3716a8] text-white rounded-lg hover:bg-[#4d2bc7]
                  active:scale-95 transition-all"
              >
                <TrendingUp size={15} />
                Become Investor
              </button>
            </div>

          </div>
        </div>
      )}
    </nav>
  );
}