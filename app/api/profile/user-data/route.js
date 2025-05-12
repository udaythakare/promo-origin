import { NextResponse } from 'next/server';
import { getUserId } from '@/helpers/userHelper';
import { supabaseAdmin } from '@/lib/supabaseAdmin';



export async function GET() {
    const startTime = Date.now(); // Start timing

    try {
        const userId = await getUserId();
        if (!userId) {
            const elapsed = Date.now() - startTime;
            console.log(`Request completed in ${elapsed}ms (User not logged in)`);
            return NextResponse.json({ success: false, message: 'User not logged in' }, { status: 401 });
        }

        const { data, error } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('id', userId)
            .single(); // Fetch single user data

        if (error) {
            console.error('Error fetching user info:', error);
            const elapsed = Date.now() - startTime;
            console.log(`Request completed in ${elapsed}ms (Supabase error)`);
            return NextResponse.json({ success: false, error }, { status: 500 });
        }

        const elapsed = Date.now() - startTime;
        console.log(`Request completed in ${elapsed}ms`);
        return NextResponse.json({ success: true, userInfo: data || [] });
    } catch (err) {
        console.error('Unexpected error:', err);
        const elapsed = Date.now() - startTime;
        console.log(`Request completed in ${elapsed}ms (Exception)`);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}

