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
Filter as FilterIcon
} from 'lucide-react';

import GlobalFilterSection from './GlobalFilterSection';
import InternalNotifications from './InternalNotifications';

export default function Navbar({ userId }) {

const [mobileMenuOpen,setMobileMenuOpen] = useState(false);
const [profileOpen,setProfileOpen] = useState(false);
const [filtersOpen,setFiltersOpen] = useState(false);
const [session,setSession] = useState(null);
const [user,setUser] = useState(null);

const router = useRouter();

const profileRef = useRef(null);
const mobileMenuRef = useRef(null);
const filtersRef = useRef(null);


/* CLICK OUTSIDE */

useEffect(() => {

function handleClickOutside(event){

if(profileRef.current && !profileRef.current.contains(event.target)){
setProfileOpen(false)
}

if(mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)){
setMobileMenuOpen(false)
}

if(filtersRef.current && !filtersRef.current.contains(event.target)){
setFiltersOpen(false)
}

}

document.addEventListener("mousedown",handleClickOutside)

return () => document.removeEventListener("mousedown",handleClickOutside)

},[])



/* SESSION */

useEffect(()=>{

const fetchSession = async () => {

const { data:{session} } = await supabase.auth.getSession()

setSession(session)

if(session?.user){

const {data} = await supabase
.from('users')
.select('*')
.eq('id',session.user.id)
.single()

if(data) setUser(data)

}

}

fetchSession()

const { data:{subscription} } =
supabase.auth.onAuthStateChange(async(_,currentSession)=>{

setSession(currentSession)

if(currentSession?.user){

const {data} = await supabase
.from('users')
.select('*')
.eq('id',currentSession.user.id)
.single()

if(data) setUser(data)

}else{
setUser(null)
}

})

return () => subscription?.unsubscribe()

},[])



/* SIGN OUT */

const handleSignOut = async () => {

await supabase.auth.signOut()

setProfileOpen(false)

router.push('/login')

}


/* INVESTOR CHECK */

const handleBecomeInvestor = async () => {

  if (!userId) {
    router.push('/auth/signin');
    return;
  }

  try {

    const { data, error } = await supabase
      .from("investor_profiles")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Investor check error:", error);
      router.push("/u/profile/apply-for-investor");
      return;
    }

    if (data) {
      router.push("/investors");
    } else {
      router.push("/u/profile/apply-for-investor");
    }

  } catch (err) {
    console.error("Unexpected error:", err);
    router.push("/u/profile/apply-for-investor");
  }

};


const handleApplyBusiness = async () => {

  if (!userId) {
    router.push('/auth/signin');
    return;
  }

  try {

    const { data, error } = await supabase
      .from("businesses")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Business check error:", error);
      router.push("/u/profile/apply-for-business");
      return;
    }

    if (data) {
      router.push("/business/dashboard");
    } else {
      router.push("/u/profile/apply-for-business");
    }

  } catch (err) {
    console.error("Unexpected error:", err);
    router.push("/u/profile/apply-for-business");
  }

};

const toggleProfileDropdown = () => setProfileOpen(!profileOpen)
const toggleFiltersDropdown = () => setFiltersOpen(!filtersOpen)
const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen)



