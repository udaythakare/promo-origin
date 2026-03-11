'use client'
import { Calendar, ShoppingBag, Store, RefreshCw, MapPin, CheckCircle2, Ticket, Tag, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getUserId } from '@/helpers/userHelper';
import { supabase } from '@/lib/supabase';
import { revalidateMyCouponPage } from '@/actions/revalidateActions';

const RedeemedCoupons = ({ data: initialData, onDataUpdate }) => {

    const [data, setData] = useState(initialData);
    const router = useRouter();
    const { success, coupons } = data || { success: false, coupons: [] };
    const [userId, setUserId] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => { setData(initialData); }, [initialData]);

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const id = await getUserId();
                setUserId(id);
            } catch (error) {
                console.error("Failed to get user ID:", error);
            }
        };
        fetchUserId();
    }, []);

    const refreshData = async () => {
        setRefreshing(true);
        try {
            const response = await fetch('/api/profile/user-redeemed-coupon', { credentials: 'include' });
            if (response.ok) {
                const newData = await response.json();
                setData(newData);
                if (onDataUpdate) onDataUpdate(newData);
            }
        } catch (error) {
            console.error('Failed to refresh data:', error);
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (!userId) return;
        const channel = supabase
            .channel(`redeemed_coupons_changes_${userId}`)
            .on('postgres_changes', {
                event: '*', schema: 'public',
                table: 'user_coupons', filter: `user_id=eq.${userId}`
            }, () => {
                refreshData();
                revalidateMyCouponPage();
            })
            .subscribe();
        return () => { supabase.removeChannel(channel); };
    }, [userId]);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        } catch { return 'Invalid date'; }
    };

    return (
        <div style={{ fontFamily: "'Outfit', 'DM Sans', sans-serif" }}>

            {/* ── Header ─────────────────────────────────────────────────── */}
            <div style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', marginBottom: '20px',
            }}>
                <div>
                    <h2 style={{
                        margin: 0, fontSize: '1.15rem', fontWeight: 900,
                        color: '#0f0c1d', display: 'flex', alignItems: 'center', gap: '8px',
                    }}>
                        <CheckCircle2 size={20} color="#7c3aed" />
                        Redeemed Coupons
                    </h2>
                    <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#9ca3af', fontWeight: 500 }}>
                        {coupons?.length || 0} coupon{coupons?.length !== 1 ? 's' : ''} redeemed
                    </p>
                </div>

                <button
                    onClick={refreshData}
                    disabled={refreshing}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        padding: '8px 14px', borderRadius: '10px',
                        background: 'linear-gradient(135deg, #3716a8, #6c4bff)',
                        border: 'none', color: 'white',
                        cursor: refreshing ? 'wait' : 'pointer',
                        fontSize: '0.78rem', fontWeight: 700,
                        boxShadow: '0 4px 12px rgba(55,22,168,0.3)',
                        transition: 'opacity 0.15s', fontFamily: 'inherit',
                        opacity: refreshing ? 0.7 : 1,
                    }}
                >
                    <RefreshCw size={13} style={{ animation: refreshing ? 'spin 0.7s linear infinite' : 'none' }} />
                    Refresh
                </button>
            </div>

            {/* ── Cards ──────────────────────────────────────────────────── */}
            {success && coupons && coupons.length > 0 ? (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
                    gap: '16px',
                }}>
                    {coupons.map((coupon) => {
                        const location = coupon.coupons?.businesses?.business_locations?.[0];

                        return (
                            <div
                                key={coupon.id}
                                style={{
                                    background: 'linear-gradient(145deg, #faf8ff 0%, #f0ebff 100%)',
                                    borderRadius: '16px',
                                    overflow: 'hidden',
                                    border: '1.5px solid rgba(124,58,237,0.2)',
                                    boxShadow: '0 2px 12px rgba(124,58,237,0.08)',
                                    display: 'flex', flexDirection: 'column',
                                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                    position: 'relative',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = 'translateY(-3px)';
                                    e.currentTarget.style.boxShadow = '0 10px 28px rgba(124,58,237,0.14)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 2px 12px rgba(124,58,237,0.08)';
                                }}
                            >
                                {/* Top accent — violet for redeemed */}
                                <div style={{
                                    height: '5px',
                                    background: 'linear-gradient(90deg, #7c3aed, #a78bfa)',
                                    flexShrink: 0,
                                }} />

                                {/* Faint diagonal watermark */}
                                <div style={{
                                    position: 'absolute', top: '50%', left: '50%',
                                    transform: 'translate(-50%, -50%) rotate(-25deg)',
                                    fontSize: '2.2rem', fontWeight: 900,
                                    color: 'rgba(124,58,237,0.055)',
                                    letterSpacing: '0.1em', pointerEvents: 'none',
                                    whiteSpace: 'nowrap', zIndex: 0,
                                }}>
                                    REDEEMED
                                </div>

                                {/* Body */}
                                <div style={{
                                    padding: '14px 16px', flex: 1,
                                    display: 'flex', flexDirection: 'column', gap: '10px',
                                    position: 'relative', zIndex: 1,
                                }}>

                                    {/* Business + badge */}
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', minWidth: 0 }}>
                                            <div style={{
                                                width: 30, height: 30, borderRadius: '8px', flexShrink: 0,
                                                background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            }}>
                                                <Store size={14} color="white" />
                                            </div>
                                            <span style={{
                                                fontSize: '0.78rem', fontWeight: 700, color: '#7c3aed',
                                                overflow: 'hidden', textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap', maxWidth: '130px',
                                            }}>
                                                {coupon.coupons?.businesses?.name || 'Business'}
                                            </span>
                                        </div>

                                        <span style={{
                                            fontSize: '0.65rem', fontWeight: 800,
                                            padding: '3px 9px', borderRadius: '20px', flexShrink: 0,
                                            letterSpacing: '0.05em', textTransform: 'uppercase',
                                            background: 'rgba(124,58,237,0.1)',
                                            color: '#7c3aed',
                                            border: '1px solid rgba(124,58,237,0.25)',
                                        }}>
                                            ✓ Used
                                        </span>
                                    </div>

                                    {/* Coupon title */}
                                    <div style={{
                                        padding: '8px 12px', borderRadius: '10px',
                                        background: 'rgba(124,58,237,0.07)',
                                        border: '1px solid rgba(124,58,237,0.14)',
                                    }}>
                                        <p style={{
                                            margin: 0, fontSize: '0.92rem', fontWeight: 800,
                                            color: '#5b21b6', lineHeight: 1.3,
                                        }}>
                                            {coupon.coupons?.title || 'Coupon'}
                                        </p>
                                    </div>

                                    {/* Description */}
                                    <p style={{
                                        margin: 0, fontSize: '0.78rem', color: '#6b7280',
                                        lineHeight: 1.5,
                                        display: '-webkit-box', WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical', overflow: 'hidden',
                                    }}>
                                        {coupon.coupons?.description || 'No description available'}
                                    </p>

                                    {/* Address */}
                                    {location && (
                                        <div style={{
                                            display: 'flex', alignItems: 'flex-start', gap: '6px',
                                            padding: '7px 10px', borderRadius: '8px',
                                            background: 'rgba(124,58,237,0.05)',
                                            border: '1px solid rgba(124,58,237,0.12)',
                                        }}>
                                            <MapPin size={12} color="#7c3aed" style={{ flexShrink: 0, marginTop: 2 }} />
                                            <span style={{ fontSize: '0.72rem', color: '#4b5563', lineHeight: 1.4, fontWeight: 500 }}>
                                                {[location.address, location.area, location.city, location.state]
                                                    .filter(Boolean).join(', ')}
                                            </span>
                                        </div>
                                    )}

                                    {/* Dashed cut-line divider */}
                                    <div style={{
                                        borderTop: '1.5px dashed rgba(124,58,237,0.2)',
                                        position: 'relative', margin: '2px 0',
                                    }}>
                                        <span style={{
                                            position: 'absolute', left: -16, top: '50%',
                                            transform: 'translateY(-50%)',
                                            width: 11, height: 11, borderRadius: '50%',
                                            background: '#f5f0ff',
                                        }} />
                                        <span style={{
                                            position: 'absolute', right: -16, top: '50%',
                                            transform: 'translateY(-50%)',
                                            width: 11, height: 11, borderRadius: '50%',
                                            background: '#f5f0ff',
                                        }} />
                                    </div>

                                    {/* Date */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <Calendar size={12} color="#9ca3af" />
                                        <span style={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: 600 }}>
                                            Used by {formatDate(coupon.coupons?.end_date)}
                                        </span>
                                    </div>
                                </div>

                                {/* Footer — redeemed pill (no action) */}
                                <div style={{ padding: '0 16px 16px' }}>
                                    <div style={{
                                        display: 'flex', alignItems: 'center',
                                        justifyContent: 'center', gap: '8px',
                                        padding: '10px', borderRadius: '10px',
                                        background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(167,139,250,0.15))',
                                        border: '1.5px solid rgba(124,58,237,0.25)',
                                    }}>
                                        <CheckCircle2 size={15} color="#7c3aed" />
                                        <span style={{
                                            fontSize: '0.8rem', fontWeight: 800,
                                            color: '#7c3aed', letterSpacing: '0.04em',
                                        }}>
                                            SUCCESSFULLY REDEEMED
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

            ) : (
                // ── Empty state ───────────────────────────────────────────
                <div style={{
                    padding: '48px 24px', textAlign: 'center',
                    borderRadius: '20px',
                    background: 'linear-gradient(145deg, #faf8ff, #f0ebff)',
                    border: '1.5px solid rgba(124,58,237,0.15)',
                }}>
                    <div style={{
                        width: 64, height: 64, borderRadius: '20px', margin: '0 auto 16px',
                        background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 8px 24px rgba(124,58,237,0.3)',
                    }}>
                        <CheckCircle2 size={28} color="white" />
                    </div>
                    <p style={{ margin: '0 0 6px', fontSize: '1rem', fontWeight: 800, color: '#0f0c1d' }}>
                        No redeemed coupons yet
                    </p>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: '#9ca3af', fontWeight: 500 }}>
                        Redeem your claimed coupons at participating stores
                    </p>
                </div>
            )}

            {/* ── Browse CTA ─────────────────────────────────────────────── */}
            <div style={{ marginTop: '24px', textAlign: 'center' }}>
                <button
                    onClick={() => router.push('/coupons')}
                    style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        padding: '11px 24px', borderRadius: '12px',
                        background: 'linear-gradient(135deg, #3716a8, #6c4bff)',
                        border: 'none', color: 'white', cursor: 'pointer',
                        fontSize: '0.85rem', fontWeight: 800,
                        boxShadow: '0 4px 16px rgba(55,22,168,0.35)',
                        transition: 'opacity 0.15s ease, transform 0.15s ease',
                        letterSpacing: '0.03em', fontFamily: 'inherit',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.opacity = '0.9';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.opacity = '1';
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}
                >
                    Browse Available Coupons
                    <ArrowRight size={15} />
                </button>
            </div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default RedeemedCoupons;