import MobileBottomNav from "@/components/BottomBar";
import Navbar from "@/components/Navbar";
import { getUserId } from "@/helpers/userHelper";

const CouponLayout = async ({ children }) => {
    const userId = await getUserId();
    if (!userId) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-gray-500">Please log in to view coupons.</p>
            </div>
        );
    }
    return (
        <div>
            <Navbar userId={userId} />
            {/* Other layout elements like header */}
            <main className="pb-20 md:pb-0">{children}</main>
            <MobileBottomNav />
        </div>
    );
};

export default CouponLayout;