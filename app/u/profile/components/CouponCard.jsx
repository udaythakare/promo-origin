import React, { useState } from 'react';
import {
    Calendar, Check, ChevronDown, ChevronUp,
    Gift, MapPin, QrCode, Scissors, Store,
    Tag, Timer, Users, X, Zap
} from 'lucide-react';
import { joinAddress } from '@/utils/addressUtils';
import ClaimsCounter from '@/app/business/dashboard/coupons/components/ClaimCounter';

export const CouponCard = ({
    coupon,
    index,
    isClaimed,
    claimingStatus,
    session,
    onClaimClick,
    onShowQR,
    onToggleDetails,
    userId
}) => {
    const [detailsOpen, setDetailsOpen] = useState(false);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Invalid Date';
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        } catch {
            return 'Invalid Date';
        }
    };

    const getProgressBarWidth = (current, max) => {
        if (!current || !max || max <= 0) return '0%';
        return `${Math.min((current / max) * 100, 100)}%`;
    };

    const getProgressColor = (current, max) => {
        if (!current || !max) return '#3716a8';
        const ratio = current / max;
        if (ratio >= 0.9) return '#dc2626';
        if (ratio >= 0.6) return '#d97706';
        return '#3716a8';
    };

    const handleToggleDetails = () => {
        setDetailsOpen(!detailsOpen);
        if (onToggleDetails) onToggleDetails(coupon.id);
    };

    const location = coupon?.businesses?.business_locations?.[0] || null;
    const isFullyClaimed = coupon.current_claims >= coupon.max_claims;
    const isClaiming = claimingStatus === 'claiming';
    const isInStore = coupon.coupon_type === 'redeem_at_store';

    return (
        <div style={{
            background: 'white',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 2px 12px rgba(55,22,168,0.08), 0 1px 3px rgba(0,0,0,0.06)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: "'Outfit', 'DM Sans', sans-serif",
            border: '1px solid rgba(55,22,168,0.1)',
            position: 'relative',
        }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 8px 28px rgba(55,22,168,0.15), 0 2px 6px rgba(0,0,0,0.08)';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 12px rgba(55,22,168,0.08), 0 1px 3px rgba(0,0,0,0.06)';
            }}
        >
            {/* Top accent bar */}
            <div style={{
                height: '5px',
                background: isClaimed
                    ? 'linear-gradient(90deg, #059669, #10b981)'
                    : 'linear-gradient(90deg, #3716a8, #6c4bff)',
                flexShrink: 0,
            }} />

            {/* Card Body */}
            <div style={{ padding: '14px 16px 0', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>

                {/* Header row: business + badge */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px', minWidth: 0 }}>
                        <div style={{
                            width: 32, height: 32, borderRadius: '8px', flexShrink: 0,
                            background: 'linear-gradient(135deg, #3716a8, #6c4bff)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <Store size={15} color="white" />
                        </div>
                        <span style={{
                            fontSize: '0.78rem', fontWeight: 700,
                            color: '#3716a8', truncate: true,
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                            maxWidth: '140px',
                        }}>
                            {coupon?.businesses?.name || 'Business'}
                        </span>
                    </div>

                    {/* Type badge */}
                    <span style={{
                        fontSize: '0.65rem', fontWeight: 800,
                        padding: '3px 8px', borderRadius: '20px', flexShrink: 0,
                        letterSpacing: '0.04em', textTransform: 'uppercase',
                        background: isInStore ? 'rgba(55,22,168,0.08)' : 'rgba(5,150,105,0.08)',
                        color: isInStore ? '#3716a8' : '#059669',
                        border: `1px solid ${isInStore ? 'rgba(55,22,168,0.2)' : 'rgba(5,150,105,0.2)'}`,
                    }}>
                        {isInStore ? '🏪 In-Store' : '🌐 Online'}
                    </span>
                </div>

                {/* Title */}
                <h3 style={{
                    fontSize: '1rem', fontWeight: 800,
                    color: '#0f0c1d', margin: 0, lineHeight: 1.3,
                    display: '-webkit-box', WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}>
                    {coupon.title}
                </h3>

                {/* Description */}
                <p style={{
                    fontSize: '0.8rem', color: '#6b7280',
                    margin: 0, lineHeight: 1.5,
                    display: '-webkit-box',
                    WebkitLineClamp: detailsOpen ? 'unset' : 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: detailsOpen ? 'visible' : 'hidden',
                }}>
                    {coupon.description || 'No description available'}
                </p>

                {/* Address */}
                {location && (
                    <div style={{
                        display: 'flex', alignItems: 'flex-start', gap: '5px',
                        padding: '7px 10px', borderRadius: '8px',
                        background: 'rgba(55,22,168,0.04)',
                        border: '1px solid rgba(55,22,168,0.1)',
                    }}>
                        <MapPin size={12} color="#3716a8" style={{ flexShrink: 0, marginTop: 2 }} />
                        <span style={{
                            fontSize: '0.72rem', color: '#4b5563',
                            lineHeight: 1.4, fontWeight: 500,
                        }}>
                            {[location.address, location.area, location.city, location.state]
                                .filter(Boolean).join(', ')}
                        </span>
                    </div>
                )}

                {/* Expanded details */}
                {detailsOpen && (
                    <div style={{
                        padding: '10px', borderRadius: '10px',
                        background: 'rgba(55,22,168,0.03)',
                        border: '1px solid rgba(55,22,168,0.1)',
                        display: 'flex', flexDirection: 'column', gap: '6px',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{
                                fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase',
                                letterSpacing: '0.06em', color: 'white',
                                background: '#3716a8', padding: '2px 7px', borderRadius: '4px',
                            }}>Redemption</span>
                            <span style={{ fontSize: '0.78rem', color: '#374151', fontWeight: 600 }}>
                                {isInStore ? 'Visit the store to redeem' : 'Redeem online'}
                            </span>
                        </div>
                        {location && (
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                                <span style={{
                                    fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase',
                                    letterSpacing: '0.06em', color: 'white',
                                    background: '#3716a8', padding: '2px 7px', borderRadius: '4px', flexShrink: 0,
                                }}>Address</span>
                                <span style={{ fontSize: '0.78rem', color: '#374151', fontWeight: 500 }}>
                                    {joinAddress(location)}
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {/* Dashed divider (coupon cut-line) */}
                <div style={{
                    borderTop: '1.5px dashed rgba(55,22,168,0.15)',
                    margin: '2px 0',
                    position: 'relative',
                }}>
                    <span style={{
                        position: 'absolute', left: -16, top: '50%',
                        transform: 'translateY(-50%)',
                        width: 12, height: 12, borderRadius: '50%',
                        background: '#f8f7ff',
                        border: '1.5px dashed rgba(55,22,168,0.2)',
                    }} />
                    <span style={{
                        position: 'absolute', right: -16, top: '50%',
                        transform: 'translateY(-50%)',
                        width: 12, height: 12, borderRadius: '50%',
                        background: '#f8f7ff',
                        border: '1.5px dashed rgba(55,22,168,0.2)',
                    }} />
                </div>

                {/* Date + Claims row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={11} color="#9ca3af" />
                        <span style={{ fontSize: '0.7rem', color: '#9ca3af', fontWeight: 600 }}>
                            Expires {formatDate(coupon.end_date)}
                        </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Users size={11} color="#9ca3af" />
                        <span style={{ fontSize: '0.7rem', color: '#9ca3af', fontWeight: 600 }}>
                            {coupon.current_claims || 0}/{coupon.max_claims || 0} claimed
                        </span>
                    </div>
                </div>

                {/* Progress bar */}
                <div style={{
                    height: '4px', borderRadius: '99px',
                    background: 'rgba(55,22,168,0.08)',
                    overflow: 'hidden',
                }}>
                    <div style={{
                        height: '100%',
                        width: getProgressBarWidth(coupon.current_claims, coupon.max_claims),
                        background: `linear-gradient(90deg, ${getProgressColor(coupon.current_claims, coupon.max_claims)}, #6c4bff)`,
                        borderRadius: '99px',
                        transition: 'width 0.4s ease',
                    }} />
                </div>

                {/* ClaimsCounter */}
                <div style={{ fontSize: '0.72rem', color: '#6b7280' }}>
                    <ClaimsCounter
                        couponId={coupon.id}
                        initialCount={coupon.current_claims}
                        maxClaims={coupon.max_claims}
                        userId={userId}
                    />
                </div>
            </div>

            {/* Footer */}
            <div style={{ padding: '10px 16px 14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>

                {/* Toggle details */}
                <button
                    onClick={handleToggleDetails}
                    style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        gap: '4px', padding: '5px',
                        background: 'none', border: 'none', cursor: 'pointer',
                        fontSize: '0.75rem', fontWeight: 700,
                        color: '#3716a8', fontFamily: 'inherit',
                    }}
                >
                    {detailsOpen ? <><ChevronUp size={14} /> Hide Details</> : <><ChevronDown size={14} /> View Details</>}
                </button>

                {/* Action buttons */}
                {isClaimed ? (
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button disabled style={{
                            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            gap: '6px', padding: '9px 12px', borderRadius: '10px',
                            background: 'linear-gradient(135deg, #059669, #10b981)',
                            border: 'none', color: 'white',
                            fontSize: '0.78rem', fontWeight: 800, cursor: 'not-allowed',
                            letterSpacing: '0.03em',
                        }}>
                            <Check size={14} /> CLAIMED
                        </button>
                        <button
                            onClick={() => onShowQR(coupon)}
                            style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                gap: '6px', padding: '9px 14px', borderRadius: '10px',
                                background: 'white', color: '#3716a8',
                                border: '2px solid #3716a8', cursor: 'pointer',
                                fontSize: '0.78rem', fontWeight: 800,
                                transition: 'all 0.15s ease', fontFamily: 'inherit',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#3716a8'; e.currentTarget.style.color = 'white'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#3716a8'; }}
                        >
                            <QrCode size={14} /> QR
                        </button>
                    </div>

                ) : isFullyClaimed ? (
                    <button disabled style={{
                        width: '100%', padding: '9px', borderRadius: '10px',
                        background: '#f3f4f6', border: '1.5px solid #e5e7eb',
                        color: '#9ca3af', fontSize: '0.78rem', fontWeight: 800,
                        cursor: 'not-allowed', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', gap: '6px',
                    }}>
                        <X size={14} /> FULLY CLAIMED
                    </button>

                ) : isClaiming ? (
                    <button disabled style={{
                        width: '100%', padding: '9px', borderRadius: '10px',
                        background: 'rgba(55,22,168,0.06)', border: '2px solid rgba(55,22,168,0.2)',
                        color: '#3716a8', fontSize: '0.78rem', fontWeight: 800,
                        cursor: 'wait', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', gap: '6px',
                    }}>
                        <div style={{
                            width: 14, height: 14, border: '2px solid rgba(55,22,168,0.3)',
                            borderTopColor: '#3716a8', borderRadius: '50%',
                            animation: 'cc-spin 0.7s linear infinite',
                        }} />
                        CLAIMING...
                    </button>

                ) : (
                    <button
                        onClick={() => onClaimClick(coupon)}
                        disabled={!session}
                        style={{
                            width: '100%', padding: '9px', borderRadius: '10px',
                            background: !session
                                ? '#f3f4f6'
                                : 'linear-gradient(135deg, #3716a8, #6c4bff)',
                            border: 'none',
                            color: !session ? '#9ca3af' : 'white',
                            fontSize: '0.78rem', fontWeight: 800,
                            cursor: !session ? 'not-allowed' : 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            gap: '6px', transition: 'opacity 0.15s ease',
                            boxShadow: !session ? 'none' : '0 4px 14px rgba(55,22,168,0.35)',
                            letterSpacing: '0.03em', fontFamily: 'inherit',
                        }}
                        onMouseEnter={e => { if (session) e.currentTarget.style.opacity = '0.9'; }}
                        onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
                    >
                        <Scissors size={14} />
                        {!session ? 'SIGN IN TO CLAIM' : 'CLAIM NOW'}
                    </button>
                )}
            </div>

            <style>{`@keyframes cc-spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};