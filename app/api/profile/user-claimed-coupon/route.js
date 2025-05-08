import { NextResponse } from 'next/server';
import { getUserId } from '@/helpers/userHelper';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET() {
    try {
        const userId = await getUserId();
        console.log(userId)
        if (!userId) {
            return NextResponse.json({ success: false, message: 'User not logged in' }, { status: 401 });
        }

        const { data, error } = await supabaseAdmin
            .from('user_coupons')
            .select('*, coupons(*, businesses(name))')
            .eq('user_id', userId)
            .eq('coupon_status', 'claimed');


        console.log(data, '************')

        if (error) {
            console.error('Error fetching claimed coupons:', error);
            return NextResponse.json({ success: false, error }, { status: 500 });
        }

        return NextResponse.json({ success: true, coupons: data || [] });
    } catch (err) {
        console.error('Unexpected error:', err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
