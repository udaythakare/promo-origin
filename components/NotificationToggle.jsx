'use client';

import { useState, useEffect } from 'react';
import {
    setupPushNotifications,
    disablePushNotifications,
    checkSubscriptionStatus
} from '@/lib/push-notifications';

export default function NotificationToggle() {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        checkStatus();
    }, []);

    const checkStatus = async () => {
        try {
            setIsLoading(true);
            const status = await checkSubscriptionStatus();
            setIsSubscribed(status.subscribed);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggle = async () => {
        try {
            setIsLoading(true);
            setError(null);

            if (isSubscribed) {
                const result = await disablePushNotifications();
                if (result.success) {
                    setIsSubscribed(false);
                } else {
                    throw new Error(result.error);
                }
            } else {
                const result = await setupPushNotifications();
                if (result.success) {
                    setIsSubscribed(true);
                } else {
                    throw new Error(result.error);
                }
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <div>Loading notification settings...</div>;
    }

    return (
        <div className="notification-toggle">
            <h3>Push Notifications</h3>
            <p>
                Get notified about new coupons and offers from your favorite businesses.
            </p>

            {error && (
                <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>
                    Error: {error}
                </div>
            )}

            <button
                onClick={handleToggle}
                disabled={isLoading}
                className={`toggle-btn ${isSubscribed ? 'enabled' : 'disabled'}`}
                style={{
                    padding: '10px 20px',
                    backgroundColor: isSubscribed ? '#dc3545' : '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    opacity: isLoading ? 0.6 : 1
                }}
            >
                {isLoading ? 'Processing...' : (isSubscribed ? 'Disable Notifications' : 'Enable Notifications')}
            </button>

            <p style={{ fontSize: '0.9em', color: '#666', marginTop: '10px' }}>
                Status: {isSubscribed ? '✅ Notifications enabled' : '❌ Notifications disabled'}
            </p>
        </div>
    );
}