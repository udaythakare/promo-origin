'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { registerServiceWorker, requestNotificationPermission, subscribeToPushNotifications } from '@/lib/pushNotifications';

export default function PushNotificationSetup({ userId }) {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    const handleSubscribe = async () => {
        setLoading(true);
        try {
            // Request permission
            const permissionGranted = await requestNotificationPermission();
            if (!permissionGranted) {
                alert('Please enable notifications in your browser settings');
                return;
            }

            // Register service worker
            const registration = await registerServiceWorker();
            if (!registration) return;

            // Subscribe to push notifications
            const subscription = await subscribeToPushNotifications(registration);
            if (!subscription) return;

            // Save subscription to Supabase
            const { error } = await supabase
                .from('push_subscriptions')
                .upsert({
                    user_id: userId,
                    subscription: JSON.stringify(subscription),
                    created_at: new Date().toISOString()
                });

            if (error) throw error;

            setIsSubscribed(true);
        } catch (error) {
            console.error('Failed to subscribe:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {!isSubscribed ? (
                <button
                    onClick={handleSubscribe}
                    disabled={loading}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    {loading ? 'Setting up...' : 'Enable Push Notifications'}
                </button>
            ) : (
                <p className="text-green-600">Push notifications enabled!</p>
            )}
        </div>
    );
}