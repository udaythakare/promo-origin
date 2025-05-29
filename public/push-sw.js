self.addEventListener('push', function (event) {
    console.log('Push event received:', event);

    let data = {};

    try {
        data = event.data ? event.data.json() : {};
        console.log('Push data:', data);
    } catch (error) {
        console.error('Error parsing push data:', error);
        data = { title: 'Notification', body: 'You have a new notification' };
    }

    const options = {
        body: data.body || 'New notification',
        icon: data.icon || '/icon-192x192.png',
        badge: data.badge || '/badge-72x72.png',
        tag: data.tag || 'general',
        // Fix: Store the URL directly in data, not nested
        data: {
            url: data.url || '/',
            timestamp: Date.now(),
            originalData: data
        },
        vibrate: [100, 50, 100],
        requireInteraction: false, // Changed to false for better UX
        silent: false,
        renotify: true,
        actions: data.tag === 'new-coupon' ? [
            {
                action: 'view',
                title: 'View Coupon',
                icon: '/action-view.png' // Optional
            },
            {
                action: 'dismiss',
                title: 'Dismiss',
                icon: '/action-dismiss.png' // Optional
            }
        ] : [
            {
                action: 'open',
                title: 'Open'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'Notification', options)
            .then(() => {
                console.log('Notification displayed successfully');
            })
            .catch(error => {
                console.error('Error displaying notification:', error);
            })
    );
});

self.addEventListener('notificationclick', function (event) {
    console.log('Notification clicked:', event);
    console.log('Action:', event.action);
    console.log('Notification data:', event.notification.data);

    // Close the notification
    event.notification.close();

    // Handle dismiss action
    if (event.action === 'dismiss') {
        console.log('User dismissed notification');
        return;
    }

    // Get URL to open
    const urlToOpen = event.notification.data?.url || '/';
    console.log('Opening URL:', urlToOpen);

    // Improved window handling
    event.waitUntil(
        clients.matchAll({
            type: 'window',
            includeUncontrolled: true
        }).then(function (clientList) {
            console.log('Found clients:', clientList.length);

            // Check if the app is already open
            for (let i = 0; i < clientList.length; i++) {
                const client = clientList[i];
                console.log('Client URL:', client.url);

                // If we find a window with our domain, focus it and navigate
                if (client.url.includes(self.location.origin) && 'focus' in client) {
                    console.log('Focusing existing window');
                    return client.focus().then(() => {
                        // Navigate to the desired URL if it's different
                        if (client.url !== urlToOpen && 'navigate' in client) {
                            return client.navigate(urlToOpen);
                        }
                    });
                }
            }

            // No existing window found, open a new one
            console.log('Opening new window');
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        }).catch(error => {
            console.error('Error handling notification click:', error);
        })
    );
});

self.addEventListener('notificationclose', function (event) {
    console.log('Notification closed:', event);
    // Optional: Track analytics or perform cleanup
});

// Optional: Add error handling for service worker
self.addEventListener('error', function (event) {
    console.error('Service Worker error:', event);
});

// Optional: Handle service worker updates
self.addEventListener('message', function (event) {
    console.log('Service Worker received message:', event.data);

    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});