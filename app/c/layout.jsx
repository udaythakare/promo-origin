import MobileBottomNav from "@/components/BottomBar";

const CouponLayout = ({ children }) => {
    return (
        <div>
            {/* Other layout elements like header */}
            <main className="pb-16 md:pb-0">{children}</main>
            <MobileBottomNav />
        </div>
    );
};

export default CouponLayout;