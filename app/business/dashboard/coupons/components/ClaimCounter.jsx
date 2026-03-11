'use client';

import { useRealtimeClaimsCount } from "@/hooks/useRealtimeClaimsCount";
import { useLanguage } from "@/context/LanguageContext";

export default function ClaimsCounter({ couponId, initialCount, maxClaims, userId }) {

    const ctx = useLanguage();
    const t = ctx?.t;

    const currentClaims = useRealtimeClaimsCount(couponId, initialCount, userId);

    return (
        <div
            className="border-2 border-black p-2 font-bold"
            style={{ backgroundColor: "#fff4ec" }}
        >
            <span className="text-lg">
                {maxClaims
                    ? `${currentClaims}/${maxClaims} ${t?.coupons?.claimed ?? "claimed"}`
                    : `${currentClaims} ${t?.coupons?.claims ?? "claims"}`
                }
            </span>
        </div>
    );
}