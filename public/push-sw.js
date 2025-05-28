self.addEventListener('push', function (event) {
    console.log('Push event received:', event);

    const data = event.data ? event.data.json() : {};
    console.log('Push data:', data);

    const options = {
        body: data.body || 'New notification',
        icon: data.icon || '/icon-192x192.png',
        badge: data.badge || '/badge-72x72.png',
        tag: data.tag || 'general',
        data: data.data || {},
        vibrate: [100, 50, 100],
        requireInteraction: true,
        actions: data.tag === 'new-coupon' ? [
            {
                action: 'view',
                title: 'View Coupon'
            },
            {
                action: 'dismiss',
                title: 'Dismiss'
            }
        ] : []
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'Notification', options)
    );
});

self.addEventListener('notificationclick', function (event) {
    console.log('Notification clicked:', event);
    event.notification.close();

    if (event.action === 'view' || !event.action) {
        const urlToOpen = event.notification.data?.url || '/';
        event.waitUntil(
            clients.openWindow(urlToOpen)
        );
    }
});

self.addEventListener('notificationclose', function (event) {
    console.log('Notification closed:', event);
});