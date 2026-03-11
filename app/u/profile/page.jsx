import Link from "next/link";
import React from "react";
import { getUser, getUserRolesFromDB } from "@/helpers/userHelper";
import LocationSection from "./components/LocationSection";
import {
    ChevronRight, Settings, User, Briefcase,
    TrendingUp, LogIn, IdCard, Sparkles, Shield,
} from "lucide-react";
import LogoutButton from "./components/LogoutButton";
import PersonalInfoSection from "./components/PersonalInfoSection";

export default async function Page() {
    const user = await getUser();

    if (user.msg) {
        return (
            <>
                <style>{`
                    @keyframes pp-fadeUp {
                        from { opacity:0; transform:translateY(24px); }
                        to   { opacity:1; transform:translateY(0); }
                    }
                    .pp-auth { animation: pp-fadeUp 0.5s ease forwards; }
                `}</style>
                <div style={{
                    minHeight: '100vh', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    background: 'linear-gradient(135deg, #f0eeff 0%, #e8e0ff 100%)',
                    fontFamily: "'Outfit','DM Sans',sans-serif",
                    padding: '20px',
                }}>
                    <div className="pp-auth" style={{
                        background: 'white', padding: '40px 32px',
                        borderRadius: '24px', textAlign: 'center',
                        border: '1.5px solid rgba(55,22,168,0.12)',
                        boxShadow: '0 20px 60px rgba(55,22,168,0.14)',
                        maxWidth: '380px', width: '100%',
                    }}>
                        <div style={{
                            width: 64, height: 64, borderRadius: '18px', margin: '0 auto 20px',
                            background: 'linear-gradient(135deg, #3716a8, #6c4bff)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 8px 24px rgba(55,22,168,0.38)',
                        }}>
                            <Shield size={28} color="white" />
                        </div>
                        <h2 style={{ margin: '0 0 8px', fontSize: '1.3rem', fontWeight: 900, color: '#0f0c1d' }}>
                            Not Logged In
                        </h2>
                        <p style={{ margin: '0 0 24px', fontSize: '0.85rem', color: '#9ca3af', fontWeight: 500, lineHeight: 1.6 }}>
                            Please sign in to access your profile and settings
                        </p>
                        <Link href="/login" style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            padding: '12px 28px', borderRadius: '12px',
                            background: 'linear-gradient(135deg, #3716a8, #6c4bff)',
                            color: 'white', fontWeight: 800, fontSize: '0.85rem',
                            textDecoration: 'none', letterSpacing: '0.05em',
                            boxShadow: '0 6px 20px rgba(55,22,168,0.4)',
                        }}>
                            <LogIn size={16} /> LOGIN HERE
                        </Link>
                    </div>
                </div>
            </>
        );
    }

    const userRoles      = await getUserRolesFromDB(user.id);
    const isBusinessOwner = userRoles.includes("app_business_owner");
    const isInvestor      = userRoles.includes("app_investor");

    return (
        <>
        <style>{`
            *, *::before, *::after { box-sizing: border-box; }

            @keyframes pp-fadeUp {
                from { opacity:0; transform:translateY(22px); }
                to   { opacity:1; transform:translateY(0); }
            }
            @keyframes pp-shimmer {
                0%   { background-position: -600px 0; }
                100% { background-position:  600px 0; }
            }
            @keyframes pp-float {
                0%,100% { transform:translateY(0); }
                50%     { transform:translateY(-5px); }
            }
            @keyframes pp-pulse {
                0%,100% { box-shadow: 0 6px 20px rgba(55,22,168,0.32); }
                50%     { box-shadow: 0 6px 28px rgba(55,22,168,0.55); }
            }

            .pp-c0 { animation: pp-fadeUp 0.4s ease 0.05s both; }
            .pp-c1 { animation: pp-fadeUp 0.4s ease 0.13s both; }
            .pp-c2 { animation: pp-fadeUp 0.4s ease 0.21s both; }
            .pp-c3 { animation: pp-fadeUp 0.4s ease 0.29s both; }
            .pp-c4 { animation: pp-fadeUp 0.4s ease 0.37s both; }

            .pp-shimmer-bar {
                height: 5px;
                background: linear-gradient(
                    90deg,
                    #3716a8 0%, #6c4bff 25%, #a78bfa 50%, #6c4bff 75%, #3716a8 100%
                );
                background-size: 600px 100%;
                animation: pp-shimmer 2.8s linear infinite;
            }

            .pp-role-card {
                transition: transform 0.22s ease, box-shadow 0.22s ease;
            }
            .pp-role-card:hover { transform: translateY(-5px); }

            .pp-role-link {
                transition: background 0.18s ease, transform 0.15s ease, padding-right 0.15s ease !important;
            }
            .pp-role-link:hover {
                background: rgba(255,255,255,0.25) !important;
                transform: translateX(5px) !important;
            }

            .pp-section-card {
                transition: transform 0.22s ease, box-shadow 0.22s ease;
            }
            .pp-section-card:hover {
                transform: translateY(-3px);
                box-shadow: 0 14px 44px rgba(55,22,168,0.13) !important;
            }

            .pp-settings-btn {
                transition: all 0.18s ease;
            }
            .pp-settings-btn:hover {
                background: linear-gradient(135deg,#3716a8,#6c4bff) !important;
                color: white !important;
                border-color: transparent !important;
                box-shadow: 0 4px 16px rgba(55,22,168,0.38) !important;
            }

            .pp-avatar { animation: pp-pulse 3s ease-in-out infinite; }
            .pp-sparkle { animation: pp-float 2.6s ease-in-out infinite; }

            /* ── Responsive ────────────────────── */
            .pp-wrap { max-width: 860px; margin: 0 auto; padding: 0 24px; }
            .pp-header-inner {
                display: flex; align-items: center;
                justify-content: space-between; gap: 16px; flex-wrap: wrap;
            }
            .pp-actions { display: flex; gap: 8px; flex-wrap: wrap; }

            @media (max-width: 480px) {
                .pp-wrap { padding: 0 12px; }
                .pp-header-inner { flex-direction: column; align-items: flex-start; }
                .pp-actions { width: 100%; justify-content: flex-end; }
                .pp-username { font-size: 1rem !important; }
            }
            @media (min-width: 481px) and (max-width: 640px) {
                .pp-wrap { padding: 0 16px; }
            }
        `}</style>

        <div style={{
            minHeight: '100vh',
            background: '#f0eeff',
            fontFamily: "'Outfit','DM Sans',sans-serif",
            position: 'relative', overflowX: 'hidden',
        }}>

            {/* Decorative background blobs */}
            <div aria-hidden style={{
                position: 'fixed', top: -140, right: -140, width: 520, height: 520,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(108,75,255,0.13) 0%, transparent 70%)',
                pointerEvents: 'none', zIndex: 0,
            }} />
            <div aria-hidden style={{
                position: 'fixed', bottom: -120, left: -120, width: 440, height: 440,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(55,22,168,0.1) 0%, transparent 70%)',
                pointerEvents: 'none', zIndex: 0,
            }} />

            <div style={{ position: 'relative', zIndex: 1, padding: 'clamp(16px,3vw,28px) 0 clamp(32px,5vw,56px)' }}>
                <div className="pp-wrap">

                    {/* ════════════════════════════════════════
                        PROFILE HEADER
                    ════════════════════════════════════════ */}
                    <div className="pp-c0" style={{
                        background: 'white', borderRadius: '22px',
                        border: '1.5px solid rgba(55,22,168,0.1)',
                        boxShadow: '0 4px 32px rgba(55,22,168,0.1)',
                        overflow: 'hidden', marginBottom: '20px',
                    }}>
                        <div className="pp-shimmer-bar" />

                        <div className="pp-header-inner" style={{ padding: 'clamp(14px,2.5vw,22px) clamp(16px,3vw,28px)' }}>

                            {/* Avatar + info */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(12px,2vw,18px)' }}>
                                <div className="pp-avatar" style={{
                                    width: 'clamp(46px,6vw,58px)', height: 'clamp(46px,6vw,58px)',
                                    borderRadius: '15px', flexShrink: 0,
                                    background: 'linear-gradient(135deg, #3716a8, #6c4bff)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <User size={24} color="white" />
                                </div>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                        <h1 className="pp-username" style={{
                                            margin: 0,
                                            fontSize: 'clamp(1rem,2.5vw,1.18rem)',
                                            fontWeight: 900, color: '#0f0c1d', letterSpacing: '-0.02em',
                                        }}>
                                            {user.username}
                                        </h1>
                                        <span style={{
                                            fontSize: '0.58rem', fontWeight: 800, padding: '2px 8px',
                                            borderRadius: '20px', letterSpacing: '0.07em',
                                            background: 'linear-gradient(90deg,rgba(55,22,168,0.09),rgba(108,75,255,0.09))',
                                            color: '#3716a8', border: '1px solid rgba(55,22,168,0.16)',
                                        }}>MEMBER</span>
                                    </div>
                                    <p style={{
                                        margin: '3px 0 8px',
                                        fontSize: 'clamp(0.72rem,1.5vw,0.8rem)',
                                        color: '#9ca3af', fontWeight: 500,
                                    }}>
                                        {user.email}
                                    </p>
                                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                        {isBusinessOwner && (
                                            <span style={{
                                                fontSize: '0.58rem', fontWeight: 800, padding: '3px 9px',
                                                borderRadius: '20px', letterSpacing: '0.05em',
                                                background: 'rgba(55,22,168,0.07)', color: '#3716a8',
                                                border: '1px solid rgba(55,22,168,0.16)',
                                                display: 'inline-flex', alignItems: 'center', gap: '4px',
                                            }}>
                                                <IdCard size={9} /> BUSINESS OWNER
                                            </span>
                                        )}
                                        {isInvestor && (
                                            <span style={{
                                                fontSize: '0.58rem', fontWeight: 800, padding: '3px 9px',
                                                borderRadius: '20px', letterSpacing: '0.05em',
                                                background: 'rgba(5,150,105,0.07)', color: '#059669',
                                                border: '1px solid rgba(5,150,105,0.16)',
                                                display: 'inline-flex', alignItems: 'center', gap: '4px',
                                            }}>
                                                <TrendingUp size={9} /> INVESTOR
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="pp-actions">
                                <button className="pp-settings-btn" style={{
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    padding: '9px 16px', borderRadius: '11px',
                                    background: '#f8f7ff', border: '1.5px solid rgba(55,22,168,0.15)',
                                    color: '#3716a8', fontSize: '0.76rem', fontWeight: 800,
                                    cursor: 'pointer', letterSpacing: '0.04em', fontFamily: 'inherit',
                                }}>
                                    <Settings size={14} /> SETTINGS
                                </button>
                                <LogoutButton />
                            </div>
                        </div>
                    </div>

                    {/* ════════════════════════════════════════
                        ROLE CARDS + SECTIONS
                    ════════════════════════════════════════ */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        {/* Business Dashboard */}
                        {isBusinessOwner && (
                            <div className="pp-role-card pp-c1" style={{
                                borderRadius: '20px',
                                background: 'linear-gradient(135deg, #3716a8 0%, #5b30e0 55%, #6c4bff 100%)',
                                boxShadow: '0 8px 36px rgba(55,22,168,0.32)',
                                overflow: 'hidden', position: 'relative',
                                border: '1px solid rgba(255,255,255,0.1)',
                            }}>
                                <BlobDeco />
                                <RoleCardInner
                                    icon={<IdCard size={20} color="white" />}
                                    title="Business Dashboard"
                                    desc="Manage your listings, promotions and analytics"
                                    href="/business/dashboard"
                                    label="MANAGE YOUR BUSINESS"
                                />
                            </div>
                        )}

                        {/* Investor / Apply */}
                        {isInvestor ? (
                            <div className="pp-role-card pp-c2" style={{
                                borderRadius: '20px',
                                background: 'linear-gradient(135deg, #047857 0%, #059669 55%, #10b981 100%)',
                                boxShadow: '0 8px 36px rgba(5,150,105,0.28)',
                                overflow: 'hidden', position: 'relative',
                                border: '1px solid rgba(255,255,255,0.1)',
                            }}>
                                <BlobDeco />
                                <RoleCardInner
                                    icon={<TrendingUp size={20} color="white" />}
                                    title="Investment Dashboard"
                                    desc="Track your ROI, investments and vendor connections"
                                    href="/investors"
                                    label="MANAGE YOUR INVESTMENTS"
                                />
                            </div>
                        ) : (
                            <div className="pp-role-card pp-c2" style={{
                                borderRadius: '20px',
                                background: 'linear-gradient(135deg, #0369a1 0%, #0ea5e9 60%, #38bdf8 100%)',
                                boxShadow: '0 8px 36px rgba(14,165,233,0.26)',
                                overflow: 'hidden', position: 'relative',
                                border: '1px solid rgba(255,255,255,0.1)',
                            }}>
                                <BlobDeco />
                                <RoleCardInner
                                    icon={<Briefcase size={20} color="white" />}
                                    title="Become an Investor"
                                    desc="Invest in local businesses and grow your capital"
                                    href="/u/profile/apply-for-investor"
                                    label="APPLY AS INVESTOR"
                                    extra={
                                        <div className="pp-sparkle" style={{ marginLeft: 'auto' }}>
                                            <Sparkles size={18} color="rgba(255,255,255,0.55)" />
                                        </div>
                                    }
                                />
                            </div>
                        )}

                        {/* Personal Info */}
                        <div className="pp-section-card pp-c3" style={{
                            background: 'white', borderRadius: '20px',
                            border: '1.5px solid rgba(55,22,168,0.1)',
                            boxShadow: '0 4px 20px rgba(55,22,168,0.08)',
                            overflow: 'hidden',
                        }}>
                            <div className="pp-shimmer-bar" />
                            <div style={{ padding: 'clamp(16px,3vw,24px)' }}>
                                <PersonalInfoSection userData={user} />
                            </div>
                        </div>

                        {/* Location */}
                        <div className="pp-section-card pp-c4" style={{
                            background: 'white', borderRadius: '20px',
                            border: '1.5px solid rgba(55,22,168,0.1)',
                            boxShadow: '0 4px 20px rgba(55,22,168,0.08)',
                            overflow: 'hidden', marginBottom: '8px',
                        }}>
                            <div className="pp-shimmer-bar" />
                            <div style={{ padding: 'clamp(16px,3vw,24px)' }}>
                                <LocationSection userData={user} />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
        </>
    );
}

// ── Decorative blob overlay for role cards ────────────────────────────────────
function BlobDeco() {
    return (
        <>
            <div aria-hidden style={{
                position: 'absolute', top: -50, right: -50,
                width: 180, height: 180, borderRadius: '50%',
                background: 'rgba(255,255,255,0.06)', pointerEvents: 'none',
            }} />
            <div aria-hidden style={{
                position: 'absolute', bottom: -30, right: 100,
                width: 110, height: 110, borderRadius: '50%',
                background: 'rgba(255,255,255,0.04)', pointerEvents: 'none',
            }} />
        </>
    );
}

// ── Role card inner content ───────────────────────────────────────────────────
function RoleCardInner({ icon, title, desc, href, label, extra }) {
    return (
        <div style={{ padding: 'clamp(18px,3vw,26px)', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <div style={{
                    width: 44, height: 44, borderRadius: '13px', flexShrink: 0,
                    background: 'rgba(255,255,255,0.18)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    {icon}
                </div>
                <div style={{ flex: 1 }}>
                    <h2 style={{
                        margin: 0,
                        fontSize: 'clamp(0.92rem,2.5vw,1.08rem)',
                        fontWeight: 900, color: 'white', letterSpacing: '-0.01em',
                    }}>
                        {title}
                    </h2>
                    <p style={{
                        margin: '2px 0 0',
                        fontSize: 'clamp(0.7rem,1.8vw,0.76rem)',
                        color: 'rgba(255,255,255,0.7)', fontWeight: 500,
                    }}>
                        {desc}
                    </p>
                </div>
                {extra}
            </div>
            <Link href={href} className="pp-role-link" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 16px', borderRadius: '12px',
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.24)',
                color: 'white', fontWeight: 800,
                fontSize: 'clamp(0.72rem,1.8vw,0.8rem)',
                letterSpacing: '0.05em', textDecoration: 'none',
            }}>
                {label}
                <ChevronRight size={16} />
            </Link>
        </div>
    );
}