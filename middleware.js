// middleware.ts
import { NextResponse } from 'next/server';

// Define paths that should be accessible without authentication
const publicPaths = [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/api/auth',
    '/_next',
    '/favicon.ico',
    '/static',
    '/images',
];

// Helper function to check if the current path is public
function isPublicPath(path) {
    return publicPaths.some(publicPath =>
        path === publicPath || path.startsWith(`${publicPath}/`)
    );
}

export async function middleware(request) {
    const path = request.nextUrl.pathname;

    // Skip authentication check for public paths
    if (isPublicPath(path)) {
        return NextResponse.next();
    }

    // Check for authentication tokens in cookies
    // Handle both production and development cookie formats
    const authToken = request.cookies.get('auth-token')?.value;

    // Check both the regular and __Secure- prefixed session tokens
    const sessionToken =
        request.cookies.get('next-auth.session-token')?.value ||
        request.cookies.get('__Secure-next-auth.session-token')?.value;

    // If no auth token found, redirect to login
    if (!authToken && !sessionToken) {
        const loginUrl = new URL('/login', request.url);
        // Add the original URL as a query parameter for redirect after login
        loginUrl.searchParams.set('callbackUrl', request.url);
        return NextResponse.redirect(loginUrl);
    }

    // User is authenticated, proceed with the request
    return NextResponse.next();
}

// Configure which paths the middleware runs on
export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - API routes that handle their own auth
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api/auth|_next/static|_next/image|_next/webpack|favicon.ico).*)',
    ],
};
