import { CouponCard } from "./CouponCard/CouponCard";

export const CouponGrid = ({
  coupons,
  claimingCoupons,
  session,
  onClaimClick,
  onShowQR,
}) => {
  const isCouponClaimed = (couponId) => {
    const coupon = coupons.find((c) => c.id === couponId);
    return coupon?.is_claimed || false;
  };

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
      {coupons.map((coupon, index) => (
        <CouponCard
          key={coupon.id}
          coupon={coupon}
          index={index}
          isClaimed={isCouponClaimed(coupon.id)}
          claimingStatus={claimingCoupons[coupon.id]}
          session={session}
          onClaimClick={onClaimClick}
          onShowQR={onShowQR}
        />
      ))}
    </div>
  );
};