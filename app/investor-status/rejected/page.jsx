import Link from 'next/link'
import { getUserId } from '@/helpers/userHelper'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { redirect } from 'next/navigation'

export default async function InvestorRejectedPage() {
    const userId = await getUserId()
    if (!userId || userId?.msg) redirect('/auth/signin')

    const { data: investor } = await supabaseAdmin
        .from('investor_profiles')
        .select('id, full_name, is_verified, rejection_reason, created_at')
        .eq('user_id', userId)
        .single()

    if (!investor) redirect('/u/profile/apply-for-investor')
    if (investor.is_verified) redirect('/investors')
    if (!investor.rejection_reason) redirect('/investor-status/pending')

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
                    {/* Top accent */}
                    <div style={{
                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                        padding: '32px 32px 28px',
                        textAlign: 'center',
                    }}>
                        <div style={{
                            width: '72px', height: '72px',
                            background: 'rgba(255,255,255,0.2)',
                            borderRadius: '50%',
                            display: 'flex', alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 16px',
                            fontSize: '32px',
                        }}>
                            ❌
                        </div>
                        <h1 style={{
                            color: '#fff', fontSize: '22px',
                            fontWeight: 700, margin: '0 0 6px',
                        }}>
                            Investor Application Not Approved
                        </h1>
                        <p style={{
                            color: 'rgba(255,255,255,0.85)',
                            fontSize: '14px', margin: 0,
                        }}>
                            Unfortunately your application was not accepted
                        </p>
                    </div>

                    {/* Body */}
                    <div style={{ padding: '28px 32px' }}>

                        {/* Name */}
                        <div style={{
                            background: '#fef2f2',
                            border: '1px solid #fecaca',
                            borderLeft: '4px solid #ef4444',
                            borderRadius: '0 8px 8px 0',
                            padding: '14px 16px',
                            marginBottom: '20px',
                        }}>
                            <p style={{
                                fontSize: '11px', color: '#b91c1c',
                                textTransform: 'uppercase', letterSpacing: '0.08em',
                                fontWeight: 600, margin: '0 0 4px',
                            }}>
                                Investor Name
                            </p>
                            <p style={{
                                fontSize: '16px', fontWeight: 600,
                                color: '#7f1d1d', margin: 0,
                            }}>
                                {investor.full_name}
                            </p>
                        </div>

                        {/* Rejection reason */}
                        <div style={{
                            background: '#fef2f2',
                            border: '1px solid #fecaca',
                            borderRadius: '8px',
                            padding: '16px',
                            marginBottom: '20px',
                        }}>
                            <p style={{
                                fontSize: '11px', color: '#b91c1c',
                                textTransform: 'uppercase', letterSpacing: '0.08em',
                                fontWeight: 600, margin: '0 0 8px',
                            }}>
                                Reason for rejection
                            </p>
                            <p style={{
                                fontSize: '14px', color: '#dc2626',
                                margin: 0, lineHeight: 1.6,
                            }}>
                                {investor.rejection_reason}
                            </p>
                        </div>

                        {/* What to do */}
                        <div style={{
                            background: '#f0fdf4',
                            border: '1px solid #bbf7d0',
                            borderRadius: '8px',
                            padding: '14px 16px',
                            marginBottom: '24px',
                            display: 'flex', gap: '10px', alignItems: 'flex-start',
                        }}>
                            <span style={{ fontSize: '16px', flexShrink: 0 }}>💡</span>
                            <p style={{
                                fontSize: '13px', color: '#15803d',
                                margin: 0, lineHeight: 1.6,
                            }}>
                                You can review the rejection reason above, make the necessary
                                corrections, and <strong>submit a new application</strong>.
                            </p>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            <Link href="/u/profile/apply-for-investor" style={{
                                flex: 1, minWidth: '140px',
                                padding: '12px 16px',
                                background: '#1e3a5f', color: '#fff',
                                borderRadius: '8px', textDecoration: 'none',
                                fontSize: '13px', fontWeight: 600,
                                textAlign: 'center', display: 'block',
                            }}>
                                Reapply Now
                            </Link>
                            <Link href="/" style={{
                                flex: 1, minWidth: '140px',
                                padding: '12px 16px',
                                background: '#fff', color: '#64748b',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px', textDecoration: 'none',
                                fontSize: '13px', fontWeight: 600,
                                textAlign: 'center', display: 'block',
                            }}>
                                Go to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}