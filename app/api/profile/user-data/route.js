import { NextResponse } from 'next/server';
import { getUserId } from '@/helpers/userHelper';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET() {
    try {
        const userId = await getUserId();
        if (!userId) {
            return NextResponse.json({ success: false, message: 'User not logged in' }, { status: 401 });
        }

        const { data, error } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('id', userId)
            .single(); // Fetch single user data

        if (error) {
            console.error('Error fetching user info:', error);
            return NextResponse.json({ success: false, error }, { status: 500 });
        }

        return NextResponse.json({ success: true, userInfo: data || [] });
    } catch (err) {
        console.error('Unexpected error:', err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
