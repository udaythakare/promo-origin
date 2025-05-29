'use client';
import { useState, useEffect } from 'react';
import {
    setupPushNotifications,
    disablePushNotifications,
    checkSubscriptionStatus
} from '@/lib/push-notifications';

export default function NotificationToggle() {
    const [showPermissionRequest, setShowPermissionRequest] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        checkNotificationPermissionPeriodically();
    }, []);

    const checkNotificationPermissionPeriodically = async () => {
        try {
            // Check if browser supports notifications
            if (!('Notification' in window)) {
                return;
            }

            const permission = Notification.permission;

            // Only proceed if permission is not granted
            if (permission !== 'granted') {
                const shouldShowPrompt = shouldShowNotificationPrompt();
                if (shouldShowPrompt) {
                    setShowPermissionRequest(true);
                }
            }
        } catch (err) {
            console.error('Error checking notification permission:', err);
        }
    };

    const shouldShowNotificationPrompt = () => {
        const PROMPT_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        const STORAGE_KEY = 'lastNotificationPrompt';
        const DISMISS_KEY = 'notificationPromptDismissed';

        try {
            const lastPrompt = parseInt(localStorage.getItem(STORAGE_KEY) || '0');
            const wasDismissed = localStorage.getItem(DISMISS_KEY);
            const now = Date.now();

            // If user previously dismissed and it's been less than 24 hours, don't show
            if (wasDismissed && (now - parseInt(wasDismissed)) < PROMPT_INTERVAL) {
                return false;
            }

            // Show if it's been more than 24 hours since last prompt or first time
            if (now - lastPrompt > PROMPT_INTERVAL) {
                localStorage.setItem(STORAGE_KEY, now.toString());
                return true;
            }

            return false;
        } catch (err) {
            // If localStorage is not available, show prompt
            return true;
        }
    };

    const requestNotificationPermission = async () => {
        try {
            setIsLoading(true);

            const permission = await Notification.requestPermission();

            if (permission === 'granted') {
                // Optionally setup push notifications after permission is granted
                await setupPushNotifications();
                setShowPermissionRequest(false);
                // Clear any dismiss timestamps since user granted permission
                localStorage.removeItem('notificationPromptDismissed');
            } else {
                // User denied, hide prompt
                setShowPermissionRequest(false);
            }
        } catch (err) {
            console.error('Error requesting notification permission:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const dismissPrompt = () => {
        setShowPermissionRequest(false);
        // Store dismiss timestamp
        try {
            localStorage.setItem('notificationPromptDismissed', Date.now().toString());
        } catch (err) {
            console.error('Error storing dismiss timestamp:', err);
        }
    };

    // Only render when we need to show the permission request
    if (!showPermissionRequest) {
        return null;
    }

    return (
        <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            backgroundColor: 'white',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            maxWidth: '350px',
            zIndex: 1000
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <h4 style={{ margin: '0', color: '#333', fontSize: '16px' }}>
                    🔔 Stay Updated
                </h4>
                <button
                    onClick={dismissPrompt}
                    style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '18px',
                        cursor: 'pointer',
                        color: '#999',
                        padding: '0',
                        lineHeight: '1'
                    }}
                >
                    ×
                </button>
            </div>

            <p style={{ margin: '0 0 15px 0', color: '#666', fontSize: '14px', lineHeight: '1.4' }}>
                Get notified about new coupons and offers from your favorite businesses.
            </p>

            <div style={{ display: 'flex', gap: '10px' }}>
                <button
                    onClick={requestNotificationPermission}
                    disabled={isLoading}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        fontSize: '14px',
                        opacity: isLoading ? 0.6 : 1
                    }}
                >
                    {isLoading ? 'Setting up...' : 'Allow'}
                </button>
                <button
                    onClick={dismissPrompt}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: 'transparent',
                        color: '#6c757d',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px'
                    }}
                >
                    Not now
                </button>
            </div>
        </div>
    );
}