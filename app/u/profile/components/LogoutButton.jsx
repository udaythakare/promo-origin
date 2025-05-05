'use client'
import { handleLogout } from '@/utils/authUtils'
import { LogOut } from 'lucide-react'
import React from 'react'

const LogoutButton = () => {
    return (
        <button onClick={() => handleLogout({ redirectUrl: '/login' })} className="bg-red-400 text-black font-bold px-3 py-2 border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center">
            <LogOut className="h-5 w-5 mr-1" />
            <span className="hidden xs:inline">LOGOUT</span>
        </button>
    )
}

export default LogoutButton
