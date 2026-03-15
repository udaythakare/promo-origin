import Link from 'next/link'
import { getUserId } from '@/helpers/userHelper'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { redirect } from 'next/navigation'

export default async function InvestorPendingPage() {
    const userId = await getUserId()
    if (!userId || userId?.msg) redirect('/auth/signin')

    const { data: investor } = await supabaseAdmin
        .from('investor_profiles')
        .select('id, full_name, is_verified, rejection_reason, created_at')
        .eq('user_id', userId)
        .single()

    if (!investor) redirect('/u/profile/apply-for-investor')
    if (investor.is_verified) redirect('/investors')
    if (investor.rejection_reason) redirect('/investor-status/rejected')

    const submittedDate = new Date(investor.created_at).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'long', year: 'numeric'
    })

    return (
        <div style={{
            minHeight: '100vh',
            background: '#f8fafc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            fontFamily: 'Inter, system-ui, sans-serif',
        }}>
            <div style={{ width: '100%', maxWidth: '560px' }}>
                <div style={{
                    background: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                }}>
                    {/* Top accent — yellow investor theme */}
                    <div style={{
                        background: 'linear-gradient(135deg, #f5c518 0%, #d4a017 100%)',
                        padding: '32px 32px 28px',
                        textAlign: 'center',
                    }}>
                        <div style={{
                            width: '72px', height: '72px',
                            background: 'rgba(255,255,255,0.25)',
                            borderRadius: '50%',
                            display: 'flex', alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 16px',
                            fontSize: '32px',
                        }}>
                            ⏳
                        </div>
                        <h1 style={{
                            color: '#fff', fontSize: '22px',
                            fontWeight: 700, margin: '0 0 6px',
                        }}>
                            Investor Application Under Review
                        </h1>
                        <p style={{
                            color: 'rgba(255,255,255,0.85)',
                            fontSize: '14px', margin: 0,
                        }}>
                            Our team is reviewing your investor profile
                        </p>
                    </div>

                    {/* Body */}
                    <div style={{ padding: '28px 32px' }}>

                        {/* Investor name + date */}
                        <div style={{
                            background: '#fefce8',
                            border: '1px solid #fde68a',
                            borderLeft: '4px solid #f5c518',
                            borderRadius: '0 8px 8px 0',
                            padding: '14px 16px',
                            marginBottom: '24px',
                        }}>
                            <p style={{
                                fontSize: '11px', color: '#92400e',
                                textTransform: 'uppercase', letterSpacing: '0.08em',
                                fontWeight: 600, margin: '0 0 4px',
                            }}>
                                Investor Name
                            </p>
                            <p style={{
                                fontSize: '16px', fontWeight: 600,
                                color: '#78350f', margin: '0 0 4px',
                            }}>
                                {investor.full_name}
                            </p>
                            <p style={{ fontSize: '12px', color: '#92400e', margin: 0 }}>
                                Submitted on {submittedDate}
                            </p>
                        </div>

                        {/* Steps */}
                        <p style={{
                            fontSize: '12px', color: '#94a3b8',
                            textTransform: 'uppercase', letterSpacing: '0.08em',
                            fontWeight: 600, margin: '0 0 14px',
                        }}>
                            What happens next
                        </p>

                        <div style={{
                            display: 'flex', flexDirection: 'column',
                            gap: '12px', marginBottom: '28px',
                        }}>
                            {[
                                { step: '1', label: 'Application submitted', done: true, desc: 'Your investor profile has been received' },
                                { step: '2', label: 'Admin review in progress', done: false, active: true, desc: 'Our team is verifying your information' },
                                { step: '3', label: 'Decision notification', done: false, desc: 'You will receive an email with the outcome' },
                                { step: '4', label: 'Investor dashboard access', done: false, desc: 'Start connecting with vendors on LocalGrow' },
                            ].map((item) => (
                                <div key={item.step} style={{
                                    display: 'flex', alignItems: 'flex-start', gap: '12px',
                                }}>
                                    <div style={{
                                        width: '28px', height: '28px',
                                        borderRadius: '50%',
                                        background: item.done ? '#16a34a' : item.active ? '#f5c518' : '#f1f5f9',
                                        border: `2px solid ${item.done ? '#16a34a' : item.active ? '#f5c518' : '#e2e8f0'}`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '11px', fontWeight: 700,
                                        color: item.done ? '#fff' : item.active ? '#78350f' : '#94a3b8',
                                        flexShrink: 0, marginTop: '2px',
                                    }}>
                                        {item.done ? '✓' : item.step}
                                    </div>
                                    <div>
                                        <p style={{
                                            fontSize: '13px', fontWeight: 600,
                                            color: item.done ? '#15803d' : item.active ? '#b45309' : '#94a3b8',
                                            margin: '0 0 2px',
                                        }}>
                                            {item.label}
                                        </p>
                                        <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Info box */}
                        <div style={{
                            background: '#f0f9ff',
                            border: '1px solid #bae6fd',
                            borderRadius: '8px',
                            padding: '14px 16px',
                            marginBottom: '24px',
                            display: 'flex', gap: '10px', alignItems: 'flex-start',
                        }}>
                            <span style={{ fontSize: '16px', flexShrink: 0 }}>ℹ️</span>
                            <p style={{
                                fontSize: '13px', color: '#0369a1',
                                margin: 0, lineHeight: 1.6,
                            }}>
                                Reviews typically take <strong>1–2 business days</strong>.
                                You will receive an email notification once a decision has been made.
                            </p>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            <Link href="/" style={{
                                flex: 1, minWidth: '120px',
                                padding: '12px 16px',
                                background: '#1e3a5f', color: '#fff',
                                borderRadius: '8px', textDecoration: 'none',
                                fontSize: '13px', fontWeight: 600,
                                textAlign: 'center', display: 'block',
                            }}>
                                Go to Home
                            </Link>
                            <Link href="/u/profile" style={{
                                flex: 1, minWidth: '120px',
                                padding: '12px 16px',
                                background: '#fff', color: '#1e3a5f',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px', textDecoration: 'none',
                                fontSize: '13px', fontWeight: 600,
                                textAlign: 'center', display: 'block',
                            }}>
                                View Profile
                            </Link>
                        </div>
                    </div>
                </div>

                <p style={{
                    textAlign: 'center', fontSize: '12px',
                    color: '#94a3b8', marginTop: '16px',
                }}>
                    LocalGrow — Connecting investors with local businesses
                </p>
            </div>
        </div>
    )
}