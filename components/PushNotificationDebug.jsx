'use client';
import { useState } from 'react';

export default function PushNotificationDebug() {
    const [logs, setLogs] = useState([]);

    const addLog = (message) => {
        setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    };

    const testBasicNotification = () => {
        if (Notification.permission === 'granted') {
            new Notification('Test Notification', {
                body: 'This is a basic test notification',
                icon: '/icons/icon-192x192.png'
            });
            addLog('Basic notification sent');
        } else {
            addLog('Notification permission not granted');
        }
    };

    const checkServiceWorker = async () => {
        if ('serviceWorker' in navigator) {
            try {
                const registrations = await navigator.serviceWorker.getRegistrations();
                addLog(`Found ${registrations.length} service workers`);
                registrations.forEach((reg, index) => {
                    addLog(`SW ${index}: ${reg.scope}`);
                });

                const registration = await navigator.serviceWorker.getRegistration('/');
                if (registration) {
                    addLog(`Active SW: ${registration.active?.scriptURL || 'None'}`);
                }
            } catch (error) {
                addLog(`SW check error: ${error.message}`);
            }
        } else {
            addLog('Service Workers not supported');
        }
    };

    const checkPushSubscription = async () => {
        try {
            const registration = await navigator.serviceWorker.getRegistration('/');
            if (registration) {
                const subscription = await registration.pushManager.getSubscription();
                addLog(`Push subscription: ${subscription ? 'Active' : 'None'}`);
                if (subscription) {
                    addLog(`Endpoint: ${subscription.endpoint.substring(0, 50)}...`);
                }
            }
        } catch (error) {
            addLog(`Push check error: ${error.message}`);
        }
    };

    const requestPermissionManually = async () => {
        try {
            addLog(`Current permission: ${Notification.permission}`);

            if (Notification.permission === 'default') {
                const result = await Notification.requestPermission();
                addLog(`Permission request result: ${result}`);
            } else {
                addLog('Permission already decided');
            }
        } catch (error) {
            addLog(`Permission error: ${error.message}`);
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Push Notification Debug</h2>

            <div className="space-y-2 mb-6">
                <button
                    onClick={requestPermissionManually}
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                >
                    Request Permission
                </button>
                <button
                    onClick={testBasicNotification}
                    className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                >
                    Test Basic Notification
                </button>
                <button
                    onClick={checkServiceWorker}
                    className="bg-purple-500 text-white px-4 py-2 rounded mr-2"
                >
                    Check Service Workers
                </button>
                <button
                    onClick={checkPushSubscription}
                    className="bg-orange-500 text-white px-4 py-2 rounded mr-2"
                >
                    Check Push Subscription
                </button>
                <button
                    onClick={() => setLogs([])}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                    Clear Logs
                </button>
            </div>

            <div className="bg-gray-100 p-4 rounded h-64 overflow-y-auto">
                <h3 className="font-bold mb-2">Debug Logs:</h3>
                {logs.length === 0 ? (
                    <p className="text-gray-500">No logs yet...</p>
                ) : (
                    logs.map((log, index) => (
                        <div key={index} className="text-sm font-mono mb-1">
                            {log}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}