return(

<nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">

<div className="max-w-7xl mx-auto px-4 py-3">

<div className="flex items-center justify-between">


{/* Logo */}

<Link href="/" className="text-xl font-bold text-[#3716a8] hover:opacity-80 transition">
LocalGrow
</Link>


{/* Desktop Navigation */}

<div className="hidden md:flex items-center gap-6 text-sm font-medium">

<Link href="/" className="px-3 py-2 rounded-lg hover:bg-[#3716a8]/10 transition">
Home
</Link>

<Link href="/coupons" className="px-3 py-2 rounded-lg hover:bg-[#3716a8]/10 transition">
Coupons
</Link>

<Link href="/about" className="px-3 py-2 rounded-lg hover:bg-[#3716a8]/10 transition">
About
</Link>

<Link href="/u/profile" className="px-3 py-2 rounded-lg hover:bg-[#3716a8]/10 transition">
Profile
</Link>

<Link href="/u/profile/my-coupons" className="px-3 py-2 rounded-lg hover:bg-[#3716a8]/10 transition">
My Coupon
</Link>

{session && (
<Link href="/my-coupons" className="px-3 py-2 rounded-lg hover:bg-[#3716a8]/10 transition">
My Coupons
</Link>
)}

{/* Apply Business */}

<button
onClick={handleApplyBusiness}
className="px-4 py-2 text-sm border border-[#3716a8] text-[#3716a8] rounded-lg
hover:bg-[#3716a8] hover:text-white transition"
>
Apply Business
</button>

{/* Become Investor */}

<button
onClick={handleBecomeInvestor}
className="px-4 py-2 text-sm text-white bg-[#3716a8] rounded-lg
hover:bg-[#6C4BFF] transition"
>
Become Investor
</button>

</div>


{/* Right Section */}

<div className="flex items-center gap-3">

{userId && <InternalNotifications userId={userId} />}


{/* Filters */}

<div ref={filtersRef} className="relative">

<button
onClick={toggleFiltersDropdown}
className="flex items-center gap-2 px-4 py-2 text-white bg-[#3716a8] rounded-lg
hover:bg-[#6C4BFF] transition"
>

<FilterIcon size={16}/>

Filters

<ChevronDown
size={16}
className={`transition-transform ${filtersOpen ? 'rotate-180' : ''}`}
/>

</button>

{filtersOpen && (

<>
<div
className="fixed inset-0 bg-black/30"
onClick={()=>setFiltersOpen(false)}
/>

<div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-xl border border-gray-200">

<GlobalFilterSection/>

</div>
</>

)}

</div>


{/* Profile */}

{session && (

<div className="relative" ref={profileRef}>

<button
onClick={toggleProfileDropdown}
className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-100 transition"
>

<div className="w-8 h-8 rounded-full bg-[#3716a8] flex items-center justify-center text-white">

<UserIcon size={16}/>

</div>

<ChevronDown
size={16}
className={`transition-transform ${profileOpen ? 'rotate-180' : ''}`}
/>

</button>


{profileOpen && (

<div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">

<div className="px-4 py-3 border-b">

<p className="font-semibold text-sm">
{user?.username || user?.full_name || 'User'}
</p>

<p className="text-xs text-gray-500 truncate">
{user?.email || session?.user?.email}
</p>

</div>

<Link
href="/profile"
className="block px-4 py-2 text-sm hover:bg-gray-50"
onClick={()=>setProfileOpen(false)}
>
Profile
</Link>

<button
onClick={handleSignOut}
className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
>

<LogOutIcon size={16}/>
Sign Out

</button>

</div>

)}

</div>

)}


{/* Mobile Menu Button */}

<button
onClick={toggleMobileMenu}
className="md:hidden p-2 rounded-lg hover:bg-gray-100"
>

{mobileMenuOpen ? <XIcon size={22}/> : <MenuIcon size={22}/>}

</button>

</div>

</div>


{/* Mobile Menu */}

{mobileMenuOpen && (

<div
ref={mobileMenuRef}
className="md:hidden mt-4 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">

<Link href="/" className="block px-4 py-3 hover:bg-gray-50">Home</Link>

<Link href="/coupons" className="block px-4 py-3 hover:bg-gray-50">Coupons</Link>

<Link href="/about" className="block px-4 py-3 hover:bg-gray-50">About</Link>

<Link href="/u/profile" className="block px-4 py-3 hover:bg-gray-50">Profile</Link>

<Link href="/u/profile/my-coupons" className="block px-4 py-3 hover:bg-gray-50">My Coupon</Link>

<button
onClick={handleApplyBusiness}
className="w-full text-left px-4 py-3 hover:bg-gray-50"
>
Apply Business
</button>

<button
onClick={handleBecomeInvestor}
className="w-full text-left px-4 py-3 hover:bg-gray-50"
>
Become Investor
</button>

</div>

)}

</div>

</nav>

)

}