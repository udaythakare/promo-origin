'use client'
import { handleLogout } from '@/utils/authUtils'
import { LogOut } from 'lucide-react'
import React from 'react'

const LogoutButton = () => {
    return (
        <button
            onClick={() => handleLogout({ redirectUrl: '/auth/signin' })}
            style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 16px', borderRadius: '10px',
                background: 'white',
                border: '1.5px solid rgba(55,22,168,0.25)',
                color: '#3716a8',
                fontSize: '0.78rem', fontWeight: 800,
                cursor: 'pointer', letterSpacing: '0.04em',
                fontFamily: "'Outfit','DM Sans',sans-serif",
                transition: 'all 0.15s ease',
                boxShadow: '0 2px 8px rgba(55,22,168,0.08)',
            }}
            onMouseEnter={e => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #3716a8, #6c4bff)';
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(55,22,168,0.35)';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.color = '#3716a8';
                e.currentTarget.style.borderColor = 'rgba(55,22,168,0.25)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(55,22,168,0.08)';
            }}
        >
            <LogOut size={15} />
            LOGOUT
        </button>
    )
}

export default LogoutButton