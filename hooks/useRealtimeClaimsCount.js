// hooks/useRealtimeClaimsCount.js
'use client';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

// Global store for claims counts and subscribers
const claimsStore = new Map();
const subscribers = new Map();
let globalChannel = null;
let channelRefCount = 0;

function setupGlobalChannel(userId) {
    if (globalChannel) return;

    console.log('Setting up global claims channel for user:', userId);
    globalChannel = supabase
        .channel('user-coupon-claims')
        .on(
            'postgres_changes',
            {
                event: 'UPDATE',
                schema: 'public',
                table: 'coupons',
                // filter: `user_id=eq.${userId}`, // Only listen to user's coupons
            },
            (payload) => {
                // Only process if current_claims actually changed
                if (payload.new.current_claims !== payload.old.current_claims) {
                    const couponId = payload.new.id;
                    const newCount = payload.new.current_claims;

                    // Update store
                    claimsStore.set(couponId, newCount);

                    // Notify subscribers for this specific coupon
                    const couponSubscribers = subscribers.get(couponId) || new Set();
                    couponSubscribers.forEach(callback => callback(newCount));
                }
            }
        )
        .subscribe();
}

function cleanupGlobalChannel() {
    if (globalChannel && channelRefCount === 0) {
        console.log('Cleaning up global claims channel');
        supabase.removeChannel(globalChannel);
        globalChannel = null;
        claimsStore.clear();
        subscribers.clear();
    }
}

export function useRealtimeClaimsCount(couponId, initialCount, userId) {
    const [claimsCount, setClaimsCount] = useState(initialCount);

    useEffect(() => {
        // Initialize store
        claimsStore.set(couponId, initialCount);

        // Set up global channel if needed
        channelRefCount++;
        setupGlobalChannel(userId);

        // Add subscriber for this coupon
        if (!subscribers.has(couponId)) {
            subscribers.set(couponId, new Set());
        }

        const updateCallback = (newCount) => {
            setClaimsCount(newCount);
        };

        subscribers.get(couponId).add(updateCallback);

        return () => {
            // Remove subscriber
            const couponSubscribers = subscribers.get(couponId);
            if (couponSubscribers) {
                couponSubscribers.delete(updateCallback);
                if (couponSubscribers.size === 0) {
                    subscribers.delete(couponId);
                    claimsStore.delete(couponId);
                }
            }

            // Clean up global channel if no more subscribers
            channelRefCount--;
            if (channelRefCount === 0) {
                setTimeout(cleanupGlobalChannel, 100); // Small delay to prevent premature cleanup
            }
        };
    }, [couponId, initialCount, userId]);

    return claimsCount;
}