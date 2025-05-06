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

// PUT handler for updating user location
export async function PUT(request) {
    try {
        const userId = await getAuthenticatedUserId();
        if (!userId) {
            return NextResponse.json(
                { success: false, message: 'Login first' },
                { status: 401 }
            );
        }

        // Parse the request body
        const locationData = await request.json();

        // Validate in one step with early return
        const requiredFields = ['address', 'city', 'state', 'postal_code'];
        const missingField = requiredFields.find(field => !locationData[field]);
        if (missingField) {
            return NextResponse.json(
                { success: false, error: `${missingField} is required` },
                { status: 400 }
            );
        }

        // Use a single upsert operation instead of checking first
        const { error } = await supabaseAdmin
            .from('user_locations')
            .upsert(
                {
                    user_id: userId,
                    address: locationData.address,
                    city: locationData.city,
                    state: locationData.state,
                    postal_code: locationData.postal_code,
                    is_primary: true,
                    area: locationData.area || null,
                    updated_at: new Date().toISOString()
                },
                { onConflict: 'user_id' }
            );

        if (error) {
            throw new Error(`Database error: ${error.message}`);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating user location:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}