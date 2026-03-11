import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { options } from '@/app/api/auth/[...nextauth]/options';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET() {
    try {
        const session = await getServerSession(options);
        if (!session?.user?.id) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;

        // Get vendor's business
        const { data: business, error: bizError } = await supabaseAdmin
            .from('businesses')
            .select('id')
            .eq('user_id', userId)
            .maybeSingle();

        if (bizError || !business) {
            return NextResponse.json({
                success: true,
                totalCoupons: 0,
                totalRedeemed: 0,
                totalClaims: 0,
                activeCoupons: 0,
                recentCoupons: [],
            });
        }

        // Fetch all coupons
        const { data: coupons, error: couponError } = await supabaseAdmin
            .from('coupons')
            .select(`
                id,
                title,
                is_active,
                is_expired,
                current_claims,
                current_redemption,
                max_claims,
                start_date,
                end_date,
                created_at
            `)
            .eq('business_id', business.id)
            .order('created_at', { ascending: false });

        if (couponError) {
            return NextResponse.json(
                { success: false, message: 'Failed to fetch stats' },
                { status: 500 }
            );
        }

        const totalCoupons = coupons.length;
        const totalRedeemed = coupons.reduce((sum, c) => sum + (c.current_redemption || 0), 0);
        const totalClaims = coupons.reduce((sum, c) => sum + (c.current_claims || 0), 0);
        const activeCoupons = coupons.filter((c) => c.is_active && !c.is_expired).length;
        const recentCoupons = coupons.slice(0, 5);

        return NextResponse.json({
            success: true,
            totalCoupons,
            totalRedeemed,
            totalClaims,
            activeCoupons,
            recentCoupons,
        });

    } catch (err) {
        console.error('Dashboard stats error:', err);
        return NextResponse.json(
            { success: false, message: 'Unexpected error' },
            { status: 500 }
        );
    }
}