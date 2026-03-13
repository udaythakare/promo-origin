import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { options } from '@/app/api/auth/[...nextauth]/options';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function PATCH(request) {
    try {
        const session = await getServerSession(options);
        if (!session?.user?.id) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const userId = session.user.id;
        const { connection_id, action } = await request.json();

        // action must be either 'accepted' or 'rejected'
        if (!connection_id || !['accepted', 'rejected'].includes(action)) {
            return NextResponse.json(
                { success: false, message: 'Invalid request data' },
                { status: 400 }
            );
        }

        // Step 1: Fetch the connection to verify this user is the receiver
        const { data: connection, error: fetchError } = await supabaseAdmin
            .from('investor_vendor_connections')
            .select('*')
            .eq('id', connection_id)
            .single();

        if (fetchError || !connection) {
            return NextResponse.json(
                { success: false, message: 'Connection not found' },
                { status: 404 }
            );
        }

        // Step 2: Security check
        // Only the RECEIVER can accept or reject
        // If investor initiated → vendor is the receiver
        // If vendor initiated → investor is the receiver
        const isReceiver =
            (connection.initiated_by === 'investor' && connection.vendor_id === userId) ||
            (connection.initiated_by === 'vendor' && connection.investor_id === userId);

        if (!isReceiver) {
            return NextResponse.json(
                { success: false, message: 'You are not authorized to respond to this request' },
                { status: 403 }
            );
        }

        // Step 3: Make sure it's still pending
        // You can't accept/reject something already accepted or rejected
        if (connection.status !== 'pending') {
            return NextResponse.json(
                { success: false, message: `Request is already ${connection.status}` },
                { status: 409 }
            );
        }

        // Step 4: Update the connection status
        const updateData = {
            status: action,
            updated_at: new Date().toISOString(),
        };

        // If accepting, also record the accepted timestamp
        if (action === 'accepted') {
            updateData.accepted_at = new Date().toISOString();
        }

        const { data: updated, error: updateError } = await supabaseAdmin
            .from('investor_vendor_connections')
            .update(updateData)
            .eq('id', connection_id)
            .select()
            .single();

        if (updateError) {
            console.error('Update error:', updateError);
            return NextResponse.json(
                { success: false, message: 'Failed to update connection' },
                { status: 500 }
            );
        }

        // Step 5: Notify the original sender about the response
        const senderId = connection.initiated_by === 'investor'
            ? connection.investor_id
            : connection.vendor_id;

        const responderName = session.user.name || 'The other party';
        const notifMessage = action === 'accepted'
            ? `${responderName} accepted your connection request. You can now chat!`
            : `${responderName} declined your connection request.`;

        await supabaseAdmin
            .from('internal_notifications')
            .insert({
                user_id: senderId,
                title: action === 'accepted' ? 'Request Accepted!' : 'Request Declined',
                message: notifMessage,
                type: 'connection_response',
                category: 'investment',
                reference_id: connection_id,
            });

        return NextResponse.json({
            success: true,
            message: `Connection ${action}`,
            connection: updated,
        });

    } catch (err) {
        console.error('Respond error:', err);
        return NextResponse.json(
            { success: false, message: 'Unexpected error' },
            { status: 500 }
        );
    }
}