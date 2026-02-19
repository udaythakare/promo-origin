import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Detect user's city and state from their IP address using ip-api.com
 */
export async function GET(request) {
    try {
        // Get client IP from headers (works behind proxies/load balancers)
        const forwarded = request.headers.get('x-forwarded-for');
        const realIp = request.headers.get('x-real-ip');
        let ip = forwarded?.split(',')[0]?.trim() || realIp || null;

        // In local development, IP will be 127.0.0.1 or ::1 — use empty string to let ip-api auto-detect
        if (!ip || ip === '127.0.0.1' || ip === '::1' || ip === 'localhost') {
            ip = ''; // ip-api.com will auto-detect the server's public IP
        }

        const apiUrl = ip
            ? `http://ip-api.com/json/${ip}?fields=status,message,city,regionName,country,lat,lon`
            : `http://ip-api.com/json/?fields=status,message,city,regionName,country,lat,lon`;

        const response = await fetch(apiUrl, {
            next: { revalidate: 300 } // Cache for 5 minutes
        });

        if (!response.ok) {
            throw new Error('Failed to fetch geolocation data');
        }

        const data = await response.json();

        if (data.status === 'fail') {
            console.error('IP Geolocation failed:', data.message);
            return NextResponse.json(
                { success: false, city: null, state: null },
                { status: 200 }
            );
        }

        return NextResponse.json({
            success: true,
            city: data.city || null,
            state: data.regionName || null,
            country: data.country || null,
            lat: data.lat || null,
            lon: data.lon || null
        });
    } catch (error) {
        console.error('Error in geo API:', error);
        return NextResponse.json(
            { success: false, city: null, state: null },
            { status: 200 } // Return 200 with null — callers should treat as fallback
        );
    }
}
