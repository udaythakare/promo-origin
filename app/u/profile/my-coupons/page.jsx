import React from 'react'
import { cookies } from 'next/headers'
import { Ticket, ShoppingBag, CheckCircle2 } from 'lucide-react'
import ClaimedCoupons from './components/ClaimedCoupons'
import RedeemedCoupons from './components/RedeemedCoupons'

const page = async () => {
    const cookieHeader = (await cookies()).toString()

    const [claimedRes, redeemedRes] = await Promise.all([
        fetch(
            `${process.env.NEXT_PUBLIC_SITE_URL}/api/profile/user-claimed-coupon`,
            {
                cache: 'force-cache',
                next: { revalidate: 3600 },
                headers: { cookie: cookieHeader },
                credentials: "include",
            }
        ),
        fetch(
            `${process.env.NEXT_PUBLIC_SITE_URL}/api/profile/user-redeemed-coupon`,
            {
                cache: 'force-cache',
                next: { revalidate: 3600 },
                headers: { cookie: cookieHeader },
                credentials: "include"
            },
        ),
    ])

    const claimedJson  = await claimedRes.json()
    const redeemedJson = await redeemedRes.json()

    const claimedCount  = claimedJson?.coupons?.length  || 0
    const redeemedCount = redeemedJson?.coupons?.length || 0

    return (
        <div
            className="min-h-screen pb-24 md:pb-8"
            style={{ background: '#f8f7ff', fontFamily: "'Outfit', 'DM Sans', sans-serif" }}
        >
            {/* ── Header ─────────────────────────────────────────────────── */}
            <div style={{
                background: 'linear-gradient(135deg, #3716a8 0%, #5a32e0 60%, #6c4bff 100%)',
                padding: '24px 20px 28px',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Decorative blobs */}
                <div style={{
                    position: 'absolute', top: -40, right: -40,
                    width: 180, height: 180, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.06)', pointerEvents: 'none',
                }} />
                <div style={{
                    position: 'absolute', bottom: -30, left: '30%',
                    width: 120, height: 120, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.04)', pointerEvents: 'none',
                }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                        <div style={{
                            width: 40, height: 40, borderRadius: '12px',
                            background: 'rgba(255,255,255,0.15)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: '1px solid rgba(255,255,255,0.2)',
                        }}>
                            <Ticket size={20} color="white" />
                        </div>
                        <h1 style={{
                            margin: 0, fontSize: 'clamp(1.2rem, 4vw, 1.6rem)',
                            fontWeight: 900, color: 'white', letterSpacing: '-0.01em',
                        }}>
                            My Coupons
                        </h1>
                    </div>

                    <p style={{
                        margin: '0 0 16px 52px',
                        fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', fontWeight: 500,
                    }}>
                        Your claimed and redeemed deals in one place
                    </p>

                    {/* Stat pills */}
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '7px',
                            padding: '6px 14px', borderRadius: '20px',
                            background: 'rgba(255,255,255,0.12)',
                            border: '1px solid rgba(255,255,255,0.2)',
                        }}>
                            <ShoppingBag size={13} color="white" />
                            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'white' }}>
                                {claimedCount} Active
                            </span>
                        </div>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '7px',
                            padding: '6px 14px', borderRadius: '20px',
                            background: 'rgba(255,255,255,0.12)',
                            border: '1px solid rgba(255,255,255,0.2)',
                        }}>
                            <CheckCircle2 size={13} color="white" />
                            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'white' }}>
                                {redeemedCount} Redeemed
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Content — no max-width, natural padding only ────────────── */}
            <div style={{
                padding: '24px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '32px',
            }}>
                {/* Active Claims section */}
                <section>
                    <div style={{
                        display: 'flex', alignItems: 'center',
                        gap: '10px', marginBottom: '14px',
                    }}>
                        <div style={{
                            width: 4, height: 20, borderRadius: '99px',
                            background: 'linear-gradient(180deg, #3716a8, #6c4bff)',
                        }} />
                        <h2 style={{
                            margin: 0, fontSize: '0.95rem', fontWeight: 800,
                            color: '#0f0c1d',
                        }}>
                            Active Claims
                        </h2>
                        <span style={{
                            fontSize: '0.7rem', fontWeight: 700,
                            padding: '2px 8px', borderRadius: '20px',
                            background: 'rgba(55,22,168,0.08)',
                            color: '#3716a8',
                            border: '1px solid rgba(55,22,168,0.15)',
                        }}>
                            {claimedCount}
                        </span>
                    </div>
                    <ClaimedCoupons data={claimedJson} />
                </section>

                {/* Separator */}
                <div style={{
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent, rgba(55,22,168,0.15), transparent)',
                }} />

                {/* Redeemed History section */}
                <section>
                    <div style={{
                        display: 'flex', alignItems: 'center',
                        gap: '10px', marginBottom: '14px',
                    }}>
                        <div style={{
                            width: 4, height: 20, borderRadius: '99px',
                            background: 'linear-gradient(180deg, #7c3aed, #a78bfa)',
                        }} />
                        <h2 style={{
                            margin: 0, fontSize: '0.95rem', fontWeight: 800,
                            color: '#0f0c1d',
                        }}>
                            Redeemed History
                        </h2>
                        <span style={{
                            fontSize: '0.7rem', fontWeight: 700,
                            padding: '2px 8px', borderRadius: '20px',
                            background: 'rgba(124,58,237,0.08)',
                            color: '#7c3aed',
                            border: '1px solid rgba(124,58,237,0.15)',
                        }}>
                            {redeemedCount}
                        </span>
                    </div>
                    <RedeemedCoupons data={redeemedJson} />
                </section>
            </div>
        </div>
    )
}

export default page