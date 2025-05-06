import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getServerSession } from 'next-auth';
import { options } from '@/app/api/auth/[...nextauth]/options';
import { NextResponse } from 'next/server';

// Cache the server session to avoid redundant authentication
let cachedSession = null;
let sessionExpiry = 0;
const SESSION_TTL = 60 * 1000; // 1 minute cache

// Helper function to get authenticated user ID with caching
async function getAuthenticatedUserId(req) {
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

// GET handler for fetching user data
export async function GET(request) {
    try {
        const userId = await getAuthenticatedUserId();
        if (!userId) {
            return NextResponse.json(
                { success: false, message: 'Login first' },
                { status: 401 }
            );
        }

        // Use single query with optimized selection
        const { data: user, error } = await supabaseAdmin
            .from('users')
            .select('id, email, username, created_at') // Select only needed fields
            .eq('id', userId)
            .single();

        if (error) {
            console.error('fetchUserData error:', error);
            return NextResponse.json(
                {
                    success: false,
                    message: 'Could not fetch user data',
                    error: error.message
                },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, user });
    } catch (err) {
        console.error('Unexpected error in fetchUserData:', err);
        return NextResponse.json(
            { success: false, message: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}