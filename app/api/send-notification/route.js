// import { createClient } from '@/lib/supabase/server';
import { supabase } from '@/lib/supabase';
import webpush from 'web-push';

webpush.setVapidDetails(
    `mailto:${process.env.VAPID_EMAIL}`,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

export async function POST(request) {
    try {
        const { userId, title, body, url } = await request.json();

        // const supabase = createClient();

        // Get user's push subscription
        const { data: subscriptions, error } = await supabase
            .from('push_subscriptions')
            .select('subscription')
            .eq('user_id', userId);

        if (error || !subscriptions.length) {
            return Response.json({ error: 'No subscription found' }, { status: 404 });
        }

        const payload = JSON.stringify({
            title,
            body,
            url: url || '/',
            icon: '/icon-192x192.png'
        });

        // Send notification to all user's subscriptions
        const promises = subscriptions.map(sub =>
            webpush.sendNotification(JSON.parse(sub.subscription), payload)
        );

        await Promise.all(promises);

        return Response.json({ success: true });
    } catch (error) {
        console.error('Error sending notification:', error);
        return Response.json({ error: 'Failed to send notification' }, { status: 500 });
    }
}