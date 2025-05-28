import webpush from 'web-push';
import { supabase } from './supabase';

// Configure web-push
webpush.setVapidDetails(
    `mailto:${process.env.VAPID_EMAIL}`,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

export async function sendNotificationToAllUsers(notification) {
    try {
        // Get all active push subscriptions
        const { data: subscriptions, error } = await supabase
            .from('push_subscriptions')
            .select('subscription, user_id');

        if (error) {
            console.error('Error fetching subscriptions:', error);
            return { error: 'Failed to fetch subscriptions' };
        }

        if (!subscriptions || subscriptions.length === 0) {
            console.log('No subscriptions found');
            return { success: true, sent: 0 };
        }

        const payload = JSON.stringify({
            title: notification.title,
            body: notification.body,
            url: notification.url || '/',
            icon: notification.icon || '/icon-192x192.png',
            badge: notification.badge || '/badge-72x72.png',
            tag: notification.tag || 'general',
            data: notification.data || {}
        });

        // Send notifications to all subscriptions
        const promises = subscriptions.map(async (sub) => {
            try {
                await webpush.sendNotification(sub.subscription, payload);
                return { success: true, userId: sub.user_id };
            } catch (error) {
                console.error(`Failed to send notification to user ${sub.user_id}:`, error);

                // If subscription is invalid, remove it from database
                if (error.statusCode === 410 || error.statusCode === 404) {
                    await supabase
                        .from('push_subscriptions')
                        .delete()
                        .eq('user_id', sub.user_id);
                }

                return { error: true, userId: sub.user_id };
            }
        });

        const results = await Promise.allSettled(promises);
        const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;

        console.log(`Sent ${successful} notifications out of ${subscriptions.length} subscriptions`);

        return { success: true, sent: successful, total: subscriptions.length };
    } catch (error) {
        console.error('Error in sendNotificationToAllUsers:', error);
        return { error: 'Failed to send notifications' };
    }
}

export async function sendNotificationToBusinessFollowers(businessId, notification) {
    try {
        // Get subscriptions for users who follow this business
        // This assumes you have a business_followers table
        const { data: subscriptions, error } = await supabase
            .from('push_subscriptions')
            .select(`
                subscription, 
                user_id,
                business_followers!inner(business_id)
            `)
            .eq('business_followers.business_id', businessId);

        if (error) {
            console.error('Error fetching business follower subscriptions:', error);
            return { error: 'Failed to fetch subscriptions' };
        }

        if (!subscriptions || subscriptions.length === 0) {
            console.log('No follower subscriptions found for business');
            return { success: true, sent: 0 };
        }

        const payload = JSON.stringify({
            title: notification.title,
            body: notification.body,
            url: notification.url || '/',
            icon: notification.icon || '/icon-192x192.png',
            badge: notification.badge || '/badge-72x72.png',
            tag: notification.tag || 'coupon',
            data: { ...notification.data, businessId }
        });

        const promises = subscriptions.map(async (sub) => {
            try {
                await webpush.sendNotification(sub.subscription, payload);
                return { success: true, userId: sub.user_id };
            } catch (error) {
                console.error(`Failed to send notification to user ${sub.user_id}:`, error);

                if (error.statusCode === 410 || error.statusCode === 404) {
                    await supabase
                        .from('push_subscriptions')
                        .delete()
                        .eq('user_id', sub.user_id);
                }

                return { error: true, userId: sub.user_id };
            }
        });

        const results = await Promise.allSettled(promises);
        const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;

        return { success: true, sent: successful, total: subscriptions.length };
    } catch (error) {
        console.error('Error in sendNotificationToBusinessFollowers:', error);
        return { error: 'Failed to send notifications' };
    }
}