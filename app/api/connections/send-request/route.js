import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { options } from '@/app/api/auth/[...nextauth]/options';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request) {
    try {
        // Step 1: Check who is logged in
        const session = await getServerSession(options);
        if (!session?.user?.id) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const senderId = session.user.id;

        // Step 2: Get data from request body
        // initiated_by tells us who is sending: 'investor' or 'vendor'
        const { investor_id, vendor_id, initiated_by } = await request.json();

        // Step 3: Validate required fields
        if (!investor_id || !vendor_id || !initiated_by) {
            return NextResponse.json(
                { success: false, message: 'Missing required fields' },
                { status: 400 }
            );
        }

        if (!['investor', 'vendor'].includes(initiated_by)) {
            return NextResponse.json(
                { success: false, message: 'initiated_by must be investor or vendor' },
                { status: 400 }
            );
        }

        // Step 4: Check if a connection already exists between these two
        // We don't want duplicate requests
        const { data: existing } = await supabaseAdmin
            .from('investor_vendor_connections')
            .select('id, status')
            .eq('investor_id', investor_id)
            .eq('vendor_id', vendor_id)
            .maybeSingle();

        if (existing) {
            // If already pending or accepted, block duplicate
            if (['pending', 'accepted'].includes(existing.status)) {
                return NextResponse.json(
                    { success: false, message: 'Connection already exists' },
                    { status: 409 }
                );
            }
        }

        // Step 5: Create the connection request
        const { data: connection, error: connError } = await supabaseAdmin
            .from('investor_vendor_connections')
            .insert({
                investor_id,
                vendor_id,
                initiated_by,
                status: 'pending',
            })
            .select()
            .single();

        if (connError) {
            console.error('Connection insert error:', connError);
            return NextResponse.json(
                { success: false, message: 'Failed to send request' },
                { status: 500 }
            );
        }

        // Step 6: Send notification to the receiver
        // If investor sent request → notify vendor
        // If vendor sent request → notify investor
        const receiverId = initiated_by === 'investor' ? vendor_id : investor_id;
        const senderName = session.user.name || 'Someone';
        const notifMessage = initiated_by === 'investor'
            ? `${senderName} wants to invest in your business`
            : `A vendor wants to connect with you for investment`;

        await supabaseAdmin
            .from('internal_notifications')
            .insert({
                user_id: receiverId,
                title: 'New Connection Request',
                message: notifMessage,
                type: 'connection_request',
                category: 'investment',
                reference_id: connection.id,
            });

        return NextResponse.json({
            success: true,
            message: 'Connection request sent',
            connection,
        });

    } catch (err) {
        console.error('Send request error:', err);
        return NextResponse.json(
            { success: false, message: 'Unexpected error' },
            { status: 500 }
        );
    }
}