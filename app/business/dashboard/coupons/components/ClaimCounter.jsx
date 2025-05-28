'use client';
import { useRealtimeClaimsCount } from "@/hooks/useRealtimeClaimsCount";

export default function ClaimsCounter({ couponId, initialCount, maxClaims, userId }) {
    const currentClaims = useRealtimeClaimsCount(couponId, initialCount, userId);

    return (
        <div className="bg-yellow-100 border-2 border-black p-2 font-bold">
            <span className="text-lg">
                {maxClaims ? `${currentClaims}/${maxClaims} claimed` : `${currentClaims} claims`}
            </span>

        </div>
    );
}