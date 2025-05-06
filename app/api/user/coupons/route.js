import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getServerSession } from 'next-auth';
import { options } from '@/app/api/auth/[...nextauth]/options';
import { NextResponse } from 'next/server';

// Cache the server session to avoid redundant authentication
let cachedSession = null;
let sessionExpiry = 0;
const SESSION_TTL = 60 * 1000; // 1 minute cache

// Helper function to get authenticated user ID with caching
async function getAuthenticatedUserId() {
    const now = Date.now();

    // Use cached session if still valid
    if (cachedSession && now < sessionExpiry) {
        return cachedSession.user.id;
    }

    // Otherwise fetch new session
    const session = await getServerSession(options);
    if (!session) {
        return null;
    }

    // Update cache
    cachedSession = session;
    sessionExpiry = now + SESSION_TTL;

    return session.user.id;
}

// GET handler for fetching user coupons
export async function GET(request) {
    try {
        const userId = await getAuthenticatedUserId();
        if (!userId) {
            return NextResponse.json(
                { success: false, message: 'Login first', coupons: [] },
                { status: 401 }
            );
        }

        // Use prepared statement for better performance
        const { data, error } = await supabaseAdmin.rpc('get_active_user_coupons', {
            user_id_param: userId
        });

        if (error) {
            console.error('fetchUserCoupons error:', error);
            return NextResponse.json(
                {
                    success: false,
                    message: 'Could not fetch your coupons',
                    error: error.message,
                    coupons: [],
                },
                { status: 500 }
            );
        }

        // Return already processed data from the stored procedure
        return NextResponse.json({
            success: true,
            coupons: data || [],
        });
    } catch (err) {
        console.error('Unexpected error in fetchUserCoupons:', err);
        return NextResponse.json(
            { success: false, message: 'An unexpected error occurred', coupons: [] },
            { status: 500 }
        );
    }
}