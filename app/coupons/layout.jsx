import MobileBottomNav from "@/components/BottomBar";
import Navbar from "@/components/Navbar";
import { getUserId } from "@/helpers/userHelper";

const CouponLayout = async ({ children }) => {
    const userId = await getUserId();

    if (!userId) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#f6f6fb] px-4">
                <p className="text-gray-500 text-sm sm:text-base text-center">
                    Please log in to view coupons.
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f6f6fb]">
            <Navbar userId={userId} />

            {/* 
                pb-20  → clears fixed bottom nav on mobile / PWA 
                md:pb-0 → no bottom nav on desktop
            */}
            <main className="pb-20 md:pb-0">
                {children}
            </main>

            <MobileBottomNav />
        </div>
    );
};

export default CouponLayout;