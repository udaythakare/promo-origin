'use client';
import { useState, useEffect } from 'react';
import {
    ShoppingBag, Store, Calendar, QrCode,
    RefreshCw, MapPin, Check, CheckCircle2,
    Ticket, Clock, Tag, Zap
} from 'lucide-react';
import { getUserId } from '@/helpers/userHelper';
import QRModal from '../../components/QRModal';
import { supabase } from '@/lib/supabase';
import { revalidateMyCouponPage } from '@/actions/revalidateActions';

export default function ClaimedCoupons({ data: initialData, onDataUpdate }) {

    const [data, setData] = useState(initialData);
    const { success, coupons } = data || { success: false, coupons: [] };

    const [isQROpen, setIsQROpen] = useState(false);
    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [userId, setUserId] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
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
            const response = await fetch('/api/profile/user-claimed-coupon', { credentials: 'include' });
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
            .channel(`user_coupons_changes_${userId}`)
            .on('postgres_changes', {
                event: '*', schema: 'public',
                table: 'user_coupons', filter: `user_id=eq.${userId}`
            }, (payload) => {
                refreshData();
                const updatedCoupon = payload.new;
                if (payload.eventType === 'UPDATE' && updatedCoupon?.coupon_status === 'redeemed') {
                    if (isQROpen && selectedCoupon && selectedCoupon.id === updatedCoupon.id) {
                        setShowConfirmation(true);
                        setTimeout(() => {
                            setIsQROpen(false);
                            setShowConfirmation(false);
                            setSelectedCoupon(null);
                        }, 3000);
                    }
                    revalidateMyCouponPage();
                }
            })
            .subscribe();
        return () => { supabase.removeChannel(channel); };
    }, [userId, isQROpen, selectedCoupon]);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        } catch { return 'Invalid date'; }
    };

    const showQrCode = (coupon) => {
        setIsQROpen(true);
        setSelectedCoupon(coupon);
        setShowConfirmation(false);
    };

    const closeQRModal = () => {
        setIsQROpen(false);
        setShowConfirmation(false);
        setSelectedCoupon(null);
    };

    const getQrValue = () => {
        if (!selectedCoupon || !userId) return '';
        return JSON.stringify({ userId, couponId: selectedCoupon.coupon_id });
    };

    const isRedeemed = (coupon) => coupon.coupon_status === 'redeemed';

    return (
        <div style={{ fontFamily: "'Outfit', 'DM Sans', sans-serif" }}>

            {/* ── Refresh row ────────────────────────────────────────────── */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                <button
                    onClick={refreshData}
                    disabled={refreshing}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        padding: '7px 14px', borderRadius: '10px',
                        background: 'linear-gradient(135deg, #3716a8, #6c4bff)',
                        border: 'none', color: 'white', cursor: refreshing ? 'wait' : 'pointer',
                        fontSize: '0.78rem', fontWeight: 700,
                        boxShadow: '0 4px 12px rgba(55,22,168,0.25)',
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
                        const redeemed = isRedeemed(coupon);
                        const locs = coupon?.coupons?.businesses?.business_locations;
                        const location = Array.isArray(locs) && locs.length > 0 ? locs[0] : null;

                        return (
                            <div
                                key={coupon.id}
                                style={{
                                    background: redeemed
                                        ? 'linear-gradient(145deg, #f8f7ff 0%, #ede9fe 100%)'
                                        : 'white',
                                    borderRadius: '16px',
                                    overflow: 'hidden',
                                    border: redeemed
                                        ? '1.5px solid rgba(55,22,168,0.2)'
                                        : '1.5px solid rgba(55,22,168,0.1)',
                                    boxShadow: redeemed
                                        ? '0 2px 12px rgba(55,22,168,0.1)'
                                        : '0 2px 12px rgba(55,22,168,0.07)',
                                    display: 'flex', flexDirection: 'column',
                                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                    position: 'relative',
                                    opacity: redeemed ? 0.85 : 1,
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = 'translateY(-3px)';
                                    e.currentTarget.style.boxShadow = '0 10px 28px rgba(55,22,168,0.15)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = redeemed
                                        ? '0 2px 12px rgba(55,22,168,0.1)'
                                        : '0 2px 12px rgba(55,22,168,0.07)';
                                }}
                            >
                                {/* Top accent */}
                                <div style={{
                                    height: '5px',
                                    background: redeemed
                                        ? 'linear-gradient(90deg, #7c3aed, #a78bfa)'
                                        : 'linear-gradient(90deg, #3716a8, #6c4bff)',
                                }} />

                                {/* Redeemed watermark */}
                                {redeemed && (
                                    <div style={{
                                        position: 'absolute', top: '50%', left: '50%',
                                        transform: 'translate(-50%, -50%) rotate(-25deg)',
                                        fontSize: '2.5rem', fontWeight: 900,
                                        color: 'rgba(124,58,237,0.07)',
                                        letterSpacing: '0.1em', pointerEvents: 'none',
                                        whiteSpace: 'nowrap', zIndex: 0,
                                    }}>
                                        REDEEMED
                                    </div>
                                )}

                                {/* Body */}
                                <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', position: 'relative', zIndex: 1 }}>

                                    {/* Business + status badge */}
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', minWidth: 0 }}>
                                            <div style={{
                                                width: 30, height: 30, borderRadius: '8px', flexShrink: 0,
                                                background: redeemed
                                                    ? 'linear-gradient(135deg, #7c3aed, #a78bfa)'
                                                    : 'linear-gradient(135deg, #3716a8, #6c4bff)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            }}>
                                                <Store size={14} color="white" />
                                            </div>
                                            <span style={{
                                                fontSize: '0.78rem', fontWeight: 700,
                                                color: redeemed ? '#7c3aed' : '#3716a8',
                                                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                                maxWidth: '130px',
                                            }}>
                                                {coupon.coupons?.businesses?.name || 'Business'}
                                            </span>
                                        </div>

                                        {/* Status badge */}
                                        <span style={{
                                            fontSize: '0.65rem', fontWeight: 800,
                                            padding: '3px 9px', borderRadius: '20px',
                                            letterSpacing: '0.05em', textTransform: 'uppercase',
                                            flexShrink: 0,
                                            background: redeemed
                                                ? 'rgba(124,58,237,0.1)'
                                                : 'rgba(5,150,105,0.1)',
                                            color: redeemed ? '#7c3aed' : '#059669',
                                            border: `1px solid ${redeemed ? 'rgba(124,58,237,0.25)' : 'rgba(5,150,105,0.25)'}`,
                                        }}>
                                            {redeemed ? '✓ Used' : '✓ Active'}
                                        </span>
                                    </div>

                                    {/* Coupon title */}
                                    <div style={{
                                        padding: '8px 12px', borderRadius: '10px',
                                        background: redeemed
                                            ? 'rgba(124,58,237,0.08)'
                                            : 'rgba(55,22,168,0.06)',
                                        border: `1px solid ${redeemed ? 'rgba(124,58,237,0.15)' : 'rgba(55,22,168,0.12)'}`,
                                    }}>
                                        <p style={{
                                            margin: 0, fontSize: '0.92rem', fontWeight: 800,
                                            color: redeemed ? '#5b21b6' : '#0f0c1d',
                                            lineHeight: 1.3,
                                        }}>
                                            {coupon.coupons?.title}
                                        </p>
                                    </div>

                                    {/* Description */}
                                    <p style={{
                                        margin: 0, fontSize: '0.78rem',
                                        color: '#6b7280', lineHeight: 1.5,
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
                                            background: redeemed
                                                ? 'rgba(124,58,237,0.05)'
                                                : 'rgba(55,22,168,0.04)',
                                            border: `1px solid ${redeemed ? 'rgba(124,58,237,0.12)' : 'rgba(55,22,168,0.1)'}`,
                                        }}>
                                            <MapPin size={12} color={redeemed ? '#7c3aed' : '#3716a8'} style={{ flexShrink: 0, marginTop: 2 }} />
                                            <span style={{ fontSize: '0.72rem', color: '#4b5563', lineHeight: 1.4, fontWeight: 500 }}>
                                                {[location.address, location.area, location.city, location.state]
                                                    .filter(Boolean).join(', ')}
                                            </span>
                                        </div>
                                    )}

                                    {/* Dashed divider */}
                                    <div style={{
                                        borderTop: `1.5px dashed ${redeemed ? 'rgba(124,58,237,0.2)' : 'rgba(55,22,168,0.15)'}`,
                                        position: 'relative', margin: '2px 0',
                                    }}>
                                        <span style={{
                                            position: 'absolute', left: -16, top: '50%', transform: 'translateY(-50%)',
                                            width: 11, height: 11, borderRadius: '50%', background: '#f5f5ff',
                                        }} />
                                        <span style={{
                                            position: 'absolute', right: -16, top: '50%', transform: 'translateY(-50%)',
                                            width: 11, height: 11, borderRadius: '50%', background: '#f5f5ff',
                                        }} />
                                    </div>

                                    {/* Expiry date */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <Calendar size={12} color="#9ca3af" />
                                        <span style={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: 600 }}>
                                            {redeemed ? 'Used on' : 'Expires'} {formatDate(coupon.coupons?.end_date)}
                                        </span>
                                    </div>
                                </div>

                                {/* Footer / CTA */}
                                <div style={{ padding: '0 16px 16px' }}>
                                    {redeemed ? (
                                        // ── REDEEMED state — distinct purple/violet look ──
                                        <div style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            gap: '8px', padding: '10px',
                                            borderRadius: '10px',
                                            background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(167,139,250,0.15))',
                                            border: '1.5px solid rgba(124,58,237,0.25)',
                                        }}>
                                            <CheckCircle2 size={16} color="#7c3aed" />
                                            <span style={{
                                                fontSize: '0.8rem', fontWeight: 800,
                                                color: '#7c3aed', letterSpacing: '0.04em',
                                            }}>
                                                REDEEMED
                                            </span>
                                        </div>
                                    ) : (
                                        // ── ACTIVE / CLAIMED state — show QR button ──
                                        <button
                                            onClick={() => showQrCode(coupon)}
                                            style={{
                                                width: '100%', display: 'flex',
                                                alignItems: 'center', justifyContent: 'center',
                                                gap: '8px', padding: '10px',
                                                borderRadius: '10px',
                                                background: 'linear-gradient(135deg, #3716a8, #6c4bff)',
                                                border: 'none', color: 'white', cursor: 'pointer',
                                                fontSize: '0.8rem', fontWeight: 800,
                                                boxShadow: '0 4px 14px rgba(55,22,168,0.35)',
                                                transition: 'opacity 0.15s ease',
                                                letterSpacing: '0.03em', fontFamily: 'inherit',
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                                            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                                        >
                                            <QrCode size={15} />
                                            SHOW QR CODE
                                        </button>
                                    )}
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
                    background: 'linear-gradient(145deg, #f8f7ff, #ede9fe)',
                    border: '1.5px solid rgba(55,22,168,0.12)',
                }}>
                    <div style={{
                        width: 64, height: 64, borderRadius: '20px', margin: '0 auto 16px',
                        background: 'linear-gradient(135deg, #3716a8, #6c4bff)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 8px 24px rgba(55,22,168,0.3)',
                    }}>
                        <Ticket size={28} color="white" />
                    </div>
                    <p style={{ margin: '0 0 6px', fontSize: '1rem', fontWeight: 800, color: '#0f0c1d' }}>
                        No coupons yet
                    </p>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: '#9ca3af', fontWeight: 500 }}>
                        Claim deals from your area to see them here
                    </p>
                </div>
            )}

            {isQROpen && selectedCoupon && (
                <QRModal
                    isOpen={isQROpen}
                    onClose={closeQRModal}
                    qrValue={getQrValue()}
                    couponTitle={selectedCoupon.coupons?.title}
                    showConfirmation={showConfirmation}
                />
            )}

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}