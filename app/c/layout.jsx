import MobileBottomNav from "@/components/BottomBar";
import Navbar from "@/components/Navbar";

const CouponLayout = ({ children }) => {
    return (
        <div>
            <Navbar />
            {/* Other layout elements like header */}
            <main className="pb-16 md:pb-0">{children}</main>
            <MobileBottomNav />
        </div>
    );
};

export default CouponLayout;