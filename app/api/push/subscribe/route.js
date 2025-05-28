import { supabase } from '@/lib/supabase';
import { getServerSession } from 'next-auth';
// import { options } from '@/app/api/auth/[...nextauth]/route'; // Adjust path as needed
import { NextResponse } from 'next/server';
import { options } from '../../auth/[...nextauth]/options';

export async function POST(request) {
    try {
        const session = await getServerSession(options);
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { subscription } = body;

        if (!subscription) {
            return NextResponse.json(
                { error: 'Subscription data required' },
                { status: 400 }
            );
        }

        // Upsert the subscription (insert or update if exists)
        const { data, error } = await supabase
            .from('push_subscriptions')
            .upsert({
                user_id: session.user.id,
                subscription: subscription
            })
            .select();

        if (error) {
            console.error('Error saving subscription:', error);
            return NextResponse.json(
                { error: 'Failed to save subscription' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error('Error in subscription handler:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}