// api/send-notifications/route.js
import { supabase } from '@/lib/supabase';
import webpush from 'web-push';

webpush.setVapidDetails(
    `mailto:${process.env.VAPID_EMAIL}`,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

export async function POST(request) {
    try {
        const { userId, title, body, url, tag, data: notificationData } = await request.json();

        console.log('Received notification request:', { userId, title, body, url, tag });

        // Get push subscriptions based on strategy
        let query = supabase.from('push_subscriptions').select('subscription');

        // if (userId) {
        //     // Send to specific user
        //     query = query.eq('user_id', userId);
        // }
        // If no userId provided, send to all users (broadcast)

        const { data: subscriptions, error } = await query;

        console.log(`Found ${subscriptions?.length || 0} subscriptions`);

        if (error) {
            console.error('Database error:', error);
            return Response.json({ error: 'Database error' }, { status: 500 });
        }

        if (!subscriptions || subscriptions.length === 0) {
            return Response.json({
                error: 'No subscriptions found',
                message: userId ? `No subscriptions for user ${userId}` : 'No subscriptions in database'
            }, { status: 404 });
        }

        // Prepare the push payload
        const payload = JSON.stringify({
            title,
            body,
            url: url || '/',
            icon: '/icon-192x192.png',
            badge: '/badge-72x72.png',
            tag: tag || 'general',
            data: notificationData || {}
        });

        console.log('Sending payload:', payload);

        // Send notifications to all subscriptions
        const promises = subscriptions.map(async (sub, index) => {
            try {
                await webpush.sendNotification(sub.subscription, payload);
                console.log(`Notification ${index + 1}/${subscriptions.length} sent successfully`);
                return { success: true, index };
            } catch (error) {
                console.error(`Failed to send notification ${index + 1}:`, error);

                // Handle invalid subscriptions (expired/unsubscribed)
                if (error.statusCode === 410 || error.statusCode === 404) {
                    // TODO: Remove invalid subscription from database
                    console.log(`Subscription ${index + 1} appears to be invalid (${error.statusCode})`);
                }

                return { success: false, error: error.message, index };
            }
        });

        const results = await Promise.allSettled(promises);

        // Count successful and failed notifications
        const successful = results.filter(result =>
            result.status === 'fulfilled' && result.value.success
        ).length;

        const failed = results.length - successful;

        console.log(`Notification summary: ${successful} successful, ${failed} failed`);

        if (successful === 0) {
            return Response.json({
                error: 'All notifications failed',
                details: results
            }, { status: 500 });
        }

        return Response.json({
            success: true,
            summary: {
                total: subscriptions.length,
                successful,
                failed
            }
        });

    } catch (error) {
        console.error('Error sending notification:', error);
        return Response.json({
            error: 'Failed to send notification',
            message: error.message
        }, { status: 500 });
    }
}