// File: lib/push-notifications.js (Updated for Next.js 15)

export async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('/push-sw.js');
            console.log('Service Worker registered successfully');
            return registration;
        } catch (error) {
            console.error('Service Worker registration failed:', error);
            throw error;
        }
    }
    throw new Error('Service Worker not supported');
}

export async function requestNotificationPermission() {
    if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }
    return false;
}

export async function subscribeToPushNotifications(registration) {
    try {
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY)
        });
        return subscription;
    } catch (error) {
        console.error('Failed to subscribe to push notifications:', error);
        throw error;
    }
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

// Save subscription to server
export async function saveSubscriptionToServer(subscription) {
    try {
        const response = await fetch('/api/push/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                subscription: subscription
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to save subscription');
        }

        return await response.json();
    } catch (error) {
        console.error('Error saving subscription:', error);
        throw error;
    }
}

// Remove subscription from server
export async function removeSubscriptionFromServer() {
    try {
        const response = await fetch('/api/push/unsubscribe', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to remove subscription');
        }

        return await response.json();
    } catch (error) {
        console.error('Error removing subscription:', error);
        throw error;
    }
}

// Check subscription status
export async function checkSubscriptionStatus() {
    try {
        const response = await fetch('/api/push/status');

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to check subscription status');
        }

        return await response.json();
    } catch (error) {
        console.error('Error checking subscription status:', error);
        throw error;
    }
}

// Complete setup function
export async function setupPushNotifications() {
    try {
        // 1. Register service worker
        const registration = await registerServiceWorker();

        // 2. Request permission
        const permissionGranted = await requestNotificationPermission();
        if (!permissionGranted) {
            throw new Error('Notification permission denied');
        }

        // 3. Subscribe to push notifications
        const subscription = await subscribeToPushNotifications(registration);

        // 4. Save subscription to server
        await saveSubscriptionToServer(subscription);

        console.log('Push notifications setup complete');
        return { success: true, subscription };
    } catch (error) {
        console.error('Failed to setup push notifications:', error);
        return { success: false, error: error.message };
    }
}

// Disable push notifications
export async function disablePushNotifications() {
    try {
        // 1. Get service worker registration
        const registration = await navigator.serviceWorker.getRegistration();

        if (registration) {
            // 2. Get existing subscription
            const subscription = await registration.pushManager.getSubscription();

            if (subscription) {
                // 3. Unsubscribe from push notifications
                await subscription.unsubscribe();
            }
        }

        // 4. Remove subscription from server
        await removeSubscriptionFromServer();

        console.log('Push notifications disabled');
        return { success: true };
    } catch (error) {
        console.error('Failed to disable push notifications:', error);
        return { success: false, error: error.message };
    }
}

// Send test notification (for admin/testing purposes)
export async function sendTestNotification(title, message) {
    try {
        const response = await fetch('/api/push/test', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: title,
                message: message
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to send test notification');
        }

        return await response.json();
    } catch (error) {
        console.error('Error sending test notification:', error);
        throw error;
    }
}