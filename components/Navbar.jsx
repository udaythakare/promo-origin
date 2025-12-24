'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { getAddressDropdowns } from '@/actions/addressActions';
import { fetchAllCoupons, fetchAreaCoupons } from '@/actions/couponActions';
import {
    Menu as MenuIcon,
    X as XIcon,
    User as UserIcon,
    LogOut as LogOutIcon,
    ChevronDown,
    Filter as FilterIcon,
    MapPin
} from 'lucide-react';
import GlobalFilterSection from './GlobalFilterSection';
import InternalNotifications from './InternalNotifications';
import { getUserId } from '@/helpers/userHelper';

export default function Navbar({userId}) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [session, setSession] = useState(null);
    const [user, setUser] = useState(null);
    const [areas, setAreas] = useState([]);
    const [selectedArea, setSelectedArea] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // const [userId, setUserId] =useState(null);

    const profileRef = useRef(null);
    const mobileMenuRef = useRef(null);
    const filtersRef = useRef(null);


    // console.log(user,'this is user in navbar')

    // Handle clicks outside of dropdown menus
    useEffect(() => {
        function handleClickOutside(event) {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setProfileOpen(false);
            }

            if (mobileMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
                setMobileMenuOpen(false);
            }

            if (filtersRef.current && !filtersRef.current.contains(event.target)) {
                setFiltersOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [mobileMenuOpen]);

    // Get authentication session and user data
    useEffect(() => {
        // Get initial session
        const fetchSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);

            console.log(session, 'this is session in navbar');

            if (session?.user) {
                const { data, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                if (!error && data) {
                    setUser(data);
                }
            }
        };

        fetchSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, currentSession) => {
                setSession(currentSession);

                if (currentSession?.user) {
                    const { data, error } = await supabase
                        .from('users')
                        .select('*')
                        .eq('id', currentSession.user.id)
                        .single();

                    if (!error && data) {
                        setUser(data);
                    }
                } else {
                    setUser(null);
                }
            }
        );

        return () => {
            subscription?.unsubscribe();
        };
    }, []);



    // console.log(session.user.id,'this is session user id')

    // Fetch areas for filters
    useEffect(() => {
        const fetchAreas = async () => {
            try {
                const dropdownResponse = await getAddressDropdowns();
                if (dropdownResponse?.areaData) {
                    setAreas(dropdownResponse.areaData);
                }
            } catch (error) {
                console.error('Error fetching areas:', error);
            }
        };

        fetchAreas();
    }, []);

    const handleSignOut = async () => {
        try {
            await supabase.auth.signOut();
            setProfileOpen(false);
            setMobileMenuOpen(false);
            router.push('/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const toggleProfileDropdown = () => {
        setProfileOpen(!profileOpen);
    };

    const toggleFiltersDropdown = () => {
        setFiltersOpen(!filtersOpen);
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    // Handle area selection change
    const handleAreaChange = async (area) => {
        setSelectedArea(area);
        setFiltersOpen(false);

        try {
            setLoading(true);

            if (area === '') {
                // If "All Areas" is selected, fetch all coupons
                const response = await fetchAllCoupons();
                if (window.updateCoupons && response?.coupons) {
                    window.updateCoupons(response.coupons);
                }
            } else {
                // Fetch coupons for selected area
                const response = await fetchAreaCoupons(area);
                if (window.updateCoupons && response?.coupons) {
                    window.updateCoupons(response.coupons);
                }
            }

            // Navigate to coupons page if not already there
            if (window.location.pathname !== '/coupons') {
                router.push('/coupons');
            }
        } catch (error) {
            console.error('Error fetching coupons by area:', error);
        } finally {
            setLoading(false);
        }
    };

    // Clear all filters
    const clearFilters = async () => {
        setSelectedArea('');

        try {
            setLoading(true);
            const response = await fetchAllCoupons();
            if (window.updateCoupons && response?.coupons) {
                window.updateCoupons(response.coupons);
            }
        } catch (error) {
            console.error('Error clearing filters:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <nav className="bg-white border-b-4 border-black">
            <div className="px-4 py-3">

                <div className="flex justify-between items-center">


                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/">
                            <h1 className="text-lg font-black uppercase tracking-tight transform -rotate-1">CouponStall</h1>
                        </Link>
                    </div>

                    {/* Desktop Navigation - Hidden on Mobile */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link href="/" className="text-black font-bold hover:underline uppercase">
                            Home
                        </Link>
                        <Link href="/coupons" className="text-black font-bold hover:underline uppercase">
                            Coupons
                        </Link>
                        <Link href="/about" className="text-black font-bold hover:underline uppercase">
                            About
                        </Link>
                        <Link href="/u/profile" className="text-black font-bold hover:underline uppercase">Profile</Link>
                        <Link href="/u/profile/my-coupons" className="text-black font-bold hover:underline uppercase">My Coupon</Link>
                        {session && (
                            <Link href="/my-coupons" className="text-black font-bold hover:underline uppercase">
                                My Coupons
                            </Link>
                        )}
                    </div>


                    <div>
                        {userId && (
                        <InternalNotifications userId={userId}/>

                        )}
                    </div>



                    {/* Filters dropdown and Profile dropdown */}
                    <div className="flex items-center space-x-2">
                        {/* Filters dropdown */}
                        <div className="relative" ref={filtersRef}>
                            <button
                                onClick={toggleFiltersDropdown}
                                className="p-2 bg-yellow-200 border-2 border-black rounded-none font-bold text-sm hover:bg-green-500 shadow-[3px_3px_0px_0px_rgba(0,0,0)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all uppercase flex items-center"
                                aria-label="Open filter menu"
                                aria-expanded={filtersOpen}
                            >
                                <FilterIcon size={16} className="mr-1" />
                                Filters
                                <ChevronDown
                                    size={16}
                                    className={`ml-1 transition-transform duration-200 ${filtersOpen ? 'transform rotate-180' : ''}`}
                                />
                            </button>

                            {/* Filters dropdown menu */}
                            {filtersOpen && (
                                <>
                                    {/* Dark overlay */}
                                    <div
                                        className="fixed inset-0 bg-black/50 z-50"
                                        onClick={() => setFiltersOpen(false)}
                                    />
                                    <div className="absolute right-0 mt-2 w-72 bg-white border-4 border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0)] z-50">
                                        <GlobalFilterSection />
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        {/* <button
                            aria-label="Toggle mobile menu"
                            className="md:hidden p-2 bg-yellow-200 border-2 border-black rounded-none shadow-[3px_3px_0px_0px_rgba(0,0,0)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
                            onClick={toggleMobileMenu}
                        >
                            <MenuIcon size={20} />
                        </button> */}

                        {/* Profile dropdown or Login buttons */}
                        {session && (
                            <div className="relative" ref={profileRef}>
                                <button
                                    onClick={toggleProfileDropdown}
                                    className="flex items-center p-2 bg-white border-2 border-black rounded-none hover:bg-gray-100 shadow-[3px_3px_0px_0px_rgba(0,0,0)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
                                    aria-label="Open user menu"
                                    aria-expanded={profileOpen}
                                >
                                    <div className="h-6 w-6 rounded-none bg-black flex items-center justify-center">
                                        <UserIcon size={14} className="text-white" />
                                    </div>
                                    <ChevronDown
                                        size={16}
                                        className={`ml-1 transition-transform duration-200 ${profileOpen ? 'transform rotate-180' : ''}`}
                                    />
                                </button>

                                {/* Profile dropdown menu */}
                                {profileOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white border-4 border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0)] py-1 z-50 transform origin-top-right transition-all duration-200 ease-out">
                                        <div className="px-4 py-3 border-b-2 border-black bg-yellow-400">
                                            <p className="text-sm font-black uppercase">{user?.username || user?.full_name || 'User'}</p>
                                            <p className="text-xs font-bold truncate">{user?.email || session?.user?.email}</p>
                                        </div>
                                        <Link
                                            href="/profile"
                                            className="block px-4 py-2 text-sm font-bold hover:bg-yellow-300 hover:text-black uppercase"
                                            onClick={() => setProfileOpen(false)}
                                        >
                                            Profile
                                        </Link>
                                        <button
                                            onClick={handleSignOut}
                                            className="flex items-center w-full px-4 py-2 text-sm font-bold hover:bg-red-400 hover:text-black uppercase"
                                        >
                                            <LogOutIcon size={16} className="mr-2" />
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile menu, show/hide based on menu state */}
                {mobileMenuOpen && (
                    <div
                        ref={mobileMenuRef}
                        className="fixed inset-0 z-40 md:hidden"
                        aria-modal="true"
                    >
                        {/* Background overlay */}
                        <div className="absolute inset-0 bg-black/25 backdrop-blur-xl" aria-hidden="true"></div>

                        {/* Menu panel */}
                        <div className="absolute top-0 right-0 w-3/4 max-w-xs h-full bg-white border-l-4 border-black shadow-lg transform transition-all ease-in-out duration-300">
                            <div className="p-4 border-b-4 border-black bg-yellow-400">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-black uppercase tracking-tight">Menu</h2>
                                    <button
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="p-2 border-2 border-black bg-white hover:bg-gray-100 active:translate-x-1 active:translate-y-1 transition-all"
                                    >
                                        <XIcon size={18} />
                                    </button>
                                </div>
                            </div>
                            <div className="py-2">
                                <Link href="/"
                                    className="block px-4 py-3 text-base font-bold uppercase border-b-2 border-black hover:bg-yellow-300 transform hover:-rotate-1 transition-all"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Home
                                </Link>
                                <Link href="/coupons"
                                    className="block px-4 py-3 text-base font-bold uppercase border-b-2 border-black hover:bg-yellow-300 transform hover:rotate-1 transition-all"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Coupons
                                </Link>
                                <Link href="/about"
                                    className="block px-4 py-3 text-base font-bold uppercase border-b-2 border-black hover:bg-yellow-300 transform hover:-rotate-1 transition-all"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    About
                                </Link>

                                <Link href="/v/onboard-form"
                                    className="block px-4 py-3 text-base font-bold uppercase border-b-2 border-black hover:bg-yellow-300 transform hover:-rotate-1 transition-all"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Become a Seller
                                </Link>

                                {session && (
                                    <Link href="/my-coupons"
                                        className="block px-4 py-3 text-base font-bold uppercase border-b-2 border-black hover:bg-yellow-300 transform hover:rotate-1 transition-all"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        My Coupons
                                    </Link>
                                )}



                                {/* User profile section in the mobile menu */}
                                {session ? (
                                    <div className="border-t-4 border-black mt-2 pt-2 bg-red-400">
                                        <div className="px-4 py-3">
                                            <p className="text-sm font-black uppercase">{user?.username || user?.full_name || 'User'}</p>
                                            <p className="text-xs font-bold">{user?.email || session?.user?.email}</p>
                                            <div className="mt-2 flex flex-col space-y-2">
                                                <Link href="/profile"
                                                    className="flex items-center px-4 py-2 text-sm font-bold bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all uppercase"
                                                    onClick={() => setMobileMenuOpen(false)}
                                                >
                                                    Profile
                                                </Link>
                                                <button
                                                    onClick={handleSignOut}
                                                    className="flex items-center px-4 py-2 text-sm font-bold bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all uppercase"
                                                >
                                                    <LogOutIcon size={16} className="mr-2" />
                                                    Sign Out
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}